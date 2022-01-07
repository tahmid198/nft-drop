# buildspace Solana NFT Drop Project
### Welcome 👋

Our goal for this project is to build a web application that lets a user connect their wallet, request an NFT, minting the NFT, and recieveing the NFT from our collection.

To start up the app follow these commands:

1. cd into the `app` folder
2. Run `npm install` at the root of your directory
3. Run `npm run start` to start the project

### Dependencies

- **Metaplex** will help us create and mint NFT, while **Candy Machine** will help us govern fair mints.
- **[Phantom Wallet]**(https://phantom.app/) will be a bridge between our web app and Solana program. Without a connecting to a wallet we cannot communicate with the Solana blockchain.
- **[Solana CLI]**(https://docs.solana.com/cli/install-solana-cli-tools#use-solanas-install-toolls) to deploy to the devnet (an actual blockchain runned by validators).
- **Metaplex CLI** to interact with Metaplex's deployed NFT contracts. This will allow us to
  1. Create our own Candymachine
  2. Upload our NFT to our Candymachine 
  3. Allow users to mint NFT using our Candymachine
- To interact with Candmachine CLI the following needs to be installed:
  - **[Git]**(https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
  - **[NodeJS]**(https://nodejs.org/en/download/)
  - **[Yarn]**(https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable) - make sure to install globally, `npm install -g yarn` 
  - **[ts-node]**(https://www.npmjs.com/package/ts-node#installation) - make sure to install globally, `npm install -g ts-node`

### What is the .vscode Folder?
If you use VSCode to build your app, we included a list of suggested extensions that will help you build this project! Once you open this project in VSCode, you will see a popup asking if you want to download the recommended extensions :).

### Notes 📝

Link to my notes I created so I can refer back to them in the future.

<button name="button" onclick="http://www.google.com">Click me</button>

### Resources

[Ship your own custom NFT collection on Solana w/ Metaplex in a weekend](https://app.buildspace.so/projects/CO77556be5-25e9-49dd-a799-91a2fc29520e)

[Setting up Candy Machine](https://docs.metaplex.com/candy-machine-v1/introduction)

[Establishing a Connection with Phantom](https://docs.phantom.app/integrating/establishing-a-connection#eagerly-connecting)

[Metaplex](https://www.metaplex.com/)

---------------------------------------------------------------------------------------------------

Lots of thanks and credit to 🦄Buildspace for making this project possible. 🙏
