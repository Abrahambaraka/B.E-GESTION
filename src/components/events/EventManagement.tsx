import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { 
  EventItem, 
  EventType, 
  EventStatus, 
  Assignment, 
  EventEquipment,
  GuestItem,
  TableItem,
  EventHostess,
  CatererServer,
  BeverageItem
} from '../../types/event';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Package, 
  Plus, 
  Sparkles, 
  Shield, 
  Shirt, 
  Trash2, 
  Edit, 
  Copy,
  ChevronRight, 
  Printer, 
  CheckCircle2, 
  AlertTriangle,
  FileText,
  DollarSign,
  FileDown,
  Heart,
  Grid,
  UserCheck,
  UtensilsCrossed,
  Wine,
  Check,
  Info,
  GlassWater,
  Minus,
  Search,
  LayoutList,
  CalendarRange
} from 'lucide-react';
import { NavigationTab } from '../layout/Navbar';
import { EditEventModal } from './EditEventModal';
import { exportEventsToCSV, exportEventRoadmapToCSV, downloadCSV } from '../../utils/exportUtils';
import { UniformBatchModal } from '../uniforms/UniformBatchModal';
import { EventCalendarTimeline } from './EventCalendarTimeline';

interface EventManagementProps {
  setActiveTab: (tab: NavigationTab) => void;
  openCreateModal: () => void;
  openExportModal?: (type?: any, eventId?: string) => void;
}

type EventSubTab = 'DETAILS' | 'GUESTS' | 'TABLES' | 'HOSTESSES' | 'CATERER' | 'BEVERAGES' | 'STAFF' | 'LOGISTICS' | 'ROUTING';

