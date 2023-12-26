import {TrackingType, Web3SupportNetwork} from "../types";

const LIMIT_REQUEST_PER_SESSION = 10
const FUND_NOTIFICATION = {
  FXB_STAG: 'fxb_stag',
  FXB_PROD: 'fxb_prod',
  DEX_STAG: 'dex_stag',
  DEX_PROD: 'dex_prod',
  ALL: 'all',
}
const REDIS_PUBSUB_CHANNEL_NAME = 'alert-balance'

const ENVIRONMENT = {
  "fxb_stag": [
    {
      text: "Backend",
      chain: Web3SupportNetwork.BSC_TESTNET,
      type: TrackingType.NATIVE,
      destination: '0xC84F9b16e48649732674F2Af237335CCFB91517f',
      min: 0.5
    },
    {
      text: "LINK fund",
      chain: Web3SupportNetwork.BSC_TESTNET,
      type: TrackingType.LINK,
      destination: '3130',
      min: 5
    }
  ]
  ,
  "fxb_prod": [
    {
      text: "Backend",
      chain: Web3SupportNetwork.BSC_MAINNET,
      type: TrackingType.NATIVE,
      destination: '0x96D7D0CB2af031820Bc6D563ecA14FE4044f1C50',
      min: 0.3
    },
    {
      text: "LINK fund",
      chain: Web3SupportNetwork.BSC_MAINNET,
      type: TrackingType.LINK,
      destination: '962',
      min: 5
    }
  ],
  "dex_stag":[
    {
      text: "Relayer",
      chain: Web3SupportNetwork.BSC_TESTNET,
      type: TrackingType.NATIVE,
      destination: '0xe921F0bC81Be4aB874eE36Aa381059642966B04a',
      min: 0.3
    },
    {
      text: "LINK fund",
      chain: Web3SupportNetwork.BSC_TESTNET,
      type: TrackingType.LINK,
      destination: '3238',
      min: 5
    },
    {
      text: "Relayer",
      chain: Web3SupportNetwork.AVALANCHE_FUJI,
      type: TrackingType.NATIVE,
      destination: '0x92bbC4283f47eC3d8fAb4DD733fd170Cb405984e',
      min: 0.3
    },
    {
      text: "LINK fund",
      chain: Web3SupportNetwork.AVALANCHE_FUJI,
      type: TrackingType.LINK,
      destination: '798',
      min: 5
    },
    {
      text: "Relayer",
      chain: Web3SupportNetwork.POLYGON_MUMBAI,
      type: TrackingType.NATIVE,
      destination: '0xEd20674bD2d4E759f830219a1638a934F225c7Af',
      min: 0.3
    },
    {
      text: "LINK fund",
      chain: Web3SupportNetwork.POLYGON_MUMBAI,
      type: TrackingType.LINK,
      destination: '6588',
      min: 5
    },
    {
      text: "Relayer",
      chain: Web3SupportNetwork.ARBITRUM_SEPOLIA,
      type: TrackingType.NATIVE,
      destination: '0x3207D99E05eCa94B17B7165C3f0bA0D0E0761ed6',
      min: 0.3
    },
    {
      text: "LINK fund",
      chain: Web3SupportNetwork.ARBITRUM_SEPOLIA,
      type: TrackingType.LINK,
      destination: '42',
      min: 5
    }
  ]
  ,
  "dex_prod":[

  ]
}

export {
  LIMIT_REQUEST_PER_SESSION,
  FUND_NOTIFICATION,
  REDIS_PUBSUB_CHANNEL_NAME,
  ENVIRONMENT
}