import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";
import "hardhat-deploy";
import { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
	solidity: "0.8.16",

	defaultNetwork: "hardhat",
	networks: {
		hardhat: {
			chainId: 31337,
			accounts: {
				mnemonic: process.env.MNEMONIC as string,
			},
		},

		goerli: {
			url:
				"https://eth-goerli.g.alchemy.com/v2/" +
				process.env.GOERLI_RPC_URL,
			accounts: [process.env.GOERLI_PRIVATE_KEY as string],
			chainId: 5,
			timeout: 100000,
		},
	},

	etherscan: {
		apiKey: {
			goerli: process.env.ETHERSCAN_API_KEY as string,
		},
	},

	namedAccounts: {
		deployer: {
			default: 0,
		},
	},
};

export default config;
