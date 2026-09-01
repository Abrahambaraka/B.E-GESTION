import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { 
  X, 
  Download, 
  Printer, 
  FileText, 
  Users, 
  Package, 
  Calendar, 
  Shirt, 
  Check, 
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { 
  exportStaffToCSV, 
  exportEquipmentToCSV, 
  exportEventsToCSV, 
  exportEventRoadmapToCSV,
  downloadCSV 
} from '../../utils/exportUtils';

export type ReportType = 'STAFF' | 'EQUIPMENT' | 'EVENTS' | 'ROADMAP' | 'UNIFORMS';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: ReportType;
  initialEventId?: string;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  initialType = 'STAFF',
  initialEventId,
}) => {
  const { staffList, equipmentList, events, currentRole } = useEvent();

  const [reportType, setReportType] = useState<ReportType>(initialType);
  const [selectedEventId, setSelectedEventId] = useState<string>(
    initialEventId || events[0]?.id || ''
  );
  const [includeSignatures, setIncludeSignatures] = useState<boolean>(true);
  const [includeStats, setIncludeStats] = useState<boolean>(true);
  const [exportedSuccess, setExportedSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentEvent = events.find(e => e.id === selectedEventId) || events[0];
  const currentDateFormatted = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const currentTimeFormatted = new Date().toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Calculate stats for preview
  const totalEquipVal = equipmentList.reduce(
    (sum, eq) => sum + (eq.unitValueEuro || 0) * eq.totalQty,
    0
  );
  const totalEquipAvailable = equipmentList.reduce(
    (sum, eq) => sum + eq.availableQty,
    0
  );
  const totalEquipTotal = equipmentList.reduce(
    (sum, eq) => sum + eq.totalQty,
    0
  );

  // CSV Export Handler
  const handleExportCSV = () => {
    const timestamp = new Date().toISOString().slice(0, 10);
    let csvData = '';
    let fileName = '';

    switch (reportType) {
      case 'STAFF':
        csvData = exportStaffToCSV(staffList);
        fileName = `Blessing_Event_Registre_RH_${timestamp}.csv`;
        break;
      case 'EQUIPMENT':
        csvData = exportEquipmentToCSV(equipmentList);
        fileName = `Blessing_Event_Inventaire_Materiel_${timestamp}.csv`;
        break;
      case 'EVENTS':
        csvData = exportEventsToCSV(events);
        fileName = `Blessing_Event_Planning_Receptions_${timestamp}.csv`;
        break;
      case 'ROADMAP':
        if (!currentEvent) return;
        csvData = exportEventRoadmapToCSV(currentEvent, staffList, equipmentList);
        fileName = `Blessing_Event_Feuille_Route_${currentEvent.title.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.csv`;
        break;
      case 'UNIFORMS':
        csvData = exportEquipmentToCSV(equipmentList.filter(e => e.category === 'UNIFORM'));
        fileName = `Blessing_Event_Registre_Vestiaire_${timestamp}.csv`;
        break;
    }

    downloadCSV(fileName, csvData);
    setExportedSuccess(`Fichier CSV "${fileName}" exporté avec succès.`);
    setTimeout(() => setExportedSuccess(null), 4000);
  };

  // Direct Print / Save to PDF Trigger
  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto modal-backdrop-overlay">
      <div className="bg-white border border-slate-200 rounded-xl max-w-5xl w-full max-h-[94vh] flex flex-col shadow-2xl relative overflow-hidden">
        {/* Top Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500 text-white flex items-center justify-center font-serif font-bold text-lg shadow-sm">
              B
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-serif font-bold tracking-wide">
                  Centre d'Exportation & Reporting Administratif
                </h3>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-bold uppercase">
                  PDF & CSV
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Générez des rapports certifiés pour la régie, les bilans clients ou les archives administratives.
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

        {/* Content Body: Left Control Sidebar + Right Live Printable Document Preview */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden bg-slate-50">
          {/* Controls Panel */}
          <div className="w-full lg:w-80 p-4 sm:p-5 border-b lg:border-b-0 lg:border-r border-slate-200 bg-white flex flex-col justify-between overflow-y-auto shrink-0 space-y-4">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  1. Sélectionner le Type de Rapport
                </label>
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => setReportType('STAFF')}
                    className={`w-full p-2.5 rounded-lg border text-left text-xs font-medium transition-all flex items-center justify-between ${
                      reportType === 'STAFF'
                        ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-amber-600" />
                      <span>Ressources Humaines & Extras</span>
                    </div>
                    <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                      {staffList.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReportType('EQUIPMENT')}
                    className={`w-full p-2.5 rounded-lg border text-left text-xs font-medium transition-all flex items-center justify-between ${
                      reportType === 'EQUIPMENT'
                        ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-amber-600" />
                      <span>Inventaire & Matériel</span>
                    </div>
                    <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                      {equipmentList.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReportType('EVENTS')}
                    className={`w-full p-2.5 rounded-lg border text-left text-xs font-medium transition-all flex items-center justify-between ${
                      reportType === 'EVENTS'
                        ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-600" />
                      <span>Planning des Réceptions</span>
                    </div>
                    <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                      {events.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReportType('ROADMAP')}
                    className={`w-full p-2.5 rounded-lg border text-left text-xs font-medium transition-all flex items-center justify-between ${
                      reportType === 'ROADMAP'
                        ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-600" />
                      <span>Feuille de Route (Par Événement)</span>
                    </div>
                    <span className="text-[10px] font-mono bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                      Détaillé
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReportType('UNIFORMS')}
                    className={`w-full p-2.5 rounded-lg border text-left text-xs font-medium transition-all flex items-center justify-between ${
                      reportType === 'UNIFORMS'
                        ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Shirt className="w-4 h-4 text-purple-600" />
                      <span>Vestiaire & Suivi Pressing</span>
                    </div>
                    <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                      {equipmentList.filter(e => e.category === 'UNIFORM').length}
                    </span>
                  </button>
                </div>
              </div>

              {/* Event Selector when in ROADMAP mode */}
              {reportType === 'ROADMAP' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Événement Cible *
                  </label>
                  <select
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    {events.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.title} ({ev.startDate})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Document Options */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Options du Document
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeStats}
                    onChange={(e) => setIncludeStats(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>Inclure la synthèse chiffrée (KPIs)</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSignatures}
                    onChange={(e) => setIncludeSignatures(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>Bloc de signature & validation officielle</span>
                </label>
              </div>

              {exportedSuccess && (
                <div className="p-2.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{exportedSuccess}</span>
                </div>
              )}
            </div>

            {/* Main Export Action Buttons */}
            <div className="pt-4 border-t border-slate-200 space-y-2">
              <button
                type="button"
                onClick={handlePrintPDF}
                className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>Imprimer / Sauvegarder PDF</span>
              </button>

              <button
                type="button"
                onClick={handleExportCSV}
                className="w-full py-2.5 px-3 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger Fichier CSV (Excel)</span>
              </button>
            </div>
          </div>

          {/* Right Live Document Preview Panel */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Aperçu du Document Protocolaire</span>
              <span className="text-[11px] text-slate-500 font-normal">Format A4 Standard Haute Réception</span>
            </div>

            {/* Printable Document Box */}
            <div 
              id="printable-administrative-report"
              className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-sm text-slate-900 space-y-6 print-only-container"
            >
              {/* Document Letterhead */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b-2 border-slate-900 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 bg-amber-500 text-white rounded flex items-center justify-center font-serif font-bold text-sm">
                      B
                    </div>
                    <span className="font-serif font-bold text-lg tracking-wide uppercase text-slate-900">
                      Blessing Event
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                    Haute Réception • Arts de la Table • Scénographie & Protocole VIP
                  </p>
                </div>

                <div className="text-right text-xs space-y-0.5 text-slate-600">
                  <p className="font-bold text-slate-800">DOCUMENT OFFICIEL DE RÉGIE</p>
                  <p>Édité le {currentDateFormatted} à {currentTimeFormatted}</p>
                  <p className="text-[10px] text-slate-400">Réf : BLESSING-EXP-{Date.now().toString().slice(-6)}</p>
                </div>
              </div>

              {/* Title Banner */}
              <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-serif font-bold text-slate-900 text-base uppercase tracking-wide">
                    {reportType === 'STAFF' && "Registre Officiel du Personnel & Habilitations Protocole"}
                    {reportType === 'EQUIPMENT' && "Bon d'Inventaire Général & État des Stocks Matériel"}
                    {reportType === 'EVENTS' && "Synthèse Administrative du Planning des Réceptions"}
                    {reportType === 'ROADMAP' && `Feuille de Route & Émargement : ${currentEvent?.title || 'Événement'}`}
                    {reportType === 'UNIFORMS' && "Registre du Dressing Événementiel & Suivi Pressing"}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {reportType === 'ROADMAP'
                      ? `Client : ${currentEvent?.clientName} • Lieu : ${currentEvent?.location} • Date : ${currentEvent?.startDate}`
                      : `Génération automatique certifiée pour la Direction Opérationnelle.`}
                  </p>
                </div>
                <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded border border-amber-200 shrink-0">
                  STATUT : CERTIFIÉ
                </span>
              </div>

              {/* Statistics & KPI Bar (if enabled) */}
              {includeStats && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/50 p-3 rounded-lg border border-slate-200 text-center text-xs">
                  {reportType === 'STAFF' && (
                    <>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Effectif Total</span>
                        <span className="font-mono font-bold text-sm text-slate-900">{staffList.length}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Disponibles</span>
                        <span className="font-mono font-bold text-sm text-emerald-700">
                          {staffList.filter(s => s.status === 'AVAILABLE').length}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Certifiés VIP</span>
                        <span className="font-mono font-bold text-sm text-amber-700">
                          {staffList.filter(s => s.vipProtocolCertified).length}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">En Mission</span>
                        <span className="font-mono font-bold text-sm text-blue-700">
                          {staffList.filter(s => s.status === 'ASSIGNED').length}
                        </span>
                      </div>
                    </>
                  )}

                  {reportType === 'EQUIPMENT' && (
                    <>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Références</span>
                        <span className="font-mono font-bold text-sm text-slate-900">{equipmentList.length}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Pièces Totales</span>
                        <span className="font-mono font-bold text-sm text-slate-900">{totalEquipTotal}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Disponibilité</span>
                        <span className="font-mono font-bold text-sm text-emerald-700">
                          {Math.round((totalEquipAvailable / (totalEquipTotal || 1)) * 100)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Valeur Inventaire</span>
                        <span className="font-mono font-bold text-sm text-amber-800">
                          {totalEquipVal.toLocaleString('fr-FR')} €
                        </span>
                      </div>
                    </>
                  )}

                  {reportType === 'EVENTS' && (
                    <>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Réceptions</span>
                        <span className="font-mono font-bold text-sm text-slate-900">{events.length}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Jour J En Cours</span>
                        <span className="font-mono font-bold text-sm text-emerald-700">
                          {events.filter(e => e.status === 'IN_PROGRESS').length}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Planifiés</span>
                        <span className="font-mono font-bold text-sm text-blue-700">
                          {events.filter(e => e.status === 'PLANNED').length}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Invités Cumulés</span>
                        <span className="font-mono font-bold text-sm text-slate-900">
                          {events.reduce((sum, e) => sum + (e.guestCount || 0), 0)}
                        </span>
                      </div>
                    </>
                  )}

                  {reportType === 'ROADMAP' && (
                    <>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Staff Mobilisé</span>
                        <span className="font-mono font-bold text-sm text-slate-900">
                          {currentEvent?.assignments.length || 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Matériel Réservé</span>
                        <span className="font-mono font-bold text-sm text-slate-900">
                          {currentEvent?.bookedItems.reduce((sum, i) => sum + i.quantity, 0) || 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Protocole</span>
                        <span className="font-mono font-bold text-sm text-amber-700">
                          {currentEvent?.vipProtocolLevel}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Invités Attendus</span>
                        <span className="font-mono font-bold text-sm text-slate-900">
                          {currentEvent?.guestCount}
                        </span>
                      </div>
                    </>
                  )}

                  {reportType === 'UNIFORMS' && (
                    <>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Modèles Dressing</span>
                        <span className="font-mono font-bold text-sm text-slate-900">
                          {equipmentList.filter(e => e.category === 'UNIFORM').length}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Tenues</span>
                        <span className="font-mono font-bold text-sm text-slate-900">
                          {equipmentList.filter(e => e.category === 'UNIFORM').reduce((s, u) => s + u.totalQty, 0)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">En Pressing</span>
                        <span className="font-mono font-bold text-sm text-amber-700">
                          {equipmentList.filter(e => e.category === 'UNIFORM' && e.condition === 'PRESSING').length}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Disponibles</span>
                        <span className="font-mono font-bold text-sm text-emerald-700">
                          {equipmentList.filter(e => e.category === 'UNIFORM').reduce((s, u) => s + u.availableQty, 0)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Data Table Preview */}
              <div className="overflow-x-auto">
                {reportType === 'STAFF' && (
                  <table className="w-full text-left text-xs border border-slate-200">
                    <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-2 border-b border-r border-slate-200">Nom Collaborateur</th>
                        <th className="p-2 border-b border-r border-slate-200">Poste / Rôle</th>
                        <th className="p-2 border-b border-r border-slate-200">Contact</th>
                        <th className="p-2 border-b border-r border-slate-200">Langues</th>
                        <th className="p-2 border-b border-r border-slate-200">Mensuration</th>
                        <th className="p-2 border-b border-r border-slate-200">VIP</th>
                        <th className="p-2 border-b border-slate-200">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {staffList.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50">
                          <td className="p-2 font-medium text-slate-900 border-r border-slate-200">
                            {s.fullName}
                          </td>
                          <td className="p-2 border-r border-slate-200 text-slate-700">
                            {s.staffCategory || s.role}
                          </td>
                          <td className="p-2 border-r border-slate-200 text-slate-600 font-mono text-[11px]">
                            {s.phone}
                          </td>
                          <td className="p-2 border-r border-slate-200 text-slate-600">
                            {s.languages.join(', ')}
                          </td>
                          <td className="p-2 border-r border-slate-200 text-slate-600">
                            T.{s.uniformSize || '38'} • {s.heightCm ? `${s.heightCm}cm` : '-'}
                          </td>
                          <td className="p-2 border-r border-slate-200">
                            {s.vipProtocolCertified ? (
                              <span className="text-amber-700 font-bold">★ Certifié</span>
                            ) : (
                              <span className="text-slate-400">Standard</span>
                            )}
                          </td>
                          <td className="p-2 font-semibold">
                            <span className={s.status === 'AVAILABLE' ? 'text-emerald-700' : 'text-amber-700'}>
                              {s.status === 'AVAILABLE' ? 'Disponible' : s.status === 'ASSIGNED' ? 'En mission' : 'Indispo'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {reportType === 'EQUIPMENT' && (
                  <table className="w-full text-left text-xs border border-slate-200">
                    <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-2 border-b border-r border-slate-200">Réf.</th>
                        <th className="p-2 border-b border-r border-slate-200">Désignation</th>
                        <th className="p-2 border-b border-r border-slate-200">Pôle</th>
                        <th className="p-2 border-b border-r border-slate-200 text-center">Total</th>
                        <th className="p-2 border-b border-r border-slate-200 text-center">Dispo</th>
                        <th className="p-2 border-b border-r border-slate-200">État</th>
                        <th className="p-2 border-b border-slate-200 text-right">Valeur Unitaire</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {equipmentList.map((eq) => (
                        <tr key={eq.id} className="hover:bg-slate-50">
                          <td className="p-2 font-mono font-bold text-slate-700 border-r border-slate-200 text-[11px]">
                            {eq.referenceCode}
                          </td>
                          <td className="p-2 font-medium text-slate-900 border-r border-slate-200">
                            {eq.name}
                          </td>
                          <td className="p-2 border-r border-slate-200 text-slate-600">
                            {eq.domain}
                          </td>
                          <td className="p-2 border-r border-slate-200 text-center font-mono font-bold">
                            {eq.totalQty} {eq.unit}
                          </td>
                          <td className="p-2 border-r border-slate-200 text-center font-mono font-bold text-emerald-700">
                            {eq.availableQty}
                          </td>
                          <td className="p-2 border-r border-slate-200">
                            <span className={eq.condition === 'EXCELLENT' ? 'text-emerald-700 font-semibold' : 'text-amber-700 font-semibold'}>
                              {eq.condition}
                            </span>
                          </td>
                          <td className="p-2 text-right font-mono text-slate-800">
                            {(eq.unitValueEuro || 0).toFixed(2)} €
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {reportType === 'EVENTS' && (
                  <table className="w-full text-left text-xs border border-slate-200">
                    <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-2 border-b border-r border-slate-200">Réception</th>
                        <th className="p-2 border-b border-r border-slate-200">Client</th>
                        <th className="p-2 border-b border-r border-slate-200">Date & Horaires</th>
                        <th className="p-2 border-b border-r border-slate-200">Lieu</th>
                        <th className="p-2 border-b border-r border-slate-200 text-center">Effectif</th>
                        <th className="p-2 border-b border-slate-200">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {events.map((ev) => (
                        <tr key={ev.id} className="hover:bg-slate-50">
                          <td className="p-2 font-bold text-slate-900 border-r border-slate-200">
                            {ev.title}
                          </td>
                          <td className="p-2 border-r border-slate-200 text-slate-700">
                            {ev.clientName}
                          </td>
                          <td className="p-2 border-r border-slate-200 text-slate-600">
                            {ev.startDate} ({ev.startTime || '18:00'} - {ev.endTime || '02:00'})
                          </td>
                          <td className="p-2 border-r border-slate-200 text-slate-600">
                            {ev.location}
                          </td>
                          <td className="p-2 border-r border-slate-200 text-center font-mono font-bold">
                            {ev.assignments.length} staff
                          </td>
                          <td className="p-2 font-semibold">
                            <span className={ev.status === 'IN_PROGRESS' ? 'text-emerald-700 font-bold' : 'text-slate-700'}>
                              {ev.status === 'IN_PROGRESS' ? '⚡ Jour J' : ev.status === 'PLANNED' ? '📅 Planifié' : '✅ Terminé'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {reportType === 'ROADMAP' && currentEvent && (
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1.5 pb-1 border-b border-slate-200">
                        1. Équipe Mobilisée & Registre d'Émargement
                      </h5>
                      <table className="w-full text-left text-xs border border-slate-200">
                        <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                          <tr>
                            <th className="p-2 border-b border-r border-slate-200">Collaborateur</th>
                            <th className="p-2 border-b border-r border-slate-200">Poste Jour J</th>
                            <th className="p-2 border-b border-r border-slate-200">Téléphone</th>
                            <th className="p-2 border-b border-r border-slate-200">Émargement</th>
                            <th className="p-2 border-b border-slate-200">Heure Pointage</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {currentEvent.assignments.map((a) => {
                            const staff = staffList.find(s => s.id === a.userId) || a.user;
                            return (
                              <tr key={a.id}>
                                <td className="p-2 font-medium text-slate-900 border-r border-slate-200">
                                  {staff?.fullName || 'Personnel'}
                                </td>
                                <td className="p-2 border-r border-slate-200 text-slate-700">
                                  {a.roleOnDay}
                                </td>
                                <td className="p-2 border-r border-slate-200 text-slate-600 font-mono text-[11px]">
                                  {staff?.phone || 'N/A'}
                                </td>
                                <td className="p-2 border-r border-slate-200 font-bold">
                                  <span className={a.checkInStatus === 'PRESENT' ? 'text-emerald-700' : 'text-amber-700'}>
                                    {a.checkInStatus === 'PRESENT' ? '✓ PRÉSENT' : a.checkInStatus === 'LATE' ? '⚠ RETARD' : '⚪ EN ATTENTE'}
                                  </span>
                                </td>
                                <td className="p-2 font-mono text-slate-700">
                                  {a.checkInTime || '-'}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <div>
                      <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1.5 pb-1 border-b border-slate-200">
                        2. Matériel & Mobilier Engagé sur Site
                      </h5>
                      <table className="w-full text-left text-xs border border-slate-200">
                        <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                          <tr>
                            <th className="p-2 border-b border-r border-slate-200">Réf.</th>
                            <th className="p-2 border-b border-r border-slate-200">Désignation</th>
                            <th className="p-2 border-b border-r border-slate-200 text-center">Qté Réservée</th>
                            <th className="p-2 border-b border-slate-200">Statut Contrôle</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {currentEvent.bookedItems.map((b) => {
                            const equip = equipmentList.find(e => e.id === b.equipmentId) || b.equipment;
                            return (
                              <tr key={b.id}>
                                <td className="p-2 font-mono font-bold text-slate-700 border-r border-slate-200">
                                  {equip?.referenceCode}
                                </td>
                                <td className="p-2 font-medium text-slate-900 border-r border-slate-200">
                                  {equip?.name}
                                </td>
                                <td className="p-2 border-r border-slate-200 text-center font-mono font-bold text-slate-900">
                                  {b.quantity} {equip?.unit}
                                </td>
                                <td className="p-2 font-semibold text-emerald-800">
                                  {b.status === 'CHECKED' ? '✓ Contrôlé & Prêt' : 'Réservé au Dépôt'}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {reportType === 'UNIFORMS' && (
                  <table className="w-full text-left text-xs border border-slate-200">
                    <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-2 border-b border-r border-slate-200">Réf.</th>
                        <th className="p-2 border-b border-r border-slate-200">Désignation Ensemble</th>
                        <th className="p-2 border-b border-r border-slate-200">Taille</th>
                        <th className="p-2 border-b border-r border-slate-200 text-center">Stock Total</th>
                        <th className="p-2 border-b border-r border-slate-200 text-center">Dispo</th>
                        <th className="p-2 border-b border-slate-200">Penderie / Entretien</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {equipmentList.filter(e => e.category === 'UNIFORM').map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50">
                          <td className="p-2 font-mono font-bold text-purple-900 border-r border-slate-200">
                            {u.referenceCode}
                          </td>
                          <td className="p-2 font-medium text-slate-900 border-r border-slate-200">
                            {u.name}
                          </td>
                          <td className="p-2 border-r border-slate-200 font-bold text-slate-700">
                            Taille {u.sizeOrDimensions || '38'}
                          </td>
                          <td className="p-2 border-r border-slate-200 text-center font-mono font-bold">
                            {u.totalQty}
                          </td>
                          <td className="p-2 border-r border-slate-200 text-center font-mono font-bold text-emerald-700">
                            {u.availableQty}
                          </td>
                          <td className="p-2 text-slate-600">
                            {u.locationWarehouse} {u.condition === 'PRESSING' && '• (En Pressing)'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Official Signature Blocks (if enabled) */}
              {includeSignatures && (
                <div className="pt-8 border-t-2 border-slate-900 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs text-slate-800">
                  <div className="border border-slate-300 rounded p-3 text-center space-y-8 bg-slate-50/40">
                    <p className="font-bold uppercase text-[10px] text-slate-600">
                      Régie Générale & Logistique
                    </p>
                    <div className="border-b border-dashed border-slate-400 mx-4"></div>
                    <p className="text-[10px] text-slate-400">Date et Visa</p>
                  </div>

                  <div className="border border-slate-300 rounded p-3 text-center space-y-8 bg-slate-50/40">
                    <p className="font-bold uppercase text-[10px] text-slate-600">
                      Responsable Protocole & RH
                    </p>
                    <div className="border-b border-dashed border-slate-400 mx-4"></div>
                    <p className="text-[10px] text-slate-400">Date et Visa</p>
                  </div>

                  <div className="border border-slate-300 rounded p-3 text-center space-y-8 bg-slate-50/40 col-span-2 sm:col-span-1">
                    <p className="font-bold uppercase text-[10px] text-slate-600">
                      Direction Blessing Event
                    </p>
                    <div className="border-b border-dashed border-slate-400 mx-4"></div>
                    <p className="text-[10px] text-slate-400">Cachet & Signature</p>
                  </div>
                </div>
              )}

              {/* Footer Stamp */}
              <div className="text-center text-[10px] text-slate-400 border-t border-slate-200 pt-3">
                Blessing Event • Système Opérationnel Haute Réception & Protocole • Document généré à titre de rapport administratif confidentiel.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
