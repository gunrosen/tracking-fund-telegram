export enum Web3SupportNetwork {
  BSC_TESTNET = 'bsc_testnet',
  BSC_MAINNET = 'bsc_mainnet',
}
export interface Web3Network<Web3SupportNetwork> {
  network: Web3SupportNetwork,
  rpc: string
}