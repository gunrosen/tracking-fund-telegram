import {ethers} from "ethers";

import {ChainlinkVrf} from "../../types/chainlink";
import {Web3SupportNetwork} from "../../types";
import {Web3NetworksMap} from "../constants";

export const getVrfSubscriptionBalance = async (chain: string, id: number) => {
  try {
    let vrf: ChainlinkVrf;
    vrf = {
      network: Web3SupportNetwork.BSC_TESTNET,
      subscriptionId: id,
      subscriptionLink: 'https://vrf.chain.link/bnb-chain-testnet',
      vtfAddress: '0x6A2AAd07396B36Fe02a22b33cf443582f682c82f'
    }

    const methodABI = [
      "function getSubscription(uint64) external view returns (uint96,uint64,address,address[])"]
    const provider = new ethers.JsonRpcProvider('https://bsc-testnet.publicnode.com');
    const VrfCoordinatorContract = new ethers.Contract(vrf.vtfAddress, methodABI, provider)
    const balance = await VrfCoordinatorContract.getSubscription(id);
    console.log(ethers.formatEther(balance[0]))
  } catch (e) {
    console.error(e)
  }
}

getVrfSubscriptionBalance('', 3238)