import type { BigNumber } from "ethers";
import type { HardhatRuntimeEnvironment } from "hardhat/types";
import type { DeployFunction } from "hardhat-deploy/dist/types";

import { ethers, network } from "hardhat";
import { DEV_CHAIN_ID } from "../helper.config";

const currentChainId: number = network.config.chainId!;
const confirmationAmount: number = 1;

const BASE_FEE: BigNumber = ethers.utils.parseEther("0.25"); // Request cost.
const GAS_PRICE_LINK: BigNumber = ethers.utils.parseUnits("1", "9"); // Link per gas.

const deployMockCoordinator: DeployFunction = async (
	hre: HardhatRuntimeEnvironment
) => {
	if (currentChainId === DEV_CHAIN_ID) {
		const { deployments, getNamedAccounts } = hre;
		const { deploy, log } = deployments;
		const { deployer } = await getNamedAccounts();

		log("Deploying mock...");
		const constructorArgs: Array<BigNumber> = [BASE_FEE, GAS_PRICE_LINK];

		await deploy("VRFCoordinatorV2Mock", {
			from: deployer,
			args: constructorArgs,
			log: true,
			waitConfirmations: confirmationAmount,
		});

		log("Mock deployed!");
		log("------------------------------");
	}
};

deployMockCoordinator.tags = ["mock", "all"];
export default deployMockCoordinator;
