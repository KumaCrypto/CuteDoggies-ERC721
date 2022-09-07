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
	},

	namedAccounts: {
		deployer: {
			default: 0,
		},
	},
};

export default config;
