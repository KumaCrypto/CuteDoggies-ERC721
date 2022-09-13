import { network } from "hardhat";
import { DEV_CHAIN_ID, networkConfig } from "../../helper.config";

import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { fixtureCuteDoggies } from "../utils/fixture";

import { expect } from "chai";

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
				it("Should be deployed", async function () {
					const {} = await loadFixture(fixtureCuteDoggies);
				});
				it("Should be deployed", async function () {
					const {} = await loadFixture(fixtureCuteDoggies);
				});
				it("Should be deployed", async function () {
					const {} = await loadFixture(fixtureCuteDoggies);
				});
			});
	  });
