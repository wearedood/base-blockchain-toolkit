/**
 * Base Network Utilities
 * Comprehensive utility functions for Base blockchain development
 */

const { ethers } = require('ethers');
const axios = require('axios');

// Base Network Configuration
const BASE_NETWORKS = {
  mainnet: {
    chainId: 8453,
    name: 'Base',
    rpcUrl: 'https://mainnet.base.org',
    blockExplorer: 'https://basescan.org'
  },
  testnet: {
    chainId: 84532,
    name: 'Base Sepolia',
    rpcUrl: 'https://sepolia.base.org',
    blockExplorer: 'https://sepolia.basescan.org'
  }
};

class BaseNetworkUtils {
  constructor(network = 'mainnet', privateKey = null) {
    this.network = network;
    this.config = BASE_NETWORKS[network];
    this.provider = new ethers.JsonRpcProvider(this.config.rpcUrl);
    
    if (privateKey) {
      this.wallet = new ethers.Wallet(privateKey, this.provider);
    }
  }

  async getGasPrices() {
    const feeData = await this.provider.getFeeData();
    return {
      slow: feeData.gasPrice,
      standard: feeData.gasPrice * 110n / 100n,
      fast: feeData.gasPrice * 120n / 100n
    };
  }

  async estimateGas(transaction) {
    const gasEstimate = await this.provider.estimateGas(transaction);
    return gasEstimate * 120n / 100n; // 20% buffer
  }

  async sendTransaction(transaction) {
    if (!this.wallet) {
      throw new Error('Wallet not initialized');
    }
    return await this.wallet.sendTransaction(transaction);
  }

  async getBalance(address) {
    const balance = await this.provider.getBalance(address);
    return ethers.formatEther(balance);
  }
}

module.exports = { BaseNetworkUtils, BASE_NETWORKS };
