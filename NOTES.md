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

### Deploying Your NFT's

Deploying is a 3 step process:
1. First we have to upload our NFT's to Arweave(a decentralized file-storage) and initilize our candymachine.
2. Next, we need to create our candymachine on Metaplex's contract.
3. Lastly, we need to update our candymachine with the data a customer can mint our NFT's.

In order to begin uploading to Solana we first need to create a local wallet which is essentially a keypair (a private and public key). This public key will act as our wallet address. We can copy and paste this address into our NFT's JSON file and replace it with the placeholder found at `creators:address`. To get your address you can use the command `solana address`. 

Next we use Metaplex's upload command to upload our NFT's found in the asset folder. Once upload is complete we can verify everything went well by running the verify command, and the following recipt should print with the name of our NFTs + their Arweave links.

`wallet public key: 4onC4LPmiGFsXRNEYJ3hWMMRp9vTMNqu98iwFQU44cEb
Name FUTURE_FOUNDATION with https://arweave.net/DG1pgu8oEhq97uvzETCviyONauuV9RGxB_NVEGihFfk checked out
Name 2099 with https://arweave.net/c3CztEkrMNxfRrqde3xG18XJnk0aFXqlSNv1u3ze6FE checked out
Name NOIR with https://arweave.net/uPS0ie-ZEmp07JWivkQZICVgw3Jdp8lFX6p2lUsRabA checked out
uploaded (3) out of (3)
ready to deploy!`

Arweave will store our data forever. It uses an algorithm to determine the cost of storing data forever based on size. For our case Metaplex is being generous and will pay for the cose of our NFT's. 
### Resources

[Metaplex and Candy Machine](https://hackmd.io/@levicook/HJcDneEWF#:~:text=metaplex%20is%20a%20command%20line,machine%20is%20valid%20and%20complete)
[Arweave Algorithm](https://arwiki.wiki/#/en/storage-endowment#toc_Transaction_Pricing)
[Arweave Storage Fee Calculator](https://arweavefees.com/)