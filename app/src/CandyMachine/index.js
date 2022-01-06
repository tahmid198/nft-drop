import React, { useEffect, useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, Provider, web3 } from '@project-serum/anchor';
import { MintLayout, TOKEN_PROGRAM_ID, Token } from '@solana/spl-token';
import { programs } from '@metaplex/js';
import './CandyMachine.css';
import {
  candyMachineProgram,
  TOKEN_METADATA_PROGRAM_ID,
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
} from './helpers';
const {
  metadata: { Metadata, MetadataProgram },
} = programs;

const config = new web3.PublicKey(process.env.REACT_APP_CANDY_MACHINE_CONFIG);
const { SystemProgram } = web3;
const opts = {
  preflightCommitment: 'processed',
};

const MAX_NAME_LENGTH = 32;
const MAX_URI_LENGTH = 200;
const MAX_SYMBOL_LENGTH = 10;
const MAX_CREATOR_LEN = 32 + 1 + 1;

const CandyMachine = ({ walletAddress }) => {
  // Add state property inside your component like this
  const [machineStats, setMachineStats] = useState(null);

  // New state property to store metadata of minted NFT's
  const [mints, setMints] = useState([]);

  // Actions
  const fetchHashTable = async (hash, metadataEnabled) => {
    const connection = new web3.Connection(
      process.env.REACT_APP_SOLANA_RPC_HOST
    );

    const metadataAccounts = await MetadataProgram.getProgramAccounts(
      connection,
      {
        filters: [
          {
            memcmp: {
              offset:
                1 +
                32 +
                32 +
                4 +
                MAX_NAME_LENGTH +
                4 +
                MAX_URI_LENGTH +
                4 +
                MAX_SYMBOL_LENGTH +
                2 +
                1 +
                4 +
                0 * MAX_CREATOR_LEN,
              bytes: hash,
            },
          },
        ],
      }
    );

    const mintHashes = [];

    for (let index = 0; index < metadataAccounts.length; index++) {
      const account = metadataAccounts[index];
      const accountInfo = await connection.getParsedAccountInfo(account.pubkey);
      const metadata = new Metadata(hash.toString(), accountInfo.value);
      if (metadataEnabled) mintHashes.push(metadata.data);
      else mintHashes.push(metadata.data.mint);
    }

    return mintHashes;
  };

  const getMetadata = async (mint) => {
    return (
      await PublicKey.findProgramAddress(
        [
          Buffer.from('metadata'),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mint.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
      )
    )[0];
  };

  const getMasterEdition = async (mint) => {
    return (
      await PublicKey.findProgramAddress(
        [
          Buffer.from('metadata'),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mint.toBuffer(),
          Buffer.from('edition'),
        ],
        TOKEN_METADATA_PROGRAM_ID
      )
    )[0];
  };

  const getTokenWallet = async (wallet, mint) => {
    return (
      await web3.PublicKey.findProgramAddress(
        [wallet.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
        SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
      )
    )[0];
  };

  const mintToken = async () => {
    try {

      
      /**
       * Here we are creating an account of our NFT
       * In solana, programs are stateless which is very different from Ethereum where contracts hold state. 
       * */      
      const mint = web3.Keypair.generate();
      const token = await getTokenWallet(
        walletAddress.publicKey,
        mint.publicKey
      );
      const metadata = await getMetadata(mint.publicKey);
      const masterEdition = await getMasterEdition(mint.publicKey);
      const rpcHost = process.env.REACT_APP_SOLANA_RPC_HOST;
      const connection = new Connection(rpcHost);
      const rent = await connection.getMinimumBalanceForRentExemption(
        MintLayout.span
      );

      // Params candy machine needs to mint the NFT
      const accounts = {
        config,
        candyMachine: process.env.REACT_APP_CANDY_MACHINE_ID,
        payer: walletAddress.publicKey, // Person paying + receiving the NFT
        wallet: process.env.REACT_APP_TREASURY_ADDRESS,
        mint: mint.publicKey, // Account address of the NFT we are minting
        metadata,
        masterEdition,
        mintAuthority: walletAddress.publicKey,
        updateAuthority: walletAddress.publicKey,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,
        clock: web3.SYSVAR_CLOCK_PUBKEY,
      };

      const signers = [mint];
      
      /**
       * Metaplex gives us functions that live on our candymachine
       * Here we bundle a few instructions (a tranaction) and hit them.
       */

      const instructions = [
        web3.SystemProgram.createAccount({
          fromPubkey: walletAddress.publicKey,
          newAccountPubkey: mint.publicKey,
          space: MintLayout.span,
          lamports: rent,
          programId: TOKEN_PROGRAM_ID,
        }),
        Token.createInitMintInstruction(
          TOKEN_PROGRAM_ID,
          mint.publicKey,
          0,
          walletAddress.publicKey,
          walletAddress.publicKey
        ),
        createAssociatedTokenAccountInstruction(
          token,
          walletAddress.publicKey,
          walletAddress.publicKey,
          mint.publicKey
        ),
        Token.createMintToInstruction(
          TOKEN_PROGRAM_ID,
          mint.publicKey,
          token,
          walletAddress.publicKey,
          [],
          1
        ),
      ];

      const provider = getProvider();
      const idl = await Program.fetchIdl(candyMachineProgram, provider);
      const program = new Program(idl, candyMachineProgram, provider);

      // Hit the candy machine and tell it to mint our NFT (mintNft is a candymachine function)
      const txn = await program.rpc.mintNft({
        accounts,
        signers,
        instructions,
      });

      console.log('txn:', txn);

      // Setup listener
      connection.onSignatureWithOptions(
        txn,
        async (notification, context) => {
          if (notification.type === 'status') {
            console.log('Receievd status event');

            const { result } = notification;
            if (!result.err) {
              console.log('NFT Minted!');
            }
          }
        },
        { commitment: 'processed' }
      );
    } catch (error) {
      let message = error.msg || 'Minting failed! Please try again!';

      if (!error.msg) {
        if (error.message.indexOf('0x138')) {
        } else if (error.message.indexOf('0x137')) {
          message = `SOLD OUT!`;
        } else if (error.message.indexOf('0x135')) {
          message = `Insufficient funds to mint. Please fund your wallet.`;
        }
      } else {
        if (error.code === 311) {
          message = `SOLD OUT!`;
        } else if (error.code === 312) {
          message = `Minting period hasn't started yet.`;
        }
      }

      console.warn(message);
    }
  };

  const createAssociatedTokenAccountInstruction = (
    associatedTokenAddress,
    payer,
    walletAddress,
    splTokenMintAddress
  ) => {
    const keys = [
      { pubkey: payer, isSigner: true, isWritable: true },
      { pubkey: associatedTokenAddress, isSigner: false, isWritable: true },
      { pubkey: walletAddress, isSigner: false, isWritable: false },
      { pubkey: splTokenMintAddress, isSigner: false, isWritable: false },
      {
        pubkey: web3.SystemProgram.programId,
        isSigner: false,
        isWritable: false,
      },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      {
        pubkey: web3.SYSVAR_RENT_PUBKEY,
        isSigner: false,
        isWritable: false,
      },
    ];
    return new web3.TransactionInstruction({
      keys,
      programId: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
      data: Buffer.from([]),
    });
  };

  useEffect(() => {
  getCandyMachineState();
  }, []);

  /**
   * Provider will allow our web app to communicate with the Solana blockchain
   * It will give our client a connection to Solana + our wallet credentials so we can talk to programs on the blockchain
   */  
  const getProvider = () => {
    const rpcHost = process.env.REACT_APP_SOLANA_RPC_HOST;

    // Create a new connection object
    const connection = new Connection(rpcHost)

    // Create a new Solana provider object
    const provider = new Provider(
      connection,
      window.solana,
      opts.preflightCommitment
    );
    return provider;
  };

  // Declare getCandyMachineState as an async method
  const getCandyMachineState = async () => {
    const provider = getProvider();

    // Get metadata about your deployed candy machine program, the idl contains th einfor our web app needs on how to interact w/ the candy machine
    const idl = await Program.fetchIdl(candyMachineProgram, provider);

    // Create a program that you can call to help us directly interact with the candy machine
    const program = new Program(idl, candyMachineProgram, provider);

    // Fetch the metadata from your candy machine
    // Looks like were hitting an API, but were actually hitting the Solana devnet blockchain
    const candyMachine = await program.account.candyMachine.fetch(
      process.env.REACT_APP_CANDY_MACHINE_ID
    );

    // Parse out all our metadata and log it our
    const itemsAvailable = candyMachine.data.itemsAvailable.toNumber();
    const itemsRedeemed = candyMachine.itemsRedeemed.toNumber();
    const itemsRemaining = itemsAvailable - itemsRedeemed;
    const goLiveData = candyMachine.data.goLiveDate.toNumber();

    // We will be using this later in our UI so let's generate this now
    const goLiveDataTimeString = `${new Date(
      goLiveData * 1000
    ).toGMTString()}`

    console.log({
      itemsAvailable,
      itemsRedeemed,
      goLiveData,
      goLiveDataTimeString,
    });

    // we use fetchHashTable to "Get all the accounts that have a minted NFT on this program and return the Token URI's which point to our metadata for that NFT".
    const data  = await fetchHashTable(
      process.env.REACT_APP_CANDY_MACHINE_ID,
      true
    );

    // We loop through every mint, get the Token URI, use it to fetch the jsonfile and then parse out the asset address of each of our NFT
    // After we got them all, we store them in our state and we are done
    if (data.length !== 0) {
      const requests = data.map(async (mint) => {
        // GET  URI
        try {
         const response = await fetch(mint.data.uri);
         const parse = await response.json();
         console.log("Past Minted NFT", mint)

         // Get image URI
         return parse.image;
      } catch(e) {
        // If any request fails, we'll just disregard it and carry one
        console.error("Failed retrieving Minted NFT", mint);
        return null;
      }
    });

    // Wait for all requests to finish
    const allMints = await Promise.all(requests);

    // Filter requests that failed
    const filteredMints = allMints.filter(mint => mint !== null);

    // Store all the minted image URIs
    setMints(filteredMints);
  }

    // Add this data to your state to render
    // We create a state variable and then make a call to setMachineStats to set the data
    setMachineStats({
      itemsAvailable,
      itemsRedeemed,
      itemsRemaining,
      goLiveData,
      goLiveDataTimeString,
    });
  };

  const renderMintedItems = () => (
    <div className="gif-container">
      <p className="sub-text">Minted Items ✨ </p>
      <div className="gif-grid">
        {mints.map ((mint) => (
          <div className="gif-item" key={mint}>
            <img src={mint} alt={`Minted NFT ${mint}`} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    // Only show this if machineStats is available
    machineStats && (
    <div className="machine-container">
      <p>{`Drop Date:${machineStats.goLiveDateTimeString}`}</p>
      <p>{`Items Minted: ${machineStats.itemsRedeemed} / ${machineStats.itemsAvailable}`}</p>
      <p>Items Minted:</p>
      <button className="cta-button mint-button" onClick={mintToken}> 
        Mint NFT
      </button>
       {/* If we have mints available in our array, let's render some items */}
      {mints.length > 0 && renderMintedItems()}
    </div>
    )
  );
};

export default CandyMachine;
