import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { UserStaff, StaffCategory, Role } from '../../types/event';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  Languages, 
  Shirt, 
  Sparkles, 
  Check, 
  X, 
  Edit, 
  Trash2, 
  ShieldCheck,
  CheckCircle,
  Clock,
  ArrowUpDown,
  FileDown,
  Download,
  Printer,
  Crown
} from 'lucide-react';
import { exportStaffToCSV, downloadCSV } from '../../utils/exportUtils';
import { UniformBatchModal } from '../uniforms/UniformBatchModal';

interface StaffDirectoryProps {
  openAddModal: () => void;
  openExportModal?: (type?: any) => void;
}

export const StaffDirectory: React.FC<StaffDirectoryProps> = ({ openAddModal, openExportModal }) => {
  const { staffList, updateStaff, deleteStaff, events } = useEvent();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [languageFilter, setLanguageFilter] = useState<string>('ALL');
  const [accreditationFilter, setAccreditationFilter] = useState<string>('ALL');
  const [selectedStaff, setSelectedStaff] = useState<UserStaff | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<UserStaff>>({});
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isUniformBatchModalOpen, setIsUniformBatchModalOpen] = useState(false);

  const handleQuickExportCSV = () => {
    const timestamp = new Date().toISOString().slice(0, 10);
    const csv = exportStaffToCSV(filteredStaff);
    downloadCSV(`Blessing_Event_Staff_RH_${timestamp}.csv`, csv);
    setIsExportMenuOpen(false);
  };

  // Filter staff members
  const filteredStaff = staffList.filter((staff) => {
    const matchesSearch = 
      staff.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (staff.phone && staff.phone.includes(searchTerm)) ||
      staff.languages.some(l => l.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'ALL' || staff.staffCategory === selectedCategory;
    const matchesLanguage = languageFilter === 'ALL' || staff.languages.includes(languageFilter);
    const staffAccreditation = staff.protocolAccreditation || (staff.vipProtocolCertified ? 'VIP' : 'STANDARD');
    const matchesAccreditation = accreditationFilter === 'ALL' || staffAccreditation === accreditationFilter;

    return matchesSearch && matchesCategory && matchesLanguage && matchesAccreditation;
  });

  const allLanguages = Array.from(new Set(staffList.flatMap(s => s.languages)));

  const handleOpenEdit = (staff: UserStaff) => {
    setSelectedStaff(staff);
    setEditFormData(staff);
    setIsEditing(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaff) return;
    updateStaff(selectedStaff.id, editFormData);
    setSelectedStaff({ ...selectedStaff, ...editFormData } as UserStaff);
    setIsEditing(false);
  };

  const getCategoryLabel = (cat?: StaffCategory) => {
    switch (cat) {
      case 'HOSTESS': return 'Hôtesse d’Accueil VIP';
      case 'SERVER': return 'Chef de Rang / Serveur';
      case 'BUTLER': return 'Maître d’Hôtel & Butler';
      case 'COORDINATOR': return 'Coordinateur Protocole';
      default: return 'Personnel Général';
    }
  };

  const getCategoryBadgeClass = (cat?: StaffCategory) => {
    switch (cat) {
      case 'HOSTESS': return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'SERVER': return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'BUTLER': return 'bg-amber-50 text-amber-900 border-amber-200 font-bold';
      case 'COORDINATOR': return 'bg-purple-50 text-purple-800 border-purple-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-serif font-bold text-slate-900">
            Ressources Humaines & Profils Protocole
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gestion des hôtesses, maîtres d’hôtel, serveurs et coordinateurs (mensurations, langues, habilitations).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Export Button */}
          <button
            id="export-staff-btn"
            onClick={() => openExportModal ? openExportModal('STAFF') : handleQuickExportCSV()}
            className="px-3 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded text-xs font-medium transition-colors flex items-center gap-1 border border-slate-200"
            title="Exporter le registre RH en CSV ou PDF"
          >
            <FileDown className="w-3.5 h-3.5 text-slate-500" />
            <span>Exporter</span>
          </button>

          <button
            id="add-staff-top-btn"
            onClick={openAddModal}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nouveau Profil</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs space-y-2.5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="relative md:col-span-6">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="staff-search-input"
              type="text"
              placeholder="Rechercher par nom, email, langue (ex: FR, EN, AR)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white text-slate-900"
            />
          </div>

          {/* Category Dropdown */}
          <div className="md:col-span-3">
            <select
              id="staff-category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-700"
            >
              <option value="ALL">Toutes catégories</option>
              <option value="HOSTESS">Hôtesses d’Accueil VIP</option>
              <option value="SERVER">Serveurs & Chefs de Rang</option>
              <option value="BUTLER">Maîtres d’Hôtel & Butlers</option>
              <option value="COORDINATOR">Coordinateurs Protocole</option>
            </select>
          </div>

          {/* Language Dropdown */}
          <div className="md:col-span-3">
            <select
              id="staff-language-filter"
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              className="w-full py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-700"
            >
              <option value="ALL">Toutes les langues</option>
              {allLanguages.map(l => (
                <option key={l} value={l}>Langue : {l}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Accreditation Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-400 font-medium text-[11px] mr-1">Accréditation :</span>
            <button
              type="button"
              onClick={() => setAccreditationFilter('ALL')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-colors ${
                accreditationFilter === 'ALL'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Tous
            </button>
            <button
              type="button"
              onClick={() => setAccreditationFilter(accreditationFilter === 'PRESTIGE' ? 'ALL' : 'PRESTIGE')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-colors flex items-center gap-1 ${
                accreditationFilter === 'PRESTIGE'
                  ? 'bg-amber-100 text-amber-950 border-amber-400 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-amber-600" />
              <span>Prestige Protocol (Chefs d'État)</span>
            </button>
            <button
              type="button"
              onClick={() => setAccreditationFilter(accreditationFilter === 'VIP' ? 'ALL' : 'VIP')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-colors flex items-center gap-1 ${
                accreditationFilter === 'VIP'
                  ? 'bg-sky-100 text-sky-950 border-sky-400 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-sky-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>Accrédité VIP</span>
            </button>
          </div>

          <span className="text-slate-400 text-[11px]">
            {filteredStaff.length} / {staffList.length} profils
          </span>
        </div>
      </div>

      {/* Staff Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((staff) => {
          const isAssigned = staff.status === 'ASSIGNED';
          const accreditation = staff.protocolAccreditation || (staff.vipProtocolCertified ? 'VIP' : 'STANDARD');
          
          return (
            <div
              key={staff.id}
              onClick={() => setSelectedStaff(staff)}
              className="bg-white border border-slate-200 rounded-lg p-5 hover:border-amber-500/60 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Top Avatar & Category */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-slate-200 group-hover:border-amber-500 transition-colors">
                      {staff.avatarUrl ? (
                        <img src={staff.avatarUrl} alt={staff.fullName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-slate-600 font-serif text-lg">
                          {staff.fullName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-slate-900 text-base group-hover:text-amber-600 transition-colors flex items-center gap-1.5">
                        {staff.fullName}
                      </h3>
                      <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border mt-0.5 ${getCategoryBadgeClass(staff.staffCategory)}`}>
                        {getCategoryLabel(staff.staffCategory)}
                      </span>
                    </div>
                  </div>

                  {accreditation === 'PRESTIGE' ? (
                    <span className="text-[10px] bg-amber-50 text-amber-900 font-bold px-2.5 py-0.5 rounded-full border border-amber-300 shrink-0 flex items-center gap-1 uppercase tracking-wider shadow-2xs">
                      <Crown className="w-3 h-3 text-amber-600" /> Prestige
                    </span>
                  ) : accreditation === 'VIP' ? (
                    <span className="text-[10px] bg-sky-50 text-sky-800 font-semibold px-2 py-0.5 rounded-full border border-sky-200 shrink-0 flex items-center gap-1 uppercase tracking-wider">
                      <Sparkles className="w-3 h-3 text-sky-600" /> VIP
                    </span>
                  ) : null}
                </div>

                {/* Sizing & Languages Specs */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Shirt className="w-3.5 h-3.5 text-slate-400" />
                    <span>Taille : <strong className="text-slate-900 font-mono">{staff.uniformSize || 'N/A'}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Languages className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{staff.languages.join(', ')}</span>
                  </div>
                </div>

                {staff.notes && (
                  <p className="mt-2 text-xs text-slate-500 line-clamp-2 italic bg-slate-50 p-2 rounded border border-slate-100">
                    « {staff.notes} »
                  </p>
                )}
              </div>

              {/* Card Footer with Availability Status & Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const newStatus = staff.status === 'AVAILABLE' ? 'UNAVAILABLE' : 'AVAILABLE';
                    updateStaff(staff.id, { status: newStatus });
                  }}
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold border transition-colors ${
                    staff.status === 'AVAILABLE'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                      : staff.status === 'ASSIGNED'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                  }`}
                  title="Cliquer pour basculer la disponibilité"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    staff.status === 'AVAILABLE' ? 'bg-emerald-500' : staff.status === 'ASSIGNED' ? 'bg-amber-500' : 'bg-slate-400'
                  }`}></span>
                  {staff.status === 'AVAILABLE' ? 'Disponible' : staff.status === 'ASSIGNED' ? 'En mission' : 'Indisponible'}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEdit(staff);
                    }}
                    title="Modifier la fiche"
                    className="p-1 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded border border-slate-200 hover:border-amber-300 transition-all flex items-center gap-1 px-2 py-1 text-[11px] font-bold"
                  >
                    <Edit className="w-3 h-3 text-amber-500" />
                    <span>Modifier</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Supprimer définitivement le profil de ${staff.fullName} ?`)) {
                        deleteStaff(staff.id);
                      }
                    }}
                    title="Supprimer ce profil"
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded border border-slate-200 hover:border-rose-300 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Profile Detail & Edit Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl relative">
            <button
              onClick={() => {
                setSelectedStaff(null);
                setIsEditing(false);
              }}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {!isEditing ? (
              /* View Profile Mode */
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden shrink-0 border-2 border-amber-500/40">
                    {selectedStaff.avatarUrl ? (
                      <img src={selectedStaff.avatarUrl} alt={selectedStaff.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-slate-600 font-serif text-2xl">
                        {selectedStaff.fullName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-serif font-bold text-slate-900">
                        {selectedStaff.fullName}
                      </h3>
                      {selectedStaff.vipProtocolCertified && (
                        <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded border border-amber-200 uppercase tracking-wider">
                          Habilité Protocole VIP
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">
                      {getCategoryLabel(selectedStaff.staffCategory)} • Rôle Système : {selectedStaff.role}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-600">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-slate-400" /> {selectedStaff.email}
                      </span>
                      {selectedStaff.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" /> {selectedStaff.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mensurations & Uniform specs */}
                <div className="bg-slate-50 border border-slate-200 rounded-md p-4 space-y-3">
                  <h4 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Shirt className="w-4 h-4 text-amber-600" /> Mensurations & Fiche Vestiaire
                  </h4>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="bg-white p-2.5 rounded border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">Taille Uniforme / Tailleur</span>
                      <strong className="text-slate-900 text-sm font-mono">{selectedStaff.uniformSize || 'Non renseignée'}</strong>
                    </div>
                    <div className="bg-white p-2.5 rounded border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">Stature</span>
                      <strong className="text-slate-900 text-sm font-mono">{selectedStaff.heightCm ? `${selectedStaff.heightCm} cm` : 'N/A'}</strong>
                    </div>
                    <div className="bg-white p-2.5 rounded border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">Souliers / Pointure</span>
                      <strong className="text-slate-900 text-sm font-mono">
                        {selectedStaff.shoeSize ? `T.${selectedStaff.shoeSize} (Fournie)` : 'Perso (Dress code)'}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Languages & Skills */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Languages className="w-4 h-4 text-amber-600" /> Langues Étrangères Maîtrisées
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedStaff.languages.map((lang) => (
                      <span key={lang} className="px-3 py-1 bg-slate-100 border border-slate-300 rounded text-xs font-bold text-slate-800 font-mono">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Observations & Protocol Notes */}
                {selectedStaff.notes && (
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                      Notes Opérationnelles & Appréciations
                    </h4>
                    <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded border border-slate-200">
                      {selectedStaff.notes}
                    </p>
                  </div>
                )}

                {/* Event assignments for this staff */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    Affectations Récentes & Réceptions
                  </h4>
                  <div className="space-y-1.5">
                    {events.flatMap(e => 
                      e.assignments
                        .filter(a => a.userId === selectedStaff.id)
                        .map(a => ({ event: e, assignment: a }))
                    ).map(({ event, assignment }) => (
                      <div key={assignment.id} className="p-2.5 bg-slate-50 rounded border border-slate-200 flex items-center justify-between text-xs">
                        <div>
                          <strong className="text-slate-900">{event.title}</strong>
                          <p className="text-slate-500 text-[11px]">Poste : {assignment.roleOnDay} • {event.startDate}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          assignment.checkInStatus === 'PRESENT' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-slate-200 text-slate-700 border border-slate-300'
                        }`}>
                          {assignment.checkInStatus || 'Planifié'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      if (window.confirm(`Supprimer le profil de ${selectedStaff.fullName} ?`)) {
                        deleteStaff(selectedStaff.id);
                        setSelectedStaff(null);
                      }
                    }}
                    className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Supprimer ce profil
                  </button>

                  <button
                    onClick={() => handleOpenEdit(selectedStaff)}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-md flex items-center gap-1.5 transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5 text-amber-400" /> Modifier la fiche
                    </button>
                  </div>
              </div>
            ) : (
              /* Edit Form Mode */
              <form onSubmit={handleSaveEdit} className="space-y-4">
                <h3 className="text-lg font-serif font-bold text-slate-900 border-b border-slate-100 pb-2">
                  Modifier le profil : {selectedStaff.fullName}
                </h3>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Nom complet</label>
                    <input
                      type="text"
                      value={editFormData.fullName || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                      required
                      className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-amber-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Catégorie RH</label>
                    <select
                      value={editFormData.staffCategory || 'HOSTESS'}
                      onChange={(e) => setEditFormData({ ...editFormData, staffCategory: e.target.value as StaffCategory })}
                      className="w-full p-2 border border-slate-300 rounded text-xs"
                    >
                      <option value="HOSTESS">Hôtesse d’Accueil VIP</option>
                      <option value="SERVER">Chef de Rang / Serveur</option>
                      <option value="BUTLER">Maître d’Hôtel & Butler</option>
                      <option value="COORDINATOR">Coordinateur Protocole</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Email professionnel</label>
                    <input
                      type="email"
                      value={editFormData.email || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      required
                      className="w-full p-2 border border-slate-300 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Téléphone</label>
                    <input
                      type="text"
                      value={editFormData.phone || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded text-xs"
                    />
                  </div>
                </div>

                {/* Sizing inputs */}
                <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-2.5 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Taille tenue (ex: 36, 38, 50)</label>
                      <input
                        type="text"
                        value={editFormData.uniformSize || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, uniformSize: e.target.value })}
                        className="w-full p-2 border border-slate-300 rounded text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Stature (cm)</label>
                      <input
                        type="number"
                        value={editFormData.heightCm || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, heightCm: Number(e.target.value) })}
                        className="w-full p-2 border border-slate-300 rounded text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200">
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                      <input
                        type="checkbox"
                        checked={Boolean(editFormData.shoeSize || editFormData.shoesProvidedByAgency)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setEditFormData({
                            ...editFormData,
                            shoesProvidedByAgency: checked,
                            shoeSize: checked ? (editFormData.shoeSize || 38) : undefined
                          });
                        }}
                        className="rounded text-amber-600 focus:ring-amber-500"
                      />
                      <span>Chaussures d'apparat fournies par l'agence (escarpins hôtesses / richelieus)</span>
                    </label>

                    {(editFormData.shoeSize || editFormData.shoesProvidedByAgency) ? (
                      <div className="mt-2 pl-5 max-w-xs animate-in fade-in duration-150">
                        <label className="block text-slate-600 font-semibold mb-1">Pointure requise (35-47)</label>
                        <input
                          type="number"
                          value={editFormData.shoeSize || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, shoeSize: Number(e.target.value) })}
                          className="w-full p-2 border border-slate-300 rounded text-xs font-mono"
                        />
                      </div>
                    ) : (
                      <p className="text-[10px] text-slate-400 pl-5 mt-0.5 italic">
                        Chaussures personnelles soignées (aucun renseignement de pointure requis).
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block text-slate-600 font-medium mb-1">Langues maîtrisées (séparées par virgules, ex: FR, EN, ES)</label>
                  <input
                    type="text"
                    value={editFormData.languages ? editFormData.languages.join(', ') : ''}
                    onChange={(e) => setEditFormData({ ...editFormData, languages: e.target.value.split(',').map(s => s.trim().toUpperCase()).filter(Boolean) })}
                    className="w-full p-2 border border-slate-300 rounded text-xs"
                  />
                </div>

                <div className="text-xs">
                  <label className="block text-slate-600 font-medium mb-1">Niveau d'Accréditation Protocolaire</label>
                  <select
                    value={editFormData.protocolAccreditation || (editFormData.vipProtocolCertified ? 'VIP' : 'STANDARD')}
                    onChange={(e) => {
                      const val = e.target.value as 'PRESTIGE' | 'VIP' | 'STANDARD';
                      setEditFormData({
                        ...editFormData,
                        protocolAccreditation: val,
                        vipProtocolCertified: val !== 'STANDARD'
                      });
                    }}
                    className="w-full p-2 border border-slate-300 rounded text-xs font-semibold"
                  >
                    <option value="STANDARD">Personnel Standard Extra (Qualifié - Pas de badge VIP)</option>
                    <option value="VIP">⭐ Accrédité VIP (Réceptions Officielles & Ambassades)</option>
                    <option value="PRESTIGE">👑 Prestige Protocol (Sommets & Dignitaires d'État)</option>
                  </select>
                </div>

                <div className="text-xs">
                  <label className="block text-slate-600 font-medium mb-1">Notes & Évaluation</label>
                  <textarea
                    rows={2}
                    value={editFormData.notes || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded hover:bg-slate-100"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider rounded transition-colors"
                  >
                    Enregistrer les modifications
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      {/* Uniform Batch Modal */}
      <UniformBatchModal
        isOpen={isUniformBatchModalOpen}
        onClose={() => setIsUniformBatchModalOpen(false)}
      />
    </div>
  );
};

