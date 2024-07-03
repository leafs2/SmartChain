const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const API = await ethers.getContractFactory("AItool");
  const api = await API.deploy();

  await api.waitForDeployment();

  console.log("API deployed to:", api.target);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
