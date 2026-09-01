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
import { LogAliranOrganik } from './components/admin/LogAliranOrganik';
import { LaporanEkspor } from './components/admin/LaporanEkspor';
import { LoginModal } from './components/auth/LoginModal';
import { ReceiptModal } from './components/common/ReceiptModal';
import { Toast } from './components/common/Toast';

const MainApp = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('landing'); // landing, katalog-public, sirkular, portal-nasabah, admin
  const [adminTab, setAdminTab] = useState('dashboard'); // dashboard, setor, tarik, nasabah, transaksi, katalog, maggot, laporan
  const [adminSidebarOpen, setAdminSidebarOpen] = useState(false);

  // Modals state
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [selectedTxForReceipt, setSelectedTxForReceipt] = useState(null);

  // Query parameter state for nasabah quick search
  const [nasabahQuickQuery, setNasabahQuickQuery] = useState('');

  const handleQuickCheck = (nikOrRek) => {
    setNasabahQuickQuery(nikOrRek);
    setActiveTab('portal-nasabah');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = () => {
    setActiveTab('admin');
    setAdminTab('dashboard');
  };

  // If in admin view and user is authenticated
  if (activeTab === 'admin' && user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 transform ${adminSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition duration-200 ease-in-out`}>
          <AdminSidebar
            activeTab={adminTab}
            setActiveTab={(tab) => {
              setAdminTab(tab);
              setAdminSidebarOpen(false);
            }}
            onNavigateHome={() => setActiveTab('landing')}
          />
        </div>

        {/* Backdrop for mobile */}
        {adminSidebarOpen && (
          <div
            onClick={() => setAdminSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-xs"
          />
        )}

        {/* Main Admin Content */}
        <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
          <AdminHeader
            activeTab={adminTab}
            onToggleSidebar={() => setAdminSidebarOpen(!adminSidebarOpen)}
          />

          <main className="flex-1">
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
            {adminTab === 'maggot' && <LogAliranOrganik />}
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

  // Public Views
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
