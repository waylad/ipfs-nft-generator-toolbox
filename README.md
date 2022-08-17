# Demo Video: https://youtu.be/TmlrbQUuIo8

# What is IPFS NFT Generator Toolbox ?

IPFS NFT Generator is a toolbox for the generation and minting of large collections (e.g. 10,000) of unique NFTs.
Input SVG layers of your NFTs and the generator will combine them automatically into unique merged SVG images with metadata and upload them to IPFS.
Then use the provided smart contract minter to create the NFTs on any EVM compatible blockchain.

# How to use the IPFS NFT Generator Toolbox ?

The repository is made of 2 folders:
- The `generator` that will assemble your SVG parts into unique merged images with metadata, and upload them to IPFS.
- The `contracts` folder that contains an NFT minter runing on EVM.

## Step 1: Generate the images and metadata and upload them to IPFS

Go to the `generator` folder. 

You will need an IPFS API key with Infura to proceed. Go to https://infura.io/product/ipfs and register an account.
Then rename `.env.example` as `.env` and enter your Infura IPFS credentials:

```
INFURA_API_ID=
INFURA_API_SECRET=
```

Now put all yours layers into the `layers` folder configure `index.js` with your layers combinations and ordering. (In future version, this process could be much better streamlined. In this example just leave `layers` and `index.js` as offered.)

Now install dependancies and run the generator :

```
yarn install
yarn start
```

You will see each combination being generated and uploaded to IPFS :
```
Image 0002 : Generating image file
Image 0002 : Uploading image to IPFS
Image 0002 : Uploaded to ipfs://QmadNJttyfvN8gxv8a95xWhUFsuW8AgJ3H7GcZ4M2pwiUL
Image 0002 : Generating metadata json file
Image 0002 : Writing metadata json and image file in /out
Image 0002 : DONE ---------------------------
Image 0003 : Generating image file
Image 0003 : Uploading image to IPFS
Image 0003 : Uploaded to ipfs://QmTA9YxDVAu6mL7YKMMvp1RFZPdPcm2QkQH7qY9Yif4vLn
Image 0003 : Generating metadata json file
Image 0003 : Writing metadata json and image file in /out
Image 0003 : DONE ---------------------------
Image 0010 : Generating image file
Image 0010 : Uploading image to IPFS
Image 0010 : Uploaded to ipfs://QmTHTd6Cxmp7DuBCvbefN7m36pu7Ttos4KbzUcGvfQX52V
Image 0010 : Generating metadata json file
Image 0010 : Writing metadata json and image file in /out
Image 0010 : DONE ---------------------------
...
```

Check out the generated `out` folder to see all the genrated images and metadata.


## Mint the NFTs

1- Go to the `contracts` folder. 

2- Run `yarn install`

3- Install and Run [Ganache](https://trufflesuite.com/ganache/)

4- Compile the smart contract
```
npx truffle compile
```

5- Deploy the Minter contract
```
npx truffle migrate --network testnet --reset
```

6- Modify `scripts/mint.js` with an IPFS link generated previouly to mint that NFT then run the truffle script:
```
npx truffle exec scripts/mint.js --network testnet
```

Futur versions will include a script to mint the whole collection at once.

