'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import { FileText, Download, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function PDFStore() {
  const [pdfs, setPdfs] = useState([]);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchPDFs = async () => {
      try {
        const { data } = await api.get('/pdf');
        setPdfs(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPDFs();
  }, []);

  const handleBuy = async (pdf: any) => {
    if (!user) return router.push('/login');
    
    try {
      const { data: order } = await api.post('/payments/create-order', {
        amount: pdf.price,
        productId: pdf._id,
        productType: 'pdf'
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "LIFE WITH AI",
        description: `Purchase PDF: ${pdf.title}`,
        order_id: order.id,
        handler: async (response: any) => {
          try {
            await api.post('/payments/verify', response);
            toast.success('PDF Unlocked!');
            window.location.reload();
          } catch (err) {
            toast.error('Verification failed');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#2563eb",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error('Payment initiation failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-4">Exclusive PDF Resources</h1>
        <p className="text-gray-600 mb-12 max-w-2xl">Download high-quality guides, cheatsheets, and blueprints to accelerate your AI journey.</p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pdfs.map((pdf: any) => {
            const isPurchased = user?.purchasedPDFs.includes(pdf._id);
            return (
              <div key={pdf._id} className="bg-white rounded-2xl border p-4 hover:shadow-lg transition">
                <img src={pdf.thumbnail} alt="" className="w-full h-48 object-cover rounded-xl mb-4" />
                <h3 className="font-bold text-lg mb-2">{pdf.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-4">{pdf.description}</p>
                <div className="flex justify-between items-center mt-auto">
                    <span className="font-bold text-xl">₹{pdf.price}</span>
                    {isPurchased ? (
                        <a 
                            href={pdf.pdfFile} 
                            target="_blank" 
                            className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700"
                        >
                            <Download size={20} />
                        </a>
                    ) : (
                        <button 
                            onClick={() => handleBuy(pdf)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
                        >
                            <Lock size={14} /> Buy Now
                        </button>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
