import React, { useState, useRef } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import CakeCharacter from "@/components/CakeCharacter";
import SelectOptions from "@/components/SelectOptions";
import { useToast } from "@/hooks/use-toast";
import { useRole } from "@/context/RoleContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";
import SolanaWalletButton from "@/components/SolanaWalletButton";

const Vocake: React.FC = () => {
  const { publicKey } = useWallet();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setRole } = useRole();
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<{ 
    language: string; 
    position: { x: number; y: number } 
  } | null>(null);

  // Initialize user as a learner when landing on this page
  React.useEffect(() => {
    setRole('learner');
  }, [setRole]);

  // Use closer positions for characters with smaller gaps
  const characters = [
    { 
      color: "bg-orange-400", 
      language: "English", 
      position: { x: "30%", y: "35%" },
      imageUrl: "/lovable-uploads/174a1f8c-d372-42d0-8a3e-f6c18723ef37.png" 
    },
    { 
      color: "bg-blue-400", 
      language: "Spanish", 
      position: { x: "45%", y: "42%" },
      imageUrl: "/lovable-uploads/ebe05ffb-1528-4ddb-a509-34b434ea9fb5.png" 
    },
    { 
      color: "bg-green-400", 
      language: "Thai", 
      position: { x: "35%", y: "50%" },
      imageUrl: "/lovable-uploads/d0501b14-3245-4018-88b5-fe1723f3804d.png" 
    },
    { 
      color: "bg-purple-400", 
      language: "French", 
      position: { x: "55%", y: "38%" },
      imageUrl: "/lovable-uploads/174a1f8c-d372-42d0-8a3e-f6c18723ef37.png" 
    },
    { 
      color: "bg-pink-400", 
      language: "Japanese", 
      position: { x: "40%", y: "25%" },
      imageUrl: "/lovable-uploads/ebe05ffb-1528-4ddb-a509-34b434ea9fb5.png" 
    },
  ];

  const handleCharacterClick = (language: string, event: React.MouseEvent) => {
    // Get position relative to the viewport
    const rect = event.currentTarget.getBoundingClientRect();
    setSelectedCharacter({ 
      language, 
      position: { 
        x: rect.left,
        y: window.innerHeight - rect.bottom
      } 
    });
  };

  const handleTopicClick = () => {
    if (selectedCharacter) {
      navigate(`/topics/${selectedCharacter.language}`);
    }
    setSelectedCharacter(null);
  };

  const handleBuddyClick = () => {
    if (selectedCharacter) {
      navigate(`/cakebuddy/${selectedCharacter.language}`);
    }
    setSelectedCharacter(null);
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden bg-white"
      style={{
        backgroundImage: "url('/lovable-uploads/cbaa66f1-4fbd-4402-b26a-25004604a0f6.png')",
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Header/Navigation */}
      <header className="w-full max-w-[1440px] mx-auto flex justify-between items-center px-4 sm:px-8 md:px-12 lg:px-20 py-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/studycake.png" 
              alt="StudyCake Logo" 
              className="w-6.4 h-6.4 object-contain"
            />
          </Link>
        </div>
      </header>

      {publicKey ? (
        <main className="w-full h-[calc(100vh-88px)] relative">
          <div className="max-w-4xl mx-auto px-4 pt-6 pb-2 text-center relative z-20">
            <h1 className="text-4xl md:text-5xl font-bold text-purple-800 mb-2">Choose Your Language</h1>
            <p className="text-xl text-gray-700 mb-4">Click on a cake to start your learning journey</p>
          </div>
          
          {/* Islands background */}
          <div className="relative w-full" style={{ height: 'calc(100vh - 200px)' }}>
            <div className="absolute inset-0 z-10" style={{ top: '0px' }}>
              <img 
                src="/lovable-uploads/5dbd3b0f-ff59-43e3-b889-909a4e1455e0.png"
                alt="Islands Background"
                className="w-full h-full object-contain"
              />
            </div>
            
            {/* Characters container with horizontal scrolling on mobile */}
            <ScrollArea 
              className={`relative z-30 w-full ${isMobile ? 'overflow-x-auto' : ''}`} 
              style={{ height: 'calc(100vh - 200px)' }}
            >
              <div className={`relative ${isMobile ? 'w-[900px]' : 'w-full'} h-full`}>
                {characters.map((char, index) => (
                  <CakeCharacter 
                    key={index}
                    color={char.color}
                    language={char.language}
                    position={char.position}
                    imageUrl={char.imageUrl}
                    onClick={(e) => handleCharacterClick(char.language, e as React.MouseEvent)}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>

          {selectedCharacter && (
            <>
              <div 
                className="fixed inset-0 z-30"
                onClick={() => setSelectedCharacter(null)}
              />
              <SelectOptions 
                language={selectedCharacter.language}
                position={selectedCharacter.position}
                onClose={() => setSelectedCharacter(null)}
                onTopicClick={handleTopicClick}
                onBuddyClick={handleBuddyClick}
              />
            </>
          )}
        </main>
      ) : (
        <main className="w-full h-[calc(100vh-88px)] flex items-center justify-center">
          <div className="text-center bg-white bg-opacity-80 p-8 rounded-xl">
            <img 
              src="/lovable-uploads/41eabf16-1325-4f4a-95ab-5d4c4f39e2e9.png" 
              alt="Cake Slice" 
              className="w-32 h-32 mx-auto mb-8 object-contain"
            />
            <h1 className="text-4xl md:text-5xl font-bold text-purple-800 mb-4">Welcome to Vocake</h1>
            <p className="text-xl text-gray-700 mb-8">Connect your wallet to start learning languages</p>
            <div className="flex justify-center">
              <SolanaWalletButton />
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default Vocake;
