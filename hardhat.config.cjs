require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    botchainTestnet: {
      url: process.env.BOTCHAIN_TESTNET_RPC_URL || "https://rpc.bohr.life",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 968,
    },
    botchainMainnet: {
      url: process.env.BOTCHAIN_MAINNET_RPC_URL || "https://rpc.botchain.ai",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 677,
    },
  },
  etherscan: {
    apiKey: {
      botchainTestnet: process.env.BOTCHAIN_API_KEY || "placeholder",
      botchainMainnet: process.env.BOTCHAIN_API_KEY || "placeholder",
    },
    customChains: [
      {
        network: "botchainTestnet",
        chainId: 968,
        urls: {
          apiURL: process.env.BOTCHAIN_TESTNET_API_URL || "https://testnet-scan.botchain.ai/api",
          browserURL: process.env.BOTCHAIN_TESTNET_EXPLORER || "https://testnet-scan.botchain.ai",
        },
      },
      {
        network: "botchainMainnet",
        chainId: 677,
        urls: {
          apiURL: process.env.BOTCHAIN_API_URL || "https://scan.botchain.ai/api",
          browserURL: process.env.BOTCHAIN_EXPLORER || "https://scan.botchain.ai",
        },
      },
    ],
  },
};
