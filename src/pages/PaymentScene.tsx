import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWallet } from '@solana/wallet-adapter-react';
import { useToast } from "@/hooks/use-toast";
import CustomButton from "@/components/ui/custom-button";
import SolanaWalletButton from "@/components/SolanaWalletButton";
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

const PAYMENT_AMOUNT = 0.1; // 0.1 SOL
const PROCESSING_FEE = 0.001; // 0.001 SOL

const PaymentScene: React.FC = () => {
  const { publicKey, sendTransaction } = useWallet();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionSignature, setTransactionSignature] = useState<string | null>(null);

  const handlePayment = async () => {
    if (!publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to make a payment",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setTransactionSignature(null);
    
    try {
      const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
      const merchantWallet = import.meta.env.VITE_MERCHANT_WALLET;
      
      if (!merchantWallet) {
        throw new Error('Merchant wallet not configured');
      }

      // Check wallet balance
      const balance = await connection.getBalance(publicKey);
      const requiredBalance = (PAYMENT_AMOUNT + PROCESSING_FEE) * LAMPORTS_PER_SOL;
      
      if (balance < requiredBalance) {
        throw new Error(`Insufficient balance. Required: ${requiredBalance / LAMPORTS_PER_SOL} SOL, Available: ${balance / LAMPORTS_PER_SOL} SOL`);
      }
      
      // Create a transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(merchantWallet),
          lamports: requiredBalance,
        })
      );

      // Get the latest blockhash
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Send the transaction
      const signature = await sendTransaction(transaction, connection);
      console.log('Transaction sent:', signature);
      
      // Wait for confirmation with timeout
      const confirmation = await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight
      }, 'confirmed');
      
      if (confirmation.value.err) {
        console.error('Transaction confirmation error:', confirmation.value.err);
        throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`);
      }
      
      setTransactionSignature(signature);
      
      toast({
        title: "Payment Successful",
        description: `Transaction confirmed: ${signature.slice(0, 8)}...`,
      });
      
      // Navigate back to topics or another appropriate page
      setTimeout(() => {
        navigate('/topics/English');
      }, 1500);
    } catch (error) {
      console.error('Transaction error:', error);
      let errorMessage = "We couldn't process your payment. Please try again.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
        // Log additional error details
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
      }
      
      toast({
        title: "Transaction Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-t from-[#fff5e0] to-[#f8e5ff] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-400 rounded-t-full"></div>
              <h1 className="text-2xl font-bold text-gray-800">VOCAKE</h1>
            </Link>
          </div>
          <CustomButton 
            variant="secondary" 
            onClick={() => navigate(-1)}
          >
            Back
          </CustomButton>
        </header>
        
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-purple-800 mb-6">Payment with Solana</h1>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Premium Subscription</h2>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Monthly Premium</span>
              <span className="font-semibold">{PAYMENT_AMOUNT} SOL</span>
            </div>
            <div className="flex justify-between mb-6">
              <span className="text-gray-600">Processing Fee</span>
              <span className="font-semibold">{PROCESSING_FEE} SOL</span>
            </div>
            <div className="flex justify-between pt-4 border-t">
              <span className="text-lg font-bold">Total</span>
              <span className="text-lg font-bold">{PAYMENT_AMOUNT + PROCESSING_FEE} SOL</span>
            </div>
          </div>
          
          {publicKey ? (
            <div className="space-y-4">
              <CustomButton
                variant="gradient-blue"
                className="w-full py-3 text-lg"
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Pay with SOL"}
              </CustomButton>
              
              {transactionSignature && (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Transaction completed!</p>
                  <a 
                    href={`https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View on Solana Explorer →
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <p className="text-center text-gray-600 mb-2">
                Connect your Solana wallet to make a payment
              </p>
              <SolanaWalletButton />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentScene;
