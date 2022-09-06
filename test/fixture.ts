import { BasicNft, BasicNft__factory } from "../typechain-types";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

async function fixture(): Promise<{
	signer: SignerWithAddress;
	basicNft: BasicNft;
}> {
	const [signer]: SignerWithAddress[] = await ethers.getSigners();
	const basicNft: BasicNft = await new BasicNft__factory(signer).deploy();

	return { signer, basicNft };
}

export default fixture;
