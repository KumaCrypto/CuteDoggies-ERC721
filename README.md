# CuteDoggies | Random NFT collection

<p> This is a NFT collection of the cutest puppies - the ERC-721 standard. When you mint a token, the smart-contract uses ChainlinkVRF V2 to determine the breed that the owner gets. </p>

<p>You may get a drop-off: </p>

-   Pug puppy (10% chance).
-   Shiba Inu puppy (30% chance)
-   St. Bernard puppy (60% chance)

<br/>
<p align="center">
<img src="NFT-metadata/CuteDoggies/images/pug.png" width="225" alt="NFT Pug">
<img src="NFT-metadata/CuteDoggies/images/shiba-inu.png" width="225" alt="NFT Shiba">
<img src="NFT-metadata/CuteDoggies/images/st-bernard.png" width="225" alt="NFT St.Bernard">
</p>
<br/>

---

You can read more about what ChainlinkVRF V2 is by following this [link](https://docs.chain.link/docs/vrf/v2/introduction/).

---

### Navigation:

-   [Getting Started](https://github.com/KumaCrypto/CuteDoggies-ERC721#getting-started)
    -   [Disclaimer](https://github.com/KumaCrypto/CuteDoggies-ERC721#disclaimer)
    -   [Requirements](https://github.com/KumaCrypto/CuteDoggies-ERC721#requirements)
    -   [Quickstart](https://github.com/KumaCrypto/CuteDoggies-ERC721#quickstart)
-   [Usage](https://github.com/KumaCrypto/CuteDoggies-ERC721#usage)

    -   [Deploy images and metadata](https://github.com/KumaCrypto/CuteDoggies-ERC721#deploy-images-and-metadata-to-ipfs-using-pinata)
    -   [Deploy](https://github.com/KumaCrypto/CuteDoggies-ERC721#deploy_images_and_metadata_to_ipfs)
    -   [Deploy](https://github.com/KumaCrypto/CuteDoggies-ERC721#deploy)
    -   [Testing](https://github.com/KumaCrypto/CuteDoggies-ERC721#testing)
        -   [Test coverage](https://github.com/KumaCrypto/CuteDoggies-ERC721#test-coverage)
    -   [Get one of the CuteDoggies pups](https://github.com/KumaCrypto/CuteDoggies-ERC721#get-one-of-the-cutedoggies-pups)
    -   [Withdraw](https://github.com/KumaCrypto/CuteDoggies-ERC721#withdraw)

-   [Contributing](https://github.com/KumaCrypto/CuteDoggies-ERC721#contributing)
-   [Author](https://github.com/KumaCrypto/CuteDoggies-ERC721#author)
-   [License](https://github.com/KumaCrypto/CuteDoggies-ERC721#license)

# Getting Started

## Disclaimer:

> If you do not understand something, be free to open an issue or write me in DM :)

## Requirements

-   [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
    -   You'll know you did it right if you can run `git --version` and you see a response like `git version x.x.x`
-   [Nodejs](https://nodejs.org/en/)
    -   You'll know you've installed nodejs right if you can run:
        -   `node --version` and get an ouput like: `vx.x.x`

## Quickstart

<p>Clone repository from git:</p>

```bash
git clone https://github.com/KumaCrypto/CuteDoggies-ERC721.git
```

```bash
npm install --save-dev
```

# Usage

## Deploy images and metadata to IPFS (using Pinata)

```bash
npx hardhat run NFT-metadata/scripts/index.ts
```

## Deploy

Deploy to the public blockchains:

> _If your network is different from "Goerli", change the hardhat.config.ts and the address values in helper.config.ts_

```bash
npx hardhat deploy --tags CuteDoggies --network <Your network here>
```

**Or if you want to deploy a contract on a local network hardhat:**

```bash
npx hardhat deploy
```

#### Of course you will need a .env file in which you should have the following variables (or your own for different networks):

-   _[ YOUR_NETWORK ]RPC_URL_: The url of the node. This argument is required for custom networks.

-   _[ YOUR_NETWORK ]PRIVATE_KEY key or MNEMONIC_: to sign a message.

-   _ETHERSCAN_API_KEY_: for contract verification.

> Remember to change hardhat.config.ts for your variables and networks.

## Testing

```
npx hardhat test
```

### Test Coverage

```
npx hardhat coverage
```

## Get one of the CuteDoggies pups

```bash
npx hardhat run scripts/buyCuteDoggie.ts --network goerli or <YOUR NETWORK NAME>
```

## Withdraw

```bash
npx hardhat run scripts/withdraw.ts --network goerli or <YOUR NETWORK NAME>
```

# Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

# Author:

## [Vladimir Kumalagov](https://github.com/KumaCrypto)

# License

## [MIT](https://choosealicense.com/licenses/mit/)
