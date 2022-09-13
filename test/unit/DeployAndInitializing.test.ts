import { BigNumber, ContractReceipt, ContractTransaction } from "ethers";

import { network } from "hardhat";
import { DEV_CHAIN_ID, networkConfig } from "../../helper.config";

import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { fixtureCuteDoggies } from "../utils/fixture";

import { expect } from "chai";

const mintFeeFromConfig: BigNumber = networkConfig[DEV_CHAIN_ID].mintFee;
const baseURI: string =
	"ipfs://Qma1ewwyXeZoiMfwNVcjeR14S2QVgeNJE5UhZEkL6SCZnp/";

!(network.config.chainId === DEV_CHAIN_ID)
	? describe.skip
	: describe("CuteDoggies", function () {
			describe("Deploy || Variable initializing", function () {
				it("Shold be deployed correctly (owner is correct)", async function () {
					const { cuteDoggies, owner } = await loadFixture(
						fixtureCuteDoggies
					);

					const ownerAddress: string = await cuteDoggies.owner();
					expect(ownerAddress).to.eq(owner.address);
				});

				it("Request confirmations is correct", async function () {
					const { cuteDoggies } = await loadFixture(
						fixtureCuteDoggies
					);

					const confirmations: number =
						await cuteDoggies.getRequestConfirmations();

					expect(confirmations).to.eq(3);
				});

				it("Number of words from VRF Coordinator V2 is correct", async function () {
					const { cuteDoggies } = await loadFixture(
						fixtureCuteDoggies
					);
					const numberOfWords: number =
						await cuteDoggies.getNumWords();
					expect(numberOfWords).to.eq(1);
				});

				it("Max chance should be equal to 100", async function () {
					const { cuteDoggies } = await loadFixture(
						fixtureCuteDoggies
					);

					const maxChance: BigNumber =
						await cuteDoggies.getMaxChanceValue();
					expect(maxChance).to.eq(100);
				});

				it("MintFee equal to value from networkConfig", async function () {
					const { cuteDoggies } = await loadFixture(
						fixtureCuteDoggies
					);
					const mintFee: BigNumber = await cuteDoggies.getMintFee();
					expect(mintFee).to.eq(mintFeeFromConfig);
				});

				it("Token counter equals to 0", async function () {
					const { cuteDoggies } = await loadFixture(
						fixtureCuteDoggies
					);
					const tokenCounter: BigNumber =
						await cuteDoggies.getTokenCounter();
					expect(tokenCounter).to.eq(0);
				});

				it("BaseURI is correct", async function () {
					const { cuteDoggies, VRFCoordinator } = await loadFixture(
						fixtureCuteDoggies
					);

					const txResponse: ContractTransaction =
						await cuteDoggies.requestNFT({
							value: mintFeeFromConfig,
						});

					const txReceipt: ContractReceipt = await txResponse.wait(1);

					const requestId: BigNumber = BigNumber.from(
						txReceipt.events![0].topics[2]
					);

					await VRFCoordinator.fulfillRandomWords(
						requestId,
						cuteDoggies.address
					);

					const tokenURI: string = await cuteDoggies.tokenURI(1);
					expect(tokenURI.includes(baseURI)).true;
				});
			});

			describe("Other getters", function () {
				it("GetRequestIdToSender", async function () {
					const { cuteDoggies, owner } = await loadFixture(
						fixtureCuteDoggies
					);

					const txResponse: ContractTransaction =
						await cuteDoggies.requestNFT({
							value: mintFeeFromConfig,
						});

					const txReceipt: ContractReceipt = await txResponse.wait(1);

					const requestId: BigNumber = BigNumber.from(
						txReceipt.events![0].topics[2]
					);

					const requestSender: string =
						await cuteDoggies.getRequestIdToSender(requestId);

					expect(requestSender).to.eq(owner.address);
				});

				it("getVRFCoordinatorV2", async function () {
					const { VRFCoordinator, cuteDoggies } = await loadFixture(
						fixtureCuteDoggies
					);

					const vrfCoordinatorFromContract: string =
						await cuteDoggies.getVrfCoordinatorV2();

					expect(vrfCoordinatorFromContract).to.eq(
						VRFCoordinator.address
					);
				});

				it("GasLane is correct", async function () {
					const { cuteDoggies } = await loadFixture(
						fixtureCuteDoggies
					);

					const contractGasLane: string =
						await cuteDoggies.getGasLane();

					expect(contractGasLane).to.eq(
						networkConfig[DEV_CHAIN_ID].gasLane
					);
				});

				it("SubId value returned correctly", async function () {
					const { cuteDoggies } = await loadFixture(
						fixtureCuteDoggies
					);

					const subIdFronContract: BigNumber =
						await cuteDoggies.getSubId();

					expect(subIdFronContract).to.eq(1);
				});

				it("getCallBackGasLimit is correct", async function () {
					const { cuteDoggies } = await loadFixture(
						fixtureCuteDoggies
					);

					const callbackGasLimit: number =
						await cuteDoggies.getCallBackGasLimit();

					expect(callbackGasLimit.toString()).to.eq(
						networkConfig[DEV_CHAIN_ID].callbackGasLimit
					);
				});
			});

			describe("getDoggiesUri", function () {
				it("If dogs breed is st.bernard link should be with st.bernard.json", async function () {
					const { cuteDoggies, VRFCoordinator } = await loadFixture(
						fixtureCuteDoggies
					);

					const correctURI: string =
						"ipfs://Qma1ewwyXeZoiMfwNVcjeR14S2QVgeNJE5UhZEkL6SCZnp/st-bernard.json";

					let isWantedDoggies: boolean = false,
						returnedTokenURI: string = "";

					for (let i = 1; !isWantedDoggies; i++) {
						await cuteDoggies.requestNFT({
							value: mintFeeFromConfig,
						});

						await VRFCoordinator.fulfillRandomWords(
							i,
							cuteDoggies.address
						);

						const tokenURI: string = await cuteDoggies.tokenURI(i);

						if (tokenURI.includes("st-bernard")) {
							returnedTokenURI = tokenURI;
							isWantedDoggies = true;
						}
					}

					expect(returnedTokenURI).to.eq(correctURI);
				});

				it("If dogs breed is shiba-inu link should be with shiba-inu.json", async function () {
					const { cuteDoggies, VRFCoordinator } = await loadFixture(
						fixtureCuteDoggies
					);

					const correctURI: string =
						"ipfs://Qma1ewwyXeZoiMfwNVcjeR14S2QVgeNJE5UhZEkL6SCZnp/shiba-inu.json";

					let isWantedDoggies: boolean = false,
						returnedTokenURI: string = "";

					for (let i = 1; !isWantedDoggies; i++) {
						await cuteDoggies.requestNFT({
							value: mintFeeFromConfig,
						});

						await VRFCoordinator.fulfillRandomWords(
							i,
							cuteDoggies.address
						);

						const tokenURI: string = await cuteDoggies.tokenURI(i);

						if (tokenURI.includes("shiba-inu")) {
							returnedTokenURI = tokenURI;
							isWantedDoggies = true;
						}
					}

					expect(returnedTokenURI).to.eq(correctURI);
				});

				it("If dogs breed is pug link should be with pug.json", async function () {
					const { cuteDoggies, VRFCoordinator } = await loadFixture(
						fixtureCuteDoggies
					);

					const correctURI: string =
						"ipfs://Qma1ewwyXeZoiMfwNVcjeR14S2QVgeNJE5UhZEkL6SCZnp/pug.json";

					let isWantedDoggies: boolean = false,
						returnedTokenURI: string = "";

					for (let i = 1; !isWantedDoggies; i++) {
						await cuteDoggies.requestNFT({
							value: mintFeeFromConfig,
						});

						await VRFCoordinator.fulfillRandomWords(
							i,
							cuteDoggies.address
						);

						const tokenURI: string = await cuteDoggies.tokenURI(i);

						if (tokenURI.includes("pug")) {
							returnedTokenURI = tokenURI;
							isWantedDoggies = true;
						}
					}

					expect(returnedTokenURI).to.eq(correctURI);
				});
			});
	  });
