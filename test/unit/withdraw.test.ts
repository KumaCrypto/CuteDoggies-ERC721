import { network } from "hardhat";
import { DEV_CHAIN_ID } from "../../helper.config";

import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { fixtureCuteDoggies } from "../utils/fixture";

import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { networkConfig } from "../../helper.config";

const mintFeeFromConfig: BigNumber = networkConfig[DEV_CHAIN_ID].mintFee;

!(network.config.chainId === DEV_CHAIN_ID)
	? describe.skip
	: describe("CuteDoggies || withdraw", function () {
			describe("Withdraw", function () {
				it("If to equals to the zero address revert", async function () {
					const { cuteDoggies } = await loadFixture(
						fixtureCuteDoggies
					);

					await expect(
						cuteDoggies.withdraw(ethers.constants.AddressZero, "0")
					).to.be.revertedWithCustomError(
						cuteDoggies,
						"CuteDoggies__TransferToTheZeroAddress"
					);
				});

				it("If amount equals to the zero revert", async function () {
					const { cuteDoggies, owner } = await loadFixture(
						fixtureCuteDoggies
					);

					await expect(
						cuteDoggies.withdraw(owner.address, "0")
					).to.be.revertedWithCustomError(
						cuteDoggies,
						"CuteDoggies__IncorrectAmountValue"
					);
				});

				it("If amount gt balance revert", async function () {
					const { cuteDoggies, owner } = await loadFixture(
						fixtureCuteDoggies
					);

					await expect(
						cuteDoggies.withdraw(owner.address, "1")
					).to.be.revertedWithCustomError(
						cuteDoggies,
						"CuteDoggies__IncorrectAmountValue"
					);
				});

				it("Amount successfully transfered", async function () {
					const { cuteDoggies, owner } = await loadFixture(
						fixtureCuteDoggies
					);

					await cuteDoggies.requestNFT({
						value: mintFeeFromConfig,
					});

					await expect(
						cuteDoggies.withdraw(owner.address, mintFeeFromConfig)
					).to.changeEtherBalance(owner.address, mintFeeFromConfig);
				});

				it("If transfer failed - revert", async function () {
					const { cuteDoggies, VRFCoordinator } = await loadFixture(
						fixtureCuteDoggies
					);

					await cuteDoggies.requestNFT({
						value: mintFeeFromConfig,
					});

					await expect(
						cuteDoggies.withdraw(
							VRFCoordinator.address,
							mintFeeFromConfig
						)
					).to.be.revertedWithCustomError(
						cuteDoggies,
						"CuteDoggies__LowLevelCallFailed"
					);
				});
				it("Event FundsWithdrawn should be emitted when transfer was successful", async function () {
					const { cuteDoggies, owner } = await loadFixture(
						fixtureCuteDoggies
					);

					await cuteDoggies.requestNFT({
						value: mintFeeFromConfig,
					});

					await expect(
						cuteDoggies.withdraw(owner.address, mintFeeFromConfig)
					)
						.to.emit(cuteDoggies, "FundsWithdrawn")
						.withArgs(owner.address, mintFeeFromConfig);
				});
			});
	  });
