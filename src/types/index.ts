export enum Web3Network {
  BSC_TESTNET = 'bsc_testnet',
  BSC_MAINNET = 'bsc_mainnet',
}
export interface Web3Rpc {
  network: Web3Network,
  rpc: string
}