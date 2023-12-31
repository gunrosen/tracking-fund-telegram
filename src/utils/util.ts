import {Web3SupportNetwork} from "../types";

const wait = (ms): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(1)
    }, ms)
  })
}

const getCurrentTimeStr = (): string => {
  const currentTime = new Date();
  return currentTime.getDate() + "/"
    + (currentTime.getMonth()+1)  + "/"
    + currentTime.getFullYear() + " @ "
    + currentTime.getHours() + ":"
    + currentTime.getMinutes() + ":"
    + currentTime.getSeconds();
}

const getExploreScanLink = (chain: string): string =>{
  switch (chain) {
    case Web3SupportNetwork.BSC_TESTNET:
      return 'https://testnet.bscscan.com'
    case Web3SupportNetwork.BSC_MAINNET:
      return 'https://bscscan.com'
    case Web3SupportNetwork.AVALANCHE_FUJI:
      return 'https://testnet.avascan.info/blockchain/all'
    case Web3SupportNetwork.AVALANCHE_MAINNET:
      return 'https://avascan.info/blockchain/all'
    case Web3SupportNetwork.POLYGON_MUMBAI:
      return 'https://mumbai.polygonscan.com'
    case Web3SupportNetwork.POLYGON_MATIC:
      return 'https://polygonscan.com'
    case Web3SupportNetwork.ARBITRUM_SEPOLIA:
      return 'https://sepolia.arbiscan.io'
    case Web3SupportNetwork.ARBITRUM_MAINNET:
      return 'https://arbiscan.io'
    case Web3SupportNetwork.FANTOM_TESTNET:
      return 'https://testnet.ftmscan.com'
    case Web3SupportNetwork.FANTOM_MAINNET:
      return 'https://ftmscan.com'
  }
}
export {
  wait,
  getCurrentTimeStr,
  getExploreScanLink
}