import {TrackingType, Web3SupportNetwork} from "../types";
import {getLotterySignerAddress, getNativeBalance} from "../contracts";
import {getVrf, getVrfSubscriptionInfo} from "../contracts/chainlink/vrf";
import {ENVIRONMENT} from "../utils/constants";
import {getExploreScanLink, getNativeTokenText} from "../utils/util";

// env, chain, text, balance, limit
interface TrackingJob {
  text: string,
  chain: Web3SupportNetwork,
  type: TrackingType,
  description: string,
  min: number,
}

export const getBalance = async (env): Promise<string> => {
  console.log(`-----------Get balance env=${env}`)
  let batchContent: string[] = []
  const trackingContent = ENVIRONMENT[env]

  for (const tracking of trackingContent) {
    const {text, chain, destination, type, min} = tracking
    console.log(`doing: ${env} ${text} ${chain}`)
    try {
      if (type == TrackingType.NATIVE) {
        let nativeBalance = 0
        let checkAddress = destination
        if (env.includes("fxb")) {
          checkAddress = await getLotterySignerAddress(chain, destination)
          nativeBalance = await getNativeBalance(chain, checkAddress)
        } else {
          nativeBalance = await getNativeBalance(chain, destination)
        }
        const link = getExploreScanLink(chain)
        const message = `${chain} - ${text}: <a href="${link}/address/${checkAddress}">${nativeBalance.toFixed(2)} ${getNativeTokenText(chain)}</a>`
        batchContent.push(message)
      } else if (type == TrackingType.LINK) {
        const subscriptionId = parseInt(destination)
        const subscription = await getVrfSubscriptionInfo(chain, subscriptionId)
        const {balance} = subscription
        const vrf = getVrf(chain)
        const message = `${chain} - ${text}: <a href="${vrf.subscriptionLink}/${subscriptionId}">${balance.toFixed(2)} LINK</a>`
        batchContent.push(message)
      }
    } catch (e) {
      console.error(`error: ${env} ${text} ${chain}`)
    }
  }
  const message = {
    env,
    batch: batchContent
  }
  return JSON.stringify(message)
}
