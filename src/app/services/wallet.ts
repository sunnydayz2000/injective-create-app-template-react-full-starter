// services/wallet.ts
import { WalletStrategy } from "@injectivelabs/wallet-strategy";
import { BaseWalletStrategy } from "@injectivelabs/wallet-core";
import { Web3Exception } from "@injectivelabs/exceptions";
import { Wallet } from "@injectivelabs/wallet-base";
import { CosmosWalletStrategy } from "@injectivelabs/wallet-cosmos";
import { EvmWalletStrategy } from "@injectivelabs/wallet-evm";
import {
  CHAIN_ID,
  ETHEREUM_CHAIN_ID,
  alchemyRpcEndpoint,
} from "../utils/constants";

// Create wallet strategy for Keplr
export const walletStrategy = new WalletStrategy({
  chainId: CHAIN_ID,
  wallet: Wallet.Keplr,
  strategies: {
    [Wallet.Keplr]: new CosmosWalletStrategy({
      chainId: CHAIN_ID,
      wallet: Wallet.Keplr,
    }),
  },
});

export const getAddresses = async (): Promise<string[]> => {
  const addresses = await walletStrategy.getAddresses();
  if (addresses.length === 0) {
    throw new Web3Exception(
        new Error("There are no addresses linked in this wallet.")
    );
  }
  return addresses;
};

// Create separate strategies for each wallet type
export const createWalletStrategy = (walletType: Wallet) => {
  if (walletType === Wallet.Keplr) {
    return new BaseWalletStrategy({
      chainId: CHAIN_ID,
      wallet: Wallet.Keplr,
      strategies: {
        [Wallet.Keplr]: new CosmosWalletStrategy({
          chainId: CHAIN_ID,
          wallet: Wallet.Keplr,
        }),
      },
    });
  } else if (walletType === Wallet.Metamask) {
    return new BaseWalletStrategy({
      chainId: CHAIN_ID,
      wallet: Wallet.Metamask,
      strategies: {
        [Wallet.Metamask]: new EvmWalletStrategy({
          chainId: CHAIN_ID,
          wallet: Wallet.Metamask,
          ethereumOptions: {
            ethereumChainId: ETHEREUM_CHAIN_ID,
            rpcUrl: alchemyRpcEndpoint,
          },
        }),
      },
    });
  }
  throw new Error(`Unsupported wallet type: ${walletType}`);
};