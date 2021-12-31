# buildspace Solana NFT Drop Project
## Welcome 👋

Our goal for this project is to build a web application that lets a user connect their wallet, request an NFT, minting the NFT, and recieveing the NFT from our collection.

The following will be the notes and intresting stuff I came across while working on this project.

## Notes 📝

### Metaplex

Metaplex is the NFT standard that Solana uses to create and mint NFTS. Unlike Ethereum, where we would have to create and deploy our own OpenZeppelin ERC-721 NFT contract and then call the mint function on our contract to mint an NFT, with Metaplex we dont need to create and deploy our own contracts to mint. Metaplex has already done this for us. As a developer we can interact with these standard NFT contracts and build our own collection on it. 

### Candy Machine 🍭

Candy Machine is an on chain Solana program that governs fair mints. This means that the system wont accept funds if they are out of NFT's to sell and start and finish is the same for everyone. Due to Solonas parrelel computing nature, Candy Machine is able to handle edge cases. 

For example, if there is one NFT left and person A and person B clikced mint at the same time. Candy Machine handles these problems for us.

### Resources

[Metaplex and Candy Machine](https://hackmd.io/@levicook/HJcDneEWF#:~:text=metaplex%20is%20a%20command%20line,machine%20is%20valid%20and%20complete)

testing