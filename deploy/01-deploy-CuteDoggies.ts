import type { DeployFunction } from "hardhat-deploy/dist/types";
import type { HardhatRuntimeEnvironment } from "hardhat/types";
import type { CuteDoggies, VRFCoordinatorV2Mock } from "../typechain-types";
import type { BigNumber } from "ethers";

import verify from "../scripts/utils/verify";
import { ethers, network } from "hardhat";
import {
	CONFIRMATION_AMOUNT,
	DEV_CHAIN_ID,
	networkConfig,
} from "../helper.config";

const chainId: number = network.config.chainId!;
const isDevChain: boolean = chainId === DEV_CHAIN_ID;

/* If dev chain => confirmations = 1 else confirmations fron networkConfig */
const confitmations: number = isDevChain ? 1 : CONFIRMATION_AMOUNT;

const FUND_AMOUNT: BigNumber = ethers.utils.parseEther("10");
const deployCuteDoggies: DeployFunction = async (
	hre: HardhatRuntimeEnvironment
) => {
	const { deployments, getNamedAccounts } = hre;
	const { log, deploy } = deployments;
	const { deployer } = await getNamedAccounts();

	let vrfCoordinatorAddress: string,
		vrfCoordinator: VRFCoordinatorV2Mock,
		subId: string;

	if (isDevChain) {
		vrfCoordinator = (await ethers.getContract(
			"VRFCoordinatorV2Mock"
		)) as unknown as VRFCoordinatorV2Mock;
		vrfCoordinatorAddress = vrfCoordinator.address;

		const createSubscriptionTx = await vrfCoordinator.createSubscription();
		const createSubscriptionTxReceipt = await createSubscriptionTx.wait(1);

		if (createSubscriptionTxReceipt.status === 0)
			throw new Error("Error while creating subscription!");

		subId = createSubscriptionTxReceipt.events![0].args!.subId.toString();
		await vrfCoordinator.fundSubscription(subId, FUND_AMOUNT);
	} else {
		vrfCoordinatorAddress = networkConfig[chainId].vrfV2Coordinator!;
		vrfCoordinator = await ethers.getContractAt(
			"VRFCoordinatorV2Mock",
			vrfCoordinatorAddress
		);

		subId = networkConfig[chainId].subId!;
	}

	log("----------------------------------------");

	const gasLane = networkConfig[chainId].gasLane;
	const callbackGasLimit = networkConfig[chainId].callbackGasLimit;
	const mintFee = networkConfig[chainId].mintFee;

	const args: Array<any> = [
		vrfCoordinatorAddress,
		subId,
		gasLane,
		callbackGasLimit,
		mintFee,
	];

	const CuteDoggies: CuteDoggies = (await deploy("CuteDoggies", {
		from: deployer,
		args: args,
		log: true,
		waitConfirmations: confitmations,
	})) as unknown as CuteDoggies;

	/*
    In @chainlink/contracts/src/v0.8/mocks/VRFCoordinatorV2Mock.sol npm version 0.4.1 addConsumer is not impelemnted,
    but in 0.4.2 we should to add consumers
    */
	await vrfCoordinator!.addConsumer(subId, CuteDoggies.address);

	if (!isDevChain && process.env.ETHERSCAN_API_KEY)
		await verify(CuteDoggies.address, args);
	log("----------------------------------------");
};

deployCuteDoggies.tags = ["all", "CuteDoggies"];
export default deployCuteDoggies;
