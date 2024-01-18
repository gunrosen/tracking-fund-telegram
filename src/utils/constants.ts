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
const DEFAULT_MIN_NATIVE_MAINNET= 0.3
const DEFAULT_MIN_NATIVE_TESTNET= 0.2
const DEFAULT_MIN_LINK = 3

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
      destination: '0x798219668EE38DeFc9F28F508aA68EF68811bD8c',
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
    },
    {
      text: "Relayer",
      chain: Web3SupportNetwork.FANTOM_TESTNET,
      type: TrackingType.NATIVE,
      destination: '0xBD17E05cE4ACbb4f91e675161DB3E8e357D8e9b1',
      min: DEFAULT_MIN_NATIVE_TESTNET
    },
    {
      text: "LINK fund",
      chain: Web3SupportNetwork.FANTOM_TESTNET,
      type: TrackingType.LINK,
      destination: '422',
      min: DEFAULT_MIN_LINK
    }
  ]
  ,
  "dex_prod":[
    {
      text: "Relayer",
      chain: Web3SupportNetwork.BSC_MAINNET,
      type: TrackingType.NATIVE,
      destination: '0x840AAed113F39C8bfC2d0C0497bC12Ee0B5f28BF',
      min: 0.6
    },
    {
      text: "LINK fund",
      chain: Web3SupportNetwork.BSC_MAINNET,
      type: TrackingType.LINK,
      destination: '962',
      min: DEFAULT_MIN_LINK
    },
    {
      text: "Relayer",
      chain: Web3SupportNetwork.AVALANCHE_MAINNET,
      type: TrackingType.NATIVE,
      destination: '0x7A93068E72b973f3637b2c7c9fE743dD02F853Be',
      min: 2
    },
    {
      text: "LINK fund",
      chain: Web3SupportNetwork.AVALANCHE_MAINNET,
      type: TrackingType.LINK,
      destination: '146',
      min: DEFAULT_MIN_LINK
    },
    {
      text: "Relayer",
      chain: Web3SupportNetwork.POLYGON_MATIC,
      type: TrackingType.NATIVE,
      destination: '0x25D873F3501d88491EfC668A4bf8649B932eDeb6',
      min: 3
    },
    {
      text: "LINK fund",
      chain: Web3SupportNetwork.POLYGON_MATIC,
      type: TrackingType.LINK,
      destination: '1038',
      min: DEFAULT_MIN_LINK
    },
    {
      text: "Relayer",
      chain: Web3SupportNetwork.ARBITRUM_MAINNET,
      type: TrackingType.NATIVE,
      destination: '0xeb0739D2Fc2c13C13f278b500fe340382caC06d5',
      min: 0.025
    },
    {
      text: "LINK fund",
      chain: Web3SupportNetwork.ARBITRUM_MAINNET,
      type: TrackingType.LINK,
      destination: '134',
      min: DEFAULT_MIN_LINK
    },
    {
      text: "Relayer",
      chain: Web3SupportNetwork.FANTOM_MAINNET,
      type: TrackingType.NATIVE,
      destination: '0x67B3533162Eb56fd972ef630Ca64711732204FE8',
      min: 3.25
    },
    {
      text: "LINK fund",
      chain: Web3SupportNetwork.FANTOM_MAINNET,
      type: TrackingType.LINK,
      destination: '98',
      min: DEFAULT_MIN_LINK
    }
  ]
}

export {
  LIMIT_REQUEST_PER_SESSION,
  FUND_NOTIFICATION,
  REDIS_PUBSUB_CHANNEL_NAME,
  ENVIRONMENT
}