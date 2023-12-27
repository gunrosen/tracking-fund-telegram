import {TrackingType, Web3SupportNetwork} from "../types";
import {getLotterySignerAddress, getNativeBalance} from "../contracts";
import {getVrf, getVrfSubscriptionInfo} from "../contracts/chainlink/vrf";
import Redis from 'ioredis'
import {ENVIRONMENT, REDIS_PUBSUB_CHANNEL_NAME} from "../utils/constants";
import {getExploreLink} from "../utils/util";

// env, chain, text, balance, limit
interface TrackingJob {
  text: string,
  chain: Web3SupportNetwork,
  type: TrackingType,
  description: string,
  min: number,
}

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'

export const alertBalance = async () => {
  const redis = new Redis(REDIS_URL)

  for (const env in ENVIRONMENT) {
    console.log(`-----------Tracking env=${env}`)
    let batchAlerts: string[] = []
    const trackingContent = ENVIRONMENT[env]

    for (const tracking of trackingContent) {
      const {text, chain, destination, type, min} = tracking
      console.log(`${env} ${text} in ${chain}`)
      if (type == TrackingType.NATIVE) {
        let nativeBalance = 0
        let checkAddress = destination
        if (env.includes("fxb")) {
          checkAddress = await getLotterySignerAddress(chain, destination)
          nativeBalance = await getNativeBalance(chain, checkAddress)
        } else {
          nativeBalance = await getNativeBalance(chain, destination)
        }
        const link = getExploreLink(chain)
        if (nativeBalance <= min) {
          console.log(`${text} in ${chain}. Balance is ${nativeBalance} less then ${min}`)
          const message = `${text} in ${chain} running out. Check <a href="${link}/address/${checkAddress}">here</a>`
          batchAlerts.push(message)
        }
      } else if (type == TrackingType.LINK) {
        const subscriptionId = parseInt(destination)
        const subscription = await getVrfSubscriptionInfo(chain, subscriptionId)
        const {balance} = subscription
        if (balance <= min) {
          console.log(`${text} in ${chain}. Balance is ${balance} less then ${min}`)
          const vrf = getVrf(chain)
          const message = `${text} in ${chain} running out. Please <a href="${vrf.subscriptionLink}/${subscriptionId}">add funds</a>`
          batchAlerts.push(message)
        }
      }
    }

    if (batchAlerts.length > 0) {
      redis.publish(REDIS_PUBSUB_CHANNEL_NAME, JSON.stringify({
        env,
        batch: batchAlerts
      }))
    }
  }
  // process.exit()
}


// alertBalance()