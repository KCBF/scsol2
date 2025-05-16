import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWallet } from '@solana/wallet-adapter-react';
import { useToast } from "@/hooks/use-toast";
import SolanaWalletButton from "@/components/SolanaWalletButton";
import AppLayout from "@/components/AppLayout";
import CustomButton from "@/components/ui/custom-button";
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

const Marketplace: React.FC = () => {
  const { publicKey, sendTransaction } = useWallet();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [processingNftId, setProcessingNftId] = useState<number | null>(null);

  const latestPackages = [
    {
      id: 1,
      title: "100 Essential Spanish Nouns",
      language: "Spanish",
      content: "A1 Level",
      price: 0.1,
      creator: "@LinguaLuna"
    },
    {
      id: 2,
      title: "Business English Phrases",
      language: "English",
      content: "B2 Level",
      price: 0.1,
      creator: "@EnglishPro"
    },
    {
      id: 3,
      title: "Japanese Kanji Basics",
      language: "Japanese",
      content: "N5 Level",
      price: 0.1,
      creator: "@NihongoMaster"
    },
    {
      id: 4,
      title: "French Conversation Starters",
      language: "French",
      content: "A2 Level",
      price: 0.1,
      creator: "@ParisianTalks"
    },
    {
      id: 5,
      title: "German Grammar Essentials",
      language: "German",
      content: "B1 Level",
      price: 0.1,
      creator: "@DeutschGrammar"
    },
    {
      id: 6,
      title: "Italian Food Vocabulary",
      language: "Italian",
      content: "A1 Level",
      price: 0.1,
      creator: "@CiaoItalia"
    }
  ];

  const premiumPackages = [
    {
      id: 101,
      title: "Complete Spanish Course Bundle",
      language: "Spanish",
      regularPrice: 0.5,
      salePrice: 0.35,
      timeLeft: "2d 4h"
    },
    {
      id: 102,
      title: "Business English Mastery",
      language: "English",
      regularPrice: 0.6,
      salePrice: 0.45,
      timeLeft: "1d 6h"
    },
    {
      id: 103,
      title: "Japanese Immersion Pack",
      language: "Japanese",
      regularPrice: 0.55,
      salePrice: 0.4,
      timeLeft: "3d 12h"
    }
  ];

  const handlePurchaseNft = async (nftId: number) => {
    if (!publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to purchase this NFT",
        variant: "destructive",
      });
      return;
    }
    
    setProcessingNftId(nftId);
    
    try {
      const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
      
      // Create a transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey('YOUR_MERCHANT_WALLET_ADDRESS'), // Replace with your merchant wallet
          lamports: 0.1 * LAMPORTS_PER_SOL, // 0.1 SOL
        })
      );

      // Get the latest blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Send the transaction
      const signature = await sendTransaction(transaction, connection);
      
      // Wait for confirmation
      await connection.confirmTransaction(signature, 'confirmed');
      
      toast({
        title: "Purchase successful!",
        description: "You've successfully purchased this NFT collection",
      });
      
      navigate(`/nft/${nftId}`);
    } catch (error) {
      console.error('Transaction error:', error);
      toast({
        title: "Transaction failed",
        description: "Could not complete your purchase",
        variant: "destructive",
      });
    } finally {
      setProcessingNftId(null);
    }
  };

  return (
    <AppLayout>
      <div className="w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-800 mb-2">Marketplace</h1>
          <p className="text-gray-600">Discover and buy NFT collections to enhance your language learning</p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Latest Packages</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestPackages.map((pkg) => (
              <div key={pkg.id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                <h3 className="font-bold text-lg mb-1">{pkg.title}</h3>
                <p className="text-sm text-gray-600 mb-3">by {pkg.creator}</p>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {pkg.language}
                  </span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">
                    {pkg.content}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-600 font-bold">{pkg.price} SOL</span>
                  {!publicKey ? (
                    <SolanaWalletButton />
                  ) : (
                    <CustomButton 
                      onClick={() => handlePurchaseNft(pkg.id)}
                      disabled={processingNftId === pkg.id}
                    >
                      {processingNftId === pkg.id ? "Processing..." : "Purchase"}
                    </CustomButton>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Premium Packages</h2>
          
          <div className="flex overflow-x-auto pb-4 gap-6 hide-scrollbar">
            {premiumPackages.map((pkg) => (
              <div 
                key={pkg.id} 
                className="min-w-[300px] bg-gradient-to-br from-purple-600 to-blue-500 rounded-xl shadow-lg p-6 text-white transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
              >
                <div className="mb-2">
                  <span className="px-2 py-1 bg-white/20 rounded-full text-xs">
                    {pkg.language}
                  </span>
                </div>
                <h3 className="font-bold text-xl mb-4">{pkg.title}</h3>
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <div className="text-sm line-through opacity-70">{pkg.regularPrice} SOL</div>
                    <div className="text-2xl font-bold">{pkg.salePrice} SOL</div>
                  </div>
                  <div className="bg-white/20 px-3 py-1 rounded-full text-sm">
                    {pkg.timeLeft} left
                  </div>
                </div>
                {!publicKey ? (
                  <SolanaWalletButton />
                ) : (
                  <CustomButton 
                    variant="secondary" 
                    className="w-full"
                    onClick={() => handlePurchaseNft(pkg.id)}
                    disabled={processingNftId === pkg.id}
                  >
                    {processingNftId === pkg.id ? "Processing..." : "Purchase Now"}
                  </CustomButton>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default Marketplace;
