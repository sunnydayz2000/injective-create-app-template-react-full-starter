import { create } from "zustand";
import { getAddresses } from "../app/services/wallet";

type WalletState = {
  injectiveAddress: string;
  ethereumAddress: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
};

export const useWalletStore = create<WalletState>()((set) => ({
  injectiveAddress: "",
  ethereumAddress: "",
  connectWallet: async () => {
    try {
      const [address] = await getAddresses();

      // Keplr returns Injective address directly
      set({
        ethereumAddress: "",
        injectiveAddress: address,
      });
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      throw error;
    }
  },
  disconnectWallet: () => {
    set({ ethereumAddress: "", injectiveAddress: "" });
  },
}));