import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers, deployments } from "hardhat";
import { networkConfig } from "../helper.config";
import { CuteDoggies } from "../typechain-types";
import { network } from "hardhat";

const { get } = deployments;

async function main() {
	const chainId: number = network.config.chainId!;
	const [signer]: SignerWithAddress[] = await ethers.getSigners();

	console.log(`You are using account with address: ${signer.address}`);

	// TODO change to static address
	const cuteDoggiesAddress: string = (await get("CuteDoggies")).address;

	const cuteDoggies: CuteDoggies = await ethers.getContractAt(
		"CuteDoggies",
		cuteDoggiesAddress
	);

	// TODO add types to tx and receipt
	const tx = await cuteDoggies.requestNFT({
		value: networkConfig[chainId].mintFee,
	});

	const receipt = await tx.wait(3);

	console.log(
		`Tx successfully mined at ${receipt.blockNumber} and has ${receipt.confirmations} confirmations, tranasaction hash: ${receipt.transactionHash}`
	);
}

main().catch((e: any) => {
	console.log(e);
	process.exit(1);
});
