import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import type { CuteDoggies, VRFCoordinatorV2Mock } from "../../typechain-types";

import { ethers } from "hardhat";
import { deployments } from "hardhat";
import { DEV_CHAIN_ID, networkConfig } from "../../helper.config";

async function fixtureCuteDoggies(): Promise<{
	signers: Array<SignerWithAddress>;
	owner: SignerWithAddress;
	cuteDoggies: CuteDoggies;
	VRFCoordinator: VRFCoordinatorV2Mock;
}> {
	const signers: SignerWithAddress[] = await ethers.getSigners();
	const [owner]: SignerWithAddress[] = signers;

	await deployments.fixture("all");

	const cuteDoggies: CuteDoggies = await ethers.getContract("CuteDoggies");
	const VRFCoordinator: VRFCoordinatorV2Mock = await ethers.getContract(
		"VRFCoordinatorV2Mock"
	);

	return { signers, owner, cuteDoggies, VRFCoordinator };
}

async function fixtureCuteDoggiesWithRequest(): Promise<{
	signers: Array<SignerWithAddress>;
	owner: SignerWithAddress;
	cuteDoggies: CuteDoggies;
	VRFCoordinator: VRFCoordinatorV2Mock;
}> {
	const signers: SignerWithAddress[] = await ethers.getSigners();
	const [owner]: SignerWithAddress[] = signers;

	await deployments.fixture("all");

	const cuteDoggies: CuteDoggies = await ethers.getContract("CuteDoggies");
	const VRFCoordinator: VRFCoordinatorV2Mock = await ethers.getContract(
		"VRFCoordinatorV2Mock"
	);

	await cuteDoggies.requestNFT({
		value: networkConfig[DEV_CHAIN_ID].mintFee,
	});

	return { signers, owner, cuteDoggies, VRFCoordinator };
}

export { fixtureCuteDoggies, fixtureCuteDoggiesWithRequest };
