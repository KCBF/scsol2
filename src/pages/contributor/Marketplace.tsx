import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWallet } from '@solana/wallet-adapter-react';
import { useToast } from "@/hooks/use-toast";
import SolanaWalletButton from "@/components/SolanaWalletButton";
import AppLayout from "@/components/AppLayout";
import CustomButton from "@/components/ui/custom-button";
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getPurchasedCourses } from '@/utils/purchaseVerification';

const MERCHANT_WALLET = import.meta.env.VITE_MERCHANT_WALLET;

const Marketplace: React.FC = () => {
  const { publicKey, sendTransaction } = useWallet();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [processingNftId, setProcessingNftId] = useState<number | null>(null);
  const [transactionSignature, setTransactionSignature] = useState<string | null>(null);
  const [purchasedCourses, setPurchasedCourses] = useState<number[]>([]);
  const [isLoadingPurchases, setIsLoadingPurchases] = useState(true);

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

  // Load purchased courses
  React.useEffect(() => {
    let isMounted = true;

    const loadPurchasedCourses = async () => {
      if (!publicKey) {
        if (isMounted) {
          setPurchasedCourses([]);
          setIsLoadingPurchases(false);
        }
        return;
      }

      try {
        // Get all course IDs and their prices
        const courseIds = [
          ...latestPackages.map(pkg => pkg.id),
          ...premiumPackages.map(pkg => pkg.id)
        ];
        
        const prices = {
          ...latestPackages.reduce((acc, pkg) => ({ ...acc, [pkg.id]: pkg.price }), {}),
          ...premiumPackages.reduce((acc, pkg) => ({ ...acc, [pkg.id]: pkg.salePrice }), {})
        };

        const purchased = await getPurchasedCourses(publicKey, courseIds, prices);
        
        if (isMounted) {
          setPurchasedCourses(purchased);
          setIsLoadingPurchases(false);
        }
      } catch (error) {
        console.error('Error loading purchased courses:', error);
        if (isMounted) {
          setPurchasedCourses([]);
          setIsLoadingPurchases(false);
          toast({
            title: "Error loading purchases",
            description: "There was a problem loading your purchased courses. Please try again.",
            variant: "destructive",
          });
        }
      }
    };

    loadPurchasedCourses();

    return () => {
      isMounted = false;
    };
  }, [publicKey, toast]);

  const handlePurchaseNft = async (nftId: number, price: number) => {
    if (!publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to purchase this NFT",
        variant: "destructive",
      });
      return;
    }
    
    setProcessingNftId(nftId);
    setTransactionSignature(null);
    
    try {
      const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
      
      if (!MERCHANT_WALLET) {
        throw new Error('Merchant wallet not configured');
      }

      // Check wallet balance
      const balance = await connection.getBalance(publicKey);
      const requiredBalance = price * LAMPORTS_PER_SOL;
      
      if (balance < requiredBalance) {
        throw new Error(`Insufficient balance. Required: ${requiredBalance / LAMPORTS_PER_SOL} SOL, Available: ${balance / LAMPORTS_PER_SOL} SOL`);
      }
      
      // Create a transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(MERCHANT_WALLET),
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
        title: "Purchase successful!",
        description: `Transaction confirmed: ${signature.slice(0, 8)}...`,
      });
      
      // Find the purchased package details
      const purchasedPackage = latestPackages.find(pkg => pkg.id === nftId) || 
                             premiumPackages.find(pkg => pkg.id === nftId);
      
      if (!purchasedPackage) {
        throw new Error('Package not found');
      }

      // Navigate to success page with purchase details
      navigate('/purchase-success', {
        state: {
          nftId,
          title: purchasedPackage.title,
          language: purchasedPackage.language,
          price: 'price' in purchasedPackage ? purchasedPackage.price : purchasedPackage.salePrice,
          transactionSignature: signature,
          type: 'price' in purchasedPackage ? 'regular' : 'premium'
        }
      });
    } catch (error) {
      console.error('Transaction error:', error);
      let errorMessage = "Could not complete your purchase";
      
      if (error instanceof Error) {
        errorMessage = error.message;
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
      }
      
      toast({
        title: "Transaction failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setProcessingNft(null);
    }
  };

  return (
    <AppLayout>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Language Learning Marketplace</h1>
          <p className="text-xl text-gray-600">Discover and purchase language learning courses</p>
        </div>

        {publicKey && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Purchased Courses</h2>
            {isLoadingPurchases ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto" />
                <p className="mt-4 text-gray-600">Loading your courses...</p>
              </div>
            ) : purchasedCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {purchasedCourses.map(courseId => {
                  const course = latestPackages.find(p => p.id === courseId) || 
                               premiumPackages.find(p => p.id === courseId);
                  if (!course) return null;
                  
                  return (
                    <div key={courseId} className="bg-white rounded-xl shadow-lg overflow-hidden">
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {course.language}
                          </span>
                          <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">
                            {'content' in course ? course.content : 'Premium'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">{course.language}</span>
                          <CustomButton
                            variant="gradient-blue"
                            onClick={() => navigate(`/course/${courseId}/learn`)}
                          >
                            Continue Learning
                          </CustomButton>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">You haven't purchased any courses yet.</p>
              </div>
            )}
          </div>
        )}

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
                <div className="flex flex-col gap-2">
                  <span className="text-blue-600 font-bold">{pkg.price} SOL</span>
                  {!publicKey ? (
                    <SolanaWalletButton />
                  ) : (
                    <div className="space-y-2">
                      <CustomButton 
                        onClick={() => handlePurchaseNft(pkg.id, pkg.price)}
                        disabled={processingNftId === pkg.id}
                        className="w-full"
                      >
                        {processingNftId === pkg.id ? "Processing..." : "Purchase"}
                      </CustomButton>
                      {transactionSignature && processingNftId === pkg.id && (
                        <a 
                          href={`https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium block text-center"
                        >
                          View on Solana Explorer →
                        </a>
                      )}
                    </div>
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
                  <div className="space-y-2">
                    <CustomButton 
                      variant="secondary" 
                      className="w-full"
                      onClick={() => handlePurchaseNft(pkg.id, pkg.salePrice)}
                      disabled={processingNftId === pkg.id}
                    >
                      {processingNftId === pkg.id ? "Processing..." : "Purchase Now"}
                    </CustomButton>
                    {transactionSignature && processingNftId === pkg.id && (
                      <a 
                        href={`https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-gray-200 text-sm font-medium block text-center"
                      >
                        View on Solana Explorer →
                      </a>
                    )}
                  </div>
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
