import React from 'react';
import { X, Shirt } from 'lucide-react';
import { UniformBatchForm } from './UniformBatchForm';

interface UniformBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultModelName?: string;
}

export const UniformBatchModal: React.FC<UniformBatchModalProps> = ({
  isOpen,
  onClose,
  defaultModelName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-xl max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/80 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-purple-600 text-white shadow-xs">
              <Shirt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-serif font-bold text-slate-900">
                  Enregistrement d'Uniformes par Tailles & Mensurations
                </h3>
                <span className="hidden sm:inline px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-900 border border-purple-200">
                  Saisie groupée
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Réceptionnez ou confectionnez un modèle de tenue et ventilez instantanément les stocks par taille.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <UniformBatchForm 
            defaultModelName={defaultModelName}
            onCancel={onClose}
            onSuccess={() => {
              setTimeout(() => {
                onClose();
              }, 1200);
            }}
          />
        </div>
      </div>
    </div>
  );
};
