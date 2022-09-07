import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { BasicNft } from "../typechain-types";
import { CONFIRMATION_AMOUNT, DEV_CHAIN } from "../helper.config";
import { network } from "hardhat";
import verify from "../scripts/utils/verify";

const isDevChain: boolean = network.config.chainId === DEV_CHAIN;
/* If dev chain => confirmations = 1 */
const confitmations: number = isDevChain ? 1 : CONFIRMATION_AMOUNT;

const deployBasicNft: DeployFunction = async (
	hre: HardhatRuntimeEnvironment
) => {
	const { deployments, getNamedAccounts } = hre;
	const { log, deploy } = deployments;
	const { deployer } = await getNamedAccounts();

	const args: Array<any> = [];
	const basicNft: BasicNft = (await deploy("BasicNft", {
		from: deployer,
		log: true,
		waitConfirmations: confitmations,
	})) as unknown as BasicNft;

	if (!isDevChain && process.env.ETHERSCAN_API_KEY)
		await verify(basicNft.address, args);
	log("----------------------------------------");
};

deployBasicNft.tags = ["all", "BasicNft"];
export default deployBasicNft;
