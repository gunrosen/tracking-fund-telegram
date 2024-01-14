import {getRPC} from "../src/contracts";
import {Web3SupportNetwork} from "../src/types";
import {ethers, JsonRpcProvider, parseEther} from "ethers";

const Constants = require("../src/utils/constants")
const FAUCET_VAULT_ADDRESS = process.env.FAUCET_VAULT_ADDRESS || ''

test('adds 1 + 2 to equal 3', () => {
    Object.keys(Constants.FUND_NOTIFICATION).forEach((k, v) => {
        console.log(k.toString())
    })
});

test('wait time correctness', () => {
    const HOUR_TO_SECONDS = 60 * 60
    const MINUTE_TO_SECONDS = 60
    const nextFaucetAvailable = Math.floor(Date.parse('2024-01-15T06:30:07.323Z') / 1000);
    const waitTime = nextFaucetAvailable - Math.floor(Date.now() / 1000) + 3;
    console.log(waitTime)
    const hour = Math.floor(waitTime / HOUR_TO_SECONDS)
    const minute = Math.floor((waitTime - hour * HOUR_TO_SECONDS) / MINUTE_TO_SECONDS)
    const second = Math.floor(waitTime % MINUTE_TO_SECONDS)
    console.log(`Waiting for next faucet ${nextFaucetAvailable} in ${hour}h:${minute}m:${second}s`)
})

test('gas', async () => {
    const rpc = getRPC(Web3SupportNetwork.BSC_TESTNET)
    const provider = new JsonRpcProvider(rpc)
    // Estimate the gas amount for a transaction by passing the transaction parameters
    const gasAmount = await provider.estimateGas({
        to: FAUCET_VAULT_ADDRESS,
        value: parseEther("0.5")
    });
    console.log(gasAmount)
    const feeData = (await provider.getFeeData())
    console.log(feeData )
    const gasPrice = feeData.gasPrice
    console.log((gasPrice * gasAmount).toString())

    const valueCanSend = parseEther("0.5") - gasAmount * gasPrice - parseEther("0.0001")
    console.log(valueCanSend.toString())
})