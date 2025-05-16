import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWallet } from '@solana/wallet-adapter-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import AppLayout from "@/components/AppLayout";
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { ShoppingCart, GraduationCap, Clock, Sparkles } from "lucide-react";

const MERCHANT_WALLET = import.meta.env.VITE_MERCHANT_WALLET;

interface RegularCourse {
  id: number;
  title: string;
  language: string;
  content: string;
  price: number;
  creator: string;
  description: string;
  progress?: number;
}

interface PremiumCourse {
  id: number;
  title: string;
  language: string;
  regularPrice: number;
  salePrice: number;
  timeLeft: string;
  description: string;
  progress?: number;
}

type Course = RegularCourse | PremiumCourse;

const Marketplace: React.FC = () => {
  const { publicKey, sendTransaction } = useWallet();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [processingNftId, setProcessingNftId] = useState<number | null>(null);
  const [transactionSignature, setTransactionSignature] = useState<string | null>(null);
  const [isLoadingPurchases, setIsLoadingPurchases] = useState(false);

  const latestPackages: RegularCourse[] = [
    {
      id: 5,
      title: "Vietnamese for English Speakers",
      language: "Vietnamese",
      content: "A1 Level",
      price: 0.1,
      creator: "@VietMaster",
      description: "Master Vietnamese language essentials for English speakers",
      progress: 0
    },
    {
      id: 6,
      title: "English for Vietnamese Speakers",
      language: "English",
      content: "A1 Level",
      price: 0.1,
      creator: "@EnglishPro",
      description: "Essential English for Vietnamese speakers",
      progress: 0
    },
    {
      id: 3,
      title: "Business English Phrases",
      language: "English",
      content: "B2 Level",
      price: 0.1,
      creator: "@EnglishPro",
      description: "Professional English for business communication",
      progress: 0
    },
    {
      id: 4,
      title: "French Conversation Starters",
      language: "French",
      content: "A2 Level",
      price: 0.1,
      creator: "@ParisianTalks",
      description: "Essential French conversation skills",
      progress: 0
    }
  ];

  const premiumPackages: PremiumCourse[] = [
    {
      id: 101,
      title: "Complete Vietnamese Course Bundle",
      language: "Vietnamese",
      regularPrice: 0.5,
      salePrice: 0.35,
      timeLeft: "2d 4h",
      description: "Comprehensive Vietnamese language learning package"
    },
    {
      id: 102,
      title: "Business English Mastery",
      language: "English",
      regularPrice: 0.6,
      salePrice: 0.45,
      timeLeft: "1d 6h",
      description: "Advanced business English communication skills"
    }
  ];

  // Get all course IDs for the purchased section
  const allCourseIds = [
    ...latestPackages.map(pkg => pkg.id),
    ...premiumPackages.map(pkg => pkg.id)
  ];

  const handlePurchaseNft = async (nftId: number, price: number) => {
    if (!publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to purchase this course",
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
        description: "Your course NFT will be minted shortly. Please wait...",
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
      }
      
      toast({
        title: "Transaction failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setProcessingNftId(null);
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <GraduationCap className="w-6 h-6" />
              Your Courses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allCourseIds.map(courseId => {
                const course = latestPackages.find(p => p.id === courseId) || 
                             premiumPackages.find(p => p.id === courseId);
                if (!course) return null;
                
                return (
                  <Card key={courseId} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-xl">{course.title}</CardTitle>
                      <CardDescription>by {'creator' in course ? course.creator : 'StudyCake'}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="secondary">{course.language}</Badge>
                        <Badge variant="outline">{'content' in course ? course.content : 'Premium'}</Badge>
                      </div>
                      <Progress value={course.progress || 0} className="mb-4" />
                      <p className="text-sm text-gray-500">Progress: {course.progress || 0}%</p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="default"
                        className="w-full"
                        onClick={() => navigate(`/course/${courseId}/learn`)}
                      >
                        Continue Learning
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" />
            Available Courses
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestPackages.map((pkg) => (
              <Card key={pkg.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{pkg.title}</CardTitle>
                  <CardDescription>by {pkg.creator}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="secondary">{pkg.language}</Badge>
                    <Badge variant="outline">{pkg.content}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{pkg.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">{pkg.price} SOL</span>
                    <Button
                      variant="default"
                      className="bg-purple-600 hover:bg-purple-700"
                      onClick={() => handlePurchaseNft(pkg.id, pkg.price)}
                      disabled={processingNftId === pkg.id}
                    >
                      {processingNftId === pkg.id ? "Processing..." : "Purchase"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6" />
            Premium Packages
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {premiumPackages.map((pkg) => (
              <Card key={pkg.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{pkg.title}</CardTitle>
                      <CardDescription>{pkg.language}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      Premium
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{pkg.description}</p>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm line-through text-gray-500">{pkg.regularPrice} SOL</span>
                    <span className="text-lg font-bold text-purple-600">{pkg.salePrice} SOL</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>Sale ends in {pkg.timeLeft}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="default"
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={() => handlePurchaseNft(pkg.id, pkg.salePrice)}
                    disabled={processingNftId === pkg.id}
                  >
                    {processingNftId === pkg.id ? "Processing..." : "Purchase Now"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default Marketplace;
