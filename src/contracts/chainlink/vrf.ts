import {ethers} from "ethers";

import {ChainlinkVrf} from "../../types/chainlink";
import {Web3SupportNetwork} from "../../types";
import {getRPC} from "../index";

const VRF_COORDINATOR: ChainlinkVrf[] = [
  {
    network: Web3SupportNetwork.BSC_MAINNET,
    subscriptionLink: 'https://vrf.chain.link/bsc',
    vrfCoordinatorAddress: '0xc587d9053cd1118f25F645F9E08BB98c9712A4EE'
  },
  {
    network: Web3SupportNetwork.BSC_TESTNET,
    subscriptionLink: 'https://vrf.chain.link/bnb-chain-testnet',
    vrfCoordinatorAddress: '0x6A2AAd07396B36Fe02a22b33cf443582f682c82f'
  },
  {
    network: Web3SupportNetwork.POLYGON_MATIC,
    subscriptionLink: 'https://vrf.chain.link/polygon',
    vrfCoordinatorAddress: '0xAE975071Be8F8eE67addBC1A82488F1C24858067'
  },
  {
    network: Web3SupportNetwork.POLYGON_MUMBAI,
    subscriptionLink: 'https://vrf.chain.link/mumbai',
    vrfCoordinatorAddress: '0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed'
  },
  {
    network: Web3SupportNetwork.AVALANCHE_MAINNET,
    subscriptionLink: 'https://vrf.chain.link/avalanche',
    vrfCoordinatorAddress: '0xd5D517aBE5cF79B7e95eC98dB0f0277788aFF634'
  },
  {
    network: Web3SupportNetwork.AVALANCHE_FUJI,
    subscriptionLink: 'https://vrf.chain.link/fuji',
    vrfCoordinatorAddress: '0x2eD832Ba664535e5886b75D64C46EB9a228C2610'
  },
  {
    network: Web3SupportNetwork.ARBITRUM_MAINNET,
    subscriptionLink: 'https://vrf.chain.link/arbitrum',
    vrfCoordinatorAddress: '0x41034678D6C633D8a95c75e1138A360a28bA15d1'

  },
  {
    network: Web3SupportNetwork.ARBITRUM_GOERLI,
    subscriptionLink: 'https://vrf.chain.link/arbitrum-goerli',
    vrfCoordinatorAddress: '0x6D80646bEAdd07cE68cab36c27c626790bBcf17f'
  }
]


export const getVrfSubscriptionInfo = async (chain: Web3SupportNetwork, subscriptionId: number) : Promise<{balance: number, owner:string}> => {
  try {
    let vrf: ChainlinkVrf = getVrf(chain)
    if (!vrf) console.error('Could not find VRF for support network')

    const methodABI = [
      "function getSubscription(uint64) external view returns (uint96,uint64,address,address[])"
    ]
    const rpc = getRPC(chain)
    const provider = new ethers.JsonRpcProvider(rpc);
    const VrfCoordinatorContract = new ethers.Contract(vrf.vrfCoordinatorAddress, methodABI, provider)
    const subscription = await VrfCoordinatorContract.getSubscription(subscriptionId);
    return  {
      balance: Number(ethers.formatEther(subscription[0])),
      owner:subscription[2]
    }
  } catch (e) {
    console.error(e)
  }
}

export const getVrf = (chain: Web3SupportNetwork): ChainlinkVrf => {
  return VRF_COORDINATOR.find((vrf) => vrf.network == chain)
}