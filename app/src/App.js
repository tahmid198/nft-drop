import React, { useEffect }  from 'react';
import './App.css';
import twitterLogo from './assets/twitter-logo.svg';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  // actions

  /**
   *  declare your functions
   */

  const checkIfWalletIsConnected = async () => {
    try {
      const {solana} = window;

      // check our window object in our DOM to see if the Phantom wallet extension has injected a Solana object
      if (solana) {
        // if we have a solana object check to see if it is the Phantom wallet
        if (solana.isPhantom) {
          console.log('Phantom wallet found!');
        }

        /*
         * The solana object gives us a function that will allow us to connect
         * directly with the user's wallet!
         */
        const response = await solana.connect({ onlyIfTrusted: true }); // onlyIfTrusted flag will allow the user to connect to the site without promting them to connect again with another popup (if they have connected in the past, itll pull their data)
        console.log(
          'Connected with Public Key:',
          response.publicKey.toString()
        );

      } else {
        alert('Solana object not found! Get yourself a Phantom wallet 👻' );
      }
    } 
    catch (error) {
      console.log(error);
    }
  };

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
        </div>
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
