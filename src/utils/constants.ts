const LIMIT_REQUEST_PER_SESSION = 10
const FUND_NOTIFICATION = {
  FXB_STAG: 'fxb_stag',
  FXB_PROD: 'fxb_prod',
  DEX_STAG: 'dex_stag',
  DEX_PROD: 'dex_prod',
  ALL: 'all',
}
const REDIS_PUBSUB_CHANNEL_NAME = 'alert-balance'
export {
  LIMIT_REQUEST_PER_SESSION,
  FUND_NOTIFICATION,
  REDIS_PUBSUB_CHANNEL_NAME
}