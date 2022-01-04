# buildspace Solana NFT Drop Project
## Welcome 👋

Our goal for this project is to build a web application that lets a user connect their wallet, request an NFT, minting the NFT, and recieveing the NFT from our collection.

The following will be the notes and intresting stuff I came across while working on this project.

## Notes 📝

### Metaplex

Metaplex is the NFT standard that Solana uses to create and mint NFTS. Unlike Ethereum, where we would have to create and deploy our own OpenZeppelin ERC-721 NFT contract and then call the mint function on our contract to mint an NFT, with Metaplex we dont need to create and deploy our own contracts to mint. Metaplex has already done this for us. As a developer we can interact with these standard NFT contracts and build our own collection on it. 

The Metaplex CLI makes it simple to tell Candymachine what NFT's we are going to upload and all its details. Since an NFT is only a JSON and an asset, Metaplex makes it easy and allows us to upload all NFT's together in one command. It will take the data in the JSON and stroe it on chain for us.  
### Candy Machine 🍭

Candy Machine is an on chain Solana program that governs fair mints. This means that the system wont accept funds if they are out of NFT's to sell and start and finish is the same for everyone. Due to Solonas parrelel computing nature, Candy Machine is able to handle edge cases. 

For example, if there is one NFT left and person A and person B clikced mint at the same time. Candy Machine handles these problems for us.

### Deploying Your NFT's 🚀

Deploying is a 3 step process:
1. First we have to upload our NFT's to Arweave(a decentralized file-storage) and initilize our candymachine.
2. Next, we need to create our candymachine on Metaplex's contract.
3. Lastly, we need to update our candymachine with the data a customer can mint our NFT's.

Use this link from the Metaplex documentation to [prepare your NFT](https://docs.metaplex.com/candy-machine-v1/prepare-assets).

In order to begin uploading to Solana we first need to create a local wallet which is essentially a keypair (a private and public key). This public key will act as our wallet address. We can copy and paste this address into our NFT's JSON file and replace it with the placeholder found at `creators:address`. To get your address you can use the command `solana address`. 

Next we use Metaplex's upload command to upload our NFT's found in the asset folder. Once upload is complete we can verify everything went well by running the verify command, and the following recipt should print with the name of our NFTs + their Arweave links.

Use this link from the Metaplex documentation to [upload your NFT](https://docs.metaplex.com/candy-machine-v1/upload-assets) and then [verify your NFT's were uploaded](https://docs.metaplex.com/candy-machine-v1/verify-upload).

Then, you can run the [update Candy Machine](https://docs.metaplex.com/candy-machine-v1/update-cm) command to set a drop date.

`wallet public key: 4onC4LPmiGFsXRNEYJ3hWMMRp9vTMNqu98iwFQU44cEb
Name FUTURE_FOUNDATION with https://arweave.net/DG1pgu8oEhq97uvzETCviyONauuV9RGxB_NVEGihFfk checked out
Name 2099 with https://arweave.net/c3CztEkrMNxfRrqde3xG18XJnk0aFXqlSNv1u3ze6FE checked out
Name NOIR with https://arweave.net/uPS0ie-ZEmp07JWivkQZICVgw3Jdp8lFX6p2lUsRabA checked out
uploaded (3) out of (3)
ready to deploy!`

Arweave will store our data forever. It uses an algorithm to determine the cost of storing data forever based on size. For our case Metaplex is being generous and will pay for the cose of our NFT's. 

### Creating an NFT Candy Machine

When deploying our Candy Machine to the Metaplex's contract we are not deploying a new Candy Machine from scratch. All that is happening is that we are adding a new Candy Machine to Metaplex's existing protocol. 

Use this link from the Metaplex documentation to [create our Candy Machine](https://docs.metaplex.com/candy-machine-v1/create-cm)

When creating our Candy Machine we will also be pricing our NFT in the same command.

Once we deploy our Candy Machine we should have an output like the one here:

`wallet public key: 4onC4LPmiGFsXRNEYJ3hWMMRp9vTMNqu98iwFQU44cEb
create_candy_machine finished. candy machine pubkey: 4UsstNBVE4Z3L8wcnEtK6bgkg1gWFjhE8Rc959UVnxuk`

The `candy machine pubkey` is the address of our deployed candy machine.

Note that all our NFT's will live on Metaplex's open protocal and only we will be able to alter them.

### Setting up .env

Our `.env` file at the root of our app will store our keys. 

`REACT_APP_CANDY_MACHINE_CONFIG=
REACT_APP_CANDY_MACHINE_ID=
REACT_APP_TREASURY_ADDRESS=
REACT_APP_SOLANA_NETWORK=
REACT_APP_SOLANA_RPC_HOST=`

The values for `REACT_APP_CANDY_MACHINE_CONFIG`, `REACT_APP_CANDY_MACHINE_ID`, and `REACT_APP_TREASURY_ADDRESS` can be found in the `.cache/devnet-temp` JSON file.

- The value for `REACT_APP_CANDY_MACHINE_CONFIG` is the `config` key.
- The value for `REACT_APP_CANDY_MACHINE_ID` is the `candyMachineAddress` key.
- The value for `REACT_APP_TREASURY_ADDRESS` is the `authority` key.
- `REACT_APP_SOLANA_NETWORK` should be set to `devnet` as this is the network we where ae are accessing our candy machine from.
- And becasue we need to point our RPC to the devnet link we set `REACT_APP_SOLANA_RPC_HOST` to `https://explorer-api.devnet.solana.com`.

Note: If you want to change or update your NFT's you will need to do the following steps
1. Delete the .chache folder (genetated by the Metaplex CLI candy machine commands)
2. Update your NFT's
3. Run the Metaplex `upload` command to upload NFT's
4. Run Metaplex `verify` command to make sure all NFt's were uploaded
5. Run Metaplex `create_candy_machine` command to create new  candy machine
6. Run `update_candy_machine` to create drop date
7. Update .env file with all new addresses.

### Resources

[Metaplex and Candy Machine](https://hackmd.io/@levicook/HJcDneEWF#:~:text=metaplex%20is%20a%20command%20line,machine%20is%20valid%20and%20complete)

[Arweave Algorithm](https://arwiki.wiki/#/en/storage-endowment#toc_Transaction_Pricing)

[Arweave Storage Fee Calculator](https://arweavefees.com/)

[Metaplex Documentation](https://docs.metaplex.com/)