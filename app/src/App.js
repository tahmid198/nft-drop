import React, { useEffect, useState }  from 'react';
import './App.css';
import twitterLogo from './assets/twitter-logo.svg';
import CandyMachine from './CandyMachine';


// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  // State
  const [walletAddress, setWalletAddress] = useState(null); // We store wallet data in the React state

  // Actions
  const checkIfWalletIsConnected = async () => {
    try {
      const {solana} = window;

      // Check our window object in our DOM to see if the Phantom wallet extension has injected a Solana object
      if (solana) {
        // If we have a solana object check to see if it is the Phantom wallet
        if (solana.isPhantom) {
          console.log('Phantom wallet found!');
          /*
          * The solana object gives us a function that will allow us to connect
          * directly with the user's wallet!
          */
          const response = await solana.connect({ onlyIfTrusted: true }); // onlyIfTrusted flag will allow the user to connect to the site without promting them to connect again with another popup (if they have connected in the past, itll pull their data)
          console.log(
            'Connected with Public Key:',
            response.publicKey.toString()
          );
          /**
           * Set users public key in state to be used later!
           */
          setWalletAddress(response.publicKey.toString()); // after connecting to phantom wallet we recieve and store user data in our state to use later
        }
      } else {
        alert('Solana object not found! Get yourself a Phantom wallet 👻' );
      }
    } 
    catch (error) {
      console.log(error);
    }
  };
  
  /**
   * When an user wants to connect their wallet, we simply call connect on our solana object to authorize our web app with a solana wallet. 
   * We also have access to wallet information after this.
  */

   const connectWallet = async () => {
     const {solana} = window;

     if (solana){
       const response = await solana.connect();
       console.log('Connect with public key: ', response.publicKey.toString() );
       setWalletAddress(response.publicKey.toString());
     }
   };

   /**
    * We want to render this UI if the user hasn't connected 
    * their wallet to our app yet
    */

    const renderNotConnectedContainer = () => (
      <button className = "cta-button connect-wallet-button" onClick={connectWallet} >
        Connect to Wallet
      </button>
    );
    

    /**
     * When our component first mounts, lets first check to see if we have a connected
     * Phantom wallet. 
     */
     
     // useEffect hook gets called once on component mount when that second parameter (the []) is empty!
     useEffect(() => {
      const onLoad = async () => {
        await checkIfWalletIsConnected();
      };
      window.addEventListener('load', onLoad);
      return () => window.removeEventListener('load', onLoad);
     }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">🍭 Candy Drop</p>
          <p className="sub-text">NFT drop machine with fair mint</p>
          {!walletAddress && renderNotConnectedContainer()}
        </div>
          {/* Check for walletAddress and then pass in walletAddress */}
          {walletAddress && <CandyMachine walletAddress={window.solana}/>} 
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
