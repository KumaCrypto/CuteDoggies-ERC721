import { network } from "hardhat";
import { DEV_CHAIN_ID } from "../../helper.config";

import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { fixtureCuteDoggiesWithRequest } from "../utils/fixture";

import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";

import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";

!(network.config.chainId === DEV_CHAIN_ID)
	? describe.skip
	: describe("CuteDoggies", function () {
			describe("Deploy || Variable initializing", function () {
				it("s_requestIdToSender deleted", async function () {
					const { VRFCoordinator, cuteDoggies } = await loadFixture(
						fixtureCuteDoggiesWithRequest
					);

					await VRFCoordinator.fulfillRandomWords(
						1,
						cuteDoggies.address
					);

					const reqIdToSender: string =
						await cuteDoggies.getRequestIdToSender(1);

					expect(reqIdToSender).to.eq(ethers.constants.AddressZero);
				});

				it("TotalSupply should be increased", async function () {
					const { VRFCoordinator, cuteDoggies } = await loadFixture(
						fixtureCuteDoggiesWithRequest
					);

					const totalSupplyBefore: BigNumber =
						await cuteDoggies.getTokenCounter();
					await VRFCoordinator.fulfillRandomWords(
						1,
						cuteDoggies.address
					);

					const totalSupplyAfter: BigNumber =
						await cuteDoggies.getTokenCounter();

					expect(totalSupplyBefore.add(1)).to.eq(totalSupplyAfter);
				});

				it("Token should be minted", async function () {
					const { VRFCoordinator, cuteDoggies, owner } =
						await loadFixture(fixtureCuteDoggiesWithRequest);

					const tokenBalanceBefore: BigNumber =
						await cuteDoggies.balanceOf(owner.address);

					await VRFCoordinator.fulfillRandomWords(
						1,
						cuteDoggies.address
					);

					const tokenBalanceAfter: BigNumber =
						await cuteDoggies.balanceOf(owner.address);

					expect(tokenBalanceBefore.add(1)).to.eq(tokenBalanceAfter);
				});

				it("Owner of should be correct", async function () {
					const { VRFCoordinator, cuteDoggies, owner } =
						await loadFixture(fixtureCuteDoggiesWithRequest);

					await VRFCoordinator.fulfillRandomWords(
						1,
						cuteDoggies.address
					);

					const tokenOwner: string = await cuteDoggies.ownerOf(1);

					expect(tokenOwner).to.eq(owner.address);
				});

				it("Token has own breed", async function () {
					const { VRFCoordinator, cuteDoggies } = await loadFixture(
						fixtureCuteDoggiesWithRequest
					);

					await VRFCoordinator.fulfillRandomWords(
						1,
						cuteDoggies.address
					);

					/* If does not exist will be reverted*/
					const tokenBreed: string = await cuteDoggies.getTokenBreed(
						1
					);

					expect(tokenBreed).to.all;
				});
				it("Event NFTMinted should be emmited", async function () {
					const { VRFCoordinator, cuteDoggies, owner } =
						await loadFixture(fixtureCuteDoggiesWithRequest);

					await expect(
						VRFCoordinator.fulfillRandomWords(
							1,
							cuteDoggies.address
						)
					)
						.to.emit(cuteDoggies, "NFTMinted")
						.withArgs(owner.address, 1, anyValue);
				});
			});
	  });
