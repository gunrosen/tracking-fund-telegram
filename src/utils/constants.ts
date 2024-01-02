import {TrackingType, Web3SupportNetwork} from "../types";

const LIMIT_REQUEST_PER_SESSION = 10
const FUND_NOTIFICATION = {
  FXB_STAG: 'fxb_stag',
  FXB_PROD: 'fxb_prod',
  DEX_TEST: 'dex_test',
  DEX_STAG: 'dex_stag',
  DEX_PROD: 'dex_prod',
  ALL: 'all',
}
const REDIS_PUBSUB_CHANNEL_NAME = 'alert-balance'
const DEFAULT_MIN_NATIVE_MAINNET= 0.5
const DEFAULT_MIN_NATIVE_TESTNET= 0.3
const DEFAULT_MIN_LINK = 5

const ENVIRONMENT = {
  "fxb_stag": [
    {
      text: "Backend",
      chain: Web3SupportNetwork.BSC_TESTNET,
      type: TrackingType.NATIVE,
      destination: '0xC84F9b16e48649732674F2Af237335CCFB91517f',
      min: DEFAULT_MIN_NATIVE_TESTNET
    },
    {
      text: "LINK fund",
      chain: Web3SupportNetwork.BSC_TESTNET,
      type: TrackingType.LINK,
      destination: '3130',
      min: DEFAULT_MIN_LINK
    }
  ]
  ,
  "fxb_prod": [
    {
      text: "Backend",
      chain: Web3SupportNetwork.BSC_MAINNET,
      type: TrackingType.NATIVE,
      destination: '0x96D7D0CB2af031820Bc6D563ecA14FE4044f1C50',
      min: DEFAULT_MIN_NATIVE_MAINNET
    },
    {
      text: "LINK fund",
      chain: Web3SupportNetwork.BSC_MAINNET,
      type: TrackingType.LINK,
      destination: '962',
      min: DEFAULT_MIN_LINK
    }
  ],
  "dex_test":[
    {
      text: "Relayer",
      chain: Web3SupportNetwork.BSC_TESTNET,
      type: TrackingType.NATIVE,
      destination: '0xaca614a806Cc874505210303Cd3cA957fD6EA3aA',
      min: DEFAULT_MIN_NATIVE_TESTNET
    },
    {
      text: "LINK fund",
      chain: Web3SupportNetwork.BSC_TESTNET,
      type: TrackingType.LINK,
      destination: '3238',
      min: DEFAULT_MIN_LINK
    },
    {
      text: "Relayer",
      chain: Web3SupportNetwork.AVALANCHE_FUJI,
      type: TrackingType.NATIVE,
      destination: '0xB28bC1FC3a040a78619cb0fE1b9b0B61F147a733',
      min: DEFAULT_MIN_NATIVE_TESTNET
    },
    {
      text: "LINK fund",
      chain: Web3SupportNetwork.AVALANCHE_FUJI,
      type: TrackingType.LINK,
      destination: '798',
      min: DEFAULT_MIN_LINK
    },
    {
      text: "Relayer",
      chain: Web3SupportNetwork.POLYGON_MUMBAI,
      type: TrackingType.NATIVE,
      destination: '0x0F197254dC05b074eC8Ed8D56a16f1318b451adD',
      min: DEFAULT_MIN_NATIVE_TESTNET
    },
    {
      text: "LINK fund",
      chain: Web3SupportNetwork.POLYGON_MUMBAI,
      type: TrackingType.LINK,
      destination: '6588',
      min: DEFAULT_MIN_LINK
    },
    {
      text: "Relayer",
      chain: Web3SupportNetwork.ARBITRUM_SEPOLIA,
      type: TrackingType.NATIVE,
      destination: '0xe002562f861C22ccCa11Dcaa37418639B1cFa689',
      min: DEFAULT_MIN_NATIVE_TESTNET
    },
    {
      text: "LINK fund",
      chain: Web3SupportNetwork.ARBITRUM_SEPOLIA,
      type: TrackingType.LINK,
      destination: '42',
      min: DEFAULT_MIN_LINK
    },
    {
      text: "Relayer",
      chain: Web3SupportNetwork.FANTOM_TESTNET,
      type: TrackingType.NATIVE,
      destination: '0xe002562f861C22ccCa11Dcaa37418639B1cFa689',
      min: DEFAULT_MIN_NATIVE_TESTNET
    },
    {
      text: "LINK fund",
      chain: Web3SupportNetwork.FANTOM_TESTNET,
      type: TrackingType.LINK,
      destination: '422',
      min: DEFAULT_MIN_LINK
    }
  ],
  "dex_stag":[
    {
      text: "Relayer",
      chain: Web3SupportNetwork.BSC_TESTNET,
      type: TrackingType.NATIVE,
      destination: '0x7427A6c7285B765c40b209724Bc4238E42ED3525',
      min: DEFAULT_MIN_NATIVE_TESTNET
    },
    {
      text: "LINK fund",
      chain: Web3SupportNetwork.BSC_TESTNET,
      type: TrackingType.LINK,
      destination: '3238',
      min: DEFAULT_MIN_LINK
    },
    {
      text: "Relayer",
      chain: Web3SupportNetwork.AVALANCHE_FUJI,
      type: TrackingType.NATIVE,
      destination: '0x92bbC4283f47eC3d8fAb4DD733fd170Cb405984e',
      min: DEFAULT_MIN_NATIVE_TESTNET
    },
    {
      text: "LINK fund",
      chain: Web3SupportNetwork.AVALANCHE_FUJI,
      type: TrackingType.LINK,
      destination: '798',
      min: DEFAULT_MIN_LINK
    },
    {
      text: "Relayer",
      chain: Web3SupportNetwork.POLYGON_MUMBAI,
      type: TrackingType.NATIVE,
      destination: '0xEd20674bD2d4E759f830219a1638a934F225c7Af',
      min: DEFAULT_MIN_NATIVE_TESTNET
    },
    {
      text: "LINK fund",
      chain: Web3SupportNetwork.POLYGON_MUMBAI,
      type: TrackingType.LINK,
      destination: '6588',
      min: DEFAULT_MIN_LINK
    },
    {
      text: "Relayer",
      chain: Web3SupportNetwork.ARBITRUM_SEPOLIA,
      type: TrackingType.NATIVE,
      destination: '0x3207D99E05eCa94B17B7165C3f0bA0D0E0761ed6',
      min: DEFAULT_MIN_NATIVE_TESTNET
    },
    {
      text: "LINK fund",
      chain: Web3SupportNetwork.ARBITRUM_SEPOLIA,
      type: TrackingType.LINK,
      destination: '42',
      min: DEFAULT_MIN_LINK
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