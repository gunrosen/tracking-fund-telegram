import {TrackingType, Web3SupportNetwork} from "../types";
import {getLotterySignerAddress, getNativeBalance} from "../contracts";
import {getVrf, getVrfSubscriptionInfo} from "../contracts/chainlink/vrf";
import Redis from 'ioredis'
import {REDIS_PUBSUB_CHANNEL_NAME} from "../utils/constants";
import {getExploreLink} from "../utils/util";

// env, chain, text, balance, limit
interface TrackingJob {
  text: string,
  chain: Web3SupportNetwork,
  type: TrackingType,
  description: string,
  min: number,
}

const ENVIRONMENT = {
  "fxb_stag": [
    {
      text: "Backend",
      chain: Web3SupportNetwork.BSC_TESTNET,
      type: TrackingType.NATIVE,
      destination: '0xC84F9b16e48649732674F2Af237335CCFB91517f',
      min: 0.1
    },
    {
      text: "LINK fund",
      chain: Web3SupportNetwork.BSC_TESTNET,
      type: TrackingType.LINK,
      destination: '3130',
      min: 100
    }
  ]
  ,
  "fxb_prod": [
    {
      text: "Backend",
      chain: Web3SupportNetwork.BSC_MAINNET,
      type: TrackingType.NATIVE,
      destination: '0x96D7D0CB2af031820Bc6D563ecA14FE4044f1C50',
      min: 0.2
    },
    {
      text: "LINK fund",
      chain: Web3SupportNetwork.BSC_MAINNET,
      type: TrackingType.LINK,
      destination: '962',
      min: 100
    }
  ]
}

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'
const alertBalance = async () => {
  const redis = new Redis(REDIS_URL)

  for (const env in ENVIRONMENT) {
    console.log(`-----------Tracking env=${env}`)
    let batchAlerts: string[] = []
    const trackingContent = ENVIRONMENT[env]

    for (const tracking of trackingContent) {
      const {text, chain, destination, type, min} = tracking
      console.log(`${text} in ${chain}`)
      if (type == TrackingType.NATIVE) {
        const signerAddress = await getLotterySignerAddress(chain, destination)
        const nativeBalance = await getNativeBalance(chain, signerAddress)
        console.log(`signer address = ${signerAddress}`)
        console.log(`native balance = ${nativeBalance}`)
        const link = getExploreLink(chain)
        if (nativeBalance <= min) {
          const message = `${text} in ${chain} running out. Check <a href="${link}/address/${signerAddress}">here</a>`
          batchAlerts.push(message)
        }
      } else if (type == TrackingType.LINK) {
        const subscriptionId = parseInt(destination)
        const subscription = await getVrfSubscriptionInfo(chain, subscriptionId)
        const {balance} = subscription
        if (balance <= min) {
          const vrf = getVrf(chain)
          const message = `${text} in ${chain} running out. Please <a href="${vrf.subscriptionLink}/${subscriptionId}">add funds</a>`
          batchAlerts.push(message)
        }
      }
    }
    redis.publish(REDIS_PUBSUB_CHANNEL_NAME, JSON.stringify({
      env,
      batch: batchAlerts
    }))
  }
  process.exit()
}


alertBalance()