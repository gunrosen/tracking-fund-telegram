import { Web3SupportNetwork} from "./index";

export interface ChainlinkVrf {
  network: Web3SupportNetwork,
  vtfAddress: string,
  subscriptionLink?: string,
  subscriptionId?: number,
}