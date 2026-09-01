import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { EventItem, EventType } from '../../types/event';
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
  FileDown
} from 'lucide-react';
import { NavigationTab } from '../layout/Navbar';
import { EditEventModal } from './EditEventModal';
import { ReportType } from '../export/ExportReportModal';
import { exportEventsToCSV, exportEventRoadmapToCSV, downloadCSV } from '../../utils/exportUtils';

interface EventManagementProps {
  setActiveTab: (tab: NavigationTab) => void;
  openCreateModal: () => void;
  openExportModal?: (type?: ReportType, eventId?: string) => void;
}

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
    bookEquipmentForEvent,
    currentRole
  } = useEvent();

  const [activeSubTab, setActiveSubTab] = useState<'DETAILS' | 'STAFF' | 'LOGISTICS' | 'ROUTING'>('DETAILS');
  const [selectedEquipToAdd, setSelectedEquipToAdd] = useState<string>('');
  const [qtyToAdd, setQtyToAdd] = useState<number>(10);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Edit Event Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<EventItem | null>(null);

  // Quick staff assignment form state
  const [selectedStaffToAdd, setSelectedStaffToAdd] = useState<string>('');
  const [roleOnDayInput, setRoleOnDayInput] = useState<string>('Hôtesse Accueil VIP');
  const [briefingInput, setBriefingInput] = useState<string>('');
  const [showAssignForm, setShowAssignForm] = useState<boolean>(false);

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

  const getEventTypeLabel = (t: EventType) => {
    switch (t) {
      case 'CORPORATE': return 'Gala & Soirée Corporate';
      case 'DIPLOMATIC': return 'Sommet & Réception Diplomatique';
      case 'WEDDING': return 'Mariage & Réception Privée';
      case 'GALA': return 'Gala Caritatif & Prestige';
      case 'PRIVATE': return 'Dîner Privé Confidentiel';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-serif font-bold text-slate-900">
            Gestion des Événements & Réceptions de Prestige
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Coordination protocolaire, affectation du personnel et logistique du Jour J.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {currentRole !== 'STAFF' && (
            <button
              id="create-event-top-btn"
              onClick={openCreateModal}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider rounded-md transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Nouvel Événement
            </button>
          )}
        </div>
      </div>

      {/* Main Split Grid: Event Selector on Left + Full Details on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Event List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Réceptions au Planning ({events.length})
            </span>
            <button 
              onClick={openCreateModal}
              className="text-xs text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Nouveau
            </button>
          </div>

          <div className="space-y-2.5">
            {events.map((evt) => {
              const isSelected = evt.id === selectedEvent?.id;
              const isLive = evt.status === 'IN_PROGRESS';

              return (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEventId(evt.id)}
                  className={`p-4 rounded-lg border text-left cursor-pointer transition-all group relative ${
                    isSelected
                      ? 'bg-slate-900 text-slate-100 border-amber-500 shadow-xs ring-1 ring-amber-500/40'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-amber-500/60 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      isLive 
                        ? 'bg-emerald-500 text-slate-950 font-bold animate-pulse' 
                        : isSelected 
                        ? 'bg-slate-800 text-amber-300' 
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {isLive ? 'Jour J (En cours)' : evt.type}
                    </span>
                    <span className={`text-xs font-mono ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {evt.startDate}
                    </span>
                  </div>

                  <h3 className={`font-serif font-bold text-sm line-clamp-2 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                    {evt.title}
                  </h3>

                  <p className={`text-xs mt-1 line-clamp-1 flex items-center gap-1 ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" /> {evt.location}
                  </p>

                  {/* Summary counts and quick action buttons */}
                  <div className={`mt-3 pt-2 border-t flex items-center justify-between text-xs ${
                    isSelected ? 'border-slate-800 text-slate-300' : 'border-slate-100 text-slate-500'
                  }`}>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" /> {evt.assignments.length} staff
                      </span>
                      <span className="flex items-center gap-1">
                        <Package className="w-3.5 h-3.5" /> {evt.bookedItems.length} matériels
                      </span>
                    </div>

                    {/* On-card quick action buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleOpenEdit(evt, e)}
                        title="Modifier l'événement"
                        className={`p-1.5 rounded transition-colors ${
                          isSelected 
                            ? 'text-slate-300 hover:text-white hover:bg-slate-800' 
                            : 'text-slate-500 hover:text-amber-600 hover:bg-amber-50'
                        }`}
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDuplicateEvent(evt, e)}
                        title="Dupliquer l'événement"
                        className={`p-1.5 rounded transition-colors ${
                          isSelected 
                            ? 'text-slate-300 hover:text-white hover:bg-slate-800' 
                            : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'
                        }`}
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      {currentRole === 'ADMIN' && (
                        <button
                          onClick={(e) => handleDeleteEvent(evt, e)}
                          title="Supprimer l'événement"
                          className={`p-1.5 rounded transition-colors ${
                            isSelected 
                              ? 'text-rose-400 hover:text-rose-300 hover:bg-rose-950/40' 
                              : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                          }`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Event Deep Dive (8 cols) */}
        {selectedEvent ? (
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-5">
            {/* Header with Title & Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                    Protocole {selectedEvent.vipProtocolLevel}
                  </span>
                  <span className="text-xs text-slate-500">
                    Client : <strong className="text-slate-800">{selectedEvent.clientName}</strong>
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    selectedEvent.status === 'IN_PROGRESS' 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                      : selectedEvent.status === 'COMPLETED'
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {selectedEvent.status === 'IN_PROGRESS' ? '⚡ Jour J (En cours)' : selectedEvent.status === 'COMPLETED' ? '✅ Terminé' : '📅 Planifié'}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-900">
                  {selectedEvent.title}
                </h3>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(selectedEvent)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-md transition-colors flex items-center gap-1.5 border border-slate-300"
                >
                  <Edit className="w-3.5 h-3.5 text-amber-600" /> Modifier
                </button>
                <button
                  onClick={() => handleDuplicateEvent(selectedEvent)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-md transition-colors flex items-center gap-1.5 border border-slate-300"
                  title="Créer une copie de cet événement"
                >
                  <Copy className="w-3.5 h-3.5 text-indigo-600" /> Dupliquer
                </button>
                <button
                  onClick={() => setActiveSubTab('STAFF')}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-md transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Users className="w-3.5 h-3.5 text-amber-400" /> Équipe ({selectedEvent.assignments.length})
                </button>
                {currentRole === 'ADMIN' && (
                  <button
                    onClick={() => handleDeleteEvent(selectedEvent)}
                    className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-md border border-rose-200 transition-colors"
                    title="Supprimer définitivement l'événement"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Sub Tabs Navigation */}
            <div className="flex flex-wrap gap-1.5 border-b border-slate-200 pb-2 text-xs">
              <button
                onClick={() => setActiveSubTab('DETAILS')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                  activeSubTab === 'DETAILS' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Fiche Protocolaire
              </button>
              <button
                onClick={() => setActiveSubTab('STAFF')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                  activeSubTab === 'STAFF' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Équipe Mobilisée ({selectedEvent.assignments.length})
              </button>
              <button
                onClick={() => setActiveSubTab('LOGISTICS')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                  activeSubTab === 'LOGISTICS' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Matériel Engagé ({selectedEvent.bookedItems.length})
              </button>
              <button
                onClick={() => setActiveSubTab('ROUTING')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                  activeSubTab === 'ROUTING' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Feuille de Route & Print
              </button>
            </div>

            {/* Sub Tab 1: Fiche Protocolaire Details */}
            {activeSubTab === 'DETAILS' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 bg-slate-50 rounded-md border border-slate-200 space-y-2">
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

                  <div className="p-3.5 bg-slate-50 rounded-md border border-slate-200 space-y-2">
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
                  <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-md text-xs space-y-1">
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

            {/* Sub Tab 2: Staff Assigned & Attendance */}
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
                  {currentRole !== 'STAFF' && (
                    <button
                      onClick={() => setShowAssignForm(!showAssignForm)}
                      className="text-xs font-bold uppercase tracking-wider bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      {showAssignForm ? 'Fermer le formulaire' : 'Affecter un collaborateur'}
                    </button>
                  )}
                </div>

                {/* Inline Staff Assignment Form */}
                {showAssignForm && (
                  <form onSubmit={handleAddStaffAssignment} className="p-4 bg-amber-50/70 border border-amber-200 rounded-lg space-y-3 text-xs">
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
                                {staff.fullName} ({staff.jobTitle} • {staff.uniformSize})
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
                  <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-500">
                    <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    Aucun collaborateur n'est encore affecté à cet événement.
                    {currentRole !== 'STAFF' && (
                      <button
                        onClick={() => setShowAssignForm(true)}
                        className="mt-3 block mx-auto px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-md text-xs uppercase tracking-wider transition-colors"
                      >
                        Affecter des hôtesses et maîtres d'hôtel
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-md overflow-hidden bg-white">
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
                            {/* Attendance Quick Control */}
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

                            {currentRole !== 'STAFF' && (
                              <button
                                onClick={() => removeStaffAssignment(selectedEvent.id, asg.id)}
                                className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors"
                                title="Retirer l'affectation"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

                {/* Sub Tab 3: Logistics & Equipment Booked */}
                {activeSubTab === 'LOGISTICS' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Matériel, Mobilier (Déco) & Équipement Traiteur Engagés
                      </span>
                    </div>

                    {/* Equipment reservation addition form */}
                    {currentRole !== 'STAFF' && (
                      <form onSubmit={handleAddBooking} className="p-3.5 bg-slate-50 border border-slate-200 rounded-md space-y-2 text-xs">
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
                    )}

                    {/* Booked Items List */}
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-md overflow-hidden text-xs bg-white">
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
                                    <strong className="text-slate-900">{equip?.name || 'Matériel supprimé'}</strong>
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

                                {currentRole !== 'STAFF' && (
                                  <button
                                    onClick={() => removeEquipmentBooking(selectedEvent.id, booked.id)}
                                    className="p-1 text-rose-500 hover:text-rose-700"
                                    title="Annuler la réservation"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}

            {/* Sub Tab 4: Printable Routing Sheet / Call Sheet */}
            {activeSubTab === 'ROUTING' && (
              <div className="space-y-4">
                <div className="p-6 bg-slate-50 border border-slate-300 rounded-lg space-y-4 text-xs font-sans print:bg-white print:border-none">
                  {/* Header of Printable Sheet */}
                  <div className="flex justify-between items-start border-b border-slate-300 pb-4">
                    <div>
                      <h4 className="font-serif text-lg font-bold text-slate-900">
                        FEUILLE DE ROUTE & ORDRE DE MISSION JOUR J
                      </h4>
                      <p className="text-xs text-amber-700 font-bold uppercase tracking-widest">
                        BLESSING EVENT • ART DE RECEVOIR & PROTOCOLE
                      </p>
                    </div>
                    <button
                      onClick={() => window.print()}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-400" /> Imprimer la Fiche
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p><strong>Réception :</strong> {selectedEvent.title}</p>
                      <p><strong>Client / Institution :</strong> {selectedEvent.clientName}</p>
                      <p><strong>Date & Horaires :</strong> {selectedEvent.startDate} ({selectedEvent.startTime} - {selectedEvent.endTime})</p>
                      <p><strong>Lieu :</strong> {selectedEvent.location}</p>
                    </div>
                    <div className="space-y-1">
                      <p><strong>Niveau Protocolaire :</strong> {selectedEvent.vipProtocolLevel}</p>
                      <p><strong>Dress Code Impératif :</strong> {selectedEvent.dressCodeRequired}</p>
                      <p><strong>Effectif Personnel Mobilisé :</strong> {selectedEvent.assignments.length} collaborateurs</p>
                    </div>
                  </div>

                  {/* Staff Call Sheet Table */}
                  <div className="mt-4">
                    <h5 className="font-bold text-slate-800 mb-2 uppercase tracking-wider text-[10px]">Tableau des Postes & Assignations du Personnel :</h5>
                    <table className="w-full border-collapse border border-slate-300 text-left bg-white">
                      <thead className="bg-slate-100">
                        <tr>
                          <th className="border border-slate-300 p-2 text-slate-700 font-bold">Collaborateur</th>
                          <th className="border border-slate-300 p-2 text-slate-700 font-bold">Catégorie</th>
                          <th className="border border-slate-300 p-2 text-slate-700 font-bold">Poste & Mission Jour J</th>
                          <th className="border border-slate-300 p-2 text-center text-slate-700 font-bold">Taille Tenue</th>
                          <th className="border border-slate-300 p-2 text-center text-slate-700 font-bold">Émargement Signature</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedEvent.assignments.map(asg => {
                          const user = staffList.find(s => s.id === asg.userId);
                          return (
                            <tr key={asg.id}>
                              <td className="border border-slate-300 p-2 font-semibold text-slate-900">{user?.fullName}</td>
                              <td className="border border-slate-300 p-2 text-slate-600">{user?.staffCategory}</td>
                              <td className="border border-slate-300 p-2 text-slate-800">{asg.roleOnDay}</td>
                              <td className="border border-slate-300 p-2 text-center text-slate-700 font-mono">{user?.uniformSize || '-'}</td>
                              <td className="border border-slate-300 p-2 text-center italic text-slate-400">
                                {asg.signature || '___________________'}
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
          </div>
        ) : (
          <div className="lg:col-span-8 p-12 text-center bg-white border border-slate-200 rounded-lg text-slate-500">
            Sélectionnez un événement pour afficher ses détails.
          </div>
        )}
      </div>

      {/* Edit Event Modal */}
      <EditEventModal
        event={eventToEdit}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEventToEdit(null);
        }}
      />
    </div>
  );
};

