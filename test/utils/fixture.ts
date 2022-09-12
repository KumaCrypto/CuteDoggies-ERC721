import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import type { CuteDoggies } from "../../typechain-types";

import { ethers } from "hardhat";
import { deployments } from "hardhat";

async function fixtureCuteDoggies(): Promise<{
	signers: Array<SignerWithAddress>;
	owner: SignerWithAddress;
	cuteDoggies: CuteDoggies;
}> {
	const signers: SignerWithAddress[] = await ethers.getSigners();
	const [owner]: SignerWithAddress[] = signers;

	const cuteDoggies: CuteDoggies = (await deployments.fixture(
		"CuteDoggies"
	)) as unknown as CuteDoggies;

	return { signers, owner, cuteDoggies };
}

export { fixtureCuteDoggies };
