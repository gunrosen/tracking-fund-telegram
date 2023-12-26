import {Web3SupportNetwork} from "../types";

const wait = (ms): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(1)
    }, ms)
  })
}

const getExploreLink = (chain: string): string =>{
  switch (chain) {
    case Web3SupportNetwork.BSC_TESTNET:
      return 'https://testnet.bscscan.com'
    case Web3SupportNetwork.BSC_MAINNET:
      return 'https://bscscan.com'
  }
}
export {
  wait,
  getExploreLink
}