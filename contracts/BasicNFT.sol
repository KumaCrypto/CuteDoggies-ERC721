// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract BasicNft is ERC721 {
	uint256 private s_tokenCounter;
	string private constant TOKEN_URI =
		"ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json";

	constructor() ERC721("Dogie", "DOG") {}

	function mint() external returns (uint256) {
		uint256 newTokenId = ++s_tokenCounter;
		_safeMint(msg.sender, newTokenId);

		return newTokenId;
	}

	function tokenURI(
		uint256 /* tokenId*/
	) public pure override returns (string memory) {
		return TOKEN_URI;
	}

	function getTokenCounter() external view returns (uint256) {
		return s_tokenCounter;
	}
}
