import { handleTokenUris } from "./deployMetadata";

async function main() {
	await handleTokenUris();
}

main().catch((e: any) => {
	console.log(e);
	process.exit(1);
});
