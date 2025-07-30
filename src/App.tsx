import React, { useState, useEffect } from "react";
import InjectiveWelcome from "./components/InjectiveWelcome";
import { useWalletStore } from "./store/wallet";
import { MsgExecuteContractCompat } from "@injectivelabs/sdk-ts";
import { MsgBroadcaster } from "@injectivelabs/wallet-core";
import { walletStrategy } from "./app/services/wallet";
import { NETWORK } from "./app/utils/constants";

// Update this to YOUR deployed counter contract address
const COUNTER_CONTRACT_ADDRESS = "inj1jfr0d0052mel589uhm6p4zc0mwltlt6z4c5rh9";

const App: React.FC = () => {
    const { injectiveAddress, disconnectWallet } = useWalletStore();
    const [count, setCount] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [txHash, setTxHash] = useState("");

    // Fetch current count from blockchain
    const fetchCount = async () => {
        try {
            console.log("Fetching current count from blockchain...");
            const { ChainGrpcWasmApi } = await import("@injectivelabs/sdk-ts");
            const { ENDPOINTS } = await import("./app/utils/constants");

            const wasmApi = new ChainGrpcWasmApi(ENDPOINTS.grpc);
            const query = JSON.stringify({ get_count: {} });
            const base64Query = btoa(query);

            const response = await wasmApi.fetchSmartContractState(
                COUNTER_CONTRACT_ADDRESS,
                base64Query
            );

            console.log("Raw response from blockchain:", response);

            // The response.data is a Uint8Array, convert it to string
            let data;
            if (response.data instanceof Uint8Array) {
                // Convert Uint8Array to string
                const decoder = new TextDecoder();
                const jsonString = decoder.decode(response.data);
                console.log("Decoded string:", jsonString);
                data = JSON.parse(jsonString);
            } else if (typeof response.data === 'string') {
                try {
                    // Try to parse as JSON first
                    data = JSON.parse(response.data);
                } catch {
                    // If that fails, try base64 decode
                    const decodedData = atob(response.data);
                    data = JSON.parse(decodedData);
                }
            } else {
                // It's already an object
                data = response.data;
            }

            const currentCount = data.count || 0;

            console.log("Parsed data:", data);
            console.log("Current count from blockchain:", currentCount);
            setCount(currentCount);
        } catch (error) {
            console.error("Failed to fetch count:", error);
            console.error("Error details:", error.message);
            // Don't set to 0, keep current value
        }
    };

    useEffect(() => {
        console.log("=== APP COMPONENT MOUNTED ===");
        console.log("Connected wallet address:", injectiveAddress);
        console.log("Network:", NETWORK);
        console.log("Contract address:", COUNTER_CONTRACT_ADDRESS);
        console.log("Wallet strategy:", walletStrategy);

        if (injectiveAddress) {
            console.log("⚠️ IMPORTANT: Make sure you have testnet INJ tokens!");
            console.log("Get tokens at: https://faucet.testnet.injective.network/");
            console.log("Your address:", injectiveAddress);

            // Fetch initial count when wallet connects
            fetchCount();
        }

        console.log("=== READY FOR INTERACTION ===\n");
    }, [injectiveAddress]);

    const handleIncrement = async () => {
        console.log("=== INCREMENT BUTTON CLICKED ===");
        console.log("1. Current state:", {
            sender: injectiveAddress,
            contract: COUNTER_CONTRACT_ADDRESS,
            currentCount: count,
            network: NETWORK
        });

        setIsLoading(true);
        try {
            console.log("2. Creating MsgBroadcaster with wallet strategy...");
            const msgBroadcaster = new MsgBroadcaster({
                walletStrategy,
                network: NETWORK,
            });
            console.log("3. MsgBroadcaster created successfully");

            console.log("4. Creating increment message...");
            const msg = MsgExecuteContractCompat.fromJSON({
                sender: injectiveAddress,
                contractAddress: COUNTER_CONTRACT_ADDRESS,
                msg: { increment: {} },
            });
            console.log("5. Message created:", {
                type: msg.constructor.name,
                sender: injectiveAddress,
                contract: COUNTER_CONTRACT_ADDRESS,
                executeMsg: { increment: {} },
                fullMsg: JSON.stringify(msg.toDirectSign())
            });

            console.log("6. Broadcasting transaction to network...");
            console.log("   - This will open Keplr for signing");
            const response = await msgBroadcaster.broadcast({
                msgs: msg,
                injectiveAddress,
            });

            console.log("7. Transaction broadcast successful!");
            console.log("   - Response:", response);
            console.log("   - TxHash:", response.txHash);
            console.log("   - Height:", response.height);
            console.log("   - RawLog:", response.rawLog);

            setTxHash(response.txHash);

            // Wait a bit then fetch the new count from blockchain
            console.log("Waiting 3 seconds for transaction to be processed...");
            setTimeout(() => {
                fetchCount();
            }, 3000);

            console.log("8. State updated - new count:", count + 1);
            console.log("=== INCREMENT COMPLETE ===");
        } catch (error) {
            console.error("=== INCREMENT ERROR ===");
            console.error("Error type:", error.constructor.name);
            console.error("Error message:", error.message);
            console.error("Full error object:", error);

            if (error.message.includes("not found")) {
                console.error("⚠️ Account not found - you need testnet INJ tokens!");
                console.error("   Get tokens at: https://faucet.testnet.injective.network/");
            }

            alert("Failed to increment: " + error.message);
        } finally {
            setIsLoading(false);
            console.log("=== INCREMENT FLOW ENDED ===\n");
        }
    };

    const handleReset = async () => {
        console.log("=== RESET BUTTON CLICKED ===");
        console.log("1. Current state:", {
            sender: injectiveAddress,
            contract: COUNTER_CONTRACT_ADDRESS,
            currentCount: count,
            network: NETWORK
        });

        setIsLoading(true);
        try {
            console.log("2. Creating MsgBroadcaster with wallet strategy...");
            const msgBroadcaster = new MsgBroadcaster({
                walletStrategy,
                network: NETWORK,
            });
            console.log("3. MsgBroadcaster created successfully");

            console.log("4. Creating reset message...");
            const msg = MsgExecuteContractCompat.fromJSON({
                sender: injectiveAddress,
                contractAddress: COUNTER_CONTRACT_ADDRESS,
                msg: { reset: { count: 0 } }, // Reset to 0, or any value you want
            });
            console.log("5. Message created:", {
                type: msg.constructor.name,
                sender: injectiveAddress,
                contract: COUNTER_CONTRACT_ADDRESS,
                executeMsg: { reset: { count: 0 } }
            });

            console.log("6. Broadcasting transaction to network...");
            console.log("   - This will open Keplr for signing");
            const response = await msgBroadcaster.broadcast({
                msgs: msg,
                injectiveAddress,
            });

            console.log("7. Transaction broadcast successful!");
            console.log("   - Response:", response);
            console.log("   - TxHash:", response.txHash);
            console.log("   - Height:", response.height);
            console.log("   - RawLog:", response.rawLog);

            setTxHash(response.txHash);

            // Wait a bit then fetch the new count from blockchain
            console.log("Waiting 3 seconds for transaction to be processed...");
            setTimeout(() => {
                fetchCount();
            }, 3000);

            console.log("8. State updated - reset to 0");
            console.log("=== RESET COMPLETE ===");
        } catch (error) {
            console.error("=== RESET ERROR ===");
            console.error("Error type:", error.constructor.name);
            console.error("Error message:", error.message);
            console.error("Full error object:", error);

            if (error.message.includes("not found")) {
                console.error("⚠️ Account not found - you need testnet INJ tokens!");
                console.error("   Get tokens at: https://faucet.testnet.injective.network/");
            }

            alert("Failed to reset: " + error.message);
        } finally {
            setIsLoading(false);
            console.log("=== RESET FLOW ENDED ===\n");
        }
    };

    if (!injectiveAddress) {
        return (
            <div className='bg-gray-900 text-white min-h-screen'>
                <InjectiveWelcome />
            </div>
        );
    }

    return (
        <div className='bg-gray-900 text-white min-h-screen p-8'>
            {/* Header with disconnect button */}
            <div className="flex justify-between items-center mb-8 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold">Injective Counter DApp</h1>
                <button
                    onClick={disconnectWallet}
                    className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
                >
                    Disconnect ({injectiveAddress.slice(0, 5)}...{injectiveAddress.slice(-5)})
                </button>
            </div>

            {/* Counter */}
            <div className="bg-gray-800 rounded-lg p-8 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-center">Counter Contract</h2>

                <div className="text-center mb-8">
                    <p className="text-gray-400 mb-2">Current Count</p>
                    <p className="text-5xl font-bold text-green-200">
                        {count !== null ? count : "Loading..."}
                    </p>
                    <button
                        onClick={fetchCount}
                        className="mt-4 text-sm text-gray-400 hover:text-white underline"
                    >
                        Refresh from blockchain
                    </button>
                </div>

                <div className="flex justify-center gap-4 mb-6">
                    <button
                        onClick={handleReset}
                        disabled={isLoading}
                        className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 px-6 py-3 rounded text-lg"
                    >
                        {isLoading ? "Processing..." : "Reset to 0"}
                    </button>
                    <button
                        onClick={handleIncrement}
                        disabled={isLoading}
                        className="bg-green-500 hover:bg-green-600 disabled:bg-gray-600 px-6 py-3 rounded text-lg"
                    >
                        {isLoading ? "Processing..." : "Increment"}
                    </button>
                </div>

                {txHash && (
                    <div className="bg-green-900/20 border border-green-500 rounded p-4 mb-4">
                        <p className="text-sm text-green-200">Transaction successful!</p>
                        <p className="text-xs text-gray-400 break-all mt-1">
                            TxHash: {txHash}
                        </p>
                    </div>
                )}

                <div className="mt-6 text-center space-y-2">
                    <div className="bg-yellow-900/20 border border-yellow-500 rounded p-4">
                        <p className="text-sm text-yellow-200">⚠️ Important: You need testnet INJ tokens!</p>
                        <p className="text-xs text-gray-400 mt-2">
                            Get test tokens from the Injective Testnet Faucet
                        </p>
                    </div>
                    <p className="text-xs text-gray-500">
                        Contract: {COUNTER_CONTRACT_ADDRESS}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default App;