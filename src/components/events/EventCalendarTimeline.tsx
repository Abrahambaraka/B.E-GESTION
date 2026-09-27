import React, { useState } from 'react';
import { EventItem, UserStaff, Equipment } from '../../types/event';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  Users, 
  UtensilsCrossed, 
  Sparkles, 
  Crown, 
  Heart, 
  Grid, 
  Wine, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  Eye, 
  Edit3, 
  FileDown, 
  Plus, 
  ArrowRight,
  Filter,
  DollarSign,
  Package
} from 'lucide-react';
import { detectAllOverlapsAndConflicts } from '../../utils/conflictUtils';
import { exportEventRoadmapToCSV, downloadCSV } from '../../utils/exportUtils';

interface EventCalendarTimelineProps {
  events: EventItem[];
  selectedEventId: string | null;
  onSelectEvent: (eventId: string) => void;
  onOpenEditModal: (event: EventItem) => void;
  onSwitchToListView: (eventId?: string) => void;
  openCreateModal: () => void;
  staffList: UserStaff[];
  equipmentList: Equipment[];
  openExportModal?: (type?: any, eventId?: string) => void;
}

export const EventCalendarTimeline: React.FC<EventCalendarTimelineProps> = ({
  events,
  selectedEventId,
  onSelectEvent,
  onOpenEditModal,
  onSwitchToListView,
  openCreateModal,
  staffList,
  equipmentList,
  openExportModal
}) => {
  // Default to September 2026 where default events are located
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 8, 1));
  const [viewStyle, setViewStyle] = useState<'COMBINED' | 'CALENDAR' | 'TIMELINE'>('COMBINED');
  const [selectedDayEvents, setSelectedDayEvents] = useState<{ date: string; events: EventItem[] } | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDayEvents(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDayEvents(null);
  };

  const handleResetToSept2026 = () => {
    setCurrentDate(new Date(2026, 8, 1));
    setSelectedDayEvents(null);
  };

  // Month formatting in French
  const monthName = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(currentDate);
  const formattedMonthTitle = monthName.charAt(0).toUpperCase() + monthName.slice(1);

  // Month days calculation
  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Monday = 0, Sunday = 6
  let startingDayOfWeek = firstDayOfMonth.getDay() - 1;
  if (startingDayOfWeek === -1) startingDayOfWeek = 6;

  // Filter events active in this month
  const monthString = `${year}-${String(month + 1).padStart(2, '0')}`;
  
  const monthEvents = events.filter(e => {
    if (!e.startDate) return false;
    const startMonth = e.startDate.slice(0, 7);
    const endMonth = e.endDate ? e.endDate.slice(0, 7) : startMonth;
    return startMonth === monthString || endMonth === monthString;
  });

  // Calculate Metrics for the period
  const totalGuests = monthEvents.reduce((acc, e) => acc + (e.guestCount || 0), 0);
  const totalBudget = monthEvents.reduce((acc, e) => acc + (e.budget || 0), 0);
  
  const totalHostessesMobilized = monthEvents.reduce((acc, e) => acc + (e.hostesses?.length || 0), 0);
  const totalServersMobilized = monthEvents.reduce((acc, e) => acc + (e.catererServers?.length || 0), 0);
  const totalTablesMobilized = monthEvents.reduce((acc, e) => acc + (e.tables?.length || 0), 0);
  
  const totalEquipmentPiecesBooked = monthEvents.reduce((acc, e) => {
    return acc + (e.bookedItems?.reduce((sub, b) => sub + (b.quantity || 0), 0) || 0);
  }, 0);

  // Overlap and Conflict Detection
  const allOverlapReports = detectAllOverlapsAndConflicts(events);
  const currentMonthOverlaps = allOverlapReports.filter(r => r.date.startsWith(monthString));
  const staffConflictsInMonth = currentMonthOverlaps.flatMap(r => r.staffConflicts);

  // Helper to get events for a specific day
  const getEventsForDay = (dayNum: number): EventItem[] => {
    const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    return events.filter(e => {
      if (e.startDate === dayStr) return true;
      if (e.startDate && e.endDate && dayStr >= e.startDate && dayStr <= e.endDate) return true;
      return false;
    });
  };

  const getEventTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'DIPLOMATIC':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'WEDDING':
        return 'bg-rose-100 text-rose-900 border-rose-300';
      case 'GALA':
        return 'bg-amber-100 text-amber-950 border-amber-300';
      case 'CORPORATE':
        return 'bg-sky-100 text-sky-900 border-sky-300';
      case 'PRIVATE':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const getEventTypeName = (type: string) => {
    switch (type) {
      case 'DIPLOMATIC': return 'Sommet Diplomatique';
      case 'WEDDING': return 'Mariage d\'Apparat';
      case 'GALA': return 'Gala de Prestige';
      case 'CORPORATE': return 'Soirée Corporate VIP';
      case 'PRIVATE': return 'Réception Privée';
      default: return type;
    }
  };

  const formatEuro = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleExportRoadmap = (evt: EventItem) => {
    if (openExportModal) {
      openExportModal('ROADMAP', evt.id);
    } else {
      const csv = exportEventRoadmapToCSV(evt, staffList, equipmentList);
      downloadCSV(`Blessing_Event_Feuille_De_Route_${evt.title.replace(/\s+/g, '_')}.csv`, csv);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Period KPIs & Charge Opérationnelle */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Réceptions prévues</span>
            <CalendarIcon className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold font-serif text-slate-900">
            {monthEvents.length} <span className="text-xs font-sans font-normal text-slate-500">événements</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block truncate">
            Mois de {monthName}
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Convives attendus</span>
            <Users className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900">
            {totalGuests.toLocaleString('fr-FR')} <span className="text-xs font-sans font-normal text-slate-500">invités</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block truncate">
            {totalTablesMobilized} tables dressées
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Mobilisation RH</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900">
            {totalHostessesMobilized + totalServersMobilized} <span className="text-xs font-sans font-normal text-slate-500">extras</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block truncate">
            {totalHostessesMobilized} hôtesses • {totalServersMobilized} serveurs
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Matériel & Art de la table</span>
            <Package className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900">
            {totalEquipmentPiecesBooked} <span className="text-xs font-sans font-normal text-slate-500">pièces</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block truncate">
            Mobilier, verrerie & vaisselle
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Budget Engagé</span>
            <DollarSign className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-lg font-bold font-mono text-amber-700">
            {formatEuro(totalBudget)}
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block truncate">
            Logistique, traiteur & régie
          </span>
        </div>
      </div>

      {/* Date Overlaps & Staff Conflict Warning Banner */}
      {staffConflictsInMonth.length > 0 ? (
        <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl shadow-xs text-xs space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5 text-rose-900 font-bold">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>ALERTE CONFLIT RH : Double affectation détectée sur la même date !</span>
          </div>
          <p className="text-rose-800 text-[11px] leading-relaxed">
            Un ou plusieurs collaborateurs sont programmés simultanément sur deux réceptions distinctes le même soir. Veuillez réaffecter une ressource pour garantir le bon déroulement du service :
          </p>
          <div className="space-y-1 mt-1">
            {staffConflictsInMonth.map((conf, idx) => (
              <div key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-rose-300 rounded text-rose-900 font-medium text-[11px] mr-2 mb-1 shadow-2xs">
                <strong>{conf.staffName}</strong> assigné(e) sur : 
                <span className="text-slate-600 italic">{conf.eventTitles.join(' ET ')}</span>
              </div>
            ))}
          </div>
        </div>
      ) : currentMonthOverlaps.length > 0 ? (
        <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl shadow-xs text-xs flex items-start gap-2.5 text-amber-900 animate-in fade-in duration-200">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold flex items-center gap-2">
              <span>Vigilance Opérationnelle : Chevauchement de {currentMonthOverlaps.length} date(s)</span>
              <span className="px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 text-[10px] font-mono font-semibold">
                Multi-galas
              </span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Plusieurs événements se déroulent en simultané le même soir ({currentMonthOverlaps.map(r => `${r.date} : ${r.events.map(e => e.title).join(' & ')}`).join(' | ')}). Aucun doublon de personnel n'est en conflit direct, mais veillez à la disponibilité du matériel d'apparat et des uniformes.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs flex items-center justify-between text-emerald-900">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Continuité Opérationnelle Maîtrisée :</strong> Aucun chevauchement critique de date ni doublon de personnel détecté pour {monthName}.
            </span>
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold px-2 py-0.5 rounded bg-emerald-100 hidden sm:inline-block">
            Ressources Cloisonnées
          </span>
        </div>
      )}

      {/* Calendar Controls & Sub-view Switcher */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Month Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 hover:bg-white text-slate-700 rounded-md transition-colors"
              title="Mois précédent"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-3 py-1 font-serif font-bold text-slate-900 text-sm sm:text-base min-w-[170px] text-center">
              {formattedMonthTitle}
            </div>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 hover:bg-white text-slate-700 rounded-md transition-colors"
              title="Mois suivant"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleResetToSept2026}
            className="px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg font-medium transition-colors"
          >
            Septembre 2026 (Actif)
          </button>
        </div>

        {/* View Style Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setViewStyle('COMBINED')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                viewStyle === 'COMBINED'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Vue Complète (Grille + Timeline)
            </button>
            <button
              type="button"
              onClick={() => setViewStyle('CALENDAR')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                viewStyle === 'CALENDAR'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Grille Seule
            </button>
            <button
              type="button"
              onClick={() => setViewStyle('TIMELINE')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                viewStyle === 'TIMELINE'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Timeline Seule
            </button>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shadow-xs shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Créer</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. MONTH CALENDAR GRID                                    */}
      {/* ========================================================= */}
      {(viewStyle === 'COMBINED' || viewStyle === 'CALENDAR') && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 bg-slate-900 text-white text-xs font-semibold text-center border-b border-slate-800">
            {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map((day, idx) => (
              <div key={day} className={`py-2.5 ${idx >= 5 ? 'text-amber-300' : 'text-slate-200'}`}>
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 bg-slate-50/50">
            {/* Empty padding cells before 1st of month */}
            {Array.from({ length: startingDayOfWeek }).map((_, idx) => (
              <div key={`empty-${idx}`} className="min-h-[110px] p-2 bg-slate-100/40 text-slate-300 select-none" />
            ))}

            {/* Days of Month */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const dayEvents = getEventsForDay(dayNum);
              const hasEvents = dayEvents.length > 0;
              const hasMultiEvents = dayEvents.length > 1;

              return (
                <div
                  key={`day-${dayNum}`}
                  className={`min-h-[120px] p-2 transition-all flex flex-col justify-between ${
                    hasMultiEvents
                      ? 'bg-amber-50/40 ring-1 ring-amber-300/60'
                      : hasEvents
                      ? 'bg-white'
                      : 'bg-white/80 hover:bg-slate-50'
                  }`}
                >
                  {/* Day header */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-xs font-mono font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                      hasEvents 
                        ? 'bg-slate-900 text-white' 
                        : 'text-slate-700'
                    }`}>
                      {dayNum}
                    </span>

                    {hasMultiEvents && (
                      <span 
                        className="px-1.5 py-0.2 rounded bg-amber-500 text-white text-[9px] font-bold uppercase tracking-wider flex items-center gap-0.5"
                        title="Plusieurs réceptions programmées ce jour"
                      >
                        ⚡ {dayEvents.length} Galas
                      </span>
                    )}
                  </div>

                  {/* Day Event Cards */}
                  <div className="space-y-1.5 flex-1">
                    {dayEvents.map(evt => {
                      const isSelected = selectedEventId === evt.id;
                      const hostessCount = evt.hostesses?.length || 0;
                      const serverCount = evt.catererServers?.length || 0;

                      return (
                        <div
                          key={evt.id}
                          onClick={() => {
                            onSelectEvent(evt.id);
                            setSelectedDayEvents({ date: dayStr, events: dayEvents });
                          }}
                          className={`p-1.5 rounded-lg border text-[11px] cursor-pointer transition-all duration-150 relative group ${
                            isSelected 
                              ? 'ring-2 ring-amber-500 shadow-sm' 
                              : ''
                          } ${getEventTypeBadgeClass(evt.type)}`}
                        >
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="font-mono text-[10px] font-bold text-slate-700 flex items-center gap-0.5">
                              <Clock className="w-2.5 h-2.5" />
                              {evt.startTime || '18:00'}
                            </span>
                            <span className="text-[9px] font-bold uppercase tracking-tight px-1 rounded bg-white/70 border border-black/10">
                              {evt.status === 'IN_PROGRESS' ? '⚡ Jour J' : 'Planifié'}
                            </span>
                          </div>

                          <div className="font-serif font-bold text-slate-900 line-clamp-1 group-hover:text-amber-700 transition-colors">
                            {evt.title}
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-slate-600 mt-1">
                            <span className="truncate max-w-[85px]">{evt.clientName}</span>
                            <span className="font-mono text-slate-700 shrink-0 font-semibold">
                              👥 {hostessCount + serverCount} RH
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Bottom Day Info */}
                  {hasEvents && (
                    <div className="pt-1 mt-1 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <span>{dayEvents.reduce((s, e) => s + (e.guestCount || 0), 0)} convives</span>
                      <button
                        type="button"
                        onClick={() => setSelectedDayEvents({ date: dayStr, events: dayEvents })}
                        className="text-amber-600 hover:text-amber-800 font-semibold hover:underline"
                      >
                        Zoom
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Day Zoom Modal/Drawer if clicked on day zoom */}
      {selectedDayEvents && (
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-white shadow-xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-amber-400" />
              <div>
                <h4 className="font-serif font-bold text-base text-white">
                  Réceptions du {selectedDayEvents.date}
                </h4>
                <p className="text-xs text-slate-400">
                  {selectedDayEvents.events.length} réception(s) programmée(s) pour cette date.
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedDayEvents(null)}
              className="px-2.5 py-1 text-xs text-slate-400 hover:text-white bg-slate-800 rounded-md"
            >
              Fermer le zoom
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedDayEvents.events.map(ev => (
              <div key={ev.id} className="p-3 bg-slate-800/80 rounded-lg border border-slate-700 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {getEventTypeName(ev.type)}
                    </span>
                    <h5 className="font-serif font-bold text-white text-sm mt-1">{ev.title}</h5>
                    <p className="text-xs text-slate-400">{ev.clientName} • {ev.location}</p>
                  </div>
                  <span className="font-mono text-xs text-amber-400 font-bold">{ev.startTime} - {ev.endTime}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs bg-slate-900/60 p-2 rounded border border-slate-800">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Jauge</span>
                    <strong className="text-slate-200 font-mono">{ev.guestCount} pers.</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Hôtesses</span>
                    <strong className="text-slate-200 font-mono">{ev.hostesses?.length || 0} profils</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Brigade</span>
                    <strong className="text-slate-200 font-mono">{ev.catererServers?.length || 0} serveurs</strong>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => {
                      onSelectEvent(ev.id);
                      onOpenEditModal(ev);
                    }}
                    className="px-2.5 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-white rounded font-medium transition-colors flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-slate-300" />
                    <span>Modifier</span>
                  </button>
                  <button
                    onClick={() => {
                      onSelectEvent(ev.id);
                      onSwitchToListView(ev.id);
                    }}
                    className="px-3 py-1 text-xs bg-amber-500 hover:bg-amber-600 text-white rounded font-semibold transition-colors flex items-center gap-1 shadow-xs"
                  >
                    <span>Ouvrir la fiche complète</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. CHRONOLOGICAL TIMELINE & RESOURCE LOAD BREAKDOWN       */}
      {/* ========================================================= */}
      {(viewStyle === 'COMBINED' || viewStyle === 'TIMELINE') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                Planning Chronologique & Charge RH / Matériel ({monthEvents.length} réceptions)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Vue d'ensemble de la mobilisation des effectifs d'accueil, des maîtres d'hôtel et de la dotation logistique.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {monthEvents
              .sort((a, b) => a.startDate.localeCompare(b.startDate))
              .map((evt, idx) => {
                const isSelected = selectedEventId === evt.id;
                const hostesses = evt.hostesses || [];
                const servers = evt.catererServers || [];
                const tables = evt.tables || [];
                const booked = evt.bookedItems || [];
                const beverages = evt.beverages || [];

                return (
                  <div
                    key={evt.id}
                    className={`bg-white border rounded-xl overflow-hidden transition-all shadow-2xs ${
                      isSelected 
                        ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-md' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* Event Banner */}
                    <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
                      
                      <div className="flex items-start gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center shrink-0 border border-slate-800 shadow-2xs">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                            {new Date(evt.startDate).toLocaleDateString('fr-FR', { month: 'short' })}
                          </span>
                          <span className="text-lg font-bold font-mono leading-none">
                            {new Date(evt.startDate).getDate()}
                          </span>
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getEventTypeBadgeClass(evt.type)}`}>
                              {getEventTypeName(evt.type)}
                            </span>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                              evt.status === 'IN_PROGRESS' 
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}>
                              {evt.status === 'IN_PROGRESS' ? '⚡ Jour J' : 'Planifié'}
                            </span>
                            <span className="text-[10px] bg-amber-50 text-amber-900 font-bold px-2 py-0.5 rounded border border-amber-300 flex items-center gap-1">
                              <Crown className="w-3 h-3 text-amber-600" /> {evt.vipProtocolLevel || 'PRESTIGE'}
                            </span>
                          </div>

                          <h4 className="font-serif font-bold text-slate-900 text-base sm:text-lg">
                            {evt.title}
                          </h4>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
                            <span className="font-medium text-slate-700">{evt.clientName}</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              {evt.location}
                            </span>
                            <span className="flex items-center gap-1 font-mono text-slate-700">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {evt.startTime} - {evt.endTime}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Action buttons */}
                      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                        <button
                          type="button"
                          onClick={() => handleExportRoadmap(evt)}
                          className="px-2.5 py-1.5 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-lg text-xs font-medium transition-colors border border-slate-200 flex items-center gap-1"
                          title="Télécharger la feuille de route CSV"
                        >
                          <FileDown className="w-3.5 h-3.5 text-slate-500" />
                          <span className="hidden sm:inline">Feuille de Route</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenEditModal(evt)}
                          className="px-2.5 py-1.5 text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-lg text-xs font-semibold transition-colors border border-slate-200 flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Modifier</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onSelectEvent(evt.id);
                            onSwitchToListView(evt.id);
                          }}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Fiche Détail</span>
                        </button>
                      </div>
                    </div>

                    {/* Resources Breakdown Grid */}
                    <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      
                      {/* 1. Human Resources Breakdown */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between font-serif font-bold text-slate-900 text-xs border-b border-slate-200 pb-1.5">
                          <span className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-amber-600" />
                            Dispositif RH ({hostesses.length + servers.length} pers.)
                          </span>
                          <span className="text-[10px] text-slate-500 font-sans font-normal">
                            Accueil & Service
                          </span>
                        </div>

                        {/* Hostesses */}
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                            Pôle Hôtesses ({hostesses.length}) :
                          </span>
                          {hostesses.length > 0 ? (
                            <div className="space-y-1">
                              {hostesses.map(h => (
                                <div key={h.id} className="flex items-center justify-between text-[11px] bg-white p-1.5 rounded border border-slate-200">
                                  <span className="font-semibold text-slate-800">{h.fullName}</span>
                                  <span className="text-[10px] text-slate-500 truncate max-w-[130px]">{h.assignedPost}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[11px] text-slate-400 italic">Aucune hôtesse enregistrée</p>
                          )}
                        </div>

                        {/* Servers */}
                        <div className="pt-1.5 border-t border-slate-200">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                            Brigade Traiteur ({servers.length}) :
                          </span>
                          {servers.length > 0 ? (
                            <div className="space-y-1">
                              {servers.slice(0, 3).map(s => (
                                <div key={s.id} className="flex items-center justify-between text-[11px] bg-white p-1.5 rounded border border-slate-200">
                                  <span className="font-semibold text-slate-800">{s.fullName}</span>
                                  <span className="text-[10px] text-slate-500 truncate max-w-[120px]">{s.role}</span>
                                </div>
                              ))}
                              {servers.length > 3 && (
                                <p className="text-[10px] text-slate-400 italic text-right">
                                  + {servers.length - 3} autre(s) serveur(s)
                                </p>
                              )}
                            </div>
                          ) : (
                            <p className="text-[11px] text-slate-400 italic">Aucun serveur enregistré</p>
                          )}
                        </div>
                      </div>

                      {/* 2. Tables & Guests Breakdown */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between font-serif font-bold text-slate-900 text-xs border-b border-slate-200 pb-1.5">
                          <span className="flex items-center gap-1.5">
                            <Grid className="w-3.5 h-3.5 text-sky-600" />
                            Tables & Convives ({evt.guestCount} pers.)
                          </span>
                          <span className="text-[10px] text-slate-500 font-sans font-normal">
                            {tables.length} tables
                          </span>
                        </div>

                        {evt.couple && (
                          <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-950">
                            <Heart className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            <div className="truncate">
                              <span className="text-[10px] font-bold uppercase tracking-wider block text-rose-800">Couple / Invités d'Honneur :</span>
                              <span className="text-xs font-serif font-bold truncate">
                                {evt.couple.partner1} & {evt.couple.partner2}
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                            Échantillon Plan de Tables :
                          </span>
                          {tables.length > 0 ? (
                            <div className="grid grid-cols-2 gap-1.5">
                              {tables.slice(0, 4).map(t => (
                                <div key={t.id} className="p-1.5 bg-white rounded border border-slate-200">
                                  <span className="font-bold text-slate-900 block truncate text-[11px]">{t.name}</span>
                                  <span className="text-[10px] text-slate-500 font-mono">{t.capacity} places</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[11px] text-slate-400 italic">Plan de table non configuré</p>
                          )}
                          {tables.length > 4 && (
                            <p className="text-[10px] text-slate-400 italic text-right mt-1">
                              + {tables.length - 4} table(s) supplémentaire(s)
                            </p>
                          )}
                        </div>
                      </div>

                      {/* 3. Logistics & Beverages Breakdown */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between font-serif font-bold text-slate-900 text-xs border-b border-slate-200 pb-1.5">
                          <span className="flex items-center gap-1.5">
                            <Wine className="w-3.5 h-3.5 text-amber-600" />
                            Logistique & Baromètre Boissons
                          </span>
                          <span className="text-[10px] text-slate-500 font-sans font-normal">
                            Dotation
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                            Matériel Mobilier & Apparat ({booked.length} réf.) :
                          </span>
                          {booked.length > 0 ? (
                            <div className="space-y-1">
                              {booked.slice(0, 3).map(b => (
                                <div key={b.id} className="flex items-center justify-between text-[11px] bg-white p-1.5 rounded border border-slate-200">
                                  <span className="text-slate-700 font-mono font-bold text-[10px]">Réf. {b.equipmentId}</span>
                                  <span className="font-mono text-slate-900 font-semibold">{b.quantity} pcs ({b.status})</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[11px] text-slate-400 italic">Matériel en attente de validation</p>
                          )}
                        </div>

                        <div className="pt-1.5 border-t border-slate-200">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                            Champagne & Grands Crus ({beverages.length} réf.) :
                          </span>
                          {beverages.length > 0 ? (
                            <div className="space-y-1">
                              {beverages.slice(0, 2).map(bev => (
                                <div key={bev.id} className="flex items-center justify-between text-[11px] bg-white p-1.5 rounded border border-slate-200">
                                  <span className="font-medium text-slate-800 truncate max-w-[130px]">{bev.name}</span>
                                  <span className="font-mono text-amber-700 font-bold">{bev.quantityOrdered} btles</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[11px] text-slate-400 italic">Aucune boisson sélectionnée</p>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

    </div>
  );
};
