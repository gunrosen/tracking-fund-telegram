/*
Faucet API using chainstack api
https://docs.chainstack.com/reference/chainstack-faucet-get-tokens-rpc-method
 */

import {retryable, wait} from "../utils/util";
import axios from "axios";
import {ethers, formatEther, JsonRpcProvider, parseEther, Wallet} from "ethers";
import {getRPC} from "../contracts";
import {Web3SupportNetwork} from "../types";

require('dotenv').config()

const chains = ['bnb-testnet', 'sepolia', 'goerli', 'holesky', 'zksync-testnet', 'scroll-sepolia-testnet']
const RECIPIENT_PRIVATE_KEY = process.env.FAUCET_RECIPIENT_PRIVATE_KEY || ''
const FAUCET_VAULT_ADDRESS = process.env.FAUCET_VAULT_ADDRESS || ''
const FAUCET_CHAINSTACK_API = process.env.FAUCET_CHAINSTACK_API || ''
const HOUR_TO_SECONDS = 60 * 60
const MINUTE_TO_SECONDS = 60


export const faucetToken = async () => {
    for (const chain of chains) {
        faucetTokenByChain(chain)
    }
}

export const faucetTokenByChain = async (chain: string) => {
    let rpcEndpoint = null
    switch (chain) {
        case 'bnb-testnet': {
            rpcEndpoint = getRPC(Web3SupportNetwork.BSC_TESTNET)
            break
        }
        case 'sepolia': {
            rpcEndpoint = getRPC(Web3SupportNetwork.ETHEREUM_SEPOLIA)
            break
        }
        case 'goerli': {
            rpcEndpoint = getRPC(Web3SupportNetwork.ETHEREUM_GOERLI)
            break
        }
        default: {
            console.error(`Do not support ${chain}`)
            return
        }
    }
    const provider = await retryable(async () => {
      const rpcProvider =new JsonRpcProvider(rpcEndpoint)
      rpcProvider.on('error', (error) => {
        console.log(`${chain}: RPC error`)
        rpcProvider.destroy()
      })
      await rpcProvider._detectNetwork()
      return rpcProvider
    },
      async (error) => {
        console.log(`${chain}: RPC error after retry`)
      }
      ,3)

    let myWallet = new ethers.Wallet(RECIPIENT_PRIVATE_KEY)
    myWallet = myWallet.connect(provider)
    const walletAddress = await myWallet.getAddress()

    // SendToVault If need
    const DELTA = 0.002
    await retryable(
        async (retryCount) => {
            await sendFundToVault(myWallet, walletAddress, provider, chain, (retryCount + 1) * DELTA)
        },
        async () => {
            console.log(`${chain}: send fund to vault fail constantly after retry`)
        },
        3
    )

    console.log(`${chain}: Request faucet to ${walletAddress}`)
    let transactionTx: string = await retryable(
      async () => { return faucetChainStack(walletAddress, chain)},
      async (err) => {
        console.log(`${chain}: faucet fail after retry`)
      },
      3
    )
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

    await retryable(
        async (retryCount) => {
            await sendFundToVault(myWallet, walletAddress, provider, chain, (retryCount + 1) * DELTA)
        },
        async () => {
            console.log(`${chain}: send fund to vault fail constantly after retry`)
        },
        3
    )

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
        console.log(`${chain}: API call successful:`, response.data);
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
                // try to catch: goerli:  { error: "Cannot read properties of undefined (reading 'success')" }
                // error from chainstacks
                console.error(`${chain}: `, errorData?.error, errorData?.error?.code , errorData?.error?.message, error)
                throw error
            }
        } else {
            console.error(`${chain}:`, error)
            throw error
        }
    }
}
/*
Error: insufficient funds for intrinsic transaction cost (transaction="0x",
info={ "error": { "code": -32000, "message": "insufficient funds for gas * price + value: balance 500000000000000000, tx cost 500100000000000000, overshot 100000000000000" } }, code=INSUFFICIENT_FUNDS, version=6.9.0)
 */
const sendFundToVault = async (myWallet: Wallet, walletAddress: string, provider: JsonRpcProvider, chain: string, delta: number) => {
    try {
        const balance = await provider.getBalance(walletAddress)
        const gasAmount = await provider.estimateGas({
            to: FAUCET_VAULT_ADDRESS,
            value: parseEther("0.5")
        });
        const gasPrice = (await provider.getFeeData()).gasPrice
        console.log(`${chain}:Balance: ${formatEther(balance)}, gasAmount: ${gasAmount}, gasPrice: ${gasPrice}`)
        const amountCanSend = balance - gasAmount * gasPrice - parseEther(delta.toString())
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
        console.error(`${chain}:`, error);
        throw error
    }
}

// faucetToken()