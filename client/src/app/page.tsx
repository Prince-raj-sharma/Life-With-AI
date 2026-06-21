import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { CheckCircle, Play, FileText, Users, Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6">
            Master Artificial Intelligence <br />
            <span className="text-blue-600">For Your Real Life</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            High-quality AI courses, PDFs, and resources designed to help you stay ahead in the rapidly evolving world of technology.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/courses" className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition">
              Browse Courses
            </Link>
            <Link href="/pdf-store" className="bg-white text-gray-900 border border-gray-200 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition">
              View PDF Store
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <FeatureCard icon={<Play className="text-blue-600"/>} title="Video Courses" desc="Step-by-step video tutorials from industry experts." />
            <FeatureCard icon={<FileText className="text-blue-600"/>} title="Exclusive PDFs" desc="In-depth guides and cheat sheets for quick learning." />
            <FeatureCard icon={<Users className="text-blue-600"/>} title="Community" desc="Join thousands of students learning AI together." />
            <FeatureCard icon={<Shield className="text-blue-600"/>} title="Lifetime Access" desc="Learn at your own pace with lifetime access to content." />
          </div>
        </div>
      </section>

      {/* FAQ & Contact (Simplified for brevity) */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4 text-left">
            <FAQItem question="Are the courses beginner-friendly?" answer="Yes! All our courses start from basics and go to advanced levels." />
            <FAQItem question="Can I download the PDFs?" answer="Yes, purchased PDFs are available for download if the instructor enables it." />
            <FAQItem question="How do I get my certificate?" answer="Certificates are automatically generated upon course completion." />
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="mb-4">© 2026 LIFE WITH AI. All rights reserved.</p>
          <div className="flex justify-center gap-6">
            <Link href="#" className="hover:text-blue-400">Privacy Policy</Link>
            <Link href="#" className="hover:text-blue-400">Terms of Service</Link>
            <Link href="#" className="hover:text-blue-400">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: any) {
  return (
    <div className="p-6 border rounded-2xl hover:shadow-lg transition">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}

function FAQItem({ question, answer }: any) {
  return (
    <div className="bg-white p-6 rounded-xl border">
      <h4 className="font-bold mb-2">{question}</h4>
      <p className="text-gray-600">{answer}</p>
    </div>
  );
}
