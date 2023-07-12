import { Network, getNetworkEndpoints } from "@injectivelabs/networks";
import { MsgBroadcaster } from "@injectivelabs/wallet-ts";
import { walletStrategy } from "./services/wallet";

export const NETWORK = Network.TestnetK8s;
export const ENDPOINTS = getNetworkEndpoints(NETWORK);

export const msgBroadcastClient = new MsgBroadcaster({
  walletStrategy,
  network: NETWORK,
});
