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

async function deployImages(pathToImages: string) {
	// resolve => create full path, from "./metadata/RandomDogies" to "/Users/UserName/Dir/Dir/Dir"
	const fullImagesPath = path.resolve(pathToImages);

	// All files from dir
	const files = fs.readdirSync(fullImagesPath);
	const responses: Array<any> = [];

	for (const fileIndex in files) {
		console.log(fileIndex);
		const readeableStreamForFile = fs.createReadStream(
			`${fullImagesPath}/${fileIndex}`
		);

		try {
			const response = await pinata.pinFileToIPFS(readeableStreamForFile);
			responses.push(response);
		} catch (e: any) {
			console.log(e.message);
			process.exit(1);
		}
	}
	console.log(responses, files);
	return { responses, files };
}

deployImages("./metadata/RandomDogies").catch((error: any) => {
	console.log(error);
	process.exit(1);
});
