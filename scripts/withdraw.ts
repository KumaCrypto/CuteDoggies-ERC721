import { ethers, deployments } from "hardhat";
const { get } = deployments;

import fs from "fs-extra";

import type { BigNumber } from "ethers";
import type { CuteDoggies } from "../typechain-types";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import type {
	TransactionReceipt,
	TransactionResponse,
} from "@ethersproject/abstract-provider";

// TODO You can change this values to your own :)
const contractAddress: string = "";

let to: string = "";
const amountInEther: string | number = "";
const reqConfirmatioms: number | null = null;

async function main() {
	/* Print current signer */
	const [signer]: SignerWithAddress[] = await ethers.getSigners();
	if (!to) to = signer.address;
	console.log(
		`You are currently using an account with the address: ${signer.address}`
	);

	/* Input params validation */
	if (!amountInEther) throw new Error("Incorrect amount value");
	const amountInWei: BigNumber = ethers.utils.parseEther(
		amountInEther.toString()
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
	const withdrawTx: TransactionResponse = await cuteDoggies.withdraw(
		to,
		amountInWei
	);
	console.log(`Transaction sent, txHash: ${withdrawTx.hash}`);

	const receipt: TransactionReceipt = await withdrawTx.wait(
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
