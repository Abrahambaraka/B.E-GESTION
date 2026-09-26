import React, { useState, useEffect } from 'react';
import { useEvent } from '../../context/EventContext';
import { 
  EventItem, 
  EventType, 
  EventStatus, 
  TableItem, 
  GuestItem, 
  EventHostess, 
  CatererServer, 
  BeverageItem, 
  BeverageCategory,
  HonoredCouple 
} from '../../types/event';
import { 
  X, 
  Calendar, 
  Edit3, 
  MapPin, 
  Clock, 
  Users, 
  Wine, 
  UtensilsCrossed, 
  Heart, 
  Grid, 
  UserCheck, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Info 
} from 'lucide-react';

interface EditEventModalProps {
  event: EventItem | null;
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'GENERAL' | 'COUPLE_GUESTS' | 'TABLES' | 'HOSTESSES' | 'CATERER' | 'BEVERAGES';

export const EditEventModal: React.FC<EditEventModalProps> = ({ event, isOpen, onClose }) => {
  const { updateEvent, staffList } = useEvent();

  const [activeTab, setActiveTab] = useState<TabType>('GENERAL');

  // Tab 1: General Info
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

  // Tab 2: Couple & Guests
  const [hasCouple, setHasCouple] = useState<boolean>(false);
  const [partner1, setPartner1] = useState('');
  const [partner2, setPartner2] = useState('');
  const [coupleTitle, setCoupleTitle] = useState('');
  const [coupleNotes, setCoupleNotes] = useState('');
  const [guests, setGuests] = useState<GuestItem[]>([]);

  // Guest inputs
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestCategory, setNewGuestCategory] = useState<GuestItem['category']>('VIP');
  const [newGuestTable, setNewGuestTable] = useState("Table d'Honneur");
  const [newGuestDiet, setNewGuestDiet] = useState('Standard');

  // Tab 3: Tables
  const [tables, setTables] = useState<TableItem[]>([]);
  const [newTableName, setNewTableName] = useState('');
  const [newTableCapacity, setNewTableCapacity] = useState<number>(10);
  const [newTableShape, setNewTableShape] = useState<TableItem['shape']>('ROUND');
  const [newTableZone, setNewTableZone] = useState('');
  const [newTableServer, setNewTableServer] = useState('');

  // Tab 4: Hostesses
  const [hostesses, setHostesses] = useState<EventHostess[]>([]);
  const [selectedStaffHostessId, setSelectedStaffHostessId] = useState('');
  const [customHostessName, setCustomHostessName] = useState('');
  const [hostessPhone, setHostessPhone] = useState('');
  const [hostessPost, setHostessPost] = useState('Accueil VIP & Placement');
  const [hostessUniform, setHostessUniform] = useState('Tailleur Signature Bleu Nuit');
  const [hostessShift, setHostessShift] = useState('16:00 - 01:00');

  // Tab 5: Caterer
  const [catererCompanyName, setCatererCompanyName] = useState('');
  const [catererHeadButler, setCatererHeadButler] = useState('');
  const [catererNotes, setCatererNotes] = useState('');
  const [catererServers, setCatererServers] = useState<CatererServer[]>([]);
  const [selectedStaffServerId, setSelectedStaffServerId] = useState('');
  const [customServerName, setCustomServerName] = useState('');
  const [serverPhone, setServerPhone] = useState('');
  const [serverRole, setServerRole] = useState('Chef de Rang');
  const [serverZone, setServerZone] = useState('Tables Principales');
  const [serverShift, setServerShift] = useState('16:00 - 02:00');

  // Tab 6: Beverages
  const [beverages, setBeverages] = useState<BeverageItem[]>([]);
  const [bevName, setBevName] = useState('');
  const [bevCategory, setBevCategory] = useState<BeverageCategory>('CHAMPAGNE');
  const [bevQty, setBevQty] = useState<number>(60);
  const [bevUnit, setBevUnit] = useState('Bouteilles (75cl)');
  const [bevTemp, setBevTemp] = useState('Servir frais à 7°C');
  const [bevZone, setBevZone] = useState('Bar Principal & Dîner');

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

