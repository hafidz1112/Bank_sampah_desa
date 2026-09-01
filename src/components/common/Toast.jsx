import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useBankSampah } from '../../context/BankSampahContext';

export const Toast = () => {
  const { toast, showToast } = useBankSampah();
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  };

  const bgStyles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in max-w-md shadow-xl">
      <div className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border ${bgStyles[toast.type] || bgStyles.info} backdrop-blur-md`}>
        <div className="flex-shrink-0">{icons[toast.type] || icons.info}</div>
        <p className="text-sm font-medium pr-2">{toast.message}</p>
        <button
          onClick={() => showToast(null)}
          className="ml-auto p-1 rounded-lg hover:bg-black/5 transition"
        >
          <X className="w-4 h-4 opacity-70" />
        </button>
      </div>
    </div>
  );
};
