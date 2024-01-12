import * as dotenv from 'dotenv'
import {TelegramClient} from 'telegram';
import {LIMIT_REQUEST_PER_SESSION} from "../utils/constants";
import {StringSession} from "telegram/sessions";
import Redis from "ioredis";
import {wait} from "../utils/util";

dotenv.config()
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'
const apiId = parseInt(process.env.TELEGRAM_API_ID || "0");
const apiHash = process.env.TELEGRAM_API_HASH || "";

const userTokens = process.env.TELEGRAM_SESSIONS || "";
const userTokenList = userTokens.split(',');

const botTokens = process.env.BOT_TOKENS || "";
const botList = botTokens.split(',');

/**
 Manage a Telegram Session, that helps
 + Count number of telegram call each session
 + Change new session token if reach our defined `LIMIT_REQUEST_PER_SESSION`
 Depends on telegram api, we decided to choose user or bot token
 */
class TelegramSession {
  useBot: boolean = true
  telegramClient: TelegramClient
  currentTokenIndex: number = 0
  count: number = 0 // Count number of telegram calls in current Session
  redis: Redis

  constructor(useBot: boolean) {
    this.useBot = useBot
    if (this.useBot && (!botList || botList.length === 0)) {
      console.error(`TelegramSession: useBot=${this.useBot} - botList is empty`)
      process.exit(1)
    }
    if (!this.useBot && (!userTokenList || userTokenList.length === 0)) {
      console.error(`TelegramSession: useBot=${this.useBot} - userTokenList is empty`)
      process.exit(1)
    }
    this.redis = new Redis(REDIS_URL)
  }

  /**
   * Get telegram client
   * @public
   * @return {TelegramClient}
   */
  getTelegramClient = async (): Promise<TelegramClient> => {
    if (this.count === 0 || this.count > LIMIT_REQUEST_PER_SESSION) {
      this.count = 1
      if (this.telegramClient) {
        await this.telegramClient.disconnect()
      }
      const {
        token: token,
        newTokenIndex
      } = await this.getNewToken(this.useBot ? botList : userTokenList)

      this.currentTokenIndex = newTokenIndex
      // Init
      if (this.useBot) {
        const session = await this.redis.get(`bot:session:${token}`) || "";
        const stringSession = new StringSession(session)
        this.telegramClient = new TelegramClient(stringSession, apiId, apiHash, {
          connectionRetries: 5,
        });
        await this.telegramClient.start({
          botAuthToken: token
        })
        await this.redis.set(`bot:session:${token}`, stringSession.save())
      } else {
        this.telegramClient = new TelegramClient(new StringSession(token), apiId, apiHash, {
          connectionRetries: 5,
        });
        await this.telegramClient.connect()
      }
      this.telegramClient.floodSleepThreshold = 300;
      return this.telegramClient
    } else {
      return this.telegramClient
    }
  }

  /**
   * Should call after calling any telegram api
   * @return {void}
   */
  increaseCountCall = () => {
    this.count++
  }

  getCurrentToken = (): string => {
    const length = this.useBot ? botList.length : userTokenList.length
    if (this.currentTokenIndex > length - 1) return ''
    return this.useBot ? botList[this.currentTokenIndex] : userTokenList[this.currentTokenIndex]
  }

  markCurrentTokenAsFloodWait = async (seconds: number) => {
    seconds = seconds || 10_000 // default to 10 seconds
    const currentToken = this.getCurrentToken()
    const key = `token:${this.useBot ? 'bot' : 'user'}:${currentToken}`
    await this.redis.set(key, Math.floor(Date.now() / 1000) + seconds)
    await this.redis.expire(key, seconds)
    //  skipToNextToken
    this.count = LIMIT_REQUEST_PER_SESSION + 1
  }

  /**
   * Choose next token by using round robin algorithm
   * In case all tokens are FloodWaitError, just wait for the smallest time as it can
   * @param tokenList
   * @private
   */
  getNewToken = async (tokenList: string[]): Promise<{ token: string, newTokenIndex: number }> => {
    if (!tokenList || tokenList.length === 0) {
      console.error(`getRoundRobinToken: list is empty`)
      return {token: '', newTokenIndex: 0}
    }
    let currentTokenIndex = this.currentTokenIndex
    let deadlineMap = new Map<string, number>()
    const length = tokenList.length
    do {
      currentTokenIndex = (currentTokenIndex + 1) % length
      const currentToken = tokenList[currentTokenIndex]
      const key = `token:${this.useBot ? 'bot' : 'user'}:${currentToken}`
      const deadline = await this.redis.get(key)
      if (deadline) {
        deadlineMap.set(currentToken, parseInt(deadline))
      } else {
        return {token: currentToken, newTokenIndex: currentTokenIndex}
      }

    } while (deadlineMap.size < length)
    // It seems all token had been FloodWaitError
    const deadlineValues = Array.from(deadlineMap, ([name, value]) => value)
    const minDeadline = Math.min(...deadlineValues)
    let waitingSeconds = minDeadline - Math.floor(Date.now() / 1000)
    waitingSeconds = waitingSeconds > 3 ? waitingSeconds : 3
    console.log(`getNewToken: (${this.useBot ? 'bot' : 'user'}): all tokens are in flood error, wait for ${waitingSeconds + 3} seconds`)
    await wait((waitingSeconds + 3) * 1_000) // add 3 seconds for sure

    let currentToken = ''
    for (const [key, value] of deadlineMap.entries()) {
      if (value === minDeadline) {
        currentToken = key
        break
      }
    }
    const index = tokenList.findIndex((item) => item === currentToken)
    return {token: currentToken, newTokenIndex: index}
  }
}

export default TelegramSession;
