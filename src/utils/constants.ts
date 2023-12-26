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
}

export {
  LIMIT_REQUEST_PER_SESSION,
  FUND_NOTIFICATION,
  REDIS_PUBSUB_CHANNEL_NAME,
  ENVIRONMENT
}