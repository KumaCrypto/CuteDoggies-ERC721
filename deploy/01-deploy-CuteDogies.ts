import type { DeployFunction } from "hardhat-deploy/dist/types";
import type { HardhatRuntimeEnvironment } from "hardhat/types";
import type { CuteDogies, VRFCoordinatorV2Mock } from "../typechain-types";

import verify from "../scripts/utils/verify";
import { ethers, network } from "hardhat";
import {
	CONFIRMATION_AMOUNT,
	DEV_CHAIN_ID,
	networkConfig,
} from "../helper.config";

const chainId: number = network.config.chainId!;
const isDevChain: boolean = chainId === DEV_CHAIN_ID;
/* If dev chain => confirmations = 1 */
const confitmations: number = isDevChain ? 1 : CONFIRMATION_AMOUNT;

const deployCuteDogies: DeployFunction = async (
	hre: HardhatRuntimeEnvironment
) => {
	const { deployments, getNamedAccounts } = hre;
	const { log, deploy, get } = deployments;
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
	const CuteDogies: CuteDogies = (await deploy("CuteDogies", {
		from: deployer,
		args: args,
		log: true,
		waitConfirmations: confitmations,
	})) as unknown as CuteDogies;

	//  TODO CHECK WHY NOT IMPLEMENTED
	await vrfCoordinator!.addConsumer(subId, vrfCoordinatorAddress);
	if (!isDevChain && process.env.ETHERSCAN_API_KEY)
		await verify(CuteDogies.address, args);
	log("----------------------------------------");
};

deployCuteDogies.tags = ["all", "CuteDogies"];
export default deployCuteDogies;
