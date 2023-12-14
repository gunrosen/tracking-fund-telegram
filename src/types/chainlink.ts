import { Web3SupportNetwork} from "./index";

export interface ChainlinkVrf {
  network: Web3SupportNetwork,
  vrfCoordinatorAddress: string,
  subscriptionLink?: string,
}