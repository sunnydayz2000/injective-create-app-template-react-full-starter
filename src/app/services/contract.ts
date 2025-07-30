// services/contract.ts
import { MsgExecuteContractCompat } from "@injectivelabs/sdk-ts";
import { MsgBroadcaster } from "@injectivelabs/wallet-core";
import { walletStrategy } from "./wallet";
import { NETWORK } from "../utils/constants";

// Your deployed counter contract address
export const COUNTER_CONTRACT_ADDRESS = "inj1jfr0d0052mel589uhm6p4zc0mwltlt6z4c5rh9";

// Create a message broadcaster
const msgBroadcaster = new MsgBroadcaster({
    walletStrategy,
    network: NETWORK,
});

export const executeCounterIncrement = async (injectiveAddress: string) => {
    const msg = MsgExecuteContractCompat.fromJSON({
        sender: injectiveAddress,
        contractAddress: COUNTER_CONTRACT_ADDRESS,
        msg: { increment: {} },
    });

    const response = await msgBroadcaster.broadcast({
        msgs: msg,
        injectiveAddress,
    });

    return response;
};

export const executeCounterDecrement = async (injectiveAddress: string) => {
    const msg = MsgExecuteContractCompat.fromJSON({
        sender: injectiveAddress,
        contractAddress: COUNTER_CONTRACT_ADDRESS,
        msg: { decrement: {} },
    });

    const response = await msgBroadcaster.broadcast({
        msgs: msg,
        injectiveAddress,
    });

    return response;
};