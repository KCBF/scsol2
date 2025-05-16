import { Connection, PublicKey } from '@solana/web3.js';
import { Metaplex } from '@metaplex-foundation/js';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

interface NFTRecord {
  mintAddress: string;
  courseId: number;
  timestamp: number;
}

const NFT_STORAGE_KEY = 'course_nfts';

export const verifyNFTOwnership = async (
  publicKey: PublicKey,
  courseId: number
): Promise<boolean> => {
  try {
    // First check local storage for cached NFT
    const cachedNFTs = getCachedNFTs();
    const cachedNFT = cachedNFTs.find(nft => nft.courseId === courseId);
    if (cachedNFT) {
      try {
        // Verify the cached NFT is still owned
        const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
        const metaplex = new Metaplex(connection);
        const nft = await metaplex.nfts().findByMint({ mintAddress: new PublicKey(cachedNFT.mintAddress) });
        
        if (nft.owner.equals(publicKey)) {
          return true;
        }
      } catch (error) {
        console.warn('Cached NFT verification failed:', error);
        // Continue to check wallet NFTs
      }
    }

    // If no valid cached NFT, check wallet NFTs
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    const metaplex = new Metaplex(connection);
    
    // Get all NFTs owned by the wallet
    const nfts = await metaplex.nfts().findAllByOwner({ owner: publicKey });
    
    // Find NFTs that match our course collection
    const courseNFTs = nfts.filter(nft => {
      try {
        // Check if NFT belongs to our course collection
        // This assumes you have a specific collection address for your courses
        const isCourseNFT = nft.collection?.address.equals(
          new PublicKey(import.meta.env.VITE_COURSE_COLLECTION_ADDRESS)
        );
        
        // Check if NFT metadata contains the course ID
        const hasCourseId = nft.json?.attributes?.some(
          attr => attr.trait_type === 'courseId' && attr.value === courseId
        );
        
        return isCourseNFT && hasCourseId;
      } catch (error) {
        console.warn('Error processing NFT:', error);
        return false;
      }
    });

    if (courseNFTs.length > 0) {
      // Cache the first valid NFT
      cacheNFT({
        mintAddress: courseNFTs[0].address.toString(),
        courseId,
        timestamp: Date.now()
      });
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error verifying NFT ownership:', error);
    return false;
  }
};

export const getCachedNFTs = (): NFTRecord[] => {
  try {
    const cached = localStorage.getItem(NFT_STORAGE_KEY);
    return cached ? JSON.parse(cached) : [];
  } catch (error) {
    console.error('Error reading cached NFTs:', error);
    return [];
  }
};

export const cacheNFT = (nft: NFTRecord) => {
  try {
    const cached = getCachedNFTs();
    const updated = [...cached.filter(n => n.courseId !== nft.courseId), nft];
    localStorage.setItem(NFT_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error caching NFT:', error);
  }
};

export const getOwnedCourseNFTs = async (
  publicKey: PublicKey,
  courseIds: number[]
): Promise<number[]> => {
  const ownedCourses: number[] = [];
  
  for (const courseId of courseIds) {
    const hasNFT = await verifyNFTOwnership(publicKey, courseId);
    if (hasNFT) {
      ownedCourses.push(courseId);
    }
  }
  
  return ownedCourses;
}; 