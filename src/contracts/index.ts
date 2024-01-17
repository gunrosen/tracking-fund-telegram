import {Web3SupportNetwork} from "../types";
import {ethers} from "ethers";

export const getNativeBalance = async (chain: Web3SupportNetwork, address: string): Promise<number> => {
  try {
    const rpc = getRPC(chain)
    const provider = new ethers.JsonRpcProvider(rpc)
    const balance = await provider.getBalance(address)
    return Number(ethers.formatEther(balance))
  } catch (e) {
    console.error(e)
  }
}

export const getLotterySignerAddress = async (chain: Web3SupportNetwork, contract: string): Promise<string> => {
  try {
    const methodABI = [
      "function signer() external view returns (address)"
    ]
    const rpc = getRPC(chain)
    const provider = new ethers.JsonRpcProvider(rpc)
    const lotteryContract = new ethers.Contract(contract, methodABI, provider)
    return await lotteryContract.signer()
  } catch (e) {
    console.error(e)
  }
}

export const getRPC = (chain: Web3SupportNetwork): string => {
  switch (chain) {
    case Web3SupportNetwork.BSC_TESTNET:
      return 'https://bsc-testnet.publicnode.com'
    case Web3SupportNetwork.BSC_MAINNET:
      return 'https://bsc-dataseed.bnbchain.org'
    case Web3SupportNetwork.AVALANCHE_FUJI:
      return 'https://rpc.ankr.com/avalanche_fuji'
    case Web3SupportNetwork.AVALANCHE_MAINNET:
      return 'https://avalanche-c-chain.publicnode.com'
    case Web3SupportNetwork.POLYGON_MUMBAI:
      return 'https://rpc-mumbai.maticvigil.com'
    case Web3SupportNetwork.POLYGON_MATIC:
      return 'https://rpc-mainnet.maticvigil.com'
    case Web3SupportNetwork.ARBITRUM_SEPOLIA:
      return 'https://sepolia-rollup.arbitrum.io/rpc'
    case Web3SupportNetwork.ARBITRUM_MAINNET:
      return 'https://arb1.arbitrum.io/rpc'
    case Web3SupportNetwork.FANTOM_TESTNET:
      return 'https://rpc.testnet.fantom.network'
    case Web3SupportNetwork.FANTOM_MAINNET:
      return 'https://rpcapi.fantom.network'
    case Web3SupportNetwork.ETHEREUM_GOERLI:
      return 'https://ethereum-goerli.publicnode.com'
    case Web3SupportNetwork.ETHEREUM_SEPOLIA:
      return 'https://ethereum-sepolia.publicnode.com'
    default:
      return ''
  }
}

