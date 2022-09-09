// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error CuteDogies__TokenDoesNotExist();
error CuteDogies__LowLevelCallFailed();
error CuteDogies__IncorrectAmountValue();
error CuteDogies__TransferToTheZeroAddress();
error CuteDogies__RangeOutOfBounds(uint256 maxValue, uint256 receivedValue);
error CuteDogies__NeedMoreETHSent(uint256 sent, uint256 mintFee);

contract CuteDogies is VRFConsumerBaseV2, ERC721, Ownable {
	/* Type declaration */
	enum Breed {
		PUG,
		SHIBA_INU,
		ST_BERNARD
	}

	/* VRF state variables */
	VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
	uint32 private immutable i_callbackGasLimit;
	uint64 private immutable i_subId;
	bytes32 private immutable i_gasLane;
	uint16 private constant REQUEST_CONFIRMATIONS = 3;
	uint32 private constant NUM_WORDS = 1;

	/* VRF helper */
	mapping(uint256 => address) private s_requestIdToSender;

	// Main variables
	uint256 private constant MAX_CHANCE_VALUE = 100;
	uint256 private immutable i_mintFee;

	uint256 private s_tokenCounter;
	mapping(uint256 => Breed) private s_tokenIdToBreed;

	event NFTRequested(uint256 requestId, address sender);
	event NFTMinted(uint256 requestId, address sender, Breed dogBreed);

	/* Functions */
	constructor(
		address vrfCoordinatorV2,
		uint64 subId,
		bytes32 gasLane,
		uint32 callbackGasLimit,
		uint256 mintFee
	) VRFConsumerBaseV2(vrfCoordinatorV2) ERC721("Random Dogies", "RDOGIES") {
		i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
		i_subId = subId;
		i_gasLane = gasLane;
		i_callbackGasLimit = callbackGasLimit;
		i_mintFee = mintFee;
	}

	/* User can request NFT mint and create request to VRF Coordinator V2 */
	function requestNFT() external payable returns (uint256 requestId) {
		if (msg.value < i_mintFee)
			revert CuteDogies__NeedMoreETHSent(msg.value, i_mintFee);

		requestId = i_vrfCoordinator.requestRandomWords(
			i_gasLane,
			i_subId,
			REQUEST_CONFIRMATIONS,
			i_callbackGasLimit,
			NUM_WORDS
		);

		s_requestIdToSender[requestId] = msg.sender;
		emit NFTRequested(requestId, msg.sender);
	}

	/* VRF Coordinator V2 will answer to the user request and mint random NFT */
	function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)
		internal
		override
	{
		/* Get address which request NFT */
		address tokenOwner = s_requestIdToSender[requestId];
		delete s_requestIdToSender[requestId];

		uint256 newTokenId = ++s_tokenCounter;
		_safeMint(tokenOwner, newTokenId);

		uint256 modedRng = randomWords[0] % MAX_CHANCE_VALUE;
		Breed currentDogBreed = getBreedFromModedRng(modedRng);
		s_tokenIdToBreed[newTokenId] = currentDogBreed;

		emit NFTMinted(requestId, tokenOwner, currentDogBreed);
	}

	/* Get breed for random NFT */
	function getBreedFromModedRng(uint256 modedRng)
		internal
		pure
		returns (Breed)
	{
		uint256 cumulativeSum;

		/* 10, 30, 100*/
		uint256[3] memory chanceArray = getChanceArray();

		for (uint256 i; i < chanceArray.length; i++) {
			/* 
            For example modedRng = 25:
                ((25 >= 0) and (25 < 10)) => false => cumulativeSum = cumulativeSum + 10;
                ((25 >= 10) and (25 < 40)) => return SHIBA_INU;
            */
			if (
				modedRng >= cumulativeSum &&
				modedRng < cumulativeSum + chanceArray[i]
			) return Breed(i);

			cumulativeSum = cumulativeSum + chanceArray[i];
		}

		revert CuteDogies__RangeOutOfBounds(MAX_CHANCE_VALUE, modedRng);
	}

	function withdraw(address payable to, uint256 amount) external onlyOwner {
		if (to == address(0)) revert CuteDogies__TransferToTheZeroAddress();
		if (amount == 0 || amount > address(this).balance)
			revert CuteDogies__IncorrectAmountValue();

		(bool isSuccess, ) = to.call{value: amount}("");
		if (!isSuccess) revert CuteDogies__LowLevelCallFailed();
	}

	/* Getters */
	function tokenURI(uint256 tokenId)
		public
		view
		override
		returns (string memory)
	{
		if (!_exists(tokenId)) revert CuteDogies__TokenDoesNotExist();

		string memory base = _baseURI();
		string memory tokenUri = getDogiesUri(tokenId);

		return string(abi.encodePacked(base, tokenUri));
	}

	function getChanceArray() public pure returns (uint256[3] memory) {
		return [10, 30, MAX_CHANCE_VALUE];
	}

	function getMaxChanceValue() external pure returns (uint256) {
		return MAX_CHANCE_VALUE;
	}

	function getRequestIdToSender(uint256 requestId)
		external
		view
		returns (address)
	{
		return s_requestIdToSender[requestId];
	}

	function getTokenCounter() external view returns (uint256) {
		return s_tokenCounter;
	}

	function getMintFee() external view returns (uint256) {
		return i_mintFee;
	}

	function getVrfCoordinatorV2() external view returns (address) {
		return address(i_vrfCoordinator);
	}

	function getGasLane() external view returns (bytes32) {
		return i_gasLane;
	}

	function getSubId() external view returns (uint64) {
		return i_subId;
	}

	function getNumWords() external pure returns (uint32) {
		return NUM_WORDS;
	}

	function getRequestConfirmations() external pure returns (uint16) {
		return REQUEST_CONFIRMATIONS;
	}

	function getCallBackGasLimit() external view returns (uint32) {
		return i_callbackGasLimit;
	}

	function _baseURI() internal pure override returns (string memory) {
		return "ipfs://QmZ5eVBhugNZBDV9LAZdJkA6bWTghhg2tbkv1KeXRPMNsw/";
	}

	function getDogiesUri(uint256 tokenId)
		internal
		view
		returns (string memory)
	{
		Breed currentTokenBreed = s_tokenIdToBreed[tokenId];

		if (currentTokenBreed == Breed.ST_BERNARD) {
			return "st-bernard.png";
		} else if (currentTokenBreed == Breed.SHIBA_INU) return "shiba-inu.png";

		return "pug.png";
	}
}