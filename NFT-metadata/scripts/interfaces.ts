interface metadata {
	name: string;
	description: string;
	image: string;
	attributes: object;
}

interface tokenURI {
	[tokenName: string]: string;
}

export { metadata, tokenURI };
