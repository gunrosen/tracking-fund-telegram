import {Web3Network, Web3SupportNetwork} from "../types";

export const Web3Networks: Web3Network<Web3SupportNetwork>[] = [
  {
    network: Web3SupportNetwork.BSC_MAINNET,
    rpc: 'https://bsc-dataseed.bnbchain.org',
  },
  {
    network: Web3SupportNetwork.BSC_TESTNET,
    rpc: 'https://bsc-testnet.publicnode.com'
  }
];

export const Web3NetworksMap = Web3Networks.map(({network, rpc}) => ({
  [network]: rpc
}))