export const EventManagement: React.FC<EventManagementProps> = ({ 
  setActiveTab, 
  openCreateModal,
  openExportModal 
}) => {
  const { 
    events, 
    selectedEventId, 
    setSelectedEventId, 
    staffList, 
    equipmentList, 
    addEvent,
    updateEvent,
    deleteEvent, 
    assignStaffToEvent,
    removeStaffAssignment,
    updateCheckIn,
    removeEquipmentBooking,
    updateBookingStatus,
    bookEquipmentForEvent
  } = useEvent();

  const [activeSubTab, setActiveSubTab] = useState<EventSubTab>('DETAILS');
  const [viewMode, setViewMode] = useState<'LIST' | 'CALENDAR'>('LIST');
  const [selectedEquipToAdd, setSelectedEquipToAdd] = useState<string>('');
  const [qtyToAdd, setQtyToAdd] = useState<number>(10);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Edit Event Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<EventItem | null>(null);
  const [isBatchUniformModalOpen, setIsBatchUniformModalOpen] = useState(false);

  // Filter for guests
  const [guestSearch, setGuestSearch] = useState('');
  const [guestTableFilter, setGuestTableFilter] = useState('');

  // Quick Inline forms inside tabs
  const [showAddGuestForm, setShowAddGuestForm] = useState(false);
  const [quickGuestName, setQuickGuestName] = useState('');
  const [quickGuestTable, setQuickGuestTable] = useState('');
  const [quickGuestDiet, setQuickGuestDiet] = useState('Standard');
  const [quickGuestCat, setQuickGuestCat] = useState<GuestItem['category']>('VIP');

  const [showAddTableForm, setShowAddTableForm] = useState(false);
  const [quickTableName, setQuickTableName] = useState('');
  const [quickTableCapacity, setQuickTableCapacity] = useState(10);
  const [quickTableShape, setQuickTableShape] = useState<TableItem['shape']>('ROUND');
  const [quickTableServer, setQuickTableServer] = useState('');

  const [showAddHostessForm, setShowAddHostessForm] = useState(false);
  const [quickHostessName, setQuickHostessName] = useState('');
  const [quickHostessPost, setQuickHostessPost] = useState('Accueil VIP');
  const [quickHostessUniform, setQuickHostessUniform] = useState('Tailleur Signature Bleu Nuit');

  const [showAddServerForm, setShowAddServerForm] = useState(false);
  const [quickServerName, setQuickServerName] = useState('');
  const [quickServerRole, setQuickServerRole] = useState('Chef de Rang');
  const [quickServerZone, setQuickServerZone] = useState('Tables Principales');

  const [showAddBevForm, setShowAddBevForm] = useState(false);
  const [quickBevName, setQuickBevName] = useState('');
  const [quickBevCat, setQuickBevCat] = useState<any>('CHAMPAGNE');
  const [quickBevQty, setQuickBevQty] = useState(40);
  const [quickBevUnit, setQuickBevUnit] = useState('Bouteilles (75cl)');

  const selectedEvent = events.find(e => e.id === selectedEventId) || events[0];

  const handleExportAllEvents = () => {
    if (openExportModal) {
      openExportModal('EVENTS');
    } else {
      const csv = exportEventsToCSV(events);
      downloadCSV(`Blessing_Event_Planning_${new Date().toISOString().slice(0, 10)}.csv`, csv);
    }
  };

  const handleExportRoadmap = (evt: EventItem) => {
    if (openExportModal) {
      openExportModal('ROADMAP', evt.id);
    } else {
      const csv = exportEventRoadmapToCSV(evt, staffList, equipmentList);
      downloadCSV(`Blessing_Event_Feuille_De_Route_${evt.title.replace(/\s+/g, '_')}.csv`, csv);
    }
  };

  // Quick staff assignment form state
  const [selectedStaffToAdd, setSelectedStaffToAdd] = useState<string>('');
  const [roleOnDayInput, setRoleOnDayInput] = useState<string>('Hôtesse Accueil VIP');
  const [briefingInput, setBriefingInput] = useState<string>('');
  const [showAssignForm, setShowAssignForm] = useState<boolean>(false);

  const handleOpenEdit = (evt: EventItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEventToEdit(evt);
    setIsEditModalOpen(true);
  };

  const handleDuplicateEvent = (evt: EventItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addEvent({
      title: `${evt.title} (Copie)`,
      clientName: evt.clientName,
      type: evt.type,
      location: evt.location,
      address: evt.address,
      startDate: evt.startDate,
      endDate: evt.endDate,
      startTime: evt.startTime,
      endTime: evt.endTime,
      vipProtocolLevel: evt.vipProtocolLevel,
      dressCodeRequired: evt.dressCodeRequired,
      requiredLanguages: [...evt.requiredLanguages],
      guestCount: evt.guestCount,
      budget: evt.budget,
      status: 'PLANNED',
      description: evt.description,
      couple: evt.couple,
      guests: evt.guests ? [...evt.guests] : [],
      tables: evt.tables ? [...evt.tables] : [],
      hostesses: evt.hostesses ? [...evt.hostesses] : [],
      catererServers: evt.catererServers ? [...evt.catererServers] : [],
      catererCompanyName: evt.catererCompanyName,
      catererHeadButler: evt.catererHeadButler,
      catererNotes: evt.catererNotes,
      beverages: evt.beverages ? [...evt.beverages] : []
    });
  };

  const handleDeleteEvent = (evt: EventItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer définitivement l'événement "${evt.title}" ?`)) {
      deleteEvent(evt.id);
    }
  };

  const handleAddStaffAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !selectedStaffToAdd) return;
    assignStaffToEvent(selectedEvent.id, selectedStaffToAdd, roleOnDayInput, briefingInput);
    setSelectedStaffToAdd('');
    setBriefingInput('');
    setShowAssignForm(false);
  };

  const handleAddBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !selectedEquipToAdd || qtyToAdd <= 0) return;
    
    setBookingError(null);
    const res = bookEquipmentForEvent(selectedEvent.id, selectedEquipToAdd, qtyToAdd);
    if (!res.success) {
      setBookingError(res.message || 'Erreur lors de la réservation');
    } else {
      setSelectedEquipToAdd('');
      setQtyToAdd(10);
    }
  };

  // Helper actions for dynamic Event Updates
  const handleToggleGuestPresence = (guestId: string) => {
    if (!selectedEvent) return;
    const currentGuests = selectedEvent.guests || [];
    const updated = currentGuests.map(g => {
      if (g.id === guestId) {
        const nextStatus = g.status === 'CHECKED_IN' ? 'CONFIRMED' : 'CHECKED_IN';
        return { ...g, status: nextStatus };
      }
      return g;
    });
    updateEvent(selectedEvent.id, { guests: updated });
  };

  const handleAddQuickGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !quickGuestName.trim()) return;
    const newG: GuestItem = {
      id: `gst-${Date.now()}`,
      fullName: quickGuestName.trim(),
      category: quickGuestCat,
      assignedTableName: quickGuestTable || undefined,
      dietaryRequirements: quickGuestDiet || 'Standard',
      status: 'CONFIRMED'
    };
    updateEvent(selectedEvent.id, {
      guests: [newG, ...(selectedEvent.guests || [])]
    });
    setQuickGuestName('');
    setShowAddGuestForm(false);
  };

  const handleDeleteGuest = (guestId: string) => {
    if (!selectedEvent) return;
    const updated = (selectedEvent.guests || []).filter(g => g.id !== guestId);
    updateEvent(selectedEvent.id, { guests: updated });
  };

  const handleAddQuickTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !quickTableName.trim()) return;
    const newT: TableItem = {
      id: `tbl-${Date.now()}`,
      name: quickTableName.trim(),
      capacity: Number(quickTableCapacity) || 10,
      shape: quickTableShape,
      assignedServerName: quickTableServer || undefined
    };
    updateEvent(selectedEvent.id, {
      tables: [...(selectedEvent.tables || []), newT]
    });
    setQuickTableName('');
    setQuickTableServer('');
    setShowAddTableForm(false);
  };

  const handleDeleteTable = (tableId: string) => {
    if (!selectedEvent) return;
    const updated = (selectedEvent.tables || []).filter(t => t.id !== tableId);
    updateEvent(selectedEvent.id, { tables: updated });
  };

  const handleToggleHostessStatus = (hostessId: string, status: EventHostess['status']) => {
    if (!selectedEvent) return;
    const updated = (selectedEvent.hostesses || []).map(h => 
      h.id === hostessId ? { ...h, status } : h
    );
    updateEvent(selectedEvent.id, { hostesses: updated });
  };

  const handleAddQuickHostess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !quickHostessName.trim()) return;
    const newH: EventHostess = {
      id: `hst-${Date.now()}`,
      fullName: quickHostessName.trim(),
      assignedPost: quickHostessPost,
      uniformInfo: quickHostessUniform,
      status: 'CONFIRMED',
      shiftTime: `${selectedEvent.startTime} - ${selectedEvent.endTime}`,
      languages: ['FR', 'EN']
    };
    updateEvent(selectedEvent.id, {
      hostesses: [...(selectedEvent.hostesses || []), newH]
    });
    setQuickHostessName('');
    setShowAddHostessForm(false);
  };

  const handleDeleteHostess = (hostessId: string) => {
    if (!selectedEvent) return;
    const updated = (selectedEvent.hostesses || []).filter(h => h.id !== hostessId);
    updateEvent(selectedEvent.id, { hostesses: updated });
  };

  const handleAddQuickServer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !quickServerName.trim()) return;
    const newS: CatererServer = {
      id: `srv-${Date.now()}`,
      fullName: quickServerName.trim(),
      role: quickServerRole,
      assignedZone: quickServerZone,
      shiftTime: `${selectedEvent.startTime} - ${selectedEvent.endTime}`,
      catererCompany: selectedEvent.catererCompanyName || 'Traiteur Officiel',
      status: 'CONFIRMED'
    };
    updateEvent(selectedEvent.id, {
      catererServers: [...(selectedEvent.catererServers || []), newS]
    });
    setQuickServerName('');
    setShowAddServerForm(false);
  };

  const handleDeleteServer = (serverId: string) => {
    if (!selectedEvent) return;
    const updated = (selectedEvent.catererServers || []).filter(s => s.id !== serverId);
    updateEvent(selectedEvent.id, { catererServers: updated });
  };

  const handleUpdateBeverageConsumed = (bevId: string, delta: number) => {
    if (!selectedEvent) return;
    const updated = (selectedEvent.beverages || []).map(b => {
      if (b.id === bevId) {
        const next = Math.max(0, (b.quantityConsumed || 0) + delta);
        return { ...b, quantityConsumed: next };
      }
      return b;
    });
    updateEvent(selectedEvent.id, { beverages: updated });
  };

  const handleAddQuickBeverage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !quickBevName.trim()) return;
    const newB: BeverageItem = {
      id: `bev-${Date.now()}`,
      name: quickBevName.trim(),
      category: quickBevCat,
      quantityOrdered: Number(quickBevQty) || 10,
      unit: quickBevUnit,
      quantityConsumed: 0
    };
    updateEvent(selectedEvent.id, {
      beverages: [...(selectedEvent.beverages || []), newB]
    });
    setQuickBevName('');
    setShowAddBevForm(false);
  };

  const handleDeleteBeverage = (bevId: string) => {
    if (!selectedEvent) return;
    const updated = (selectedEvent.beverages || []).filter(b => b.id !== bevId);
    updateEvent(selectedEvent.id, { beverages: updated });
  };

  const getEventTypeLabel = (t: EventType) => {
    switch (t) {
      case 'CORPORATE': return 'Gala & Soirée Corporate';
      case 'DIPLOMATIC': return 'Sommet & Réception Diplomatique';
      case 'WEDDING': return 'Mariage & Réception Privée';
      case 'GALA': return 'Gala Caritatif & Prestige';
      case 'PRIVATE': return 'Dîner Privé Confidentiel';
    }
  };

  // Derived calculations
  const currentTables = selectedEvent?.tables || [];
  const currentGuests = selectedEvent?.guests || [];
  const currentHostesses = selectedEvent?.hostesses || [];
  const currentServers = selectedEvent?.catererServers || [];
  const currentBeverages = selectedEvent?.beverages || [];

  const totalSeats = currentTables.reduce((acc, t) => acc + (t.capacity || 0), 0);
  const totalBottles = currentBeverages.reduce((acc, b) => acc + (b.quantityOrdered || 0), 0);
  const totalConsumedBottles = currentBeverages.reduce((acc, b) => acc + (b.quantityConsumed || 0), 0);

  const filteredGuests = currentGuests.filter(g => {
    const matchesSearch = !guestSearch || g.fullName.toLowerCase().includes(guestSearch.toLowerCase());
    const matchesTable = !guestTableFilter || g.assignedTableName === guestTableFilter;
    return matchesSearch && matchesTable;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-serif font-bold text-slate-900">
            Gestion des Événements & Réceptions de Prestige
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Coordination complète : Protocole, Couple & Invités, Plan de tables, Hôtesses, Brigade traiteur et Baromètre boissons.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Mode Switcher: List vs Calendar/Timeline */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              id="event-view-list-btn"
              onClick={() => setViewMode('LIST')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'LIST'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>Liste & Fiches</span>
            </button>
            <button
              type="button"
              id="event-view-calendar-btn"
              onClick={() => setViewMode('CALENDAR')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'CALENDAR'
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarRange className="w-3.5 h-3.5" />
              <span>Calendrier & Timeline</span>
            </button>
          </div>

          <button
            onClick={handleExportAllEvents}
            className="px-3 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded text-xs font-medium transition-colors flex items-center gap-1 border border-slate-200"
            title="Exporter la liste des événements"
          >
            <FileDown className="w-3.5 h-3.5 text-slate-500" />
            <span>Exporter</span>
          </button>
          <button
            id="create-event-top-btn"
            onClick={openCreateModal}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nouvel Événement</span>
          </button>
        </div>
      </div>

      {viewMode === 'CALENDAR' ? (
        <EventCalendarTimeline
          events={events}
          selectedEventId={selectedEventId}
          onSelectEvent={(id) => setSelectedEventId(id)}
          onOpenEditModal={(evt) => {
            setEventToEdit(evt);
            setIsEditModalOpen(true);
          }}
          onSwitchToListView={(id) => {
            if (id) setSelectedEventId(id);
            setViewMode('LIST');
          }}
          openCreateModal={openCreateModal}
          staffList={staffList}
          equipmentList={equipmentList}
          openExportModal={openExportModal}
        />
      ) : (
        /* Main Split Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Event List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Réceptions Programmées ({events.length})
            </span>
          </div>

          <div className="space-y-2.5 max-h-[calc(100vh-210px)] overflow-y-auto pr-1">
            {events.map((evt) => {
              const isSelected = selectedEventId === evt.id;
              const hasCoupleBadge = !!evt.couple;
              const tableCount = (evt.tables || []).length;
              const hostessCount = (evt.hostesses || []).length;

              return (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEventId(evt.id)}
                  className={`p-4 rounded-xl border text-xs cursor-pointer transition-all duration-150 relative ${
                    isSelected
                      ? 'bg-white border-amber-500 shadow-md ring-1 ring-amber-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="font-serif font-bold text-slate-900 line-clamp-1 text-sm">
                      {evt.title}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                      evt.status === 'IN_PROGRESS' 
                        ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                        : evt.status === 'COMPLETED'
                        ? 'bg-slate-100 text-slate-600'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {evt.status === 'IN_PROGRESS' ? '⚡ Jour J' : evt.status === 'COMPLETED' ? 'Terminé' : 'Planifié'}
                    </span>
                  </div>

                  <p className="text-slate-500 text-[11px] mb-2 font-medium">
                    {evt.clientName}
                  </p>

                  <div className="space-y-1 text-slate-600 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{evt.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{evt.startDate} • {evt.startTime}-{evt.endTime}</span>
                    </div>
                  </div>

                  {/* Micro tags for reception features */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-[10px]">
                    {hasCoupleBadge && (
                      <span className="px-1.5 py-0.5 bg-rose-50 text-rose-700 font-semibold rounded border border-rose-200 flex items-center gap-1">
                        <Heart className="w-2.5 h-2.5" /> Couple
                      </span>
                    )}
                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 font-medium rounded">
                      {tableCount} tables
                    </span>
                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 font-medium rounded">
                      {hostessCount} hôtesses
                    </span>
                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 font-medium rounded">
                      {(evt.beverages || []).length} boissons
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Event Active Console (8 cols) */}
        {selectedEvent ? (
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5">
            
            {/* Event Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-200">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-slate-900 text-amber-400 font-serif font-bold text-[10px] uppercase tracking-wider">
                    {getEventTypeLabel(selectedEvent.type)}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 font-semibold text-[10px]">
                    Niveau Protocole : {selectedEvent.vipProtocolLevel}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-900">
                  {selectedEvent.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Client : <strong>{selectedEvent.clientName}</strong> • {selectedEvent.location}
                </p>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleExportRoadmap(selectedEvent)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs rounded-lg transition-colors flex items-center gap-1.5 border border-slate-200"
                  title="Exporter la feuille de route protocolaire"
                >
                  <FileDown className="w-3.5 h-3.5 text-amber-600" />
                  <span>Feuille de Route</span>
                </button>

                <button
                  onClick={() => handleOpenEdit(selectedEvent)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Edit className="w-3.5 h-3.5 text-amber-400" />
                  <span>Modifier</span>
                </button>

                <button
                  onClick={() => handleDuplicateEvent(selectedEvent)}
                  className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Dupliquer l'événement"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDeleteEvent(selectedEvent)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Supprimer définitivement l'événement"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Sub Tabs Navigation */}
            <div className="flex flex-wrap gap-1 border-b border-slate-200 pb-2 text-xs overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveSubTab('DETAILS')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeSubTab === 'DETAILS' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Fiche Protocole
              </button>

              <button
                onClick={() => setActiveSubTab('GUESTS')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1 ${
                  activeSubTab === 'GUESTS' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                Couple & Invités ({currentGuests.length})
              </button>

              <button
                onClick={() => setActiveSubTab('TABLES')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1 ${
                  activeSubTab === 'TABLES' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Grid className="w-3.5 h-3.5 text-indigo-500" />
                Tables & Places ({currentTables.length})
              </button>

              <button
                onClick={() => setActiveSubTab('HOSTESSES')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1 ${
                  activeSubTab === 'HOSTESSES' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-500" />
                Hôtesses ({currentHostesses.length})
              </button>

              <button
                onClick={() => setActiveSubTab('CATERER')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1 ${
                  activeSubTab === 'CATERER' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <UtensilsCrossed className="w-3.5 h-3.5 text-emerald-600" />
                Traiteur & Serveurs ({currentServers.length})
              </button>

              <button
                onClick={() => setActiveSubTab('BEVERAGES')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1 ${
                  activeSubTab === 'BEVERAGES' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Wine className="w-3.5 h-3.5 text-purple-600" />
                Boissons & Bar ({currentBeverages.length})
              </button>

              <button
                onClick={() => setActiveSubTab('STAFF')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeSubTab === 'STAFF' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Équipe RH ({selectedEvent.assignments.length})
              </button>

              <button
                onClick={() => setActiveSubTab('LOGISTICS')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeSubTab === 'LOGISTICS' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Matériel ({selectedEvent.bookedItems.length})
              </button>

              <button
                onClick={() => setActiveSubTab('ROUTING')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1 ${
                  activeSubTab === 'ROUTING' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Printer className="w-3.5 h-3.5 text-amber-500" />
                Feuille de Route
              </button>
            </div>

            {/* TAB CONTENT: 1. DETAILS */}
            {activeSubTab === 'DETAILS' && (
              <div className="space-y-4">
                {/* Honored Couple Banner if present */}
                {selectedEvent.couple && (
                  <div className="p-4 bg-gradient-to-r from-rose-50 via-amber-50 to-rose-50 border border-rose-200/80 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-600 border border-rose-200 flex items-center justify-center shrink-0">
                        <Heart className="w-5 h-5 text-rose-600" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-rose-700 uppercase tracking-widest block">
                          {selectedEvent.couple.title || 'Couple Célébré d’Honneur'}
                        </span>
                        <h4 className="text-base font-serif font-bold text-slate-900">
                          {selectedEvent.couple.partner1} & {selectedEvent.couple.partner2}
                        </h4>
                        {selectedEvent.couple.notes && (
                          <p className="text-slate-600 text-xs mt-0.5 italic">
                            « {selectedEvent.couple.notes} »
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Dashboard KPI Mini Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Tables & Places</span>
                    <span className="text-base font-bold text-indigo-900 font-mono mt-0.5 block">
                      {currentTables.length} tables
                    </span>
                    <span className="text-[11px] text-slate-500">{totalSeats} places assises</span>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Hôtesses en Poste</span>
                    <span className="text-base font-bold text-amber-900 font-mono mt-0.5 block">
                      {currentHostesses.length} hôtesses
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {currentHostesses.filter(h => h.status === 'PRESENT').length} sur site
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Traiteur & Serveurs</span>
                    <span className="text-base font-bold text-emerald-900 font-mono mt-0.5 block">
                      {currentServers.length} serveurs
                    </span>
                    <span className="text-[11px] text-slate-500 truncate block">
                      {selectedEvent.catererCompanyName || 'Non spécifié'}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Cave & Boissons</span>
                    <span className="text-base font-bold text-purple-900 font-mono mt-0.5 block">
                      {totalBottles} bouteilles
                    </span>
                    <span className="text-[11px] text-slate-500">{currentBeverages.length} références</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-700 block uppercase tracking-wider text-[10px]">
                      Lieu & Horaires de la Réception
                    </span>
                    <p className="flex items-center gap-2 text-slate-800">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <strong>{selectedEvent.location}</strong>
                    </p>
                    {selectedEvent.address && (
                      <p className="text-slate-500 pl-6">{selectedEvent.address}</p>
                    )}
                    <p className="flex items-center gap-2 text-slate-800">
                      <Clock className="w-4 h-4 text-slate-400" />
                      Vacation : <strong>{selectedEvent.startTime} - {selectedEvent.endTime}</strong> ({selectedEvent.startDate})
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-700 block uppercase tracking-wider text-[10px]">
                      Exigences Protocolaires & Dress Code
                    </span>
                    <p className="flex items-center gap-2 text-slate-800">
                      <Shirt className="w-4 h-4 text-amber-600" />
                      <span>Dress Code : <strong>{selectedEvent.dressCodeRequired}</strong></span>
                    </p>
                    <div className="flex items-center gap-2 text-slate-800">
                      <span>Langues impératives :</span>
                      <div className="flex gap-1">
                        {selectedEvent.requiredLanguages.map(l => (
                          <span key={l} className="px-1.5 py-0.5 bg-amber-100 text-amber-900 font-bold rounded text-[10px] border border-amber-200">
                            {l}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600">
                      Nombre d'invités attendus : <strong>{selectedEvent.guestCount} personnes</strong>
                    </p>
                  </div>
                </div>

                {selectedEvent.description && (
                  <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-lg text-xs space-y-1">
                    <span className="font-bold text-amber-950 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                      <Sparkles className="w-4 h-4 text-amber-600" /> Note de Cadrage & Briefing Général
                    </span>
                    <p className="text-slate-700 leading-relaxed">
                      {selectedEvent.description}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: 2. GUESTS & COUPLE */}
            {activeSubTab === 'GUESTS' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Gestion des Invités & Table Nominative
                    </h4>
                    <span className="text-xs text-slate-500">
                      {currentGuests.length} invités répertoriés • {currentGuests.filter(g => g.status === 'CHECKED_IN').length} émargés sur site • {selectedEvent.guestCount} attendus
                    </span>
                  </div>

                  <button
                    onClick={() => setShowAddGuestForm(!showAddGuestForm)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{showAddGuestForm ? 'Fermer' : 'Ajouter un Invité'}</span>
                  </button>
                </div>

                {/* Inline Add Guest Form */}
                {showAddGuestForm && (
                  <form onSubmit={handleAddQuickGuest} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
                    <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider">
                      Ajout rapide d'un convive
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          required
                          placeholder="Nom & Prénom de l'invité..."
                          value={quickGuestName}
                          onChange={(e) => setQuickGuestName(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <select
                          value={quickGuestCat}
                          onChange={(e) => setQuickGuestCat(e.target.value as any)}
                          className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                        >
                          <option value="HONOR">Honneur</option>
                          <option value="VIP">VIP</option>
                          <option value="FAMILY">Famille</option>
                          <option value="OFFICIAL">Officiel</option>
                          <option value="GENERAL">Standard</option>
                          <option value="CHILD">Enfant</option>
                        </select>
                      </div>
                      <div>
                        <select
                          value={quickGuestTable}
                          onChange={(e) => setQuickGuestTable(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                        >
                          <option value="">-- Table libre --</option>
                          {currentTables.map(t => (
                            <option key={t.id} value={t.name}>{t.name} ({t.capacity} pl.)</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Régime alimentaire (Halal, Sans gluten, Végétarien...)"
                        value={quickGuestDiet}
                        onChange={(e) => setQuickGuestDiet(e.target.value)}
                        className="flex-1 p-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold uppercase text-[11px] shadow-xs"
                      >
                        Enregistrer le Convive
                      </button>
                    </div>
                  </form>
                )}

                {/* Filter & Search Bar */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Rechercher un invité par nom..."
                      value={guestSearch}
                      onChange={(e) => setGuestSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <select
                    value={guestTableFilter}
                    onChange={(e) => setGuestTableFilter(e.target.value)}
                    className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
                  >
                    <option value="">Toutes les tables</option>
                    {currentTables.map(t => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>

                {/* Guests Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Invité</th>
                        <th className="p-3">Catégorie</th>
                        <th className="p-3">Table Attribuée</th>
                        <th className="p-3">Régime Spécifique</th>
                        <th className="p-3 text-center">Émargement Jour J</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredGuests.map(g => (
                        <tr key={g.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 font-semibold text-slate-900">
                            {g.fullName}
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                              {g.category || 'VIP'}
                            </span>
                          </td>
                          <td className="p-3 font-medium text-slate-700">
                            {g.assignedTableName ? (
                              <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold">
                                {g.assignedTableName}
                              </span>
                            ) : (
                              <span className="text-slate-400 italic">Non assigné</span>
                            )}
                          </td>
                          <td className="p-3 text-slate-600">
                            {g.dietaryRequirements || 'Standard'}
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleToggleGuestPresence(g.id)}
                              className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                                g.status === 'CHECKED_IN'
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-600 hover:bg-emerald-100 hover:text-emerald-800'
                              }`}
                            >
                              {g.status === 'CHECKED_IN' ? '✓ Émargé sur Site' : 'Attendu'}
                            </button>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleDeleteGuest(g.id)}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded"
                              title="Supprimer cet invité"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredGuests.length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-6 text-center text-slate-400">
                            Aucun invité ne correspond à ces critères.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 3. TABLES & SEATS */}
            {activeSubTab === 'TABLES' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Plan de Tables & Répartition des Convives
                    </h4>
                    <span className="text-xs text-slate-500">
                      {currentTables.length} tables configurées • {totalSeats} places assises • {selectedEvent.guestCount} invités attendus
                    </span>
                  </div>

                  <button
                    onClick={() => setShowAddTableForm(!showAddTableForm)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{showAddTableForm ? 'Fermer' : 'Ajouter une Table'}</span>
                  </button>
                </div>

                {/* Inline Add Table Form */}
                {showAddTableForm && (
                  <form onSubmit={handleAddQuickTable} className="p-4 bg-indigo-50/60 border border-indigo-200 rounded-xl space-y-3 text-xs">
                    <span className="font-bold text-indigo-950 block text-[11px] uppercase tracking-wider">
                      Nouvelle Table à la Réception
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          required
                          placeholder="Nom de la table (ex: Table d'Honneur, Table 1...)"
                          value={quickTableName}
                          onChange={(e) => setQuickTableName(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          min="1"
                          required
                          placeholder="Capacité (places)"
                          value={quickTableCapacity}
                          onChange={(e) => setQuickTableCapacity(Number(e.target.value))}
                          className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-bold"
                        />
                      </div>
                      <div>
                        <select
                          value={quickTableShape}
                          onChange={(e) => setQuickTableShape(e.target.value as any)}
                          className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                        >
                          <option value="ROUND">Ronde (8-10 p.)</option>
                          <option value="HONOR_U">En U / Honneur</option>
                          <option value="RECTANGULAR">Rectangulaire</option>
                          <option value="HIGH_TOP">Mange-debout</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Serveur / Chef de rang responsable..."
                        value={quickTableServer}
                        onChange={(e) => setQuickTableServer(e.target.value)}
                        className="flex-1 p-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold uppercase text-[11px] shadow-xs"
                      >
                        Créer la Table
                      </button>
                    </div>
                  </form>
                )}

                {/* Tables Visual Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  {currentTables.map(table => {
                    const seatedGuests = currentGuests.filter(g => g.assignedTableName === table.name);
                    const isFull = seatedGuests.length >= table.capacity;

                    return (
                      <div key={table.id} className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <span className="font-bold text-slate-900 text-sm block">
                                {table.name}
                              </span>
                              <span className="text-[10px] text-slate-500 font-medium">
                                Forme : {table.shape === 'HONOR_U' ? 'Table d’Honneur' : table.shape === 'RECTANGULAR' ? 'Rectangulaire' : 'Ronde'}
                              </span>
                            </div>
                            <button
                              onClick={() => handleDeleteTable(table.id)}
                              className="text-slate-400 hover:text-rose-600 p-1"
                              title="Supprimer la table"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Capacity Badge */}
                          <div className="flex items-center justify-between my-2 p-2 bg-slate-50 rounded-lg">
                            <span className="text-slate-600 font-semibold">Occupation :</span>
                            <span className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                              isFull ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'
                            }`}>
                              {seatedGuests.length} / {table.capacity} places
                            </span>
                          </div>

                          {/* Seated Guests preview */}
                          <div className="space-y-1 mt-2">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">
                              Convives placés ({seatedGuests.length}) :
                            </span>
                            {seatedGuests.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {seatedGuests.map(sg => (
                                  <span key={sg.id} className="px-1.5 py-0.5 bg-slate-100 text-slate-800 rounded text-[10px] font-medium">
                                    {sg.fullName}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-slate-400 text-[11px] italic">Aucun convive placé</p>
                            )}
                          </div>
                        </div>

                        {table.assignedServerName && (
                          <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-600">
                            Service assuré par : <strong>{table.assignedServerName}</strong>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB CONTENT: 4. HOSTESSES */}
            {activeSubTab === 'HOSTESSES' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Hôtesses Affectées à l'Événement
                    </h4>
                    <span className="text-xs text-slate-500">
                      {currentHostesses.length} hôtesses en mission • {currentHostesses.filter(h => h.status === 'PRESENT').length} présentes sur site
                    </span>
                  </div>

                  <button
                    onClick={() => setShowAddHostessForm(!showAddHostessForm)}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{showAddHostessForm ? 'Fermer' : 'Affecter une Hôtesse'}</span>
                  </button>
                </div>

                {/* Inline Add Hostess Form */}
                {showAddHostessForm && (
                  <form onSubmit={handleAddQuickHostess} className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3 text-xs">
                    <span className="font-bold text-amber-950 block text-[11px] uppercase tracking-wider">
                      Nouvelle affectation d'hôtesse
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <input
                          type="text"
                          required
                          placeholder="Nom & Prénom..."
                          value={quickHostessName}
                          onChange={(e) => setQuickHostessName(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          required
                          placeholder="Poste (ex: Accueil VIP, Tapis Rouge...)"
                          value={quickHostessPost}
                          onChange={(e) => setQuickHostessPost(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                        />
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Uniforme..."
                          value={quickHostessUniform}
                          onChange={(e) => setQuickHostessUniform(e.target.value)}
                          className="flex-1 p-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg uppercase text-[11px]"
                        >
                          Valider
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {/* Hostesses Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Hôtesse</th>
                        <th className="p-3">Poste d'Accueil & Mission</th>
                        <th className="p-3">Tenue & Uniforme</th>
                        <th className="p-3">Vacation</th>
                        <th className="p-3 text-center">Émargement Présence</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentHostesses.map(h => (
                        <tr key={h.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                            <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0">
                              {h.fullName.slice(0, 2).toUpperCase()}
                            </span>
                            <span>{h.fullName}</span>
                          </td>
                          <td className="p-3 font-semibold text-slate-800">
                            {h.assignedPost}
                          </td>
                          <td className="p-3 text-slate-600">
                            {h.uniformInfo || 'Uniforme officiel'}
                          </td>
                          <td className="p-3 font-mono text-slate-500">
                            {h.shiftTime || '16:00 - 01:00'}
                          </td>
                          <td className="p-3 text-center">
                            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
                              <button
                                onClick={() => handleToggleHostessStatus(h.id, 'PRESENT')}
                                className={`px-2 py-1 rounded text-[10px] font-bold ${
                                  h.status === 'PRESENT' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:text-emerald-700'
                                }`}
                              >
                                Présente
                              </button>
                              <button
                                onClick={() => handleToggleHostessStatus(h.id, 'LATE')}
                                className={`px-2 py-1 rounded text-[10px] font-bold ${
                                  h.status === 'LATE' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:text-amber-700'
                                }`}
                              >
                                Retard
                              </button>
                              <button
                                onClick={() => handleToggleHostessStatus(h.id, 'CONFIRMED')}
                                className={`px-2 py-1 rounded text-[10px] font-bold ${
                                  h.status === 'CONFIRMED' || !h.status ? 'bg-slate-700 text-white' : 'text-slate-600 hover:text-slate-800'
                                }`}
                              >
                                Attendue
                              </button>
                            </div>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleDeleteHostess(h.id)}
                              className="text-slate-400 hover:text-rose-600 p-1"
                              title="Retirer cette hôtesse"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {currentHostesses.length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-6 text-center text-slate-400">
                            Aucune hôtesse enregistrée pour cet événement.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 5. CATERER & SERVERS */}
            {activeSubTab === 'CATERER' && (
              <div className="space-y-4">
                {/* Caterer Company Overview */}
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                        Partenaire Traiteur
                      </span>
                      <h4 className="text-base font-bold text-slate-900">
                        {selectedEvent.catererCompanyName || 'Maison Traiteur Partenaire'}
                      </h4>
                    </div>
                    {selectedEvent.catererHeadButler && (
                      <span className="px-3 py-1 bg-white border border-emerald-300 rounded-lg text-emerald-900 font-semibold text-xs">
                        Maître d'Hôtel : <strong>{selectedEvent.catererHeadButler}</strong>
                      </span>
                    )}
                  </div>
                  {selectedEvent.catererNotes && (
                    <p className="text-slate-700 pt-1 border-t border-emerald-200/60 leading-relaxed">
                      <strong>Consignes :</strong> {selectedEvent.catererNotes}
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Brigade des Serveurs du Traiteur
                    </h4>
                    <span className="text-xs text-slate-500">
                      {currentServers.length} serveurs engagés pour le service en salle & cocktail
                    </span>
                  </div>

                  <button
                    onClick={() => setShowAddServerForm(!showAddServerForm)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{showAddServerForm ? 'Fermer' : 'Ajouter un Serveur'}</span>
                  </button>
                </div>

                {/* Inline Add Server Form */}
                {showAddServerForm && (
                  <form onSubmit={handleAddQuickServer} className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-3 text-xs">
                    <span className="font-bold text-emerald-950 block text-[11px] uppercase tracking-wider">
                      Nouveau serveur traiteur
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <input
                          type="text"
                          required
                          placeholder="Nom & Prénom..."
                          value={quickServerName}
                          onChange={(e) => setQuickServerName(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                        />
                      </div>
                      <div>
                        <select
                          value={quickServerRole}
                          onChange={(e) => setQuickServerRole(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold"
                        >
                          <option value="Maître d'Hôtel">Maître d'Hôtel</option>
                          <option value="Chef de Rang">Chef de Rang</option>
                          <option value="Sommelier">Sommelier</option>
                          <option value="Barman & Mixologue">Barman & Mixologue</option>
                          <option value="Serveur Cocktail">Serveur Cocktail</option>
                          <option value="Commis">Commis</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Zone (ex: Tables 1-3)..."
                          value={quickServerZone}
                          onChange={(e) => setQuickServerZone(e.target.value)}
                          className="flex-1 p-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg uppercase text-[11px]"
                        >
                          Valider
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {/* Servers Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Serveur</th>
                        <th className="p-3">Rôle / Spécialité</th>
                        <th className="p-3">Zone & Tables Assignées</th>
                        <th className="p-3">Vacation</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentServers.map(s => (
                        <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 font-bold text-slate-900">
                            {s.fullName}
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900">
                              {s.role}
                            </span>
                          </td>
                          <td className="p-3 font-semibold text-slate-800">
                            {s.assignedZone}
                          </td>
                          <td className="p-3 font-mono text-slate-500">
                            {s.shiftTime || '16:00 - 02:00'}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleDeleteServer(s.id)}
                              className="text-slate-400 hover:text-rose-600 p-1"
                              title="Retirer ce serveur"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {currentServers.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-slate-400">
                            Aucun serveur traiteur répertorié.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 6. BEVERAGES */}
            {activeSubTab === 'BEVERAGES' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Cave, Vins Fins & Gestion des Boissons
                    </h4>
                    <span className="text-xs text-slate-500">
                      {currentBeverages.length} références • {totalBottles} bouteilles / portions commandées • {totalConsumedBottles} consommées
                    </span>
                  </div>

                  <button
                    onClick={() => setShowAddBevForm(!showAddBevForm)}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{showAddBevForm ? 'Fermer' : 'Ajouter une Boisson'}</span>
                  </button>
                </div>

                {/* Inline Add Beverage Form */}
                {showAddBevForm && (
                  <form onSubmit={handleAddQuickBeverage} className="p-4 bg-purple-50/60 border border-purple-200 rounded-xl space-y-3 text-xs">
                    <span className="font-bold text-purple-950 block text-[11px] uppercase tracking-wider">
                      Nouvelle référence boisson
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          required
                          placeholder="Nom de la boisson..."
                          value={quickBevName}
                          onChange={(e) => setQuickBevName(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                        />
                      </div>
                      <div>
                        <select
                          value={quickBevCat}
                          onChange={(e) => setQuickBevCat(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                        >
                          <option value="CHAMPAGNE">Champagne</option>
                          <option value="WINE_RED">Vin Rouge</option>
                          <option value="WINE_WHITE">Vin Blanc</option>
                          <option value="COCKTAIL">Cocktail</option>
                          <option value="SOFT_WATER">Eaux & Softs</option>
                          <option value="SPIRITS">Spiritueux</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min="1"
                          required
                          placeholder="Qté"
                          value={quickBevQty}
                          onChange={(e) => setQuickBevQty(Number(e.target.value))}
                          className="w-20 p-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-bold"
                        />
                        <button
                          type="submit"
                          className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg uppercase text-[11px]"
                        >
                          Ajouter
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {/* Beverages Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Boisson & Marque</th>
                        <th className="p-3">Catégorie</th>
                        <th className="p-3">Stock Commandé</th>
                        <th className="p-3 text-center">Consommation Jour J</th>
                        <th className="p-3">Consignes & Température</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentBeverages.map(b => (
                        <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 font-bold text-slate-900">
                            {b.name}
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-900">
                              {b.category}
                            </span>
                          </td>
                          <td className="p-3 font-mono font-bold text-slate-800">
                            {b.quantityOrdered} {b.unit}
                          </td>
                          <td className="p-3 text-center">
                            <div className="inline-flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
                              <button
                                onClick={() => handleUpdateBeverageConsumed(b.id, -1)}
                                className="p-1 hover:bg-slate-200 rounded text-slate-700"
                                title="Diminuer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="font-mono font-bold px-1.5 text-purple-900">
                                {b.quantityConsumed || 0}
                              </span>
                              <button
                                onClick={() => handleUpdateBeverageConsumed(b.id, +1)}
                                className="p-1 hover:bg-slate-200 rounded text-slate-700"
                                title="Augmenter"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                          <td className="p-3 text-slate-500">
                            {b.temperatureOrService || 'Température normale'}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleDeleteBeverage(b.id)}
                              className="text-slate-400 hover:text-rose-600 p-1"
                              title="Retirer cette boisson"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {currentBeverages.length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-6 text-center text-slate-400">
                            Aucune boisson répertoriée pour cet événement.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 7. STAFF HR ASSIGNED */}
            {activeSubTab === 'STAFF' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Équipe Mobilisée & Émargement Présence
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {selectedEvent.assignments.length} collaborateur(s) affecté(s) • {selectedEvent.assignments.filter(a => a.checkInStatus === 'PRESENT').length} présent(s)
                    </span>
                  </div>
                  <button
                    onClick={() => setShowAssignForm(!showAssignForm)}
                    className="text-xs font-bold uppercase tracking-wider bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {showAssignForm ? 'Fermer le formulaire' : 'Affecter un collaborateur'}
                  </button>
                </div>

                {/* Inline Staff Assignment Form */}
                {showAssignForm && (
                  <form onSubmit={handleAddStaffAssignment} className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3 text-xs">
                    <span className="font-bold text-amber-950 block text-[11px] uppercase tracking-wider">
                      Nouvelle affectation sur cet événement
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                          Collaborateur RH
                        </label>
                        <select
                          value={selectedStaffToAdd}
                          onChange={(e) => setSelectedStaffToAdd(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:ring-1 focus:ring-amber-500 focus:outline-hidden"
                          required
                        >
                          <option value="">-- Sélectionner un profil --</option>
                          {staffList
                            .filter(s => !selectedEvent.assignments.some(a => a.userId === s.id))
                            .map((staff) => (
                              <option key={staff.id} value={staff.id}>
                                {staff.fullName} ({staff.staffCategory || staff.role} • {staff.uniformSize || 'T38'})
                              </option>
                            ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                          Poste & Mission Jour J
                        </label>
                        <input
                          type="text"
                          value={roleOnDayInput}
                          onChange={(e) => setRoleOnDayInput(e.target.value)}
                          placeholder="Ex: Maître d'hôtel Référent Salon VIP"
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:ring-1 focus:ring-amber-500 focus:outline-hidden"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                          Consignes de Briefing
                        </label>
                        <input
                          type="text"
                          value={briefingInput}
                          onChange={(e) => setBriefingInput(e.target.value)}
                          placeholder="Ex: Accueil officiel des délégations"
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:ring-1 focus:ring-amber-500 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowAssignForm(false)}
                        className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 rounded text-xs"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        disabled={!selectedStaffToAdd}
                        className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold rounded text-xs uppercase tracking-wider transition-colors shadow-xs"
                      >
                        Valider l'affectation
                      </button>
                    </div>
                  </form>
                )}

                {selectedEvent.assignments.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500">
                    <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    Aucun collaborateur n'est encore affecté à cet événement.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                    {selectedEvent.assignments.map((asg) => {
                      const staffUser = staffList.find(s => s.id === asg.userId);
                      return (
                        <div key={asg.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors text-xs">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden font-bold text-slate-700 flex items-center justify-center shrink-0">
                              {staffUser?.avatarUrl ? (
                                <img src={staffUser.avatarUrl} alt={staffUser.fullName} className="w-full h-full object-cover" />
                              ) : (
                                staffUser?.fullName.charAt(0) || '?'
                              )}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900 flex items-center gap-2">
                                {staffUser?.fullName}
                                <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded border border-slate-200">
                                  Taille : {staffUser?.uniformSize || 'N/A'}
                                </span>
                              </div>
                              <p className="text-amber-800 font-semibold text-[11px] mt-0.5">
                                Poste Jour J : {asg.roleOnDay}
                              </p>
                              {asg.briefingNotes && (
                                <p className="text-slate-500 text-[11px] italic mt-0.5">
                                  « {asg.briefingNotes} »
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex items-center bg-slate-100 p-0.5 rounded border border-slate-200">
                              <button
                                onClick={() => updateCheckIn(selectedEvent.id, asg.id, 'PRESENT')}
                                className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                                  asg.checkInStatus === 'PRESENT'
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-emerald-700'
                                }`}
                                title="Marquer Présent"
                              >
                                Présent
                              </button>
                              <button
                                onClick={() => updateCheckIn(selectedEvent.id, asg.id, 'LATE')}
                                className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                                  asg.checkInStatus === 'LATE'
                                    ? 'bg-amber-600 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-amber-700'
                                }`}
                                title="Marquer En retard"
                              >
                                Retard
                              </button>
                              <button
                                onClick={() => updateCheckIn(selectedEvent.id, asg.id, 'PENDING')}
                                className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                                  asg.checkInStatus === 'PENDING'
                                    ? 'bg-slate-700 text-white shadow-xs'
                                    : 'text-slate-500 hover:text-slate-700'
                                }`}
                                title="En attente"
                              >
                                Attendu
                              </button>
                            </div>

                            <button
                              onClick={() => removeStaffAssignment(selectedEvent.id, asg.id)}
                              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors"
                              title="Retirer l'affectation"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: 8. LOGISTICS */}
            {activeSubTab === 'LOGISTICS' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Matériel, Mobilier (Déco) & Équipement Traiteur Engagés
                  </span>
                </div>

                <form onSubmit={handleAddBooking} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                  <span className="font-bold text-slate-800 block uppercase tracking-wider text-[10px]">
                    Réserver du matériel supplémentaire :
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <select
                      value={selectedEquipToAdd}
                      onChange={(e) => setSelectedEquipToAdd(e.target.value)}
                      className="sm:col-span-2 p-2 border border-slate-300 rounded bg-white text-xs"
                    >
                      <option value="">Sélectionner une pièce dans le catalogue...</option>
                      <optgroup label="🏛️ Pôle Décoration & Mobilier (Tables, Chaises, Housses)">
                        {equipmentList.filter(e => e.domain === 'DECORATION').map(eq => (
                          <option key={eq.id} value={eq.id}>
                            {eq.name} ({eq.availableQty} {eq.unit} dispo)
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="🍽️ Pôle Service Traiteur & Buffet (Chafing, Plateaux, Verrerie)">
                        {equipmentList.filter(e => e.domain === 'CATERING').map(eq => (
                          <option key={eq.id} value={eq.id}>
                            {eq.name} ({eq.availableQty} {eq.unit} dispo)
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="👔 Pôle Vestiaire & Uniformes">
                        {equipmentList.filter(e => e.domain === 'WARDROBE').map(eq => (
                          <option key={eq.id} value={eq.id}>
                            {eq.name} ({eq.availableQty} {eq.unit} dispo)
                          </option>
                        ))}
                      </optgroup>
                    </select>

                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="1"
                        value={qtyToAdd}
                        onChange={(e) => setQtyToAdd(Number(e.target.value))}
                        placeholder="Qté"
                        className="w-20 p-2 border border-slate-300 rounded bg-white text-center text-xs font-mono"
                      />
                      <button
                        type="submit"
                        className="flex-1 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider rounded transition-colors"
                      >
                        Engager
                      </button>
                    </div>
                  </div>

                  {bookingError && (
                    <p className="text-rose-600 text-xs font-medium flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> {bookingError}
                    </p>
                  )}
                </form>

                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs bg-white">
                  {selectedEvent.bookedItems.length === 0 ? (
                    <div className="p-6 text-center text-slate-500">
                      Aucun matériel engagé pour cette réception.
                    </div>
                  ) : (
                    selectedEvent.bookedItems.map((booked) => {
                      const equip = equipmentList.find(e => e.id === booked.equipmentId);
                      return (
                        <div key={booked.id} className="p-3 flex items-center justify-between hover:bg-slate-50">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-500 font-bold shrink-0">
                              <Package className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <strong className="text-slate-900">{equip?.name || 'Matériel'}</strong>
                                {equip?.domain === 'DECORATION' && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-900 border border-amber-200 uppercase">
                                    Déco & Mobilier
                                  </span>
                                )}
                                {equip?.domain === 'CATERING' && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200 uppercase">
                                    Service Traiteur
                                  </span>
                                )}
                                {equip?.domain === 'WARDROBE' && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-100 text-purple-900 border border-purple-200 uppercase">
                                    Vestiaire
                                  </span>
                                )}
                              </div>
                              <p className="text-slate-500 text-[11px] mt-0.5">
                                Code : {equip?.referenceCode} • Emplacement : {equip?.locationWarehouse}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-mono">
                              {booked.quantity} {equip?.unit || 'pièces'}
                            </span>

                            <select
                              value={booked.status}
                              onChange={(e) => updateBookingStatus(selectedEvent.id, booked.id, e.target.value as any)}
                              className="text-[11px] p-1 border border-slate-300 rounded bg-white"
                            >
                              <option value="RESERVED">Réservé Entrepôt</option>
                              <option value="DISPATCHED">Expédié sur le Jour J</option>
                              <option value="CHECKED">Vérifié sur Site</option>
                              <option value="RETURNED">Retourné & Réintégré</option>
                            </select>

                            <button
                              onClick={() => removeEquipmentBooking(selectedEvent.id, booked.id)}
                              className="p-1 text-rose-500 hover:text-rose-700"
                              title="Annuler la réservation"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: 9. ROUTING SHEET & PRINT */}
            {activeSubTab === 'ROUTING' && (
              <div className="space-y-4">
                <div className="p-6 bg-slate-50 border border-slate-300 rounded-xl space-y-5 text-xs font-sans print:bg-white print:border-none">
                  {/* Header of Printable Sheet */}
                  <div className="flex justify-between items-start border-b border-slate-300 pb-4">
                    <div>
                      <h4 className="font-serif text-lg font-bold text-slate-900 uppercase">
                        Feuille de Route Globale & Ordre de Mission Jour J
                      </h4>
                      <p className="text-xs text-amber-700 font-bold uppercase tracking-widest mt-0.5">
                        BLESSING EVENT • HAUTE RÉCEPTION & PROTOCOLE
                      </p>
                    </div>
                    <button
                      onClick={() => window.print()}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-400" /> Imprimer le Document
                    </button>
                  </div>

                  {/* Couple or Honored Hosts summary */}
                  {selectedEvent.couple && (
                    <div className="p-3 bg-white border border-rose-200 rounded-lg">
                      <strong className="text-rose-900 uppercase text-[10px] block">
                        {selectedEvent.couple.title || 'Couple Célébré'} :
                      </strong>
                      <span className="text-sm font-bold text-slate-900">
                        {selectedEvent.couple.partner1} & {selectedEvent.couple.partner2}
                      </span>
                      {selectedEvent.couple.notes && (
                        <p className="text-slate-500 text-xs italic mt-0.5">« {selectedEvent.couple.notes} »</p>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p><strong>Réception :</strong> {selectedEvent.title}</p>
                      <p><strong>Client :</strong> {selectedEvent.clientName}</p>
                      <p><strong>Date & Horaires :</strong> {selectedEvent.startDate} ({selectedEvent.startTime} - {selectedEvent.endTime})</p>
                      <p><strong>Lieu :</strong> {selectedEvent.location}</p>
                    </div>
                    <div className="space-y-1">
                      <p><strong>Niveau Protocolaire :</strong> {selectedEvent.vipProtocolLevel}</p>
                      <p><strong>Dress Code Requis :</strong> {selectedEvent.dressCodeRequired}</p>
                      <p><strong>Traiteur Partenaire :</strong> {selectedEvent.catererCompanyName || 'Interne'}</p>
                      <p><strong>Invités :</strong> {selectedEvent.guestCount} attendus ({totalSeats} places assises)</p>
                    </div>
                  </div>

                  {/* Hostesses Call Sheet */}
                  {currentHostesses.length > 0 && (
                    <div className="mt-3">
                      <h5 className="font-bold text-slate-900 uppercase text-[10px] mb-1.5">
                        1. Hôtesses de Réception & Postes d'Accueil :
                      </h5>
                      <table className="w-full border-collapse border border-slate-300 text-left bg-white text-[11px]">
                        <thead className="bg-slate-100">
                          <tr>
                            <th className="border border-slate-300 p-2 font-bold">Hôtesse</th>
                            <th className="border border-slate-300 p-2 font-bold">Poste d'Accueil</th>
                            <th className="border border-slate-300 p-2 font-bold">Tenue Assignée</th>
                            <th className="border border-slate-300 p-2 font-bold">Vacation</th>
                            <th className="border border-slate-300 p-2 text-center font-bold">Émargement</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentHostesses.map(h => (
                            <tr key={h.id}>
                              <td className="border border-slate-300 p-2 font-bold">{h.fullName}</td>
                              <td className="border border-slate-300 p-2">{h.assignedPost}</td>
                              <td className="border border-slate-300 p-2">{h.uniformInfo || 'Tailleur officiel'}</td>
                              <td className="border border-slate-300 p-2 font-mono">{h.shiftTime || 'Jour J'}</td>
                              <td className="border border-slate-300 p-2 text-center text-slate-400 italic">
                                {h.status === 'PRESENT' ? '✓ PRÉSENTE' : '___________________'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Caterer Servers Call Sheet */}
                  {currentServers.length > 0 && (
                    <div className="mt-3">
                      <h5 className="font-bold text-slate-900 uppercase text-[10px] mb-1.5">
                        2. Brigade Traiteur ({selectedEvent.catererCompanyName || 'Maison Traiteur'}) :
                      </h5>
                      <table className="w-full border-collapse border border-slate-300 text-left bg-white text-[11px]">
                        <thead className="bg-slate-100">
                          <tr>
                            <th className="border border-slate-300 p-2 font-bold">Personnel</th>
                            <th className="border border-slate-300 p-2 font-bold">Rôle / Rang</th>
                            <th className="border border-slate-300 p-2 font-bold">Zone & Tables Affectées</th>
                            <th className="border border-slate-300 p-2 font-bold">Horaires</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentServers.map(s => (
                            <tr key={s.id}>
                              <td className="border border-slate-300 p-2 font-bold">{s.fullName}</td>
                              <td className="border border-slate-300 p-2">{s.role}</td>
                              <td className="border border-slate-300 p-2">{s.assignedZone}</td>
                              <td className="border border-slate-300 p-2 font-mono">{s.shiftTime}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Beverages Inventory Summary */}
                  {currentBeverages.length > 0 && (
                    <div className="mt-3">
                      <h5 className="font-bold text-slate-900 uppercase text-[10px] mb-1.5">
                        3. Cave, Vins & Boissons Prévues ({totalBottles} bouteilles / doses) :
                      </h5>
                      <table className="w-full border-collapse border border-slate-300 text-left bg-white text-[11px]">
                        <thead className="bg-slate-100">
                          <tr>
                            <th className="border border-slate-300 p-2 font-bold">Boisson</th>
                            <th className="border border-slate-300 p-2 font-bold">Catégorie</th>
                            <th className="border border-slate-300 p-2 font-bold">Stock Commandé</th>
                            <th className="border border-slate-300 p-2 font-bold">Consignes & Température</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentBeverages.map(b => (
                            <tr key={b.id}>
                              <td className="border border-slate-300 p-2 font-bold">{b.name}</td>
                              <td className="border border-slate-300 p-2">{b.category}</td>
                              <td className="border border-slate-300 p-2 font-mono font-bold">{b.quantityOrdered} {b.unit}</td>
                              <td className="border border-slate-300 p-2">{b.temperatureOrService || 'Normal'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Tables Seating Plan Summary */}
                  {currentTables.length > 0 && (
                    <div className="mt-3">
                      <h5 className="font-bold text-slate-900 uppercase text-[10px] mb-1.5">
                        4. Plan de Tables & Capacités Assises ({totalSeats} places) :
                      </h5>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {currentTables.map(t => (
                          <div key={t.id} className="p-2 bg-white border border-slate-300 rounded">
                            <span className="font-bold text-slate-900 block">{t.name}</span>
                            <span className="text-slate-600 font-mono text-[10px]">{t.capacity} places • {t.shape}</span>
                            {t.assignedServerName && (
                              <p className="text-[10px] text-slate-500 mt-0.5">Serveur : {t.assignedServerName}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        ) : (
          <div className="lg:col-span-8 p-12 text-center bg-white border border-slate-200 rounded-xl text-slate-500">
            Sélectionnez un événement pour afficher ses détails.
          </div>
        )}
      </div>
      )}

      {/* Edit Event Modal */}
      <EditEventModal
        event={eventToEdit}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEventToEdit(null);
        }}
      />

      {/* Batch Uniform Modal */}
      <UniformBatchModal
        isOpen={isBatchUniformModalOpen}
        defaultModelName={selectedEvent?.dressCodeRequired}
        onClose={() => setIsBatchUniformModalOpen(false)}
      />
    </div>
  );
};
