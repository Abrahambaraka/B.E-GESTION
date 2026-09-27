import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { 
  EventType, 
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
  Sparkles, 
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
  ShieldCheck, 
  Info,
  CheckCircle2,
  DollarSign,
  Layers,
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { checkStaffConflict } from '../../utils/conflictUtils';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'GENERAL' | 'COUPLE_GUESTS' | 'TABLES' | 'HOSTESSES' | 'CATERER' | 'BEVERAGES';

export const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose }) => {
  const { addEvent, staffList, events } = useEvent();

  const [activeTab, setActiveTab] = useState<TabType>('GENERAL');

  // Tab 1: General Info
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [type, setType] = useState<EventType>('WEDDING');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [startDate, setStartDate] = useState('2026-09-20');
  const [endDate, setEndDate] = useState('2026-09-20');
  const [startTime, setStartTime] = useState('16:00');
  const [endTime, setEndTime] = useState('04:00');
  const [vipProtocolLevel, setVipProtocolLevel] = useState<'PRESTIGE' | 'OFFICIAL' | 'STANDARD'>('PRESTIGE');
  const [dressCodeRequired, setDressCodeRequired] = useState('Tenue de Cérémonie Chic / Smoking & Nœud Papillon');
  const [requiredLanguagesInput, setRequiredLanguagesInput] = useState('FR, EN');
  const [guestCount, setGuestCount] = useState<number>(180);
  const [budget, setBudget] = useState<number>(45000);
  const [description, setDescription] = useState('');

  // Tab 2: Honored Couple & Guests
  const [hasCouple, setHasCouple] = useState<boolean>(true);
  const [partner1, setPartner1] = useState('Alexandre de Montmirail');
  const [partner2, setPartner2] = useState('Inès Baraka');
  const [coupleTitle, setCoupleTitle] = useState('Les Mariés d’Honneur');
  const [coupleNotes, setCoupleNotes] = useState('Entrée d’honneur sous les applaudissements à 17h00');

  const [guests, setGuests] = useState<GuestItem[]>([
    { id: 'g-init-1', fullName: 'Alexandre de Montmirail', category: 'HONOR', assignedTableName: "Table d'Honneur", seatNumber: 1, dietaryRequirements: 'Standard', status: 'CONFIRMED' },
    { id: 'g-init-2', fullName: 'Inès Baraka', category: 'HONOR', assignedTableName: "Table d'Honneur", seatNumber: 2, dietaryRequirements: 'Sans gluten & Halal', status: 'CONFIRMED' },
    { id: 'g-init-3', fullName: 'Comte Godefroy de Montmirail', category: 'FAMILY', assignedTableName: "Table d'Honneur", seatNumber: 3, dietaryRequirements: 'Standard', status: 'CONFIRMED' },
    { id: 'g-init-4', fullName: 'Mme Leila Baraka', category: 'FAMILY', assignedTableName: "Table d'Honneur", seatNumber: 4, dietaryRequirements: 'Halal', status: 'CONFIRMED' },
    { id: 'g-init-5', fullName: 'Guillaume de Valmont (Témoin)', category: 'VIP', assignedTableName: "Table 1 - Diamant", seatNumber: 1, dietaryRequirements: 'Standard', status: 'CONFIRMED' },
    { id: 'g-init-6', fullName: 'Camille d’Argenson (Témoin)', category: 'VIP', assignedTableName: "Table 1 - Diamant", seatNumber: 2, dietaryRequirements: 'Végétarien', status: 'CONFIRMED' },
  ]);

  // Guest inputs
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestCategory, setNewGuestCategory] = useState<GuestItem['category']>('VIP');
  const [newGuestTable, setNewGuestTable] = useState("Table d'Honneur");
  const [newGuestDiet, setNewGuestDiet] = useState('Standard');

  // Tab 3: Tables
  const [tables, setTables] = useState<TableItem[]>([
    { id: 't-init-1', name: "Table d'Honneur - Versailles", capacity: 12, shape: 'HONOR_U', assignedServerName: "Alexandre Mercier (Maître d'Hôtel)", locationZone: "Scène Centrale Face aux Jardins" },
    { id: 't-init-2', name: "Table 1 - Diamant", capacity: 10, shape: 'ROUND', assignedServerName: "Julien Roussel (Chef de Rang)", locationZone: "Premier rang côté marié" },
    { id: 't-init-3', name: "Table 2 - Émeraude", capacity: 10, shape: 'ROUND', assignedServerName: "Julien Roussel (Chef de Rang)", locationZone: "Premier rang côté mariée" },
    { id: 't-init-4', name: "Table 3 - Saphir Impérial", capacity: 10, shape: 'ROUND', assignedServerName: "Thomas Leroy (Serveur)", locationZone: "Centre nef" },
    { id: 't-init-5', name: "Table 4 - Rubis Étoilé", capacity: 10, shape: 'ROUND', assignedServerName: "Thomas Leroy (Serveur)", locationZone: "Centre nef aile gauche" },
    { id: 't-init-6', name: "Table 5 - Les Petits Princes (Enfants)", capacity: 12, shape: 'RECTANGULAR', assignedServerName: "Service Dédié Enfants", locationZone: "Espace salon contigu" },
  ]);

  // Table inputs
  const [newTableName, setNewTableName] = useState('');
  const [newTableCapacity, setNewTableCapacity] = useState<number>(10);
  const [newTableShape, setNewTableShape] = useState<TableItem['shape']>('ROUND');
  const [newTableZone, setNewTableZone] = useState('');
  const [newTableServer, setNewTableServer] = useState('');

  // Tab 4: Hostesses
  const [hostesses, setHostesses] = useState<EventHostess[]>([
    { id: 'h-init-1', staffId: 'usr-1', fullName: 'Charlotte Dubois', phone: '+33 6 12 34 56 78', assignedPost: 'Accueil VIP & Tapis Rouge', uniformInfo: 'Tailleur Marine Signature T.36 + Foulard', languages: ['FR', 'EN', 'ES'], status: 'CONFIRMED', shiftTime: '15:30 - 23:30' },
    { id: 'h-init-2', staffId: 'usr-3', fullName: 'Inaya Benali', phone: '+33 6 45 67 89 01', assignedPost: 'Émargement & Remise des Pochettes Cadeaux', uniformInfo: 'Tailleur Marine Signature T.38 + Foulard', languages: ['FR', 'EN', 'AR'], status: 'CONFIRMED', shiftTime: '15:30 - 23:30' },
    { id: 'h-init-3', staffId: 'usr-7', fullName: 'Léa Moreau', phone: '+33 6 55 44 33 22', assignedPost: 'Orientation & Placement aux Tables', uniformInfo: 'Tailleur Marine Signature T.36 + Foulard', languages: ['FR', 'EN', 'ZH'], status: 'CONFIRMED', shiftTime: '16:00 - 01:00' },
  ]);

  // Hostess inputs
  const [selectedStaffHostessId, setSelectedStaffHostessId] = useState('');
  const [customHostessName, setCustomHostessName] = useState('');
  const [hostessPhone, setHostessPhone] = useState('');
  const [hostessPost, setHostessPost] = useState('Accueil VIP & Placement');
  const [hostessUniform, setHostessUniform] = useState('Tailleur Signature Bleu Nuit & Foulard');
  const [hostessShift, setHostessShift] = useState('16:00 - 01:00');

  // Tab 5: Caterer & Servers
  const [catererCompanyName, setCatererCompanyName] = useState('Maison Lenôtre Haute Gastronomie');
  const [catererHeadButler, setCatererHeadButler] = useState('Maître Alexandre Mercier');
  const [catererNotes, setCatererNotes] = useState('Cocktail dans les jardins de 17h00 à 19h30, dîner assis à 20h00, gâteau des mariés à minuit.');
  const [catererServers, setCatererServers] = useState<CatererServer[]>([
    { id: 's-init-1', staffId: 'usr-2', fullName: 'Alexandre Mercier', phone: '+33 6 98 76 54 32', role: "Maître d'Hôtel Général", assignedZone: "Table d'Honneur & Coordination", shiftTime: '15:00 - 03:00', catererCompany: 'Maison Lenôtre', status: 'CONFIRMED' },
    { id: 's-init-2', staffId: 'usr-4', fullName: 'Julien Roussel', phone: '+33 6 23 45 67 89', role: 'Chef de Rang Prestige', assignedZone: 'Tables 1 (Diamant) & 2 (Émeraude)', shiftTime: '16:00 - 02:00', catererCompany: 'Maison Lenôtre', status: 'CONFIRMED' },
    { id: 's-init-3', staffId: 'usr-6', fullName: 'Maximilian Schmidt', phone: '+33 6 33 22 11 00', role: 'Sommelier & Vins Fins', assignedZone: 'Cave & Accord Mets-Vins', shiftTime: '16:00 - 02:00', catererCompany: 'Maison Lenôtre', status: 'CONFIRMED' },
    { id: 's-init-4', fullName: 'Thomas Leroy', phone: '+33 6 44 33 22 11', role: 'Chef de Rang', assignedZone: 'Tables 3 (Saphir) & 4 (Rubis)', shiftTime: '16:30 - 02:30', catererCompany: 'Maison Lenôtre', status: 'CONFIRMED' },
  ]);

  // Server inputs
  const [selectedStaffServerId, setSelectedStaffServerId] = useState('');
  const [customServerName, setCustomServerName] = useState('');
  const [serverPhone, setServerPhone] = useState('');
  const [serverRole, setServerRole] = useState('Chef de Rang');
  const [serverZone, setServerZone] = useState('Tables Principales');
  const [serverShift, setServerShift] = useState('16:00 - 02:00');

  // Tab 6: Beverages
  const [beverages, setBeverages] = useState<BeverageItem[]>([
    { id: 'b-init-1', name: 'Champagne Ruinart Blanc de Blancs', category: 'CHAMPAGNE', quantityOrdered: 90, unit: 'Bouteilles (75cl)', temperatureOrService: 'Servir très frais à 7-8°C en vasque argent avec glace', allocatedBarOrZone: 'Cocktail d’Accueil & Toast d’Ouverture' },
    { id: 'b-init-2', name: 'Champagne Moët & Chandon Brut Impérial (Magnums)', category: 'CHAMPAGNE', quantityOrdered: 24, unit: 'Magnums (1.5L)', temperatureOrService: 'Très frais avec fontaines lumineuses', allocatedBarOrZone: 'Découpe Pièce Montée Minuit' },
    { id: 'b-init-3', name: 'Saint-Émilion Grand Cru Château Cheval Blanc 2016', category: 'WINE_RED', quantityOrdered: 65, unit: 'Bouteilles (75cl)', temperatureOrService: 'Ouvrir 1h30 avant, chambré à 16°C', allocatedBarOrZone: 'Dîner Assis - Plat de Viande' },
    { id: 'b-init-4', name: 'Chablis Premier Cru Domaine Laroche 2021', category: 'WINE_WHITE', quantityOrdered: 50, unit: 'Bouteilles (75cl)', temperatureOrService: 'Fraîcheur 10°C', allocatedBarOrZone: 'Dîner Assis - Entrée de Homard' },
    { id: 'b-init-5', name: 'Cocktail Signature "Passion Royale" (Fruits rouges, Fleur de sureau, Champagne)', category: 'COCKTAIL', quantityOrdered: 200, unit: 'Verres prévus', temperatureOrService: 'Shaker minute, fleurs comestibles', allocatedBarOrZone: 'Bar Miroir des Jardins' },
    { id: 'b-init-6', name: 'Eaux Minérales San Pellegrino & Evian', category: 'SOFT_WATER', quantityOrdered: 250, unit: 'Bouteilles verre (1L)', temperatureOrService: 'Régulièrement réapprovisionnées fraîches', allocatedBarOrZone: 'Toutes les tables & Bar' },
    { id: 'b-init-7', name: 'Mocktail Fraîcheur Mojito Framboise (Sans Alcool)', category: 'SOFT_WATER', quantityOrdered: 120, unit: 'Verres prévus', temperatureOrService: 'Glace pilée et menthe fraîche', allocatedBarOrZone: 'Bar Sans Alcool & Enfants' },
  ]);

  // Beverage inputs
  const [bevName, setBevName] = useState('');
  const [bevCategory, setBevCategory] = useState<BeverageCategory>('CHAMPAGNE');
  const [bevQty, setBevQty] = useState<number>(60);
  const [bevUnit, setBevUnit] = useState('Bouteilles (75cl)');
  const [bevTemp, setBevTemp] = useState('Servir frais à 7°C');
  const [bevZone, setBevZone] = useState('Bar Principal & Dîner');

  if (!isOpen) return null;

  // Handlers for Additions
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

  const handleRemoveGuest = (id: string) => {
    setGuests(prev => prev.filter(g => g.id !== id));
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

  const handleRemoveTable = (id: string) => {
    setTables(prev => prev.filter(t => t.id !== id));
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

  const handleRemoveHostess = (id: string) => {
    setHostesses(prev => prev.filter(h => h.id !== id));
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

  const handleRemoveServer = (id: string) => {
    setCatererServers(prev => prev.filter(s => s.id !== id));
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

  const handleRemoveBeverage = (id: string) => {
    setBeverages(prev => prev.filter(b => b.id !== id));
  };

  // Preset Template Loader
  const handleLoadTemplate = (templateType: 'WEDDING' | 'DIPLOMATIC') => {
    if (templateType === 'WEDDING') {
      setTitle('Mariage d’Exception & Soirée d’Apparat au Château');
      setClientName('Famille de Montmirail & Maison Baraka');
      setType('WEDDING');
      setLocation('Château de Chantilly - Galerie des Glaces & Orangerie');
      setAddress('Route de Chantilly, 60500 Chantilly');
      setStartDate('2026-09-20');
      setEndDate('2026-09-21');
      setStartTime('15:30');
      setEndTime('05:00');
      setGuestCount(250);
      setBudget(75000);
      setDressCodeRequired('Smoking Noir & Nœud Papillon / Robe de Cérémonie Ivoire & Or');
      setDescription('Cérémonie laïque dans les jardins, cocktail champagne, dîner d’apparat servi à table et fontaine lumineuse de champagne pour la pièce montée à minuit.');
      setHasCouple(true);
      setPartner1('Alexandre de Montmirail');
      setPartner2('Inès Baraka');
      setCoupleTitle('Les Mariés d’Honneur');
      setCoupleNotes('Arrivée en calèche blanche dans la cour d’honneur à 16h45');
    } else {
      setTitle('Sommet International & Dîner Officiel des Ambassadeurs');
      setClientName('Ministère des Affaires Étrangères & Corps Diplomatique');
      setType('DIPLOMATIC');
      setLocation('Salons Gabriel & Pavillon d’Armenonville, Paris');
      setAddress('5 Avenue Gabriel, 75008 Paris');
      setStartDate('2026-09-28');
      setEndDate('2026-09-28');
      setStartTime('18:00');
      setEndTime('01:30');
      setGuestCount(220);
      setBudget(55000);
      setDressCodeRequired('Tailleur Marine & Foulard Soie / Smoking d’Apparat');
      setDescription('Dîner de prestige pour 45 ambassadeurs et hauts dignitaires. Respect strict de l’ordre protocolaire de préséance.');
      setHasCouple(true);
      setPartner1("S.E. Monsieur l'Ambassadeur d'Allemagne");
      setPartner2("Madame l'Ambassadrice");
      setCoupleTitle('Invités Plénipotentiaires d’Honneur');
      setCoupleNotes('Accueil solennel avec hymnes et escorte républicaine à 18h20');
    }
  };

  const totalSeats = tables.reduce((acc, t) => acc + (t.capacity || 0), 0);
  const totalBottles = beverages.reduce((acc, b) => acc + (b.quantityOrdered || 0), 0);

  const TABS: { id: TabType; title: string; stepNumber: number; icon: any }[] = [
    { id: 'GENERAL', title: '1. Général & Protocole', stepNumber: 1, icon: Calendar },
    { id: 'COUPLE_GUESTS', title: `2. Couple & Invités (${guests.length})`, stepNumber: 2, icon: Heart },
    { id: 'TABLES', title: `3. Plan de Tables (${tables.length})`, stepNumber: 3, icon: Grid },
    { id: 'HOSTESSES', title: `4. Hôtesses (${hostesses.length})`, stepNumber: 4, icon: UserCheck },
    { id: 'CATERER', title: `5. Traiteur & Serveurs (${catererServers.length})`, stepNumber: 5, icon: UtensilsCrossed },
    { id: 'BEVERAGES', title: `6. Boissons & Bar (${beverages.length})`, stepNumber: 6, icon: Wine },
  ];

  const isTabCompleted = (tab: TabType): boolean => {
    switch (tab) {
      case 'GENERAL':
        return Boolean(title.trim() && clientName.trim() && location.trim());
      case 'COUPLE_GUESTS':
        return Boolean((hasCouple && (partner1.trim() || partner2.trim())) || guests.length > 0);
      case 'TABLES':
        return tables.length > 0;
      case 'HOSTESSES':
        return hostesses.length > 0;
      case 'CATERER':
        return Boolean(catererCompanyName.trim() || catererServers.length > 0);
      case 'BEVERAGES':
        return beverages.length > 0;
      default:
        return false;
    }
  };

  const completedCount = TABS.filter(t => isTabCompleted(t.id)).length;
  const currentTabIndex = TABS.findIndex(t => t.id === activeTab);

  const handleNextStep = () => {
    if (currentTabIndex < TABS.length - 1) {
      setActiveTab(TABS[currentTabIndex + 1].id);
    }
  };

  const handlePrevStep = () => {
    if (currentTabIndex > 0) {
      setActiveTab(TABS[currentTabIndex - 1].id);
    }
  };

  // Conflict check for selected hostess and server
  const selectedHostessConflict = selectedStaffHostessId
    ? checkStaffConflict(selectedStaffHostessId, startDate, events)
    : { hasConflict: false };

  const selectedServerConflict = selectedStaffServerId
    ? checkStaffConflict(selectedStaffServerId, startDate, events)
    : { hasConflict: false };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !clientName || !location) {
      setActiveTab('GENERAL');
      return;
    }

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
      <div className="bg-white border border-slate-200 rounded-xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Calendar className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-serif tracking-wide text-white flex items-center gap-2">
                Enregistrement Complet d'un Événement de Prestige
              </h2>
              <p className="text-xs text-slate-300">
                Protocole, couple ou hôtes, plan de tables, hôtesses, brigade traiteur et stocks de boissons.
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

        {/* Wizard Stepper Progress Bar */}
        <div className="bg-slate-900/95 text-white px-6 py-2.5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold font-mono text-[11px]">
              Étape {currentTabIndex + 1} / {TABS.length}
            </span>
            <span className="font-semibold text-slate-200 text-xs">
              {TABS[currentTabIndex].title}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-300">
              Progression : <strong className="text-emerald-400 font-mono">{completedCount}</strong> / {TABS.length} volets complétés
            </span>
            <div className="w-28 sm:w-36 bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
              <div 
                className="bg-emerald-400 h-full transition-all duration-300"
                style={{ width: `${(completedCount / TABS.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Templates Quick Bar */}
        <div className="bg-amber-50/80 px-6 py-2 border-b border-amber-200/60 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-semibold text-amber-900 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Modèles pré-configurés complets :
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleLoadTemplate('WEDDING')}
              className="px-2.5 py-1 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded font-medium text-[11px] transition-colors"
            >
              💍 Mariage Haut de Gamme
            </button>
            <button
              type="button"
              onClick={() => handleLoadTemplate('DIPLOMATIC')}
              className="px-2.5 py-1 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded font-medium text-[11px] transition-colors"
            >
              🏛️ Gala Sommet Diplomatique
            </button>
          </div>
        </div>

        {/* Tab Navigation with Completion Checkmarks */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none py-2">
          {TABS.map((tab) => {
            const isCompleted = isTabCompleted(tab.id);
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all whitespace-nowrap border ${
                  isActive 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {isCompleted ? (
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0" title="Volet complété">
                    ✓
                  </span>
                ) : (
                  <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-mono shrink-0">
                    {tab.stepNumber}
                  </span>
                )}
                <span>{tab.title}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body / Tab Panes */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          
          {/* TAB 1: GENERAL INFO */}
          {activeTab === 'GENERAL' && (
            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Intitulé de la Réception *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Mariage Princier & Dîner d'Apparat ou Gala des Ambassadeurs"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Client ou Famille Commanditaire *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Famille de Montmirail, Ambassade, Maison de Luxe..."
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Typologie d'Événement</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as EventType)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900 font-semibold"
                  >
                    <option value="WEDDING">💍 Mariage & Célébration Privée</option>
                    <option value="GALA">✨ Gala & Prestige</option>
                    <option value="DIPLOMATIC">🏛️ Sommet Diplomatique & Officiel</option>
                    <option value="CORPORATE">🏢 Corporate & Congrès Haute Direction</option>
                    <option value="PRIVATE">🥂 Dîner Privé Confidentiel</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lieu & Salle de Réception *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Château de Chantilly, Galerie des Glaces"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Adresse Complète</label>
                  <input
                    type="text"
                    placeholder="Ex: Route de Chantilly, 60500 Chantilly"
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
                  <label className="block font-semibold text-slate-700 mb-1">Heure de Clôture</label>
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold text-slate-700">Budget Logistique & RH</label>
                    <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(budget || 0)}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="500"
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900 font-mono font-bold text-sm pr-14"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs pointer-events-none">€ EUR</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-[10px] text-slate-400 font-medium">Ajustement :</span>
                    <button
                      type="button"
                      onClick={() => setBudget(b => (b || 0) + 5000)}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border border-slate-200"
                    >
                      +5 000 €
                    </button>
                    <button
                      type="button"
                      onClick={() => setBudget(b => (b || 0) + 10000)}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border border-slate-200"
                    >
                      +10 000 €
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dress Code Requis</label>
                  <input
                    type="text"
                    placeholder="Ex: Smoking Noir & Nœud Papillon / Robe Longue"
                    value={dressCodeRequired}
                    onChange={(e) => setDressCodeRequired(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Langues Requises (séparées par virgules)</label>
                  <input
                    type="text"
                    placeholder="FR, EN, ES, AR"
                    value={requiredLanguagesInput}
                    onChange={(e) => setRequiredLanguagesInput(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Briefing & Consignes Particulières</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Placement nominatif très strict, table d'honneur à servir en premier, synchronisation avec le sommelier..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900"
                />
              </div>
            </div>
          )}

          {/* TAB 2: COUPLE & GUESTS */}
          {activeTab === 'COUPLE_GUESTS' && (
            <div className="space-y-5">
              {/* Couple or Honored Hosts Section */}
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
                      <label className="block font-semibold text-slate-700 mb-1">Conjoint 1 / Hôte 1 *</label>
                      <input
                        type="text"
                        placeholder="Ex: Alexandre de Montmirail"
                        value={partner1}
                        onChange={(e) => setPartner1(e.target.value)}
                        className="w-full p-2 bg-white border border-rose-200 rounded-md focus:ring-1 focus:ring-rose-500 focus:outline-none text-slate-900 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Conjoint 2 / Hôte 2 *</label>
                      <input
                        type="text"
                        placeholder="Ex: Inès Baraka"
                        value={partner2}
                        onChange={(e) => setPartner2(e.target.value)}
                        className="w-full p-2 bg-white border border-rose-200 rounded-md focus:ring-1 focus:ring-rose-500 focus:outline-none text-slate-900 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Titre Protocolaire</label>
                      <input
                        type="text"
                        placeholder="Ex: Les Mariés d’Honneur, Couple d'Or..."
                        value={coupleTitle}
                        onChange={(e) => setCoupleTitle(e.target.value)}
                        className="w-full p-2 bg-white border border-rose-200 rounded-md focus:ring-1 focus:ring-rose-500 focus:outline-none text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Consignes d'Arrivée & Protocole</label>
                      <input
                        type="text"
                        placeholder="Ex: Arrivée en calèche à 16h45, musique d'accueil..."
                        value={coupleNotes}
                        onChange={(e) => setCoupleNotes(e.target.value)}
                        className="w-full p-2 bg-white border border-rose-200 rounded-md focus:ring-1 focus:ring-rose-500 focus:outline-none text-slate-900"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Guests List Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-slate-600" /> Liste Nominative des Invités Clés ({guests.length})
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    Capacité globale attendue : <strong>{guestCount} convives</strong>
                  </span>
                </div>

                {/* Add Guest Form */}
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
                      <option value="HONOR">Honneur / Mariés</option>
                      <option value="VIP">VIP Privilégié</option>
                      <option value="FAMILY">Famille Proche</option>
                      <option value="OFFICIAL">Officiel / Autorité</option>
                      <option value="CHILD">Enfant</option>
                      <option value="GENERAL">Invité Général</option>
                    </select>
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Table assignée..."
                      value={newGuestTable}
                      onChange={(e) => setNewGuestTable(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900"
                    />
                  </div>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="Régime (Halal...)"
                      value={newGuestDiet}
                      onChange={(e) => setNewGuestDiet(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900"
                    />
                    <button
                      type="submit"
                      className="px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-md flex items-center justify-center font-bold"
                      title="Ajouter l'invité"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </form>

                {/* Guests Table */}
                <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-100 text-[10px] uppercase font-bold text-slate-600 sticky top-0">
                      <tr>
                        <th className="p-2">Nom & Prénom</th>
                        <th className="p-2">Catégorie</th>
                        <th className="p-2">Table</th>
                        <th className="p-2">Régime Alimentaire</th>
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
                              onClick={() => handleRemoveGuest(g.id)}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {guests.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-4 text-center text-slate-400">
                            Aucun invité nominatif saisi pour le moment.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TABLES & SEATS */}
          {activeTab === 'TABLES' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl">
                <div>
                  <span className="font-bold text-indigo-950 uppercase tracking-wider text-[11px] block">
                    Configuration des Tables & Capacité Assise
                  </span>
                  <span className="text-slate-600 text-[11px]">
                    Total places configurées : <strong>{totalSeats} places</strong> sur <strong>{tables.length} tables</strong> • Invités prévus : <strong>{guestCount} personnes</strong>
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {totalSeats >= guestCount ? (
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-md text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Capacité Suffisante
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-800 font-bold rounded-md text-[11px] flex items-center gap-1">
                      <Info className="w-3.5 h-3.5" /> Écart : +{guestCount - totalSeats} places requises
                    </span>
                  )}
                </div>
              </div>

              {/* Add Table Form */}
              <form onSubmit={handleAddTable} className="p-3 bg-slate-50 border border-slate-200 rounded-lg grid grid-cols-1 sm:grid-cols-5 gap-2">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Nom ou N° de Table *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Table d'Honneur, Table 1 - Saphir..."
                    value={newTableName}
                    onChange={(e) => setNewTableName(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:outline-none text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Nombre de Places *</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={newTableCapacity}
                    onChange={(e) => setNewTableCapacity(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:outline-none text-slate-900 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Forme de Table</label>
                  <select
                    value={newTableShape}
                    onChange={(e) => setNewTableShape(e.target.value as any)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:outline-none text-slate-900"
                  >
                    <option value="ROUND">Ronde (8-10 p.)</option>
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
                      placeholder="Chef de rang..."
                      value={newTableServer}
                      onChange={(e) => setNewTableServer(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:outline-none text-slate-900"
                    />
                    <button
                      type="submit"
                      className="px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center justify-center font-bold"
                      title="Ajouter la table"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </form>

              {/* Tables Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-56 overflow-y-auto">
                {tables.map((t) => (
                  <div key={t.id} className="p-3 bg-white border border-slate-200 rounded-lg shadow-2xs relative flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <span className="font-bold text-slate-900 text-xs">{t.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTable(t.id)}
                          className="text-slate-400 hover:text-rose-600 p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-bold rounded text-[11px] border border-indigo-200">
                          {t.capacity} places
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {t.shape === 'HONOR_U' ? 'Table d’Honneur' : t.shape === 'RECTANGULAR' ? 'Rectangulaire' : 'Ronde'}
                        </span>
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
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-amber-950 uppercase tracking-wider text-[11px] block">
                    Équipe des Hôtesses d'Accueil & Protocole ({hostesses.length})
                  </span>
                  <span className="text-slate-600 text-[11px]">
                    Sélectionnez parmi vos hôtesses référencées ou enregistrez des profils dédiés pour cet événement.
                  </span>
                </div>
              </div>

              {/* Add Hostess Form */}
              <form onSubmit={handleAddHostess} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2.5">
                {selectedHostessConflict.hasConflict && (
                  <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-lg text-xs text-amber-950 flex items-start gap-2 animate-in fade-in duration-150">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-900 block">⚠️ Conflit de planning détecté !</span>
                      <p className="text-[11px] text-amber-800 mt-0.5">
                        Cette hôtesse est déjà mobilisée le <strong>{selectedHostessConflict.conflictingEventDate}</strong> ({selectedHostessConflict.conflictingEventTime}) sur <em>« {selectedHostessConflict.conflictingEventTitle} »</em> en tant que <strong>{selectedHostessConflict.conflictingRole}</strong>.
                      </p>
                      <span className="text-[10px] text-amber-700 italic block mt-0.5">
                        Risque opérationnel de double affectation le même soir.
                      </span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Depuis l'annuaire d'équipe</label>
                    <select
                      value={selectedStaffHostessId}
                      onChange={(e) => {
                        setSelectedStaffHostessId(e.target.value);
                        if (e.target.value) setCustomHostessName('');
                      }}
                      className="w-full p-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900"
                    >
                      <option value="">-- Choisir une hôtesse existante --</option>
                      {staffList.filter(s => s.staffCategory === 'HOSTESS' || s.role === 'STAFF').map(s => {
                        const conflict = checkStaffConflict(s.id, startDate, events);
                        return (
                          <option key={s.id} value={s.id}>
                            {s.fullName} ({s.languages.join('/')} • T.{s.uniformSize || '38'})
                            {conflict.hasConflict ? ` ⚠️ (Déjà sur: ${conflict.conflictingEventTitle?.slice(0, 18)}...)` : ''}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">OU Nom de l'hôtesse externe</label>
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
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Poste d'Accueil / Mission *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Accueil VIP, Émargement, Vestiaire..."
                      value={hostessPost}
                      onChange={(e) => setHostessPost(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Tenue / Uniforme Assigné</label>
                    <input
                      type="text"
                      placeholder="Ex: Tailleur Signature Bleu Nuit T.36"
                      value={hostessUniform}
                      onChange={(e) => setHostessUniform(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Horaires de Vacation</label>
                    <input
                      type="text"
                      placeholder="Ex: 15:30 - 23:30"
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
                      <Plus className="w-4 h-4" /> Affecter cette Hôtesse
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
                      <th className="p-2">Uniforme / Tenue</th>
                      <th className="p-2">Vacation</th>
                      <th className="p-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {hostesses.map((h) => {
                      const conflict = h.staffId ? checkStaffConflict(h.staffId, startDate, events) : null;
                      return (
                        <tr key={h.id} className={`hover:bg-slate-50 transition-colors ${conflict?.hasConflict ? 'bg-amber-50/50' : ''}`}>
                          <td className="p-2 font-bold text-slate-900">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[10px] font-bold">
                                {h.fullName.slice(0, 2).toUpperCase()}
                              </span>
                              <div>
                                <span>{h.fullName}</span>
                                {conflict?.hasConflict && (
                                  <span className="block text-[10px] text-amber-700 font-semibold flex items-center gap-1 mt-0.5">
                                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                                    Déjà sur « {conflict.conflictingEventTitle?.slice(0, 22)}... »
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-2 text-slate-700 font-semibold">{h.assignedPost}</td>
                          <td className="p-2 text-slate-500">{h.uniformInfo || 'Non spécifié'}</td>
                          <td className="p-2 font-mono text-slate-600">{h.shiftTime || 'Journée'}</td>
                          <td className="p-2 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveHostess(h.id)}
                              className="text-slate-400 hover:text-rose-600 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {hostesses.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-slate-400">
                          Aucune hôtesse affectée pour cet événement.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: CATERER & SERVERS */}
          {activeTab === 'CATERER' && (
            <div className="space-y-4">
              {/* Caterer Company Details */}
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-3">
                <span className="font-bold text-emerald-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <UtensilsCrossed className="w-4 h-4 text-emerald-600" /> Prestataire Traiteur & Maître d'Hôtel de Liaison
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Maison Traiteur Partenaire *</label>
                    <input
                      type="text"
                      placeholder="Ex: Maison Lenôtre, Potel & Chabot, Baraka Catering..."
                      value={catererCompanyName}
                      onChange={(e) => setCatererCompanyName(e.target.value)}
                      className="w-full p-2 bg-white border border-emerald-200 rounded-md focus:ring-1 focus:ring-emerald-500 focus:outline-none text-slate-900 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Maître d'Hôtel Responsable Salle</label>
                    <input
                      type="text"
                      placeholder="Ex: Alexandre Mercier (Direction Service)"
                      value={catererHeadButler}
                      onChange={(e) => setCatererHeadButler(e.target.value)}
                      className="w-full p-2 bg-white border border-emerald-200 rounded-md focus:ring-1 focus:ring-emerald-500 focus:outline-none text-slate-900 font-medium"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Consignes & Synchronisation Traiteur</label>
                    <input
                      type="text"
                      placeholder="Ex: Cocktail servi à 17h, passage à table à 20h, entrée synchronisée des plats sous cloche..."
                      value={catererNotes}
                      onChange={(e) => setCatererNotes(e.target.value)}
                      className="w-full p-2 bg-white border border-emerald-200 rounded-md focus:ring-1 focus:ring-emerald-500 focus:outline-none text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Add Server Form */}
              <div className="space-y-2">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                  Brigade des Serveurs du Traiteur ({catererServers.length})
                </span>

                <form onSubmit={handleAddServer} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2.5">
                  {selectedServerConflict.hasConflict && (
                    <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-lg text-xs text-amber-950 flex items-start gap-2 animate-in fade-in duration-150">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-amber-900 block">⚠️ Conflit de planning détecté !</span>
                        <p className="text-[11px] text-amber-800 mt-0.5">
                          Ce collaborateur est déjà mobilisé le <strong>{selectedServerConflict.conflictingEventDate}</strong> ({selectedServerConflict.conflictingEventTime}) sur <em>« {selectedServerConflict.conflictingEventTitle} »</em> en tant que <strong>{selectedServerConflict.conflictingRole}</strong>.
                        </p>
                        <span className="text-[10px] text-amber-700 italic block mt-0.5">
                          Risque opérationnel de double affectation le même soir.
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Depuis l'annuaire extra</label>
                      <select
                        value={selectedStaffServerId}
                        onChange={(e) => {
                          setSelectedStaffServerId(e.target.value);
                          if (e.target.value) setCustomServerName('');
                        }}
                        className="w-full p-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-emerald-500 focus:outline-none text-slate-900"
                      >
                        <option value="">-- Choisir un serveur existant --</option>
                        {staffList.filter(s => s.staffCategory === 'SERVER' || s.staffCategory === 'BUTLER').map(s => {
                          const conflict = checkStaffConflict(s.id, startDate, events);
                          return (
                            <option key={s.id} value={s.id}>
                              {s.fullName} ({s.staffCategory})
                              {conflict.hasConflict ? ` ⚠️ (Déjà sur: ${conflict.conflictingEventTitle?.slice(0, 18)}...)` : ''}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">OU Nom du serveur externe</label>
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
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Rôle / Spécialité *</label>
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
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Zone ou Tables Assignées *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Table d'Honneur & Table 1, Buffet..."
                        value={serverZone}
                        onChange={(e) => setServerZone(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-emerald-500 focus:outline-none text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Horaires de Service</label>
                      <input
                        type="text"
                        placeholder="Ex: 16:00 - 02:00"
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
                        <Plus className="w-4 h-4" /> Ajouter ce Serveur
                      </button>
                    </div>
                  </div>
                </form>

                {/* Servers Table */}
                <div className="border border-slate-200 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-100 text-[10px] uppercase font-bold text-slate-600 sticky top-0">
                      <tr>
                        <th className="p-2">Nom du Serveur</th>
                        <th className="p-2">Rôle Traiteur</th>
                        <th className="p-2">Zone & Tables</th>
                        <th className="p-2">Horaires</th>
                        <th className="p-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {catererServers.map((s) => {
                        const conflict = s.staffId ? checkStaffConflict(s.staffId, startDate, events) : null;
                        return (
                          <tr key={s.id} className={`hover:bg-slate-50 transition-colors ${conflict?.hasConflict ? 'bg-amber-50/50' : ''}`}>
                            <td className="p-2 font-bold text-slate-900">
                              <div className="flex items-center gap-2">
                                <span>{s.fullName}</span>
                                {conflict?.hasConflict && (
                                  <span className="text-[10px] text-amber-700 font-semibold flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                                    Déjà sur « {conflict.conflictingEventTitle?.slice(0, 18)}... »
                                  </span>
                                )}
                              </div>
                            </td>
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
                                onClick={() => handleRemoveServer(s.id)}
                                className="text-slate-400 hover:text-rose-600 p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: BEVERAGES & BAR */}
          {activeTab === 'BEVERAGES' && (
            <div className="space-y-4">
              <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-purple-950 uppercase tracking-wider text-[11px] block">
                    Cave, Boissons & Bar de Réception ({beverages.length} références)
                  </span>
                  <span className="text-slate-600 text-[11px]">
                    Total volumes engagés : <strong>{totalBottles} bouteilles / portions</strong> pour <strong>{guestCount} invités</strong>.
                  </span>
                </div>
              </div>

              {/* Add Beverage Form */}
              <form onSubmit={handleAddBeverage} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Désignation de la Boisson *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Champagne Ruinart Blanc de Blancs, Château Margaux..."
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
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Quantité Prévue *</label>
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
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Unité de mesure</label>
                    <input
                      type="text"
                      placeholder="Bouteilles (75cl), Magnums, Packs..."
                      value={bevUnit}
                      onChange={(e) => setBevUnit(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-purple-500 focus:outline-none text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Consigne & Température de Service</label>
                    <input
                      type="text"
                      placeholder="Ex: Servir très frais à 7°C en vasque argent"
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
                      <Plus className="w-4 h-4" /> Ajouter cette Boisson
                    </button>
                  </div>
                </div>
              </form>

              {/* Beverages Table */}
              <div className="border border-slate-200 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-100 text-[10px] uppercase font-bold text-slate-600 sticky top-0">
                    <tr>
                      <th className="p-2">Boisson & Référence</th>
                      <th className="p-2">Catégorie</th>
                      <th className="p-2">Stock Prévu</th>
                      <th className="p-2">Consigne Température / Service</th>
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
                        <td className="p-2 text-slate-500">{b.temperatureOrService || 'Température normale'}</td>
                        <td className="p-2 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveBeverage(b.id)}
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

        {/* Modal Footer with Stepper Actions */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
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
              className="px-3.5 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Annuler
            </button>

            {/* Stepper Prev / Next Buttons */}
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={currentTabIndex === 0}
              className="px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Précédent</span>
            </button>

            {currentTabIndex < TABS.length - 1 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1 shadow-xs"
              >
                <span>Suivant</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : null}

            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Enregistrer l'Événement</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
