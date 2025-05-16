import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import CustomButton from '@/components/ui/custom-button';
import { ExternalLink } from 'lucide-react';

interface PurchaseDetails {
  nftId: number;
  title: string;
  language: string;
  price: number;
  transactionSignature: string;
  type: 'regular' | 'premium';
}

const PurchaseSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const purchaseDetails = location.state as PurchaseDetails;

  if (!purchaseDetails) {
    return (
      <AppLayout>
        <div className="w-full max-w-3xl mx-auto text-center py-12">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Purchase Details</h1>
          <CustomButton onClick={() => navigate('/contributor/marketplace')}>
            Return to Marketplace
          </CustomButton>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-purple-800 mb-2">Purchase Successful!</h1>
            <p className="text-gray-600">Your transaction has been confirmed</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Purchase Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Course Title</span>
                <span className="font-medium">{purchaseDetails.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Language</span>
                <span className="font-medium">{purchaseDetails.language}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price</span>
                <span className="font-medium">{purchaseDetails.price} SOL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Package Type</span>
                <span className="font-medium capitalize">{purchaseDetails.type}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <a
              href={`https://explorer.solana.com/tx/${purchaseDetails.transactionSignature}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ExternalLink size={20} />
              View on Solana Explorer
            </a>
            
            <div className="flex gap-4">
              <CustomButton
                variant="secondary"
                className="flex-1"
                onClick={() => navigate('/contributor/marketplace')}
              >
                Back to Marketplace
              </CustomButton>
              
              <CustomButton
                variant="gradient-blue"
                className="flex-1"
                onClick={() => navigate(`/course/${purchaseDetails.nftId}`)}
              >
                View Course
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default PurchaseSuccess; 