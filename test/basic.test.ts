import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import fixture from "./fixture";
import { ethers } from "hardhat";
import { expect } from "chai";

describe("BasicNft", function () {
	describe("Deploy", function () {
		it("Should icrement counter when nft minted", async function () {
			const { basicNft } = await loadFixture(fixture);
			await basicNft.mint();
			await basicNft.mint();

			expect(await basicNft.getTokenCounter()).to.eq(2);
		});
	});
});
