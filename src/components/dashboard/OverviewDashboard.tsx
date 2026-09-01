import React from 'react';
import { useEvent } from '../../context/EventContext';
import { 
  Users, 
  Package, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Plus, 
  Sparkles, 
  Shield, 
  Languages, 
  Shirt, 
  MapPin, 
  Clock,
  ExternalLink,
  Crown
} from 'lucide-react';
import { NavigationTab } from '../layout/Navbar';

interface OverviewDashboardProps {
  setActiveTab: (tab: NavigationTab) => void;
  openNewEventModal: () => void;
  openNewStaffModal: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ 
  setActiveTab, 
  openNewEventModal, 
  openNewStaffModal 
}) => {
  const { staffList, equipmentList, events, setSelectedEventId } = useEvent();

  const activeEvent = events.find(e => e.status === 'IN_PROGRESS') || events[0];
  const upcomingEvents = events.filter(e => e.status === 'PLANNED');
  
  // Calculate quick metrics
  const totalStaff = staffList.length;
  const vipCertifiedCount = staffList.filter(s => s.vipProtocolCertified).length;
  const assignedStaffCount = staffList.filter(s => s.status === 'ASSIGNED').length;
  const availableStaffCount = staffList.filter(s => s.status === 'AVAILABLE').length;

  const totalEquipmentItems = equipmentList.reduce((sum, eq) => sum + eq.totalQty, 0);
  const availableEquipmentItems = equipmentList.reduce((sum, eq) => sum + eq.availableQty, 0);
  const engagedRate = Math.round(((totalEquipmentItems - availableEquipmentItems) / (totalEquipmentItems || 1)) * 100);

  // Active event check-in status
  const totalEventAssignments = activeEvent?.assignments.length || 0;
  const presentCount = activeEvent?.assignments.filter(a => a.checkInStatus === 'PRESENT').length || 0;
  const lateCount = activeEvent?.assignments.filter(a => a.checkInStatus === 'LATE').length || 0;
  const pendingCount = activeEvent?.assignments.filter(a => a.checkInStatus === 'PENDING').length || 0;
  const presenceRate = totalEventAssignments > 0 ? Math.round(((presentCount + lateCount) / totalEventAssignments) * 100) : 0;

  // Alerts computation
  const alerts: { id: string; type: 'warning' | 'info' | 'critical'; title: string; desc: string; actionTab: NavigationTab }[] = [];
  
  // Alert for pending check-ins if event is in progress
  if (activeEvent?.status === 'IN_PROGRESS' && pendingCount > 0) {
    alerts.push({
      id: 'alt-checkin',
      type: 'warning',
      title: `${pendingCount} Émargement(s) en attente`,
      desc: `Sur l'événement en cours "${activeEvent.title.slice(0, 35)}..."`,
      actionTab: 'events'
    });
  }

  // Alert for events without staff assigned
  const eventsNeedingStaff = events.filter(e => e.assignments.length === 0);
  if (eventsNeedingStaff.length > 0) {
    alerts.push({
      id: 'alt-staff-need',
      type: 'critical',
      title: `${eventsNeedingStaff.length} Événement(s) sans personnel affecté`,
      desc: `Ex: ${eventsNeedingStaff[0].title.slice(0, 35)}...`,
      actionTab: 'events'
    });
  }

  // Check uniform assignment completeness
  const unassignedUniformCount = events.reduce((count, ev) => {
    return count + ev.assignments.filter(a => !a.assignedUniformId).length;
  }, 0);
  if (unassignedUniformCount > 0) {
    alerts.push({
      id: 'alt-uniform',
      type: 'info',
      title: `${unassignedUniformCount} Tenue(s) à calibrer`,
      desc: 'Affectez les uniformes aux hôtesses et maîtres d’hôtel selon leurs mensurations.',
      actionTab: 'uniforms'
    });
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-xs text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-500/30 flex items-center gap-1">
                <Crown className="w-3 h-3 text-amber-400" /> Direction des Opérations & Protocole
              </span>
            </div>
            <h1 className="text-xl lg:text-2xl font-serif font-bold text-white tracking-tight">
              Tableau de bord d'exploitation Blessing Event
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Supervision en temps réel des ressources humaines (hôtesses, maîtres d’hôtel, serveurs) et de la haute logistique pour vos réceptions d’exception.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              id="dash-create-event-btn"
              onClick={openNewEventModal}
              className="px-4 py-2 rounded-md bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Nouvel Événement
            </button>
            <button
              id="dash-add-staff-btn"
              onClick={openNewStaffModal}
              className="px-3.5 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Users className="w-4 h-4 text-amber-400" /> Profil RH
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* RH Événementiel */}
        <div 
          onClick={() => setActiveTab('staff')}
          className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs hover:border-amber-500/60 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Effectif RH Global</span>
            <div className="w-8 h-8 rounded bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-amber-100 group-hover:text-amber-800 transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-serif text-slate-900">{totalStaff}</span>
            <span className="text-xs text-slate-500">collaborateurs qualifiés</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {availableStaffCount} disponibles
            </span>
            <span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[10px] uppercase">
              {vipCertifiedCount} Protocole VIP
            </span>
          </div>
        </div>

        {/* Événements Actifs & Galas */}
        <div 
          onClick={() => setActiveTab('events')}
          className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs hover:border-amber-500/60 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Réceptions en Gestion</span>
            <div className="w-8 h-8 rounded bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-amber-100 group-hover:text-amber-800 transition-colors">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-serif text-slate-900">{events.length}</span>
            <span className="text-xs text-slate-500">galas planifiés</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span className="text-emerald-700 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> 1 En cours Jour J
            </span>
            <span className="text-slate-500">{upcomingEvents.length} À venir</span>
          </div>
        </div>

        {/* Matériel & Stocks engagés */}
        <div 
          onClick={() => setActiveTab('logistics')}
          className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs hover:border-amber-500/60 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Taux d'Engagement Matériel</span>
            <div className="w-8 h-8 rounded bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-amber-100 group-hover:text-amber-800 transition-colors">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-serif text-slate-900">{engagedRate}%</span>
            <span className="text-xs text-slate-500">mobilisé sur événements</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>{totalEquipmentItems} pièces référencées</span>
            <span className="font-semibold text-slate-800">{availableEquipmentItems} dispo</span>
          </div>
        </div>

        {/* Présence Jour J */}
        <div 
          onClick={() => {
            if (activeEvent) setSelectedEventId(activeEvent.id);
            setActiveTab('events');
          }}
          className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs hover:border-amber-500/60 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Présence Jour J</span>
            <div className="w-8 h-8 rounded bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-amber-100 group-hover:text-amber-800 transition-colors">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-serif text-emerald-700">{presenceRate}%</span>
            <span className="text-xs text-slate-500">taux d'émargement</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>{presentCount + lateCount} / {totalEventAssignments} sur site</span>
            <span className="text-emerald-700 font-semibold">{pendingCount === 0 ? 'Complet' : `${pendingCount} attendu(s)`}</span>
          </div>
        </div>
      </div>

      {/* Main split row: Live Event Focus + Operational Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Focus On Ongoing Event */}
        {activeEvent && (
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded uppercase tracking-wider">
                      Événement en Cours
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Protocole : <strong>{activeEvent.vipProtocolLevel}</strong>
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900 mt-0.5">
                    {activeEvent.title}
                  </h3>
                </div>
              </div>

              <button
                id="view-live-checkin-btn"
                onClick={() => {
                  setSelectedEventId(activeEvent.id);
                  setActiveTab('events');
                }}
                className="text-xs font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 px-3.5 py-2 rounded-md transition-colors flex items-center gap-1.5 shrink-0 shadow-xs"
              >
                Gérer l'événement <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4 p-3.5 bg-slate-50 border border-slate-200/80 rounded-md text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="truncate">{activeEvent.location}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Horaires : {activeEvent.startTime} - {activeEvent.endTime}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Users className="w-4 h-4 text-slate-500 shrink-0" />
                <span>{activeEvent.guestCount} Invités VIP attendus</span>
              </div>
            </div>

            {/* Staff Assigned Table Preview */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Équipe Mobilisée & Rôles sur le Jour J ({activeEvent.assignments.length})</span>
                <span className="text-slate-400 font-normal normal-case text-[11px]">Code vestimentaire : {activeEvent.dressCodeRequired.split('/')[0]}</span>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-md overflow-hidden bg-white">
                {activeEvent.assignments.map((asg) => {
                  const staffUser = staffList.find(s => s.id === asg.userId);
                  const isPresent = asg.checkInStatus === 'PRESENT';
                  const isLate = asg.checkInStatus === 'LATE';

                  return (
                    <div key={asg.id} className="p-3 flex items-center justify-between hover:bg-slate-50/80 transition-colors text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 shrink-0 overflow-hidden text-xs">
                          {staffUser?.avatarUrl ? (
                            <img src={staffUser.avatarUrl} alt={staffUser.fullName} className="w-full h-full object-cover" />
                          ) : (
                            staffUser?.fullName.charAt(0) || '?'
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                            {staffUser?.fullName}
                            {staffUser?.vipProtocolCertified && (
                              <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded border border-amber-200 uppercase">VIP</span>
                            )}
                          </div>
                          <p className="text-slate-500 text-[11px]">{asg.roleOnDay}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Spoken languages */}
                        <div className="hidden sm:flex items-center gap-1">
                          {staffUser?.languages.map(l => (
                            <span key={l} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-mono border border-slate-200">
                              {l}
                            </span>
                          ))}
                        </div>

                        {/* Check-in status badge */}
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                          isPresent 
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                            : isLate 
                            ? 'bg-amber-100 text-amber-800 border-amber-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {isPresent ? `Présent (${asg.checkInTime})` : isLate ? `Retard (${asg.checkInTime})` : 'En attente'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Right 1 Col: Operational Alerts & Quick Shortcuts */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Alertes & Vigilance Opérationnelle
            </h3>
            {alerts.length === 0 ? (
              <div className="p-4 text-center bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-500">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                Aucune alerte critique. Tous les protocoles et stocks sont synchronisés.
              </div>
            ) : (
              <div className="space-y-2.5">
                {alerts.map((alt) => (
                  <div 
                    key={alt.id}
                    onClick={() => setActiveTab(alt.actionTab)}
                    className={`p-3 rounded-md border text-xs cursor-pointer transition-all hover:translate-x-0.5 ${
                      alt.type === 'critical' 
                        ? 'bg-rose-50 border-rose-200 text-rose-900' 
                        : alt.type === 'warning'
                        ? 'bg-amber-50 border-amber-200 text-amber-900'
                        : 'bg-blue-50 border-blue-200 text-blue-900'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between text-xs">
                      <span>{alt.title}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                    </div>
                    <p className="mt-1 opacity-90 text-[11px] leading-relaxed">{alt.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stocks & Dressing Callout */}
          <div 
            onClick={() => setActiveTab('logistics')}
            className="bg-slate-900 border border-slate-800 rounded-lg p-5 text-slate-200 cursor-pointer hover:border-amber-500/60 transition-all group shadow-xs"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1 uppercase tracking-widest">
                <Shield className="w-3.5 h-3.5" /> Logistique & Réceptions
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 transition-colors" />
            </div>
            <h4 className="font-serif font-bold text-sm text-white">
              Mobilier, Traiteur & Vestiaire
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Consultez les stocks disponibles, les réservations matériel et l'attribution des tenues pour chaque gala.
            </p>
          </div>
        </div>
      </div>

      {/* Upcoming Events Overview */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-serif font-bold text-slate-900">
              Prochaines Réceptions & Galas au Calendrier
            </h3>
            <p className="text-xs text-slate-500">Planification des effectifs et réservations logistiques anticipées</p>
          </div>
          <button
            onClick={() => setActiveTab('events')}
            className="text-xs font-bold uppercase tracking-wider text-amber-600 hover:text-amber-700 flex items-center gap-1"
          >
            Voir tous les événements <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((ev) => (
            <div 
              key={ev.id}
              onClick={() => {
                setSelectedEventId(ev.id);
                setActiveTab('events');
              }}
              className="border border-slate-200 rounded-lg p-4 hover:border-amber-500/60 hover:shadow-xs transition-all cursor-pointer bg-white group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    ev.status === 'IN_PROGRESS' 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {ev.type} • {ev.vipProtocolLevel}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">{ev.startDate}</span>
                </div>
                <h4 className="font-serif font-bold text-slate-900 text-sm group-hover:text-amber-600 transition-colors line-clamp-2">
                  {ev.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {ev.location}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <strong>{ev.assignments.length}</strong> staff affecté(s)
                </span>
                <span className="flex items-center gap-1">
                  <Package className="w-3.5 h-3.5 text-slate-400" />
                  <strong>{ev.bookedItems.length}</strong> matériels
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

