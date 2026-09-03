import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BankSampahProvider } from './context/BankSampahContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './components/public/LandingPage';
import { KatalogHargaPublic } from './components/public/KatalogHargaPublic';
import { AlurSirkularMaggot } from './components/public/AlurSirkularMaggot';
import { NasabahPortal } from './components/public/NasabahPortal';
import { AdminSidebar } from './components/layout/AdminSidebar';
import { AdminHeader } from './components/layout/AdminHeader';
import { DashboardOverview } from './components/admin/DashboardOverview';
import { TransaksiSetor } from './components/admin/TransaksiSetor';
import { TransaksiTarik } from './components/admin/TransaksiTarik';
import { NasabahManagement } from './components/admin/NasabahManagement';
import { RiwayatTransaksi } from './components/admin/RiwayatTransaksi';
import { KatalogManagement } from './components/admin/KatalogManagement';
import { LaporanEkspor } from './components/admin/LaporanEkspor';
import { LoginModal } from './components/auth/LoginModal';
import { ReceiptModal } from './components/common/ReceiptModal';
import { Toast } from './components/common/Toast';

const MainApp = () => {
  const { user, loading } = useAuth();
  
  // Public tabs (only available for non-admin visitors)
  const [activeTab, setActiveTab] = useState('landing'); // landing, katalog-public, sirkular, portal-nasabah

  // Admin tabs (persisted in localStorage so refreshing stays on the current tab)
  const [adminTab, setAdminTabState] = useState(() => {
    return localStorage.getItem('SI_BSDES_ADMIN_TAB') || 'dashboard';
  });
  const [adminSidebarOpen, setAdminSidebarOpen] = useState(false);

  // Modals state
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [selectedTxForReceipt, setSelectedTxForReceipt] = useState(null);

  // Query parameter state for nasabah quick search
  const [nasabahQuickQuery, setNasabahQuickQuery] = useState('');

  const setAdminTab = (tab) => {
    setAdminTabState(tab);
    localStorage.setItem('SI_BSDES_ADMIN_TAB', tab);
  };

  const handleQuickCheck = (nikOrRek) => {
    setNasabahQuickQuery(nikOrRek);
    setActiveTab('portal-nasabah');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = () => {
    setLoginModalOpen(false);
  };

  // 1. Loading state while checking authentication session
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Memuat sistem SI-BSDes...</p>
        </div>
      </div>
    );
  }

  // 2. ADMIN VIEW (Fixed Viewport: Sidebar stays locked in position, Main content scrolls smoothly)
  if (user) {
    return (
      <div className="h-screen w-screen overflow-hidden bg-slate-50 flex font-sans">
        {/* Sidebar Container (Fixed height on desktop, Drawer on mobile) */}
        <div className={`fixed inset-y-0 left-0 z-50 transform ${adminSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 lg:z-auto transition duration-200 ease-in-out flex-shrink-0 h-full`}>
          <AdminSidebar
            activeTab={adminTab}
            setActiveTab={(tab) => {
              setAdminTab(tab);
              setAdminSidebarOpen(false);
            }}
          />
        </div>

        {/* Backdrop for mobile */}
        {adminSidebarOpen && (
          <div
            onClick={() => setAdminSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-xs"
          />
        )}

        {/* Main Admin Content (Independently scrollable) */}
        <div className="flex-1 flex flex-col h-screen overflow-y-auto overflow-x-hidden min-w-0 bg-slate-50">
          <AdminHeader
            activeTab={adminTab}
            onToggleSidebar={() => setAdminSidebarOpen(!adminSidebarOpen)}
          />

          <main className="flex-1 pb-16">
            {adminTab === 'dashboard' && (
              <DashboardOverview
                onNavigate={(t) => setAdminTab(t)}
                onSelectTx={(tx) => setSelectedTxForReceipt(tx)}
              />
            )}
            {adminTab === 'setor' && <TransaksiSetor />}
            {adminTab === 'tarik' && <TransaksiTarik />}
            {adminTab === 'nasabah' && <NasabahManagement />}
            {adminTab === 'transaksi' && <RiwayatTransaksi />}
            {adminTab === 'katalog' && <KatalogManagement />}
            {adminTab === 'laporan' && <LaporanEkspor />}
          </main>
        </div>

        {/* Global Modals */}
        <ReceiptModal
          isOpen={Boolean(selectedTxForReceipt)}
          onClose={() => setSelectedTxForReceipt(null)}
          transaksi={selectedTxForReceipt}
          nasabah={selectedTxForReceipt?.nasabah}
        />
        <Toast />
      </div>
    );
  }

  // 3. PUBLIC CITIZEN VIEW (Only rendered when user is not authenticated)
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLogin={() => setLoginModalOpen(true)}
      />

      <main className="flex-1">
        {activeTab === 'landing' && (
          <LandingPage
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onQuickCheck={handleQuickCheck}
          />
        )}
        {activeTab === 'katalog-public' && <KatalogHargaPublic />}
        {activeTab === 'sirkular' && <AlurSirkularMaggot />}
        {activeTab === 'portal-nasabah' && (
          <NasabahPortal initialSearch={nasabahQuickQuery} />
        )}
      </main>

      <Footer
        onOpenLogin={() => setLoginModalOpen(true)}
      />

      {/* Global Modals */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      <ReceiptModal
        isOpen={Boolean(selectedTxForReceipt)}
        onClose={() => setSelectedTxForReceipt(null)}
        transaksi={selectedTxForReceipt}
        nasabah={selectedTxForReceipt?.nasabah}
      />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BankSampahProvider>
        <MainApp />
      </BankSampahProvider>
    </AuthProvider>
  );
}
