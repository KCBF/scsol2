import React from "react";
import AppLayout from "@/components/AppLayout";
import CustomButton from "@/components/ui/custom-button";
import { Link } from "react-router-dom";

const NFTLibrary: React.FC = () => {
  const nftCollections = [
    {
      id: 1,
      title: "100 Essential Spanish Nouns",
      language: "Spanish",
      content: "A1 Level",
      price: 0.1,
      downloads: 238,
      rating: 4.7,
    },
    {
      id: 2,
      title: "Business English Phrases",
      language: "English",
      content: "B2 Level",
      price: 0.1,
      downloads: 124,
      rating: 4.5,
    },
    {
      id: 3,
      title: "Japanese Kanji Basics",
      language: "Japanese",
      content: "N5 Level",
      price: 0.1,
      downloads: 87,
      rating: 4.2,
    }
  ];

  return (
    <AppLayout>
      <div className="w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-purple-800">NFT Library</h1>
          <Link to="/contributor/create-nft">
            <CustomButton variant="gradient-blue">
              + Create new collection
            </CustomButton>
          </Link>
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Created by you</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nftCollections.map((collection) => (
              <div key={collection.id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6">
                <h3 className="font-bold text-lg mb-1">{collection.title}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {collection.language}
                  </span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">
                    {collection.content}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-blue-600 font-bold">{collection.price} SOL</span>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm">{collection.rating}</span>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{collection.downloads} downloads</span>
                  <Link to={`/contributor/nft/${collection.id}`} className="text-purple-600 hover:text-purple-800">
                    View details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Download tracking</h2>
            <Link to="/contributor/analytics" className="text-purple-600 hover:text-purple-800">
              View full report →
            </Link>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 h-64 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500">Bar chart visualization would go here</p>
              <p className="text-sm text-gray-400 mt-2">Showing download statistics over time</p>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default NFTLibrary;
