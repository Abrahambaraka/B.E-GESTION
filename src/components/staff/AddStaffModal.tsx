import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { StaffCategory, Role } from '../../types/event';
import { X, Users, Sparkles, Shirt } from 'lucide-react';

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddStaffModal: React.FC<AddStaffModalProps> = ({ isOpen, onClose }) => {
  const { addStaff } = useEvent();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<Role>('STAFF');
  const [staffCategory, setStaffCategory] = useState<StaffCategory>('HOSTESS');
  const [languagesInput, setLanguagesInput] = useState('FR, EN');
  const [uniformSize, setUniformSize] = useState('38');
  const [heightCm, setHeightCm] = useState<number>(175);
  const [shoesProvidedByAgency, setShoesProvidedByAgency] = useState<boolean>(false);
  const [shoeSize, setShoeSize] = useState<number>(38);
  const [experienceYears, setExperienceYears] = useState<number>(3);
  const [protocolAccreditation, setProtocolAccreditation] = useState<'PRESTIGE' | 'VIP' | 'STANDARD'>('STANDARD');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;

    const languages = languagesInput
      .split(',')
      .map(s => s.trim().toUpperCase())
      .filter(Boolean);

    addStaff({
      fullName,
      email,
      phone,
      role,
      staffCategory,
      languages: languages.length > 0 ? languages : ['FR'],
      uniformSize,
      heightCm: Number(heightCm) || undefined,
      shoeSize: shoesProvidedByAgency ? (Number(shoeSize) || undefined) : undefined,
      shoesProvidedByAgency,
      experienceYears: Number(experienceYears) || 0,
      vipProtocolCertified: protocolAccreditation !== 'STANDARD',
      protocolAccreditation,
      notes,
      status: 'AVAILABLE',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
          <div className="p-2 rounded-md bg-amber-50 text-amber-900 border border-amber-200">
            <Users className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-slate-900">
              Nouveau Collaborateur RH & Protocole
            </h3>
            <p className="text-xs text-slate-500">
              Enregistrement d'un profil hôtesse, maître d'hôtel, serveur ou coordinateur.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nom complet *</label>
              <input
                type="text"
                required
                placeholder="Ex: Hélène de Valois"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Catégorie RH *</label>
              <select
                value={staffCategory}
                onChange={(e) => setStaffCategory(e.target.value as StaffCategory)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900"
              >
                <option value="HOSTESS">Hôtesse d’Accueil VIP</option>
                <option value="SERVER">Chef de Rang / Serveur</option>
                <option value="BUTLER">Maître d’Hôtel & Butler</option>
                <option value="COORDINATOR">Coordinateur Régie & Protocole</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email *</label>
              <input
                type="email"
                required
                placeholder="contact@domaine.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Téléphone</label>
              <input
                type="tel"
                placeholder="+33 6 ..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900"
              />
            </div>
          </div>

          {/* Sizing & Mensurations Section */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-md space-y-2.5">
            <span className="font-bold text-slate-800 flex items-center gap-1">
              <Shirt className="w-3.5 h-3.5 text-amber-600" /> Mensurations & Vestiaire
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-500 text-[11px] mb-0.5">Taille tenue (36-54)</label>
                <input
                  type="text"
                  placeholder="38 ou L"
                  value={uniformSize}
                  onChange={(e) => setUniformSize(e.target.value)}
                  className="w-full p-1.5 border border-slate-200 rounded-md bg-white text-slate-900 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-500 text-[11px] mb-0.5">Stature (cm)</label>
                <input
                  type="number"
                  placeholder="175"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full p-1.5 border border-slate-200 rounded-md bg-white text-slate-900 font-mono"
                />
              </div>
            </div>

            {/* Optional shoe sizing only if agency provides shoes */}
            <div className="pt-2 border-t border-slate-200/60">
              <label className="flex items-center gap-2 cursor-pointer text-[11px] font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={shoesProvidedByAgency}
                  onChange={(e) => setShoesProvidedByAgency(e.target.checked)}
                  className="rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                />
                <span>L'agence fournit les chaussures d'apparat (escarpins hôtesses / richelieus service)</span>
              </label>

              {shoesProvidedByAgency ? (
                <div className="mt-2 pl-5 max-w-xs animate-in fade-in duration-150">
                  <label className="block text-slate-600 text-[11px] mb-0.5 font-semibold">
                    Pointure requise (36-46)
                  </label>
                  <input
                    type="number"
                    min="34"
                    max="48"
                    placeholder="Ex: 38"
                    value={shoeSize || ''}
                    onChange={(e) => setShoeSize(Number(e.target.value))}
                    className="w-full p-1.5 border border-slate-200 rounded-md bg-white text-slate-900 font-mono"
                  />
                </div>
              ) : (
                <p className="text-[10px] text-slate-400 pl-5 mt-0.5 italic">
                  Chaussures personnelles soignées portées par le collaborateur (formulaire allégé).
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Langues (ex: FR, EN, AR, ES)</label>
              <input
                type="text"
                placeholder="FR, EN, ES"
                value={languagesInput}
                onChange={(e) => setLanguagesInput(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Années d'expérience</label>
              <input
                type="number"
                min="0"
                max="30"
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Niveau d'Accréditation Protocolaire</label>
            <select
              value={protocolAccreditation}
              onChange={(e) => setProtocolAccreditation(e.target.value as any)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900 font-medium"
            >
              <option value="STANDARD">Personnel Standard Extra (Qualifié - Pas de badge VIP)</option>
              <option value="VIP">⭐ Accrédité VIP (Réceptions Officielles & Ambassades)</option>
              <option value="PRESTIGE">👑 Prestige Protocol (Sommets & Dignitaires d'État)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Observations & Spécificités</label>
            <textarea
              rows={2}
              placeholder="Ex: Formé au service d'argent, habitué aux délégations diplomatiques..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-100 font-bold uppercase tracking-wider text-xs transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold uppercase tracking-wider rounded-md shadow-xs transition-colors"
            >
              Enregistrer le profil
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

