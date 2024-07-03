require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config('/.env')
const PRIVATE_KEY = process.env.REACT_APP_WALLET_PRIVATE_KEY;
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/cd219a543e9b4072882f0dcb85d3a887`,
      accounts: [PRIVATE_KEY],
    },
    localhost: {
      url: "http://127.0.0.1:8545" // 本地节点的 URL
    }
  }
};
