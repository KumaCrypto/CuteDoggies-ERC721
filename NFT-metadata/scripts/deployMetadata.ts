import type { tokenURI, metadata } from "./interfaces";

import * as pinataSDK from "@pinata/sdk";
import * as path from "path";
import fs from "fs-extra";

/* PATH */
const metadataPath: string = "NFT-metadata/RandomDogies/metadata";
const pathToImages: string = "NFT-metadata/RandomDogies/images/";
const pathToSaveMetadataURI: string = "NFT-metadata/RandomDogies/URI/URIs.json";

/* Init pinata client */
const pinata: pinataSDK.PinataClient = pinataSDK.default(
	process.env.PINATA_API_KEY as string,
	process.env.PINATA_API_SECRET as string
);

async function deployMetadata() {
	if (process.env.DEPLOY_TO_PINATA !== "true")
		throw new Error("DEPLOY_TO_PINATA in .env equals to false!");
	// Deploy images to IPFS (pinata) and getting list of files.
	const { URIs, files } = await deployImages(pathToImages);

	// Get tokenNames without extensions.
	const tokenNames: Array<string> = files.map(
		(currentFile) => currentFile.split(".")[0]
	);

	// Get full path to the metadata.
	const metadataResolvedPath: string = path.resolve(metadataPath);

	// Create and store metadata from received URIs, tokenNames to metadataResolvedPath.
	createAndStoreMetadata(URIs, tokenNames, metadataResolvedPath);

	console.log("Deploying metadata to IPFS...");
	// Deploy to IPFS(Pinata) and receive resposne from them
	const deployResponse: pinataSDK.PinataPinResponse = await deployToIpfs(
		metadataResolvedPath
	);
	console.log("Deployed!");

	// Add current metadataTokenURI to array
	const metadataURIs: Array<tokenURI> = tokenNames.map((currentTokenName) => {
		return {
			[currentTokenName]: `ipfs://${
				deployResponse.IpfsHash + "/" + currentTokenName + ".json"
			}`,
		};
	});

	// If dir and file does not exist => create them
	if (!fs.existsSync(pathToSaveMetadataURI)) {
		const dirPathSplitted: Array<string> = pathToSaveMetadataURI.split("/");
		dirPathSplitted.pop();
		const dirPath: string = dirPathSplitted.join("/");

		fs.mkdirSync(dirPath);
		fs.createFileSync(pathToSaveMetadataURI);
	}

	// Write array of token URIs to file
	fs.writeJSONSync(pathToSaveMetadataURI, metadataURIs);

	console.log("All tokens metadata created and deployed to IPFS!");
	console.log(`URI's saved at ${pathToSaveMetadataURI}`);
}

// Create and store metadata for every pup - locally
function createAndStoreMetadata(
	URIs: Array<string>,
	tokenNames: Array<string>,
	metadataResolvedPath: string
) {
	console.log("Creating metadata...");

	for (let currentIndex = 0; currentIndex < URIs.length; currentIndex++) {
		// Get token name from filename
		const currentTokenName: string = tokenNames[currentIndex];

		// Create metadata for current token
		const tokenMetadata: metadata = {
			name: currentTokenName,
			description: `An adorable ${currentTokenName} pup`,
			image: `ipfs://${URIs[currentIndex]}`,
			attributes: [
				{
					trait_type: "cuteness",
					value: Math.round(Math.random() * 100),
				},
			],
		};

		// If dir for token metadata does not exist, create it
		if (!fs.existsSync(metadataResolvedPath))
			fs.mkdirSync(metadataResolvedPath);

		const pathToTokenMetadata: string =
			metadataResolvedPath + "/" + currentTokenName + ".json";

		// If file does not exist, create it
		if (!fs.existsSync(pathToTokenMetadata))
			fs.createFileSync(pathToTokenMetadata);

		// Write token metadata to file
		fs.writeJSONSync(pathToTokenMetadata, tokenMetadata);
	}

	console.log("Metadata created!");
}

/* Deploy directory to IPFS (Pinata)  */
async function deployToIpfs(dir: string): Promise<pinataSDK.PinataPinResponse> {
	/*
        Using pinFromFS instead pinFileToIPFS,
        because in pinFromFS we upload directory so root URI will be same
    */
	return pinata.pinFromFS(dir).catch((e: any) => {
		console.log(`Error occurs at path: ${dir}`);
		console.log(e);
		process.exit(1);
	});
}

/* Deploy images to IPFS(Pinata)*/
async function deployImages(
	imagesFilePath: string
): Promise<{ URIs: Array<string>; files: Array<string> }> {
	console.log("Deploying images to IPFS!");
	// resolve => create full path, from "./metadata/RandomDogies" to "/Users/UserName/Dir/Dir/Dir"
	const fullImagesPath = path.resolve(imagesFilePath);

	// All files from directory
	const files: Array<string> = fs.readdirSync(fullImagesPath);

	const response: pinataSDK.PinataPinResponse = await deployToIpfs(
		fullImagesPath
	);

	console.log("Images deployed!");

	// Calculate URI for every uploaded image
	// Example: QmZ5eVBhugNZBDV9LAZdJkA6bWTghhg2tbkv1KeXRPMNsw/pug.png
	const URIs: Array<string> = files.map((filename) => {
		return response.IpfsHash + "/" + filename;
	});

	return { URIs, files };
}

export { deployMetadata };
