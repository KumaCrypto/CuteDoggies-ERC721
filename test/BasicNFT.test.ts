import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { fixtureBasicNft } from "./utils/fixture";

import { expect } from "chai";
import { BigNumber } from "ethers";

import { network } from "hardhat";
import { DEV_CHAIN } from "../helper.config";

const TokenURI =
	"ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json";

!(network.config.chainId === DEV_CHAIN)
	? describe.skip
	: describe("BasicNft", function () {
			describe("Deploy", function () {
				it("Counter value by default should be 0", async function () {
					const { basicNft } = await loadFixture(fixtureBasicNft);
					expect(await basicNft.getTokenCounter()).to.eq(0);
				});

				it("TokenURI should be correct", async function () {
					const { basicNft } = await loadFixture(fixtureBasicNft);
					expect(await basicNft.tokenURI(0)).to.eq(TokenURI);
				});
			});

			describe("Mint", function () {
				it("Balance should be increased", async function () {
					const { basicNft, signer } = await loadFixture(
						fixtureBasicNft
					);
					const balanceBefore: BigNumber = await basicNft.balanceOf(
						signer.address
					);

					await basicNft.mint();

					const balanceAfter: BigNumber = await basicNft.balanceOf(
						signer.address
					);
					expect(balanceAfter).to.eq(balanceBefore.add(1));
				});

				it("Should icrement counter when nft minted", async function () {
					const { basicNft } = await loadFixture(fixtureBasicNft);
					await basicNft.mint();
					await basicNft.mint();

					expect(await basicNft.getTokenCounter()).to.eq(2);
				});
			});
	  });
