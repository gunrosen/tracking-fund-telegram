/*
Faucet API using chainstack api
https://docs.chainstack.com/reference/chainstack-faucet-get-tokens-rpc-method
 */

import {wait} from "../utils/util";

require('dotenv').config()
import axios from "axios";
import {ethers, parseEther} from "ethers";
import {getRPC} from "../contracts";
import {Web3SupportNetwork} from "../types";

const chain = 'bnb-testnet' // goerli
const RECIPIENT_PRIVATE_KEY = process.env.FAUCET_RECIPIENT_PRIVATE_KEY || ''
const FAUCET_VAULT_ADDRESS = process.env.FAUCET_VAULT_ADDRESS || ''
const FAUCET_CHAINSTACK_API = process.env.FAUCET_CHAINSTACK_API || ''

const apiUrl = `https://api.chainstack.com/v1/faucet/${chain}`

const faucetToken = async () => {

  try {
    const rpc = getRPC(Web3SupportNetwork.BSC_TESTNET)
    const provider = new ethers.JsonRpcProvider(rpc)
    let myWallet = new ethers.Wallet( RECIPIENT_PRIVATE_KEY)
    myWallet = myWallet.connect(provider)
    const walletAddress = await myWallet.getAddress()
    console.log(`Sending faucet request for address ${walletAddress}`)

    const response = await axios.post(apiUrl, { address:walletAddress }, {
      headers: {
        'Authorization': `Bearer ${FAUCET_CHAINSTACK_API}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('API call successful:', response.data);
    await wait(5000)
    const tx = {
      to: FAUCET_VAULT_ADDRESS,
      value: parseEther('0.45')
    }
    const receipt = await myWallet.sendTransaction(tx)
    console.log(`receipt: ${receipt?.hash}}`)

  } catch (error) {
    console.error(error.response?.data ?  error.response.data : error);
  }
}

faucetToken()