'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

export default function AdminPDFStore() {
  const [pdfs, setPdfs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    thumbnail: '',
    pdfFile: '',
    canDownload: true
  });

  const fetchPDFs = async () => {
    try {
      const { data } = await api.get('/pdf');
      setPdfs(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPDFs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/pdf', formData);
      toast.success('PDF Product created');
      setShowModal(false);
      fetchPDFs();
    } catch (error) {
      toast.error('Failed to create PDF product');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Manage PDF Store</h2>
        <button 
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} /> Add PDF
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {pdfs.map((pdf: any) => (
          <div key={pdf._id} className="bg-white border rounded-xl overflow-hidden shadow-sm">
            <img src={pdf.thumbnail} alt="" className="w-full h-40 object-cover" />
            <div className="p-4">
                <h3 className="font-bold mb-1">{pdf.title}</h3>
                <p className="text-blue-600 font-bold mb-4">₹{pdf.price}</p>
                <div className="flex gap-2">
                    <button className="flex-1 bg-gray-100 py-2 rounded flex justify-center hover:bg-gray-200"><Edit size={16}/></button>
                    <button className="flex-1 bg-red-50 text-red-600 py-2 rounded flex justify-center hover:bg-red-100"><Trash2 size={16}/></button>
                </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full">
            <h3 className="text-2xl font-bold mb-6">Add PDF Product</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input placeholder="Title" required className="w-full border rounded-lg px-4 py-2" onChange={(e) => setFormData({...formData, title: e.target.value})} />
              <textarea placeholder="Description" required className="w-full border rounded-lg px-4 py-2" onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
              <input type="number" placeholder="Price" required className="w-full border rounded-lg px-4 py-2" onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} />
              <input placeholder="Thumbnail URL" className="w-full border rounded-lg px-4 py-2" onChange={(e) => setFormData({...formData, thumbnail: e.target.value})} />
              <input placeholder="PDF File URL (Cloudinary)" required className="w-full border rounded-lg px-4 py-2" onChange={(e) => setFormData({...formData, pdfFile: e.target.value})} />
              <div className="flex justify-end gap-4 mt-8">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 border rounded-lg">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg">Add PDF</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
