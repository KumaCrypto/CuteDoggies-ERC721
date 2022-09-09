import { fixtureRandomNft } from "./utils/fixture";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { network } from "hardhat";
import { DEV_CHAIN } from "../helper.config";

!(network.config.chainId === DEV_CHAIN)
	? describe.skip
	: describe("RandomNFT", function () {
			describe("Deploy || Variable initializing", function () {
				it("Should be deployed", async function () {
					const {} = await loadFixture(fixtureRandomNft);
				});
				it("Should be deployed", async function () {
					const {} = await loadFixture(fixtureRandomNft);
				});
				it("Should be deployed", async function () {
					const {} = await loadFixture(fixtureRandomNft);
				});
				it("Should be deployed", async function () {
					const {} = await loadFixture(fixtureRandomNft);
				});
				it("Should be deployed", async function () {
					const {} = await loadFixture(fixtureRandomNft);
				});
				it("Should be deployed", async function () {
					const {} = await loadFixture(fixtureRandomNft);
				});
			});
	  });
