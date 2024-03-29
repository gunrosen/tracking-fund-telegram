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

const getNativeTokenText = (chain: string): string =>{
  switch (chain) {
    case Web3SupportNetwork.BSC_TESTNET:
      return 'TBNB'
    case Web3SupportNetwork.BSC_MAINNET:
      return 'BNB'
    case Web3SupportNetwork.AVALANCHE_FUJI:
      return 'TAVAX'
    case Web3SupportNetwork.AVALANCHE_MAINNET:
      return 'AVAX'
    case Web3SupportNetwork.POLYGON_MUMBAI:
      return 'TMATIC'
    case Web3SupportNetwork.POLYGON_MATIC:
      return 'MATIC'
    case Web3SupportNetwork.ARBITRUM_SEPOLIA:
      return 'TETH'
    case Web3SupportNetwork.ARBITRUM_MAINNET:
      return 'ETH'
    case Web3SupportNetwork.FANTOM_TESTNET:
      return 'TFTM'
    case Web3SupportNetwork.FANTOM_MAINNET:
      return 'FTM'
  }
}

export async function retryable<T>(
  fn: (retryCount: number) => Promise<T>,
  onError: <TError extends Error>(err: TError, retryCount: number) => Promise<void> = () =>
    Promise.resolve(),
  maxRetries: number = 3
) {
  const doTask = async (attempts: number): Promise<T> => {
    try {
      await wait(Math.floor(Math.random() * 4) * 1000)
      return await fn(attempts)
    } catch (err: any) {
      if (attempts >= maxRetries) {
        await onError(err, attempts)
        throw err
      } else {
        return await doTask(attempts + 1)
      }
    }
  }

  return doTask(0)
}

export {
  wait,
  getCurrentTimeStr,
  getExploreScanLink,
  getNativeTokenText
}