import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { CheckInStatus, Assignment } from '../../types/event';
import { 
  UserCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle, 
  Sparkles, 
  Printer, 
  MapPin, 
  Shirt, 
  Phone, 
  Signature, 
  Check, 
  X,
  FileCheck,
  UserPlus
} from 'lucide-react';

export const LiveCheckIn: React.FC = () => {
  const { events, selectedEventId, setSelectedEventId, staffList, updateCheckIn } = useEvent();

  const [signatureModalAsg, setSignatureModalAsg] = useState<Assignment | null>(null);
  const [signatureInput, setSignatureInput] = useState('');
  const [selectedStatusToApply, setSelectedStatusToApply] = useState<CheckInStatus>('PRESENT');

  const currentEvent = events.find(e => e.id === selectedEventId) || events[0];

  const totalAssigned = currentEvent?.assignments.length || 0;
  const presentCount = currentEvent?.assignments.filter(a => a.checkInStatus === 'PRESENT').length || 0;
  const lateCount = currentEvent?.assignments.filter(a => a.checkInStatus === 'LATE').length || 0;
  const absentCount = currentEvent?.assignments.filter(a => a.checkInStatus === 'ABSENT').length || 0;
  const pendingCount = currentEvent?.assignments.filter(a => a.checkInStatus === 'PENDING').length || 0;

  const attendancePercent = totalAssigned > 0 ? Math.round(((presentCount + lateCount) / totalAssigned) * 100) : 0;

  const handleOpenSignatureModal = (asg: Assignment, defaultStatus: CheckInStatus = 'PRESENT') => {
    const user = staffList.find(s => s.id === asg.userId);
    setSignatureModalAsg(asg);
    setSelectedStatusToApply(defaultStatus);
    setSignatureInput(asg.signature || user?.fullName || '');
  };

  const handleConfirmSignature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEvent || !signatureModalAsg) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    updateCheckIn(
      currentEvent.id,
      signatureModalAsg.id,
      selectedStatusToApply,
      timeStr,
      signatureInput || 'Signé numériquement'
    );

    setSignatureModalAsg(null);
  };

  const handleQuickStatusChange = (asgId: string, status: CheckInStatus) => {
    if (!currentEvent) return;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    updateCheckIn(currentEvent.id, asgId, status, timeStr);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl lg:text-2xl font-serif font-bold text-stone-900">
              Module d'Émargement Numérique & Check-in Jour J
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border border-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Live Terrain
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Suivi des présences en temps réel, signature électronique et contrôle d'arrivée du personnel extra et permanent.
          </p>
        </div>

        {/* Event Selector */}
        <div className="flex items-center gap-2">
          <select
            value={selectedEventId || ''}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="py-2 px-3 text-xs bg-white border border-stone-300 rounded-lg font-medium shadow-xs focus:ring-1 focus:ring-amber-500"
          >
            {events.map(ev => (
              <option key={ev.id} value={ev.id}>
                {ev.title.slice(0, 40)}... ({ev.startDate})
              </option>
            ))}
          </select>

          <button
            onClick={() => window.print()}
            className="px-3 py-2 bg-stone-900 hover:bg-stone-800 text-stone-100 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-4 h-4" /> Imprimer Registre
          </button>
        </div>
      </div>

      {currentEvent ? (
        <div className="space-y-5">
          {/* Top Live Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Taux Global */}
            <div className="bg-white border border-stone-200 rounded-xl p-3.5 shadow-xs flex flex-col justify-between">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Taux de Présence</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-serif font-bold text-stone-900">{attendancePercent}%</span>
                <span className="text-xs text-stone-500">sur site</span>
              </div>
              <div className="w-full bg-stone-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${attendancePercent}%` }}></div>
              </div>
            </div>

            {/* Présents à l'heure */}
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3.5 shadow-xs flex flex-col justify-between text-emerald-950">
              <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Présents & Signés
              </span>
              <span className="text-2xl font-serif font-bold text-emerald-900 mt-1">{presentCount}</span>
              <span className="text-[11px] text-emerald-700">À l'heure au poste</span>
            </div>

            {/* Retards */}
            <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3.5 shadow-xs flex flex-col justify-between text-amber-950">
              <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" /> Arrivées Tardives
              </span>
              <span className="text-2xl font-serif font-bold text-amber-900 mt-1">{lateCount}</span>
              <span className="text-[11px] text-amber-700">Check-in après l'horaire</span>
            </div>

            {/* En attente */}
            <div className="bg-stone-100/70 border border-stone-300 rounded-xl p-3.5 shadow-xs flex flex-col justify-between text-stone-900">
              <span className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-stone-500" /> En Attente d'Arrivée
              </span>
              <span className="text-2xl font-serif font-bold text-stone-800 mt-1">{pendingCount}</span>
              <span className="text-[11px] text-stone-500">Non encore émargés</span>
            </div>

            {/* Absents */}
            <div className="bg-rose-50/60 border border-rose-200 rounded-xl p-3.5 shadow-xs flex flex-col justify-between text-rose-950">
              <span className="text-[11px] font-semibold text-rose-800 uppercase tracking-wider flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5 text-rose-600" /> Absences / Défections
              </span>
              <span className="text-2xl font-serif font-bold text-rose-900 mt-1">{absentCount}</span>
              <span className="text-[11px] text-rose-700">À remplacer en urgence</span>
            </div>
          </div>

          {/* Event Context Strip */}
          <div className="bg-stone-900 text-stone-100 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-amber-400 font-semibold uppercase tracking-wider text-[10px]">
                {currentEvent.title}
              </span>
              <div className="flex items-center gap-3 mt-0.5 text-stone-300">
                <span>Lieu : <strong>{currentEvent.location}</strong></span>
                <span>•</span>
                <span>Début du service : <strong>{currentEvent.startTime}</strong></span>
                <span>•</span>
                <span>Fin : <strong>{currentEvent.endTime}</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-stone-800 text-amber-300 font-medium border border-stone-700">
                Dress Code : {currentEvent.dressCodeRequired.split('/')[0]}
              </span>
            </div>
          </div>

          {/* Staff Roster Check-in Cards / Table */}
          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
            <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Registre d'Émargement du Personnel ({currentEvent.assignments.length} Postes)
              </h3>
              <span className="text-xs text-stone-500 font-medium">
                Cliquez sur un statut pour émarger ou valider la signature
              </span>
            </div>

            <div className="divide-y divide-stone-100">
              {currentEvent.assignments.length === 0 ? (
                <div className="p-8 text-center text-stone-500 text-xs">
                  Aucun membre du personnel n'est affecté à cet événement.
                </div>
              ) : (
                currentEvent.assignments.map((asg) => {
                  const staffUser = staffList.find(s => s.id === asg.userId);
                  const isPresent = asg.checkInStatus === 'PRESENT';
                  const isLate = asg.checkInStatus === 'LATE';
                  const isAbsent = asg.checkInStatus === 'ABSENT';
                  const isPending = asg.checkInStatus === 'PENDING' || !asg.checkInStatus;

                  return (
                    <div 
                      key={asg.id}
                      className={`p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs transition-colors ${
                        isPresent ? 'bg-emerald-50/20' : isLate ? 'bg-amber-50/20' : isAbsent ? 'bg-rose-50/20' : 'hover:bg-stone-50'
                      }`}
                    >
                      {/* Staff Info Column */}
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-full bg-stone-200 overflow-hidden font-bold text-stone-700 flex items-center justify-center shrink-0 border border-stone-300">
                          {staffUser?.avatarUrl ? (
                            <img src={staffUser.avatarUrl} alt={staffUser.fullName} className="w-full h-full object-cover" />
                          ) : (
                            staffUser?.fullName.charAt(0) || '?'
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-stone-900 text-sm font-serif">
                              {staffUser?.fullName}
                            </h4>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-stone-100 text-stone-600 font-medium">
                              {staffUser?.staffCategory}
                            </span>
                            {staffUser?.vipProtocolCertified && (
                              <span className="text-[10px] px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded font-semibold border border-amber-200">
                                VIP
                              </span>
                            )}
                          </div>

                          <p className="text-amber-900 font-medium text-xs mt-0.5">
                            Poste : <strong>{asg.roleOnDay}</strong>
                          </p>

                          <div className="flex items-center gap-3 text-stone-500 text-[11px] mt-1">
                            {staffUser?.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3 text-stone-400" /> {staffUser.phone}
                              </span>
                            )}
                            <span>Taille : <strong>{staffUser?.uniformSize || 'N/A'}</strong></span>
                            <span>•</span>
                            <span>Langues : {staffUser?.languages.join(', ')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Status & Digital Signature Column */}
                      <div className="flex flex-wrap items-center gap-2 justify-end">
                        {/* Signature proof indicator if signed */}
                        {asg.signature && (
                          <div className="text-right mr-2 hidden sm:block">
                            <span className="text-[10px] text-stone-400 block">Émargé à {asg.checkInTime}</span>
                            <span className="font-serif italic font-semibold text-stone-800 text-xs">
                              ✍ {asg.signature}
                            </span>
                          </div>
                        )}

                        {/* Status Selection Buttons */}
                        <button
                          onClick={() => handleOpenSignatureModal(asg, 'PRESENT')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                            isPresent
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-stone-100 text-stone-600 hover:bg-emerald-50 hover:text-emerald-700'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Présent
                        </button>

                        <button
                          onClick={() => handleOpenSignatureModal(asg, 'LATE')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                            isLate
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'bg-stone-100 text-stone-600 hover:bg-amber-50 hover:text-amber-700'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" /> Retard
                        </button>

                        <button
                          onClick={() => handleQuickStatusChange(asg.id, 'ABSENT')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                            isAbsent
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-stone-100 text-stone-600 hover:bg-rose-50 hover:text-rose-700'
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" /> Absent
                        </button>

                        <button
                          onClick={() => handleOpenSignatureModal(asg, asg.checkInStatus || 'PRESENT')}
                          className="p-1.5 bg-stone-100 hover:bg-stone-200 rounded-lg text-stone-700"
                          title="Modifier l'émargement et la signature"
                        >
                          <FileCheck className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-white border border-stone-200 rounded-xl text-stone-500">
          Sélectionnez un événement pour afficher le registre d'émargement.
        </div>
      )}

      {/* Signature Confirmation Modal */}
      {signatureModalAsg && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setSignatureModalAsg(null)}
              className="absolute right-4 top-4 text-stone-400 hover:text-stone-600 p-1.5 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-stone-100">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-stone-900">
                  Validation de l'Émargement
                </h3>
                <p className="text-xs text-stone-500">
                  Check-in Jour J & horodatage de présence
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmSignature} className="space-y-4 text-xs">
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <span className="text-stone-400 block text-[10px]">Collaborateur</span>
                <strong className="text-stone-900 text-sm">
                  {staffList.find(s => s.id === signatureModalAsg.userId)?.fullName}
                </strong>
                <p className="text-amber-900 text-xs mt-0.5">
                  Poste : {signatureModalAsg.roleOnDay}
                </p>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Statut d'arrivée</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedStatusToApply('PRESENT')}
                    className={`p-2 rounded border text-xs font-semibold flex items-center justify-center gap-1 ${
                      selectedStatusToApply === 'PRESENT'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" /> Présent à l'heure
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedStatusToApply('LATE')}
                    className={`p-2 rounded border text-xs font-semibold flex items-center justify-center gap-1 ${
                      selectedStatusToApply === 'LATE'
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" /> En retard
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Signature numérique / Prénom Nom du signataire
                </label>
                <input
                  type="text"
                  required
                  value={signatureInput}
                  onChange={(e) => setSignatureInput(e.target.value)}
                  placeholder="Ex: C. Dubois"
                  className="w-full p-2.5 border border-stone-300 rounded font-serif italic text-sm focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSignatureModalAsg(null)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 rounded hover:bg-stone-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded shadow-xs"
                >
                  Confirmer l'Émargement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
