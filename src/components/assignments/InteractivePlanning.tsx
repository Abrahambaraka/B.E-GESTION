import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { UserStaff, EventItem, Assignment } from '../../types/event';
import { 
  Layers, 
  UserCheck, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Check, 
  AlertTriangle, 
  Trash2, 
  Plus, 
  Shirt, 
  Languages, 
  ShieldCheck, 
  Search,
  Filter
} from 'lucide-react';

export const InteractivePlanning: React.FC = () => {
  const { 
    events, 
    staffList, 
    equipmentList, 
    assignStaffToEvent, 
    removeStaffAssignment 
  } = useEvent();

  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || '');
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [roleOnDayInput, setRoleOnDayInput] = useState<string>("Hôtesse d'Accueil VIP");
  const [briefingInput, setBriefingInput] = useState<string>('');
  const [selectedUniformId, setSelectedUniformId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const currentEvent = events.find(e => e.id === selectedEventId) || events[0];

  const assignedStaffIds = new Set(currentEvent?.assignments.map(a => a.userId) || []);
  const availableStaff = staffList.filter(s => !assignedStaffIds.has(s.id));

  // Pre-set standard protocol roles
  const standardRoles = [
    "Hôtesse d'Accueil VIP & Salons d'Honneur",
    "Hôtesse Émargement & Remise des Badges",
    "Maître d'Hôtel Principal & Table Officielle",
    "Chef de Rang & Service Champagne",
    "Coordinateur Protocole & Flux Invités",
    "Hôte Vestiaire & Accueil Voiturier",
    "Sommelier & Dégustation Grands Crus"
  ];

  // Uniform options
  const uniformOptions = equipmentList.filter(e => e.category === 'UNIFORM');

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEvent || !selectedStaffId || !roleOnDayInput) return;

    assignStaffToEvent(
      currentEvent.id,
      selectedStaffId,
      roleOnDayInput,
      briefingInput,
      selectedUniformId || undefined
    );

    setSelectedStaffId('');
    setBriefingInput('');
    setSelectedUniformId('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-serif font-bold text-stone-900">
            Affectations des Postes & Planning Opérationnel
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Assignation personnalisée du personnel extra et permanent selon le protocole de la réception.
          </p>
        </div>

        {/* Event Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-stone-600">Réception cible :</span>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="py-1.5 px-3 text-xs bg-white border border-stone-300 rounded-lg font-medium shadow-xs focus:ring-1 focus:ring-amber-500"
          >
            {events.map(ev => (
              <option key={ev.id} value={ev.id}>
                {ev.title} ({ev.startDate})
              </option>
            ))}
          </select>
        </div>
      </div>

      {currentEvent && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Assignment Workspace (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Event Protocol Context Banner */}
            <div className="bg-gradient-to-r from-stone-900 to-stone-850 text-stone-100 p-4 rounded-xl border border-stone-800 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
                    {currentEvent.type} • Protocole {currentEvent.vipProtocolLevel}
                  </span>
                  <h3 className="font-serif font-bold text-base mt-1 text-stone-100">
                    {currentEvent.title}
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-400 shrink-0" /> {currentEvent.location}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-serif font-bold text-amber-300">
                    {currentEvent.assignments.length}
                  </span>
                  <span className="text-xs text-stone-400 block">collaborateurs affectés</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-stone-800 grid grid-cols-2 gap-2 text-xs text-stone-300">
                <div>
                  <span className="text-stone-400 block text-[10px]">Dress Code Requis</span>
                  <strong className="text-stone-200">{currentEvent.dressCodeRequired}</strong>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Langues Requises</span>
                  <div className="flex gap-1 mt-0.5">
                    {currentEvent.requiredLanguages.map(l => (
                      <span key={l} className="px-1.5 py-0.2 bg-stone-800 text-amber-300 rounded font-mono text-[10px]">
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Currently Assigned Staff List */}
            <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Postes & Affectations du Jour J ({currentEvent.assignments.length})
                </h4>
                <span className="text-xs text-stone-500">
                  Vacation : {currentEvent.startTime} - {currentEvent.endTime}
                </span>
              </div>

              {currentEvent.assignments.length === 0 ? (
                <div className="p-8 text-center bg-stone-50 rounded-lg text-xs text-stone-500 border border-dashed border-stone-300">
                  <Layers className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                  Aucun membre affecté pour l'instant. Choisissez un collaborateur à droite pour l'assigner à un poste protocolaire.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {currentEvent.assignments.map((asg) => {
                    const user = staffList.find(s => s.id === asg.userId);
                    const uniform = equipmentList.find(e => e.id === asg.assignedUniformId);

                    // Language compatibility check
                    const missingLangs = currentEvent.requiredLanguages.filter(
                      rl => !user?.languages.includes(rl)
                    );
                    const hasLangMatch = user?.languages.some(l => currentEvent.requiredLanguages.includes(l));

                    return (
                      <div 
                        key={asg.id}
                        className="p-3.5 bg-stone-50/80 border border-stone-200 rounded-lg flex items-center justify-between gap-3 text-xs hover:bg-stone-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-stone-200 overflow-hidden font-bold text-stone-700 flex items-center justify-center shrink-0 border border-stone-300">
                            {user?.avatarUrl ? (
                              <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
                            ) : (
                              user?.fullName.charAt(0) || '?'
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-stone-900 flex items-center gap-2">
                              {user?.fullName}
                              <span className="text-[10px] px-1.5 py-0.2 bg-stone-200 text-stone-700 rounded font-medium">
                                {user?.staffCategory}
                              </span>
                              {user?.vipProtocolCertified && (
                                <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-semibold border border-amber-200">
                                  VIP
                                </span>
                              )}
                            </div>

                            <p className="text-amber-900 font-semibold text-[11px] mt-0.5">
                              Rôle Jour J : {asg.roleOnDay}
                            </p>

                            <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-stone-500">
                              <span>Taille : <strong>{user?.uniformSize || 'Non spécifiée'}</strong></span>
                              {uniform && (
                                <span className="text-purple-800 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200">
                                  Tenue : {uniform.name.split('(')[0]}
                                </span>
                              )}
                            </div>

                            {asg.briefingNotes && (
                              <p className="text-stone-600 text-[11px] italic mt-1 bg-white p-1.5 rounded border border-stone-200">
                                « {asg.briefingNotes} »
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <button
                            onClick={() => removeStaffAssignment(currentEvent.id, asg.id)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded"
                            title="Retirer cette affectation"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right: New Assignment Form (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
              <h4 className="text-sm font-serif font-bold text-stone-900 pb-3 mb-3 border-b border-stone-100 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-amber-700" /> Assigner un Collaborateur à la Réception
              </h4>

              <form onSubmit={handleAssign} className="space-y-3.5 text-xs">
                  {/* Select Staff */}
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">
                      1. Sélectionner le collaborateur ({availableStaff.length} disponibles) *
                    </label>
                    <select
                      required
                      value={selectedStaffId}
                      onChange={(e) => setSelectedStaffId(e.target.value)}
                      className="w-full p-2.5 border border-stone-300 rounded-lg bg-white focus:ring-1 focus:ring-amber-500"
                    >
                      <option value="">-- Choisir une hôtesse, maître d'hôtel ou serveur --</option>
                      {availableStaff.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.fullName} ({s.staffCategory} • T.{s.uniformSize || '?'} • {s.languages.join('/')}) {s.vipProtocolCertified ? '★ VIP' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Role on the Day */}
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">
                      2. Poste & Rôle sur le Jour J *
                    </label>
                    <input
                      type="text"
                      required
                      value={roleOnDayInput}
                      onChange={(e) => setRoleOnDayInput(e.target.value)}
                      placeholder="Ex: Hôtesse d'Accueil VIP & Salons"
                      className="w-full p-2 border border-stone-300 rounded focus:ring-1 focus:ring-amber-500"
                    />

                    {/* Pre-fill quick chips */}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {standardRoles.slice(0, 4).map(r => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRoleOnDayInput(r)}
                          className="text-[10px] px-2 py-0.5 bg-stone-100 hover:bg-amber-100 hover:text-amber-900 rounded text-stone-600 transition-colors"
                        >
                          {r.split('&')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Uniform allocation */}
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">
                      3. Attribution de la Tenue Vestiaire (Optionnel)
                    </label>
                    <select
                      value={selectedUniformId}
                      onChange={(e) => setSelectedUniformId(e.target.value)}
                      className="w-full p-2 border border-stone-300 rounded bg-white"
                    >
                      <option value="">Attribuer plus tard / Tenue personnelle conforme</option>
                      {uniformOptions.map(u => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.availableQty} en stock)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Briefing notes */}
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">
                      4. Consignes Spécifiques & Briefing de Poste
                    </label>
                    <textarea
                      rows={2}
                      value={briefingInput}
                      onChange={(e) => setBriefingInput(e.target.value)}
                      placeholder="Ex: Accueil de la délégation ministérielle au perron d'honneur, vérification liste nominative..."
                      className="w-full p-2 border border-stone-300 rounded focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!selectedStaffId}
                    className={`w-full py-2.5 rounded-lg font-semibold text-xs transition-colors shadow-xs flex items-center justify-center gap-2 ${
                      selectedStaffId
                        ? 'bg-amber-600 hover:bg-amber-500 text-stone-950 cursor-pointer'
                        : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    <Check className="w-4 h-4" /> Valider l'Affectation au Poste
                  </button>
                </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
