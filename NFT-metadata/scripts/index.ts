import { deployMetadata } from "./deployMetadata";

async function main() {
	await deployMetadata();
}

main().catch((e: any) => {
	console.log(e);
	process.exit(1);
});
