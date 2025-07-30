// components/App/WalletConnect.tsx
import React from "react";
import Button from "./Button";
import { useWalletStore } from "../../store/wallet";

const WalletConnect: React.FC = () => {
    const { injectiveAddress, connectWallet, disconnectWallet } = useWalletStore();

    const formattedAddress = injectiveAddress
        ? `${injectiveAddress.slice(0, 5)}...${injectiveAddress.slice(-5)}`
        : "";

    const handleConnect = async () => {
        try {
            await connectWallet();
        } catch (err) {
            console.error("Failed to connect wallet:", err);
            alert("Failed to connect Keplr wallet. Please make sure Keplr is installed.");
        }
    };

    if (injectiveAddress) {
        return (
            <div className="flex items-center gap-2">
        <span className="text-green-200 text-sm">
          🌌 {formattedAddress}
        </span>
                <Button onClick={disconnectWallet}>Disconnect</Button>
            </div>
        );
    }

    return (
        <Button onClick={handleConnect}>
            Connect Keplr
        </Button>
    );
};

export default WalletConnect;