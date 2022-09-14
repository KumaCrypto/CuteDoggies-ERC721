import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { fixtureCuteDoggies } from "../utils/fixture";

import { BigNumber, PopulatedTransaction } from "ethers";
import { network } from "hardhat";

import { DEV_CHAIN_ID, networkConfig } from "../../helper.config";
import { expect } from "chai";

const mintFeeFromConfig = networkConfig[DEV_CHAIN_ID].mintFee;

!(network.config.chainId === DEV_CHAIN_ID)
	? describe.skip
	: describe("CuteDoggies || requestNFT", function () {
			describe("requestNFT", function () {
				it("If msg.value less than mintFee tx should be reverted", async function () {
					const { cuteDoggies } = await loadFixture(
						fixtureCuteDoggies
					);

					await expect(cuteDoggies.requestNFT())
						.to.be.revertedWithCustomError(
							cuteDoggies,
							"CuteDoggies__NeedMoreETHSent"
						)
						.withArgs(0, networkConfig[DEV_CHAIN_ID].mintFee);
				});

				it("Request id writed correctly", async function () {
					const { cuteDoggies, owner } = await loadFixture(
						fixtureCuteDoggies
					);

					await cuteDoggies.requestNFT({
						value: networkConfig[DEV_CHAIN_ID].mintFee,
					});

					const senderAddress: string =
						await cuteDoggies.getRequestIdToSender(1);

					expect(senderAddress).to.eq(owner.address);
				});

				it("To emit the NFTRequested event", async function () {
					const { cuteDoggies, owner } = await loadFixture(
						fixtureCuteDoggies
					);

					await expect(
						cuteDoggies.requestNFT({
							value: networkConfig[DEV_CHAIN_ID].mintFee,
						})
					)
						.to.emit(cuteDoggies, "NFTRequested")
						.withArgs(owner.address, 1);
				});

				it("Request 2 NFT to 1 user should mint 2 NFT", async function () {
					const { cuteDoggies, VRFCoordinator, owner } =
						await loadFixture(fixtureCuteDoggies);

					/* First req */
					await cuteDoggies.requestNFT({
						value: mintFeeFromConfig,
					});

					/* Second req */
					await cuteDoggies.requestNFT({
						value: mintFeeFromConfig,
					});

					/* Answer to first req */
					await VRFCoordinator.fulfillRandomWords(
						1,
						cuteDoggies.address
					);

					/* Answer to second req */
					await VRFCoordinator.fulfillRandomWords(
						2,
						cuteDoggies.address
					);

					const balance: BigNumber = await cuteDoggies.balanceOf(
						owner.address
					);

					expect(balance).to.eq(2);
				});
			});

			describe("Receive", function () {
				it("Receive should call _requestNFT", async function () {
					const { cuteDoggies, owner } = await loadFixture(
						fixtureCuteDoggies
					);

					const tx: PopulatedTransaction = {
						to: cuteDoggies.address,
						value: mintFeeFromConfig,
					};

					await expect(owner.sendTransaction(tx))
						.to.emit(cuteDoggies, "NFTRequested")
						.withArgs(owner.address, 1);
				});
			});
	  });
