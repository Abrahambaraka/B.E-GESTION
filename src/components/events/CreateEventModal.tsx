import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { EventType } from '../../types/event';
import { X, Calendar, Sparkles, MapPin, Shirt, Clock } from 'lucide-react';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose }) => {
  const { addEvent } = useEvent();

  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [type, setType] = useState<EventType>('GALA');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [startDate, setStartDate] = useState('2026-09-15');
  const [endDate, setEndDate] = useState('2026-09-15');
  const [startTime, setStartTime] = useState('18:00');
  const [endTime, setEndTime] = useState('02:00');
  const [vipProtocolLevel, setVipProtocolLevel] = useState<'PRESTIGE' | 'OFFICIAL' | 'STANDARD'>('PRESTIGE');
  const [dressCodeRequired, setDressCodeRequired] = useState('Tailleur Marine & Foulard Soie / Smoking Noir');
  const [requiredLanguagesInput, setRequiredLanguagesInput] = useState('FR, EN');
  const [guestCount, setGuestCount] = useState<number>(200);
  const [budget, setBudget] = useState<number>(45000);
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !clientName || !location) return;

    const langs = requiredLanguagesInput
      .split(',')
      .map(s => s.trim().toUpperCase())
      .filter(Boolean);

    addEvent({
      title,
      clientName,
      type,
      location,
      address,
      startDate,
      endDate,
      startTime,
      endTime,
      vipProtocolLevel,
      dressCodeRequired,
      requiredLanguages: langs.length > 0 ? langs : ['FR', 'EN'],
      guestCount: Number(guestCount) || 100,
      budget: Number(budget) || 0,
      status: 'PLANNED',
      description,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
          <div className="p-2 rounded-md bg-amber-50 text-amber-900 border border-amber-200">
            <Calendar className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-slate-900">
              Création d’un Nouvel Événement
            </h3>
            <p className="text-xs text-slate-500">
              Paramétrage du protocole, des besoins RH et du cahier des charges logistique.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Intitulé de la Réception *</label>
            <input
              type="text"
              required
              placeholder="Ex: Gala de Clôture & Dîner de Prestige CRAA"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Client ou Institution *</label>
              <input
                type="text"
                required
                placeholder="Ex: Ambassade, Entreprise, Maison de Luxe..."
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Typologie d'événement</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as EventType)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900"
              >
                <option value="GALA">Gala & Prestige</option>
                <option value="CORPORATE">Corporate & Séminaire</option>
                <option value="DIPLOMATIC">Protocole Diplomatique</option>
                <option value="WEDDING">Mariage Haut de Gamme</option>
                <option value="PRIVATE">Dîner Privé</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Lieu de la réception *</label>
              <input
                type="text"
                required
                placeholder="Ex: Salons d'Honneur de l'Hôtel de Ville"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Niveau Protocolaire</label>
              <select
                value={vipProtocolLevel}
                onChange={(e) => setVipProtocolLevel(e.target.value as any)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900"
              >
                <option value="PRESTIGE">PRESTIGE (Haute Autorité / Chefs d'État)</option>
                <option value="OFFICIAL">OFFICIAL (Protocole Corporate / Ambassades)</option>
                <option value="STANDARD">STANDARD (Réception Élégante)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Date</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setEndDate(e.target.value);
                }}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900 font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Début</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900 font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Fin</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Dress Code Requis</label>
              <input
                type="text"
                placeholder="Ex: Tailleur Noir / Smoking & Nœud papillon"
                value={dressCodeRequired}
                onChange={(e) => setDressCodeRequired(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Langues requises (ex: FR, EN, ES)</label>
              <input
                type="text"
                placeholder="FR, EN, ES, AR"
                value={requiredLanguagesInput}
                onChange={(e) => setRequiredLanguagesInput(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nombre d'invités attendus</label>
              <input
                type="number"
                min="1"
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Budget Logistique & RH (€)</label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Briefing & Consignes Particulières</label>
            <textarea
              rows={2}
              placeholder="Ex: Placement nominatif très strict, table présidentielle à servir en premier..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-100 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold uppercase tracking-wider rounded-md shadow-xs transition-colors"
            >
              Créer la réception
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

