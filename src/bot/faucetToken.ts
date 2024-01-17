/*
Faucet API using chainstack api
https://docs.chainstack.com/reference/chainstack-faucet-get-tokens-rpc-method
 */

import {wait} from "../utils/util";
import axios from "axios";
import {ethers, formatEther, JsonRpcProvider, parseEther, Wallet} from "ethers";
import {getRPC} from "../contracts";
import {Web3SupportNetwork} from "../types";

require('dotenv').config()

const chains = ['bnb-testnet', 'sepolia', 'goerli']
const RECIPIENT_PRIVATE_KEY = process.env.FAUCET_RECIPIENT_PRIVATE_KEY || ''
const FAUCET_VAULT_ADDRESS = process.env.FAUCET_VAULT_ADDRESS || ''
const FAUCET_CHAINSTACK_API = process.env.FAUCET_CHAINSTACK_API || ''
const HOUR_TO_SECONDS = 60 * 60
const MINUTE_TO_SECONDS = 60


export const faucetToken= async () => {
  for (const chain of chains) {
    faucetTokenByChain(chain)
  }
}

export const faucetTokenByChain = async (chain: string) => {
    let rpc = null
    switch (chain) {
      case 'bnb-testnet':{
        rpc = getRPC(Web3SupportNetwork.BSC_TESTNET)
        break
      }
      case 'sepolia':{
        rpc = getRPC(Web3SupportNetwork.ETHEREUM_SEPOLIA)
        break
      }
      case 'goerli':{
        rpc = getRPC(Web3SupportNetwork.ETHEREUM_GOERLI)
        break
      }
      default: {
        console.error(`Do not support ${chain}`)
        return
      }
    }
    const provider = new JsonRpcProvider(rpc)
    let myWallet = new ethers.Wallet(RECIPIENT_PRIVATE_KEY)
    myWallet = myWallet.connect(provider)
    const walletAddress = await myWallet.getAddress()

    // SendToVault If need
    await sendFundToVault(myWallet, walletAddress, provider, chain)

    console.log(`${chain}: Request faucet to ${walletAddress}`)
    let transactionTx: string = await faucetChainStack(walletAddress, chain)
    if (transactionTx === '') return
    // Make sure transaction confirmed
    while (1) {
        if (transactionTx == '') {
            console.error(`${chain}: Can not parse transactionHash`)
            break
        }
        await wait(5000)
        // check if transaction confirmed
        try {
            const tx = await provider.getTransaction(transactionTx)
            if (tx && tx.blockNumber) {
                console.log(`${chain}: ${transactionTx} confirmed`)
                break
            }
        } catch (e) {
            console.error(e)
        }
    }

    await sendFundToVault(myWallet, walletAddress, provider, chain)

}

const faucetChainStack = async (walletAddress: string, chain: string): Promise<string> => {
    try {
        const apiUrl = `https://api.chainstack.com/v1/faucet/${chain}`
        const response = await axios.post(apiUrl, {address: walletAddress}, {
            headers: {
                'Authorization': `Bearer ${FAUCET_CHAINSTACK_API}`,
                'Content-Type': 'application/json',
            },
        });
        console.log('${chain}: API call successful:', response.data);
        const splits = response?.data?.transaction.split('/')
        return splits[splits.length - 1];
    } catch (error) {
        const errorData = error.response?.data
        if (errorData) {
            if ('TooManyRequests' === errorData?.error?.code) {
                const nextFaucetAvailableInSecond = Math.floor(Date.parse(errorData?.nextFaucetAvailable) / 1000)
                const waitTime = nextFaucetAvailableInSecond - Math.floor(Date.now() / 1000) + 3;
                const hour = Math.floor(waitTime / HOUR_TO_SECONDS)
                const minute = Math.floor((waitTime - hour * HOUR_TO_SECONDS) / MINUTE_TO_SECONDS)
                const second = Math.floor(waitTime % MINUTE_TO_SECONDS)
                console.log(`${chain}: Waiting for next faucet ${errorData?.nextFaucetAvailable} in ${hour}h:${minute}m:${second}s`)
                if (waitTime > 12 * HOUR_TO_SECONDS) {
                    console.log(`${chain}: Wait too long... then stop`)
                    return ''
                }
                await wait(waitTime * 1000)
                console.log(`${chain}: Restarting faucet progress`)
                return await faucetChainStack(walletAddress, chain)
            } else {
                console.error(errorData)
                return ''
            }
        } else {
            console.error(error)
            return ''
        }
    }
}
/*
Error: insufficient funds for intrinsic transaction cost (transaction="0x",
info={ "error": { "code": -32000, "message": "insufficient funds for gas * price + value: balance 500000000000000000, tx cost 500100000000000000, overshot 100000000000000" } }, code=INSUFFICIENT_FUNDS, version=6.9.0)
 */
const sendFundToVault = async (myWallet: Wallet, walletAddress: string, provider: JsonRpcProvider, chain: string) => {
    try {
        const balance = await provider.getBalance(walletAddress)
        console.log(`${chain}:Balance: ${formatEther(balance)}`)
        const gasAmount = await provider.estimateGas({
            to: FAUCET_VAULT_ADDRESS,
            value: parseEther("0.5")
        });
        const gasPrice = (await provider.getFeeData()).gasPrice
        const amountCanSend = balance - gasAmount * gasPrice - parseEther("0.0001")
        if (amountCanSend > 0) {
            console.log(`${chain}:Can be sent: ${formatEther(amountCanSend)}`)
            const tx = {
                to: FAUCET_VAULT_ADDRESS,
                value: amountCanSend,
            }

            const receipt = await myWallet.sendTransaction(tx)
            console.log(`${chain}:receipt: ${receipt?.hash}`)
        } else {
            console.log(`${chain}:Not enough to send to vault`)
        }
    } catch (error) {
        console.error(error);
    }
}

// faucetToken()