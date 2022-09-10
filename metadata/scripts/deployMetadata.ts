import * as pinataSDK from "@pinata/sdk";

import * as path from "path";
import fs from "fs-extra";

const pinata: pinataSDK.PinataClient = pinataSDK.default(
	process.env.PINATA_API_KEY as string,
	process.env.PINATA_API_SECRET as string
);

async function deployMetadata() {
	if (process.env.DEPLOY_TO_PINATA !== "true")
		throw new Error("DEPLOY_TO_PINATA in .env equals to false ");
}

async function storeImages(imagesFilePath: string) {
	// resolve => create full path, from "./metadata/RandomDogies" to "/Users/UserName/Dir/Dir/Dir"
	const fullImagesPath = path.resolve(imagesFilePath);

	// All files from dir
	const files = fs.readdirSync(fullImagesPath);
	const responses: Array<any> = [];

	for (const indexFile in files) {
		const readableStreamForFile = fs.createReadStream(
			`${fullImagesPath}/${files[indexFile]}`
		);

		try {
			const response = await pinata.pinFileToIPFS(readableStreamForFile);
			responses.push(response);
		} catch (e: any) {
			console.log(e.message);
			process.exit(1);
		}
	}

	return { responses, files };
}

export { storeImages };
