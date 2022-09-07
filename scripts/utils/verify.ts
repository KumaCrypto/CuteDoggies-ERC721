import { run } from "hardhat";
import { log } from "console";

async function verify(contractAddress: string, args: Array<any>) {
	try {
		await run("verify:verify", {
			address: contractAddress,
			constructorArguments: args,
		});
	} catch (error: any) {
		error.message.toLowerCase().includes("already verified")
			? log("Contract already verified!")
			: log(error);
	}
}

export default verify;
