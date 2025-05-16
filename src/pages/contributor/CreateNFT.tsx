import React, { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { useNavigate } from "react-router-dom";
import { useWallet } from '@solana/wallet-adapter-react';
import SolanaWalletButton from "@/components/SolanaWalletButton";
import CustomButton from "@/components/ui/custom-button";
import { useToast } from "@/hooks/use-toast";
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  uploadTime: string;
}

const CreateNFT: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { publicKey, sendTransaction } = useWallet();
  const [name, setName] = useState("100 Essential Spanish Nouns");
  const [url, setUrl] = useState("essential-spanish-nouns");
  const [description, setDescription] = useState("A collection of the 100 most common Spanish nouns at A1 level, perfect for beginners.");
  const [price, setPrice] = useState("0.1");
  const [language, setLanguage] = useState("Spanish");
  const [isPublishing, setIsPublishing] = useState(false);
  
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    { id: "1", name: "Quiz.mp3", size: "2.4 MB", uploadTime: "2m ago" },
    { id: "2", name: "Quiz.pdf", size: "1.1 MB", uploadTime: "2m ago" }
  ]);

  const handlePublish = async () => {
    if (!publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to publish your NFT",
        variant: "destructive",
      });
      return;
    }

    setIsPublishing(true);

    try {
      const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
      
      // Create a transaction for minting the NFT
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey('YOUR_MERCHANT_WALLET_ADDRESS'), // Replace with your merchant wallet
          lamports: 0.1 * LAMPORTS_PER_SOL, // 0.1 SOL for minting fee
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
        title: "NFT Collection Published",
        description: `Your collection "${name}" has been published successfully.`
      });
      navigate("/contributor/nft-library");
    } catch (error) {
      console.error('Transaction error:', error);
      toast({
        title: "Publishing failed",
        description: "There was an error publishing your NFT collection.",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    // In a real app, we would upload the files to a server
    // This is just a placeholder for the UI demonstration
    toast({
      title: "File Upload",
      description: "File upload simulation. In a real app, this would upload your files."
    });
  };

  return (
    <AppLayout>
      <div className="w-full max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-800">Create NFT Collection</h1>
          <p className="text-gray-600 mt-2">Create and publish your language learning content as NFTs</p>
        </div>

        {!publicKey ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Connect Your Wallet</h2>
            <p className="text-gray-600 mb-6">
              You need to connect your wallet to create and publish NFT collections
            </p>
            <div className="flex justify-center">
              <SolanaWalletButton />
            </div>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
                  Collection Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-purple-300"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="url">
                  URL Slug
                </label>
                <input
                  type="text"
                  id="url"
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-purple-300"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-purple-300"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="price">
                    Price (SOL)
                  </label>
                  <input
                    type="text"
                    id="price"
                    className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-purple-300"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="language">
                    Language
                  </label>
                  <select
                    id="language"
                    className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-purple-300"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="Spanish">Spanish</option>
                    <option value="English">English</option>
                    <option value="Japanese">Japanese</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Italian">Italian</option>
                  </select>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-2">
                  Upload Files
                </label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                >
                  <p className="text-gray-600 mb-4">
                    Drag and drop your files here, or click to browse
                  </p>
                  <CustomButton variant="secondary">
                    Browse Files
                  </CustomButton>
                </div>
                
                {uploadedFiles.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Uploaded Files</h3>
                    <div className="space-y-2">
                      {uploadedFiles.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-gray-500">
                              {file.size} • {file.uploadTime}
                            </p>
                          </div>
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => {
                              setUploadedFiles(files =>
                                files.filter(f => f.id !== file.id)
                              );
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <CustomButton
                variant="gradient-blue"
                onClick={handlePublish}
                disabled={isPublishing}
              >
                {isPublishing ? "Publishing..." : "Publish Collection"}
              </CustomButton>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default CreateNFT;
