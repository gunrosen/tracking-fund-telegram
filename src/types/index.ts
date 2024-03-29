export enum Web3SupportNetwork {
  BSC_TESTNET = 'bsc_testnet',
  BSC_MAINNET = 'bsc_mainnet',
  POLYGON_MATIC = 'polygon_matic',
  POLYGON_MUMBAI = 'polygon_mumbai',
  AVALANCHE_MAINNET = 'avalanche_mainnet',
  AVALANCHE_FUJI = 'avalanche_fuji',
  ARBITRUM_MAINNET = 'arbitrum_mainnet',
  ARBITRUM_SEPOLIA = 'arbitrum_sepolia',
  FANTOM_MAINNET = 'fantom_mainnet',
  FANTOM_TESTNET = 'fantom_testnet',
  ETHEREUM_GOERLI= 'eth_goerli',
  ETHEREUM_SEPOLIA= 'eth_sepolia',
  ETHEREUM_HOLESKY = 'eth_holesky',
  ZKSYNC_SEPOLIA_TESTNET = 'zksync-testnet',
  SCROLL_SEPOLIA = 'scroll_sepolia',
}

export interface Web3Network<Web3SupportNetwork> {
  network: Web3SupportNetwork,
  rpc: string
}

export enum TrackingType {
  LINK = 'token_link_subscription',
  NATIVE = 'token_native',
  ERC20 = 'token_erc20',
}