      // Extended fields
      if (event.couple) {
        setHasCouple(true);
        setPartner1(event.couple.partner1 || '');
        setPartner2(event.couple.partner2 || '');
        setCoupleTitle(event.couple.title || 'Couple d’Honneur');
        setCoupleNotes(event.couple.notes || '');
      } else {
        setHasCouple(false);
        setPartner1('');
        setPartner2('');
        setCoupleTitle('Les Mariés');
        setCoupleNotes('');
      }

      setGuests(event.guests || []);
      setTables(event.tables || []);
      setHostesses(event.hostesses || []);
      setCatererServers(event.catererServers || []);
      setCatererCompanyName(event.catererCompanyName || '');
      setCatererHeadButler(event.catererHeadButler || '');
      setCatererNotes(event.catererNotes || '');
      setBeverages(event.beverages || []);
    }
  }, [event]);

  if (!isOpen || !event) return null;

  // Add handlers
  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;
    setGuests(prev => [
      ...prev,
      {
        id: `gst-${Date.now()}`,
        fullName: newGuestName.trim(),
        category: newGuestCategory,
        assignedTableName: newGuestTable,
        dietaryRequirements: newGuestDiet,
        status: 'CONFIRMED'
      }
    ]);
    setNewGuestName('');
  };

  const handleAddTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableName.trim()) return;
    setTables(prev => [
      ...prev,
      {
        id: `tbl-${Date.now()}`,
        name: newTableName.trim(),
        capacity: Number(newTableCapacity) || 10,
        shape: newTableShape,
        locationZone: newTableZone,
        assignedServerName: newTableServer
      }
    ]);
    setNewTableName('');
    setNewTableZone('');
    setNewTableServer('');
  };

  const handleAddHostess = (e: React.FormEvent) => {
    e.preventDefault();
    let name = customHostessName.trim();
    let staffId: string | undefined = undefined;
    let phone = hostessPhone.trim();

    if (selectedStaffHostessId) {
      const match = staffList.find(s => s.id === selectedStaffHostessId);
      if (match) {
        name = match.fullName;
        staffId = match.id;
        phone = match.phone;
      }
    }

    if (!name) return;

    setHostesses(prev => [
      ...prev,
      {
        id: `hst-${Date.now()}`,
        staffId,
        fullName: name,
        phone,
        assignedPost: hostessPost,
        uniformInfo: hostessUniform,
        shiftTime: hostessShift,
        status: 'CONFIRMED',
        languages: ['FR', 'EN']
      }
    ]);

    setSelectedStaffHostessId('');
    setCustomHostessName('');
    setHostessPhone('');
  };

  const handleAddServer = (e: React.FormEvent) => {
    e.preventDefault();
    let name = customServerName.trim();
    let staffId: string | undefined = undefined;
    let phone = serverPhone.trim();

    if (selectedStaffServerId) {
      const match = staffList.find(s => s.id === selectedStaffServerId);
      if (match) {
        name = match.fullName;
        staffId = match.id;
        phone = match.phone;
      }
    }

    if (!name) return;

    setCatererServers(prev => [
      ...prev,
      {
        id: `srv-${Date.now()}`,
        staffId,
        fullName: name,
        phone,
        role: serverRole,
        assignedZone: serverZone,
        shiftTime: serverShift,
        catererCompany: catererCompanyName,
        status: 'CONFIRMED'
      }
    ]);

    setSelectedStaffServerId('');
    setCustomServerName('');
    setServerPhone('');
  };

  const handleAddBeverage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bevName.trim()) return;
    setBeverages(prev => [
      ...prev,
      {
        id: `bev-${Date.now()}`,
        name: bevName.trim(),
        category: bevCategory,
        quantityOrdered: Number(bevQty) || 1,
        unit: bevUnit,
        temperatureOrService: bevTemp,
        allocatedBarOrZone: bevZone
      }
    ]);
    setBevName('');
  };

  const totalSeats = tables.reduce((acc, t) => acc + (t.capacity || 0), 0);
  const totalBottles = beverages.reduce((acc, b) => acc + (b.quantityOrdered || 0), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !clientName || !location) return;

    const langs = requiredLanguagesInput
      .split(',')
      .map(s => s.trim().toUpperCase())
      .filter(Boolean);

    const coupleData: HonoredCouple | undefined = hasCouple && (partner1 || partner2) ? {
      partner1,
      partner2,
      title: coupleTitle,
      notes: coupleNotes
    } : undefined;

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
      couple: coupleData,
      guests,
      tables,
      hostesses,
      catererServers,
      catererCompanyName,
      catererHeadButler,
      catererNotes,
      beverages,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Edit3 className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-serif tracking-wide text-white">
                Modifier la Réception : {event.title}
              </h2>
              <p className="text-xs text-slate-300">
                Mise à jour des informations, des tables, du couple & invités, des hôtesses, serveurs et boissons.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 flex items-center gap-1 overflow-x-auto shrink-0 scrollbar-none py-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('GENERAL')}
            className={`px-3 py-2 rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'GENERAL' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            1. Général & Statut
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('COUPLE_GUESTS')}
            className={`px-3 py-2 rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'COUPLE_GUESTS' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            2. Couple & Invités ({guests.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('TABLES')}
            className={`px-3 py-2 rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'TABLES' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Grid className="w-3.5 h-3.5 text-indigo-500" />
            3. Plan de Tables ({tables.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('HOSTESSES')}
            className={`px-3 py-2 rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'HOSTESSES' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-500" />
            4. Hôtesses ({hostesses.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('CATERER')}
            className={`px-3 py-2 rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'CATERER' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5 text-emerald-600" />
            5. Traiteur & Serveurs ({catererServers.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('BEVERAGES')}
            className={`px-3 py-2 rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'BEVERAGES' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Wine className="w-3.5 h-3.5 text-purple-600" />
            6. Boissons & Bar ({beverages.length})
          </button>
        </div>

        {/* Tab Panes */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          
          {/* TAB 1: GENERAL */}
          {activeTab === 'GENERAL' && (
            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Intitulé de la Réception *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900 font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Client ou Commanditaire *</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Statut Opérationnel</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as EventStatus)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900 font-bold"
                  >
                    <option value="PLANNED">📅 Planifié (En préparation)</option>
                    <option value="IN_PROGRESS">⚡ Jour J (En cours)</option>
                    <option value="COMPLETED">✅ Terminé / Réalisé</option>
                    <option value="CANCELLED">❌ Annulé</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Typologie</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as EventType)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900 font-semibold"
                  >
                    <option value="WEDDING">💍 Mariage & Célébration</option>
                    <option value="GALA">✨ Gala & Prestige</option>
                    <option value="DIPLOMATIC">🏛️ Diplomatique & Sommet</option>
                    <option value="CORPORATE">🏢 Corporate & Congrès</option>
                    <option value="PRIVATE">🥂 Dîner Privé Confidentiel</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lieu *</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Adresse Complète</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Heure de Début</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Heure de Fin</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nombre d'Invités Attendus</label>
                  <input
                    type="number"
                    min="1"
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Niveau Protocolaire</label>
                  <select
                    value={vipProtocolLevel}
                    onChange={(e) => setVipProtocolLevel(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900 font-semibold"
                  >
                    <option value="PRESTIGE">PRESTIGE (Très Haute Exigence)</option>
                    <option value="OFFICIAL">OFFICIAL (Protocole Diplomatique)</option>
                    <option value="STANDARD">STANDARD (Élégant & Soigné)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Budget Logistique & RH (€)</label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Briefing Général & Note Protocolaire</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900"
                />
              </div>
            </div>
          )}

          {/* TAB 2: COUPLE & GUESTS */}
          {activeTab === 'COUPLE_GUESTS' && (
            <div className="space-y-4">
              <div className="p-4 bg-rose-50/60 border border-rose-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-950 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                    <Heart className="w-4 h-4 text-rose-600" /> Couple à l'Honneur ou Hôtes Célébrés
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasCouple}
                      onChange={(e) => setHasCouple(e.target.checked)}
                      className="rounded text-rose-600 focus:ring-rose-500"
                    />
                    <span className="text-slate-700 font-medium">Activer la fiche couple / hôtes</span>
                  </label>
                </div>

                {hasCouple && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Conjoint 1 / Hôte 1</label>
                      <input
                        type="text"
                        value={partner1}
                        onChange={(e) => setPartner1(e.target.value)}
                        className="w-full p-2 bg-white border border-rose-200 rounded-md focus:ring-1 focus:ring-rose-500 focus:outline-none text-slate-900 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Conjoint 2 / Hôte 2</label>
                      <input
                        type="text"
                        value={partner2}
                        onChange={(e) => setPartner2(e.target.value)}
                        className="w-full p-2 bg-white border border-rose-200 rounded-md focus:ring-1 focus:ring-rose-500 focus:outline-none text-slate-900 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Titre Protocolaire</label>
                      <input
                        type="text"
                        value={coupleTitle}
                        onChange={(e) => setCoupleTitle(e.target.value)}
                        className="w-full p-2 bg-white border border-rose-200 rounded-md focus:ring-1 focus:ring-rose-500 focus:outline-none text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Consignes d'Arrivée</label>
                      <input
                        type="text"
                        value={coupleNotes}
                        onChange={(e) => setCoupleNotes(e.target.value)}
                        className="w-full p-2 bg-white border border-rose-200 rounded-md focus:ring-1 focus:ring-rose-500 focus:outline-none text-slate-900"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Add & List Guests */}
              <div className="space-y-3">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                  Liste des Invités Clés ({guests.length})
                </span>

                <form onSubmit={handleAddGuest} className="p-3 bg-slate-50 border border-slate-200 rounded-lg grid grid-cols-1 sm:grid-cols-5 gap-2">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Nom & Prénom de l'invité..."
                      value={newGuestName}
                      onChange={(e) => setNewGuestName(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900"
                    />
                  </div>
                  <div>
                    <select
                      value={newGuestCategory}
                      onChange={(e) => setNewGuestCategory(e.target.value as any)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900"
                    >
                      <option value="HONOR">Honneur</option>
                      <option value="VIP">VIP Privilégié</option>
                      <option value="FAMILY">Famille</option>
                      <option value="OFFICIAL">Officiel</option>
                      <option value="CHILD">Enfant</option>
                      <option value="GENERAL">Général</option>
                    </select>
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Table..."
                      value={newGuestTable}
                      onChange={(e) => setNewGuestTable(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900"
                    />
                  </div>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="Régime..."
                      value={newGuestDiet}
                      onChange={(e) => setNewGuestDiet(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900"
                    />
                    <button
                      type="submit"
                      className="px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-md flex items-center justify-center font-bold"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </form>

                <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-100 text-[10px] uppercase font-bold text-slate-600 sticky top-0">
                      <tr>
                        <th className="p-2">Nom & Prénom</th>
                        <th className="p-2">Catégorie</th>
                        <th className="p-2">Table</th>
                        <th className="p-2">Régime</th>
                        <th className="p-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {guests.map((g) => (
                        <tr key={g.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-2 font-medium text-slate-900">{g.fullName}</td>
                          <td className="p-2">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                              {g.category || 'VIP'}
                            </span>
                          </td>
                          <td className="p-2 text-slate-700 font-semibold">{g.assignedTableName || 'Non assigné'}</td>
                          <td className="p-2 text-slate-500">{g.dietaryRequirements || 'Standard'}</td>
                          <td className="p-2 text-right">
                            <button
                              type="button"
                              onClick={() => setGuests(prev => prev.filter(x => x.id !== g.id))}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TABLES */}
          {activeTab === 'TABLES' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl">
                <div>
                  <span className="font-bold text-indigo-950 uppercase tracking-wider text-[11px] block">
                    Configuration des Tables & Capacité Assise
                  </span>
                  <span className="text-slate-600 text-[11px]">
                    Total : <strong>{totalSeats} places assises</strong> sur <strong>{tables.length} tables</strong>.
                  </span>
                </div>
              </div>

              {/* Add Table Form */}
              <form onSubmit={handleAddTable} className="p-3 bg-slate-50 border border-slate-200 rounded-lg grid grid-cols-1 sm:grid-cols-5 gap-2">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Nom de Table</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Table d'Honneur, Table 1..."
                    value={newTableName}
                    onChange={(e) => setNewTableName(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:outline-none text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Nombre de Places</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newTableCapacity}
                    onChange={(e) => setNewTableCapacity(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:outline-none text-slate-900 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Forme</label>
                  <select
                    value={newTableShape}
                    onChange={(e) => setNewTableShape(e.target.value as any)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:outline-none text-slate-900"
                  >
                    <option value="ROUND">Ronde</option>
                    <option value="HONOR_U">En U / Honneur</option>
                    <option value="RECTANGULAR">Rectangulaire</option>
                    <option value="HIGH_TOP">Mange-debout</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Serveur Affecté</label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="Serveur..."
                      value={newTableServer}
                      onChange={(e) => setNewTableServer(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:outline-none text-slate-900"
                    />
                    <button
                      type="submit"
                      className="px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center justify-center font-bold"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </form>

              {/* Grid of Tables */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-56 overflow-y-auto">
                {tables.map((t) => (
                  <div key={t.id} className="p-3 bg-white border border-slate-200 rounded-lg shadow-2xs relative flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <span className="font-bold text-slate-900 text-xs">{t.name}</span>
                        <button
                          type="button"
                          onClick={() => setTables(prev => prev.filter(x => x.id !== t.id))}
                          className="text-slate-400 hover:text-rose-600 p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-bold rounded text-[11px] border border-indigo-200">
                          {t.capacity} places
                        </span>
                        <span className="text-[10px] text-slate-500">{t.shape}</span>
                      </div>
                    </div>
                    {t.assignedServerName && (
                      <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-600">
                        Serveur : <strong>{t.assignedServerName}</strong>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: HOSTESSES */}
          {activeTab === 'HOSTESSES' && (
            <div className="space-y-4">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                Équipe des Hôtesses d'Accueil ({hostesses.length})
              </span>

              {/* Add Hostess Form */}
              <form onSubmit={handleAddHostess} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Depuis l'annuaire</label>
                    <select
                      value={selectedStaffHostessId}
                      onChange={(e) => {
                        setSelectedStaffHostessId(e.target.value);
                        if (e.target.value) setCustomHostessName('');
                      }}
                      className="w-full p-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900"
                    >
                      <option value="">-- Choisir hôtesse existante --</option>
                      {staffList.filter(s => s.staffCategory === 'HOSTESS' || s.role === 'STAFF').map(s => (
                        <option key={s.id} value={s.id}>{s.fullName} ({s.languages.join('/')})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">OU Nom libre</label>
                    <input
                      type="text"
                      placeholder="Prénom & Nom..."
                      value={customHostessName}
                      disabled={!!selectedStaffHostessId}
                      onChange={(e) => setCustomHostessName(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900 disabled:bg-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Poste / Rôle *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Accueil VIP, Tapis Rouge..."
                      value={hostessPost}
                      onChange={(e) => setHostessPost(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Tenue / Uniforme</label>
                    <input
                      type="text"
                      value={hostessUniform}
                      onChange={(e) => setHostessUniform(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Horaires</label>
                    <input
                      type="text"
                      value={hostessShift}
                      onChange={(e) => setHostessShift(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900 font-mono"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md font-bold uppercase tracking-wider text-[11px] flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Affecter Hôtesse
                    </button>
                  </div>
                </div>
              </form>

              {/* Hostesses Table */}
              <div className="border border-slate-200 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-100 text-[10px] uppercase font-bold text-slate-600 sticky top-0">
                    <tr>
                      <th className="p-2">Hôtesse</th>
                      <th className="p-2">Poste Assigné</th>
                      <th className="p-2">Tenue</th>
                      <th className="p-2">Horaires</th>
                      <th className="p-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {hostesses.map((h) => (
                      <tr key={h.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-2 font-bold text-slate-900">{h.fullName}</td>
                        <td className="p-2 text-slate-700 font-semibold">{h.assignedPost}</td>
                        <td className="p-2 text-slate-500">{h.uniformInfo || 'Non spécifié'}</td>
                        <td className="p-2 font-mono text-slate-600">{h.shiftTime || 'Journée'}</td>
                        <td className="p-2 text-right">
                          <button
                            type="button"
                            onClick={() => setHostesses(prev => prev.filter(x => x.id !== h.id))}
                            className="text-slate-400 hover:text-rose-600 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: CATERER */}
          {activeTab === 'CATERER' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-3">
                <span className="font-bold text-emerald-950 uppercase tracking-wider text-[11px] block">
                  Prestataire Traiteur & Maître d'Hôtel
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Maison Traiteur</label>
                    <input
                      type="text"
                      value={catererCompanyName}
                      onChange={(e) => setCatererCompanyName(e.target.value)}
                      className="w-full p-2 bg-white border border-emerald-200 rounded-md focus:ring-1 focus:ring-emerald-500 focus:outline-none text-slate-900 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Maître d'Hôtel Responsable</label>
                    <input
                      type="text"
                      value={catererHeadButler}
                      onChange={(e) => setCatererHeadButler(e.target.value)}
                      className="w-full p-2 bg-white border border-emerald-200 rounded-md focus:ring-1 focus:ring-emerald-500 focus:outline-none text-slate-900 font-medium"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Consignes Traiteur</label>
                    <input
                      type="text"
                      value={catererNotes}
                      onChange={(e) => setCatererNotes(e.target.value)}
                      className="w-full p-2 bg-white border border-emerald-200 rounded-md focus:ring-1 focus:ring-emerald-500 focus:outline-none text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Add & List Servers */}
              <div className="space-y-2">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                  Brigade des Serveurs ({catererServers.length})
                </span>

                <form onSubmit={handleAddServer} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Depuis l'annuaire</label>
                      <select
                        value={selectedStaffServerId}
                        onChange={(e) => {
                          setSelectedStaffServerId(e.target.value);
                          if (e.target.value) setCustomServerName('');
                        }}
                        className="w-full p-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-emerald-500 focus:outline-none text-slate-900"
                      >
                        <option value="">-- Choisir serveur existant --</option>
                        {staffList.filter(s => s.staffCategory === 'SERVER' || s.staffCategory === 'BUTLER').map(s => (
                          <option key={s.id} value={s.id}>{s.fullName} ({s.staffCategory})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">OU Nom libre</label>
                      <input
                        type="text"
                        placeholder="Prénom & Nom..."
                        value={customServerName}
                        disabled={!!selectedStaffServerId}
                        onChange={(e) => setCustomServerName(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-emerald-500 focus:outline-none text-slate-900 disabled:bg-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Rôle</label>
                      <select
                        value={serverRole}
                        onChange={(e) => setServerRole(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-emerald-500 focus:outline-none text-slate-900 font-semibold"
                      >
                        <option value="Maître d'Hôtel">Maître d'Hôtel</option>
                        <option value="Chef de Rang">Chef de Rang</option>
                        <option value="Sommelier / Service Vins">Sommelier / Service Vins</option>
                        <option value="Barman & Mixologue">Barman & Mixologue</option>
                        <option value="Serveur Cocktail">Serveur Cocktail</option>
                        <option value="Commis de Débarrassage">Commis de Débarrassage</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Zone Assignée</label>
                      <input
                        type="text"
                        required
                        value={serverZone}
                        onChange={(e) => setServerZone(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-emerald-500 focus:outline-none text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Horaires</label>
                      <input
                        type="text"
                        value={serverShift}
                        onChange={(e) => setServerShift(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-emerald-500 focus:outline-none text-slate-900 font-mono"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="submit"
                        className="w-full p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-bold uppercase tracking-wider text-[11px] flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                      >
                        <Plus className="w-4 h-4" /> Ajouter Serveur
                      </button>
                    </div>
                  </div>
                </form>

                <div className="border border-slate-200 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-100 text-[10px] uppercase font-bold text-slate-600 sticky top-0">
                      <tr>
                        <th className="p-2">Serveur</th>
                        <th className="p-2">Rôle</th>
                        <th className="p-2">Zone & Tables</th>
                        <th className="p-2">Horaires</th>
                        <th className="p-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {catererServers.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-2 font-bold text-slate-900">{s.fullName}</td>
                          <td className="p-2">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900">
                              {s.role}
                            </span>
                          </td>
                          <td className="p-2 text-slate-700 font-medium">{s.assignedZone}</td>
                          <td className="p-2 font-mono text-slate-500">{s.shiftTime || 'Soirée'}</td>
                          <td className="p-2 text-right">
                            <button
                              type="button"
                              onClick={() => setCatererServers(prev => prev.filter(x => x.id !== s.id))}
                              className="text-slate-400 hover:text-rose-600 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: BEVERAGES */}
          {activeTab === 'BEVERAGES' && (
            <div className="space-y-4">
              <span className="font-bold text-purple-950 uppercase tracking-wider text-[11px] block">
                Cave & Boissons de Réception ({beverages.length} références)
              </span>

              {/* Add Beverage Form */}
              <form onSubmit={handleAddBeverage} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Désignation</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Champagne Ruinart..."
                      value={bevName}
                      onChange={(e) => setBevName(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-purple-500 focus:outline-none text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Catégorie</label>
                    <select
                      value={bevCategory}
                      onChange={(e) => setBevCategory(e.target.value as BeverageCategory)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-purple-500 focus:outline-none text-slate-900 font-semibold"
                    >
                      <option value="CHAMPAGNE">🍾 Champagne</option>
                      <option value="WINE_RED">🍷 Vin Rouge</option>
                      <option value="WINE_WHITE">🥂 Vin Blanc</option>
                      <option value="WINE_ROSE">🌸 Vin Rosé</option>
                      <option value="COCKTAIL">🍹 Cocktail Signature</option>
                      <option value="SOFT_WATER">💧 Eaux & Softs</option>
                      <option value="SPIRITS">🥃 Spiritueux & Digestifs</option>
                      <option value="BEER">🍺 Bière Prestige</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Quantité</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={bevQty}
                      onChange={(e) => setBevQty(Number(e.target.value))}
                      className="w-full p-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-purple-500 focus:outline-none text-slate-900 font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Unité</label>
                    <input
                      type="text"
                      value={bevUnit}
                      onChange={(e) => setBevUnit(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-purple-500 focus:outline-none text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Service & Température</label>
                    <input
                      type="text"
                      value={bevTemp}
                      onChange={(e) => setBevTemp(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-purple-500 focus:outline-none text-slate-900"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-bold uppercase tracking-wider text-[11px] flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Ajouter Boisson
                    </button>
                  </div>
                </div>
              </form>

              {/* Beverages Table */}
              <div className="border border-slate-200 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-100 text-[10px] uppercase font-bold text-slate-600 sticky top-0">
                    <tr>
                      <th className="p-2">Boisson</th>
                      <th className="p-2">Catégorie</th>
                      <th className="p-2">Stock Prévu</th>
                      <th className="p-2">Consigne Température</th>
                      <th className="p-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {beverages.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-2 font-bold text-slate-900">{b.name}</td>
                        <td className="p-2">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-900">
                            {b.category}
                          </span>
                        </td>
                        <td className="p-2 font-mono font-bold text-slate-800">
                          {b.quantityOrdered} {b.unit}
                        </td>
                        <td className="p-2 text-slate-500">{b.temperatureOrService || 'Normal'}</td>
                        <td className="p-2 text-right">
                          <button
                            type="button"
                            onClick={() => setBeverages(prev => prev.filter(x => x.id !== b.id))}
                            className="text-slate-400 hover:text-rose-600 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 text-slate-500 text-[11px]">
            <span>{tables.length} tables ({totalSeats} pl.)</span>
            <span>•</span>
            <span>{hostesses.length} hôtesses</span>
            <span>•</span>
            <span>{catererServers.length} serveurs</span>
            <span>•</span>
            <span>{beverages.length} boissons</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Enregistrer les Modifications</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
