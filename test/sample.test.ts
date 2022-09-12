import { network } from "hardhat";
import { DEV_CHAIN_ID } from "../helper.config";

import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { fixtureCuteDoggies } from "./utils/fixture";

!(network.config.chainId === DEV_CHAIN_ID)
	? describe.skip
	: describe("CuteDoggies", function () {
			describe("Deploy || Variable initializing", function () {
				it("Should be deployed", async function () {
					const {} = await loadFixture(fixtureCuteDoggies);
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
				it("Should be deployed", async function () {
					const {} = await loadFixture(fixtureCuteDoggies);
				});
				it("Should be deployed", async function () {
					const {} = await loadFixture(fixtureCuteDoggies);
				});
			});
	  });
