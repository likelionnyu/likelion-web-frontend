import AdminNav from '../components/AdminNav';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <AdminNav />

      {/* Admin Home Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-[#0a0a0a]">
        <h1 className="text-[40px] md:text-[96px] font-bold text-white leading-tight md:leading-normal text-center px-4">NYU Admin Page</h1>
      </div>
    </div>
  );
}
