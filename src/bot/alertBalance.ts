import {TrackingType, Web3SupportNetwork} from "../types";
import {getLotterySignerAddress, getNativeBalance} from "../contracts";
import {getVrf, getVrfSubscriptionInfo} from "../contracts/chainlink/vrf";

// env, chain, text, balance, limit
interface TrackingJob {
  text: string,
  chain: Web3SupportNetwork,
  type: TrackingType,
  description: string,
  min: number,
}

const ENVIRONMENT = {
  "fxb_stag": {
    tracking: [
      {
        text: "fxb_stag backend",
        chain: Web3SupportNetwork.BSC_TESTNET,
        type: TrackingType.NATIVE,
        destination: '0xC84F9b16e48649732674F2Af237335CCFB91517f',
        min: 0.1
      },
      {
        text: "fxb_stag LINK fund",
        chain: Web3SupportNetwork.BSC_TESTNET,
        type: TrackingType.LINK,
        destination: '3130',
        min: 100
      }
    ]
  }
}
const alertBalance = async () => {
  // let botTelegramSession = new TelegramSession(true)
  // const clientTelegram = await botTelegramSession.getTelegramClient()
  // clientTelegram.on((event) => {
  //   console.log(event)
  // })
  const fxbStaging = ENVIRONMENT["fxb_stag"]
  for (const tracking of fxbStaging.tracking) {
    const {text, chain, destination, type, min} = tracking
    console.log(`${text} in ${chain}`)
    if (type == TrackingType.NATIVE) {
      const signerAddress = await getLotterySignerAddress(chain, destination)
      const nativeBalance = await getNativeBalance(chain, signerAddress)
      console.log(`signer address = ${signerAddress}`)
      console.log(`native balance = ${nativeBalance}`)
      if (nativeBalance <= min) {
        console.log(`${text} in ${chain} running out. Please send native token to ${signerAddress}`)
      }
    } else if (type == TrackingType.LINK) {
      const subscriptionId = parseInt(destination)
      const subscription= await getVrfSubscriptionInfo(chain, subscriptionId)
      const {balance, owner} = subscription
      if (balance <= min){
        const vrf = getVrf(chain)
        console.log(`${text} in ${chain} running out. Please send LINK token to ${owner}.\nThen please add fund with function in ${vrf.subscriptionLink}/${subscriptionId} `)
      }
    }
  }
}


alertBalance()