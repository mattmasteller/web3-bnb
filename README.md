## On-chain BNB Property Ownership and Rental

![Header](/screenshots/web3-bnb.png)

### Features

A solidity smart contract + dapp that combines the core features of renting a single property (e.g. an AirBnb rental) with an ERC-20 dividend paying token for multiple owners of the property:

- a group of owners/investors (shareholders) can buy a property together
- guests can book and pay rent for the property
- earnings (rent) can be withdrawn by a shareholder proportionally to their number of shares
- the dapp supports use cases for both guests and owners

### Run the project locally

1. Clone the project locally:

    ```bash
    git clone https://github.com/mattmasteller/web3-bnb.git
    ```

2. Install dependencies:

    ```bash
    yarn install
    ```

3. Start the local Hardhat node:

    ```bash
    yarn hardhat node
    ```

4. With the Hardhat node running, deploy the smart contract to the local network in a separate terminal window:

    ```bash
    yarn hardhat run ethereum/scripts/deploy.js --network localhost
    ```

5. Copy the contract address from the terminal and assign it to the REACT_APP_CONTRACT_ADDRESS environment variable in the .env file.

6. Configure .env file inside the root directory:

    ```file
    NETWORK_URL=https://eth-rinkeby.alchemyapi.io/v2/your-alchemy-key
    REACT_APP_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
    ```

7. Launch the frontend client app:

    ```bash
    yarn start
    ```

### Deployed website

<https://web3-bnb.netlify.app/>

### Deployed contract

<https://rinkeby.etherscan.io/address/0xa3Cbdaa189D193d905662bbb999446854C1a5480>

### Technology

- hardhat
- solidity
- openzeppelin
- react
- ethers
- chakra-ui
