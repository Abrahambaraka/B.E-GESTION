import React, { useState, useEffect } from 'react';
import { useEvent } from '../../context/EventContext';
import { EventItem, EventType, EventStatus } from '../../types/event';
import { X, Calendar, Edit3, MapPin, Shirt, Clock, DollarSign, Users } from 'lucide-react';

interface EditEventModalProps {
  event: EventItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditEventModal: React.FC<EditEventModalProps> = ({ event, isOpen, onClose }) => {
  const { updateEvent } = useEvent();

  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [type, setType] = useState<EventType>('GALA');
  const [status, setStatus] = useState<EventStatus>('PLANNED');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [vipProtocolLevel, setVipProtocolLevel] = useState<'PRESTIGE' | 'OFFICIAL' | 'STANDARD'>('PRESTIGE');
  const [dressCodeRequired, setDressCodeRequired] = useState('');
  const [requiredLanguagesInput, setRequiredLanguagesInput] = useState('');
  const [guestCount, setGuestCount] = useState<number>(100);
  const [budget, setBudget] = useState<number>(0);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setClientName(event.clientName);
      setType(event.type);
      setStatus(event.status);
      setLocation(event.location);
      setAddress(event.address || '');
      setStartDate(event.startDate);
      setEndDate(event.endDate || event.startDate);
      setStartTime(event.startTime || '18:00');
      setEndTime(event.endTime || '02:00');
      setVipProtocolLevel(event.vipProtocolLevel || 'PRESTIGE');
      setDressCodeRequired(event.dressCodeRequired || '');
      setRequiredLanguagesInput(event.requiredLanguages?.join(', ') || 'FR, EN');
      setGuestCount(event.guestCount || 100);
      setBudget(event.budget || 0);
      setDescription(event.description || '');
    }
  }, [event]);

  if (!isOpen || !event) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !clientName || !location) return;

    const langs = requiredLanguagesInput
      .split(',')
      .map(s => s.trim().toUpperCase())
      .filter(Boolean);

    updateEvent(event.id, {
      title,
      clientName,
      type,
      status,
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

        <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
          <div className="p-2 rounded-md bg-amber-50 text-amber-900 border border-amber-200">
            <Edit3 className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-slate-900">
              Modifier la Réception
            </h3>
            <p className="text-xs text-slate-500">
              Mise à jour des informations, du protocole et des horaires de l'événement.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Intitulé de la Réception *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-hidden text-slate-900 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Client / Commanditaire *</label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-hidden text-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Statut Opérationnel</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as EventStatus)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-hidden text-slate-900 font-bold"
              >
                <option value="PLANNED">📅 Planifié (En préparation)</option>
                <option value="IN_PROGRESS">⚡ Jour J (En cours)</option>
                <option value="COMPLETED">✅ Terminé / Réalisé</option>
                <option value="CANCELLED">❌ Annulé</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Typologie Réception</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as EventType)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-hidden text-slate-900"
              >
                <option value="GALA">Gala Caritatif & Prestige</option>
                <option value="CORPORATE">Gala & Soirée Corporate</option>
                <option value="DIPLOMATIC">Sommet Diplomatique & Officiel</option>
                <option value="WEDDING">Mariage & Réception Privée</option>
                <option value="PRIVATE">Dîner Privé Confidentiel</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Exigence Protocolaire</label>
              <select
                value={vipProtocolLevel}
                onChange={(e) => setVipProtocolLevel(e.target.value as 'PRESTIGE' | 'OFFICIAL' | 'STANDARD')}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-hidden text-slate-900"
              >
                <option value="PRESTIGE">Prestige (VIP & Personnalités)</option>
                <option value="OFFICIAL">Officiel / Ministériel</option>
                <option value="STANDARD">Standard Haute Réception</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Lieu / Salle *</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-hidden text-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Adresse complète</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-hidden text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Date début</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-hidden text-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Date fin</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-hidden text-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Heure début</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-hidden text-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Heure fin</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-hidden text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Invités attendus</label>
              <input
                type="number"
                min="1"
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-hidden text-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Budget prévisionnel (€)</label>
              <input
                type="number"
                min="0"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-hidden text-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Langues requises</label>
              <input
                type="text"
                value={requiredLanguagesInput}
                onChange={(e) => setRequiredLanguagesInput(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-hidden text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Dress Code & Tenues imposées</label>
            <input
              type="text"
              value={dressCodeRequired}
              onChange={(e) => setDressCodeRequired(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-hidden text-slate-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Notes & Consignes Particulières</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-hidden text-slate-900"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-md hover:bg-slate-100 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider rounded-md transition-colors shadow-xs"
            >
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
