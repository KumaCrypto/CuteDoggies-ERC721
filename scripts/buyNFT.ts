import { ethers, deployments, network } from "hardhat";
import { networkConfig } from "../helper.config";
import fs from "fs-extra";

import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import type {
	TransactionReceipt,
	TransactionResponse,
} from "@ethersproject/abstract-provider";
import type { CuteDoggies } from "../typechain-types";

const { get } = deployments;

// TODO You can change this values to your own :)
const contractAddress: string = "";
const reqConfirmatioms: number | null = null;

async function main() {
	const chainId: number = network.config.chainId!;
	if (!chainId)
		throw new Error("ChainId in your network config does not exist");

	/* Print current signer */
	const [signer]: SignerWithAddress[] = await ethers.getSigners();
	console.log(
		`You are currently using an account with the address: ${signer.address}`
	);

	/* Get contract address */
	let cuteDoggiesAddress: string;

	fs.existsSync("./deployments/goerli/CuteDoggies.json")
		? (cuteDoggiesAddress = (await get("CuteDoggies")).address)
		: (cuteDoggiesAddress = contractAddress);

	if (!cuteDoggiesAddress) throw new Error("Contract address field is empty");

	/* Get contract */
	const cuteDoggies: CuteDoggies = await ethers.getContractAt(
		"CuteDoggies",
		cuteDoggiesAddress
	);

	/* Send transaction and wait for confirmations */
	const requestTx: TransactionResponse = await cuteDoggies.requestNFT({
		value: networkConfig[chainId].mintFee,
	});
	console.log(`Transaction sent, txHash: ${requestTx.hash}`);

	const receipt: TransactionReceipt = await requestTx.wait(
		reqConfirmatioms ?? 1
	);

	console.log(
		`The transaction was successfully added to the block number: ${receipt.blockNumber} with ${receipt.confirmations} of confirmation(s)`
	);
}

main().catch((e: any) => {
	console.log(e);
	process.exit(1);
});
