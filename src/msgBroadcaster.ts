// src/msgBroadcaster.ts
import { MsgBroadcaster } from "@injectivelabs/wallet-core";
import { walletStrategy } from "./app/services/wallet";
import { NETWORK } from "./app/utils/constants";

export const msgBroadcastClient = new MsgBroadcaster({
    walletStrategy,
    network: NETWORK,
});