const hre = require("hardhat");

async function main() {
    console.log("Deploying MedTrack...");
    
    const MedTrack = await hre.ethers.getContractFactory("MedTrack");
    const medTrack = await MedTrack.deploy();
    await medTrack.deployed();
    
    console.log("MedTrack deployed to:", medTrack.address);
    console.log("COPY THIS ADDRESS!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});