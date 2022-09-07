// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

contract RandomIpfsNft is VRFConsumerBaseV2 {
	VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
	uint64 private immutable i_subId;
	bytes32 private immutable i_gasLane;
	uint32 private immutable i_callbackGasLimit;
	uint16 private constant REQUEST_CONFIRMATIONS = 3;
	uint32 private constant NUM_WORDS = 1;

	function requestNFT() external {}

	constructor(
		address vrfCoordinatorV2,
		uint64 subId,
		bytes32 gasLane,
		uint32 callbackGasLimit
	) VRFConsumerBaseV2(vrfCoordinatorV2) {
		i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
		i_subId = subId;
		i_gasLane = gasLane;
		i_callbackGasLimit = callbackGasLimit;
	}

	function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)
		internal
		override
	{}

	function tokenURI() external {}
}
