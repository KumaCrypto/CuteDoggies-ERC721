import type { tokenURI, metadata } from "./interfaces";

import * as pinataSDK from "@pinata/sdk";
import * as path from "path";
import fs from "fs-extra";

/* PATH */
const pathToImages: string = "metadata/RandomDogies/images/";
const pathToSaveMetadataURI: string = "./metadata/RandomDogies/URI/URIs.json";

/* Init pinata client */
const pinata: pinataSDK.PinataClient = pinataSDK.default(
	process.env.PINATA_API_KEY as string,
	process.env.PINATA_API_SECRET as string
);

async function handleTokenUris() {
	if (process.env.DEPLOY_TO_PINATA !== "true")
		throw new Error("DEPLOY_TO_PINATA in .env equals to false ");

	// Deploy images to IPFS (pinata) and getting list of files.
	const { responses, files } = await deployImages(pathToImages);
	const tokenURIs: Array<tokenURI> = [];

	for (
		let currentIndex = 0;
		currentIndex < responses.length;
		currentIndex++
	) {
		// Get token name from filename
		const tokenName = files[currentIndex].replace(".png", "");
		// Create metadata for current token
		const tokenMetadata: metadata = {
			name: tokenName,
			description: `An adorable ${tokenName} pup`,
			image: `ipfs://${responses[currentIndex].IpfsHash}`,
			attributes: [
				{
					trait_type: "cuteness",
					value: Math.round(Math.random() * 100),
				},
			],
		};

		// Get pin resposne from PinataSDK
		const deployResponse: pinataSDK.PinataPinResponse = await deployToIpfs(
			tokenMetadata
		);

		// Add current metadataTokenURI to array
		tokenURIs.push({ [tokenName]: `ipfs://${deployResponse.IpfsHash}` });
	}

	// If dir and file does not exist => create them
	if (!fs.existsSync(pathToSaveMetadataURI)) {
		const dirPathSplitted: Array<string> = pathToSaveMetadataURI.split("/");
		dirPathSplitted.pop();
		const dirPath: string = dirPathSplitted.join("/");

		fs.mkdirSync(dirPath);
		fs.createFileSync(pathToSaveMetadataURI);
	}

	// Write array of token URIs to file
	await fs.writeJSON(pathToSaveMetadataURI, tokenURIs);

	console.log("All tokens metadata deployed to IPFS!");
	console.log(`URI's saved to ${pathToSaveMetadataURI}`);
}

/* Deploy token metadata to IPFS(Pinata) and return PinataPinResponse */
async function deployToIpfs(file: metadata | fs.ReadStream) {
	return pinata.pinJSONToIPFS(file).catch((e: any) => {
		console.log(e);
		process.exit(1);
	});
}

/* Deploy images to IPFS(Pinata)*/
async function deployImages(imagesFilePath: string) {
	// resolve => create full path, from "./metadata/RandomDogies" to "/Users/UserName/Dir/Dir/Dir"
	const fullImagesPath = path.resolve(imagesFilePath);

	// All files from dir
	const files = fs.readdirSync(fullImagesPath);
	const responses: Array<pinataSDK.PinataPinResponse> = [];

	for (const indexFile of files) {
		const readableStreamForFile = fs.createReadStream(
			`${fullImagesPath}/${indexFile}`
		);

		const response = await deployToIpfs(readableStreamForFile);
		responses.push(response);
	}

	return { responses, files };
}

export { handleTokenUris };
