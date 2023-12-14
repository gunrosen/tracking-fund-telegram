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
    default:
      return ''
  }
}

