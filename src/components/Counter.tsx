// components/Counter.tsx
import React, { useState } from "react";
import Button from "./App/Button";
import { useWalletStore } from "../store/wallet";
import { executeCounterIncrement, executeCounterDecrement } from "../app/services/contract";

const Counter: React.FC = () => {
    const { injectiveAddress } = useWalletStore();
    const [count, setCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [txHash, setTxHash] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleIncrement = async () => {
        if (!injectiveAddress) {
            setError("Please connect your wallet first");
            return;
        }

        setIsLoading(true);
        setError("");
        setTxHash("");

        try {
            const response = await executeCounterIncrement(injectiveAddress);
            setTxHash(response.txHash);
            setCount(prev => prev + 1); // Update local count
        } catch (err) {
            console.error("Failed to increment:", err);
            setError(err instanceof Error ? err.message : "Failed to increment counter");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDecrement = async () => {
        if (!injectiveAddress) {
            setError("Please connect your wallet first");
            return;
        }

        setIsLoading(true);
        setError("");
        setTxHash("");

        try {
            const response = await executeCounterDecrement(injectiveAddress);
            setTxHash(response.txHash);
            setCount(prev => prev - 1); // Update local count
        } catch (err) {
            console.error("Failed to decrement:", err);
            setError(err instanceof Error ? err.message : "Failed to decrement counter");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-800 rounded-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Counter Contract</h2>

            <div className="text-center mb-8">
                <p className="text-gray-400 mb-2">Current Count</p>
                <p className="text-5xl font-bold text-green-200">{count}</p>
            </div>

            <div className="flex justify-center gap-4 mb-6">
                <Button onClick={handleDecrement} disabled={isLoading}>
                    {isLoading ? "Processing..." : "Decrement"}
                </Button>
                <Button onClick={handleIncrement} disabled={isLoading}>
                    {isLoading ? "Processing..." : "Increment"}
                </Button>
            </div>

            {txHash && (
                <div className="bg-green-900/20 border border-green-500 rounded p-4 mb-4">
                    <p className="text-sm text-green-200">Transaction successful!</p>
                    <p className="text-xs text-gray-400 break-all mt-1">
                        TxHash: {txHash}
                    </p>
                </div>
            )}

            {error && (
                <div className="bg-red-900/20 border border-red-500 rounded p-4">
                    <p className="text-sm text-red-200">{error}</p>
                </div>
            )}

            <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                    Contract: inj1t8rhq5vcxqgw68ldg0k2mjxjvzshuah6tnugvy
                </p>
            </div>
        </div>
    );
};

export default Counter;