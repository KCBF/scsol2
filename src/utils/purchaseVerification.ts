import { Connection, PublicKey } from '@solana/web3.js';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

interface PurchaseRecord {
  courseId: number;
  signature: string;
  timestamp: number;
  amount: number;
}

const PURCHASE_STORAGE_KEY = 'purchased_courses';
const TRANSACTION_TIMEOUT = 10000; // 10 seconds timeout for transaction verification

export const verifyPurchase = async (
  publicKey: PublicKey,
  courseId: number,
  expectedPrice: number
): Promise<boolean> => {
  try {
    // First check local storage for cached purchase
    const cachedPurchases = getCachedPurchases();
    const cachedPurchase = cachedPurchases.find(p => p.courseId === courseId);
    if (cachedPurchase) {
      try {
        // Verify the cached transaction is still valid with timeout
        const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
        const tx = await Promise.race([
          connection.getTransaction(cachedPurchase.signature),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Transaction verification timeout')), TRANSACTION_TIMEOUT)
          )
        ]);
        
        if (tx && !tx.meta?.err) {
          return true;
        }
      } catch (error) {
        console.warn('Cached transaction verification failed:', error);
        // Continue to check transaction history
      }
    }

    // If no valid cached purchase, check transaction history
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    const merchantWallet = new PublicKey(import.meta.env.VITE_MERCHANT_WALLET);
    
    // Get recent transactions
    const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 100 });
    
    // Get transaction details with timeout
    const transactions = await Promise.all(
      signatures.map(async (sig) => {
        try {
          const tx = await Promise.race([
            connection.getTransaction(sig.signature, {
              maxSupportedTransactionVersion: 0
            }),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Transaction fetch timeout')), TRANSACTION_TIMEOUT)
            )
          ]);
          return tx;
        } catch (error) {
          console.warn('Error fetching transaction:', error);
          return null;
        }
      })
    );

    // Find valid course purchases
    const validPurchase = transactions.find(tx => {
      if (!tx || !tx.meta) return false;

      try {
        const accountKeys = tx.transaction.message.getAccountKeys().keySegments().flat();
        const isToMerchant = accountKeys.some(
          (key: PublicKey) => key.equals(merchantWallet)
        );
        const isSuccessful = !tx.meta.err;
        const preBalance = tx.meta.preBalances[0] ?? 0;
        const postBalance = tx.meta.postBalances[0] ?? 0;
        const amount = postBalance - preBalance;
        const isCorrectAmount = amount === expectedPrice * LAMPORTS_PER_SOL;

        return isToMerchant && isSuccessful && isCorrectAmount;
      } catch (error) {
        console.warn('Error processing transaction:', error);
        return false;
      }
    });

    if (validPurchase) {
      // Cache the valid purchase
      cachePurchase({
        courseId,
        signature: validPurchase.transaction.signatures[0],
        timestamp: Date.now(),
        amount: expectedPrice
      });
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error verifying purchase:', error);
    return false;
  }
};

export const getCachedPurchases = (): PurchaseRecord[] => {
  try {
    const cached = localStorage.getItem(PURCHASE_STORAGE_KEY);
    return cached ? JSON.parse(cached) : [];
  } catch (error) {
    console.error('Error reading cached purchases:', error);
    return [];
  }
};

export const cachePurchase = (purchase: PurchaseRecord) => {
  try {
    const cached = getCachedPurchases();
    const updated = [...cached.filter(p => p.courseId !== purchase.courseId), purchase];
    localStorage.setItem(PURCHASE_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error caching purchase:', error);
  }
};

export const getPurchasedCourses = async (
  publicKey: PublicKey,
  courseIds: number[],
  prices: { [key: number]: number }
): Promise<number[]> => {
  const purchasedCourses: number[] = [];
  
  for (const courseId of courseIds) {
    const isPurchased = await verifyPurchase(publicKey, courseId, prices[courseId]);
    if (isPurchased) {
      purchasedCourses.push(courseId);
    }
  }
  
  return purchasedCourses;
}; 