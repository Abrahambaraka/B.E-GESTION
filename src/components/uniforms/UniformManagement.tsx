import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { Equipment, UserStaff } from '../../types/event';
import { 
  Shirt, 
  Sparkles, 
  Check, 
  AlertCircle, 
  RefreshCw, 
  Users, 
  Search, 
  Warehouse, 
  Tag, 
  Layers, 
  CheckCircle2,
  Calendar,
  Plus,
  Edit,
  Trash2,
  FileDown,
  SlidersHorizontal,
  FolderPlus,
  AlertTriangle
} from 'lucide-react';
import { AddUniformModal } from './AddUniformModal';
import { EditUniformModal } from './EditUniformModal';
import { UniformBatchModal } from './UniformBatchModal';
import { UniformBatchForm } from './UniformBatchForm';

interface UniformManagementProps {
  openExportModal?: (type?: any) => void;
}

export const UniformManagement: React.FC<UniformManagementProps> = ({ openExportModal }) => {
  const { equipmentList, staffList, events, updateEquipment, deleteEquipment } = useEvent();

  const [activeTab, setActiveTab] = useState<'CATALOG' | 'BATCH_ENTRY' | 'SIZING_MATRIX'>('CATALOG');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSize, setFilterSize] = useState('ALL');

  // Modals state
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [uniformToEdit, setUniformToEdit] = useState<Equipment | null>(null);

  // Filter uniforms from equipment
  const uniforms = equipmentList.filter(e => e.category === 'UNIFORM');

  const filteredUniforms = uniforms.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.referenceCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSize = filterSize === 'ALL' || (u.sizeOrDimensions && u.sizeOrDimensions.includes(filterSize));
    return matchesSearch && matchesSize;
  });

  // Calculate stats
  const totalUniformCount = uniforms.reduce((sum, u) => sum + u.totalQty, 0);
  const availableUniformCount = uniforms.reduce((sum, u) => sum + u.availableQty, 0);
  const inPressingCount = uniforms.filter(u => u.condition === 'PRESSING').reduce((sum, u) => sum + u.totalQty, 0);

  // Group staff by uniform size
  const staffBySize: { [size: string]: UserStaff[] } = {};
  staffList.forEach(s => {
    const size = s.uniformSize || 'Non spécifiée';
    if (!staffBySize[size]) staffBySize[size] = [];
    staffBySize[size].push(s);
  });

  // Map of stock available by size
  const stockBySize: { [size: string]: number } = {};
  uniforms.forEach(u => {
    const raw = u.sizeOrDimensions?.replace('Taille ', '').trim() || 'TU';
    stockBySize[raw] = (stockBySize[raw] || 0) + u.availableQty;
  });

  const handleTogglePressing = (uniform: Equipment) => {
    const nextCondition = uniform.condition === 'PRESSING' ? 'EXCELLENT' : 'PRESSING';
    updateEquipment(uniform.id, { condition: nextCondition });
  };

  const handleOpenEdit = (uniform: Equipment) => {
    setUniformToEdit(uniform);
    setIsEditModalOpen(true);
  };

  const handleDelete = (uniform: Equipment) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la tenue "${uniform.name}" (${uniform.referenceCode}) du vestiaire ?`)) {
      deleteEquipment(uniform.id);
    }
  };

  const handleQuickAdjustStock = (uniform: Equipment, delta: number) => {
    const newTotal = Math.max(0, uniform.totalQty + delta);
    const newAvailable = Math.max(0, Math.min(newTotal, uniform.availableQty + delta));
    updateEquipment(uniform.id, { totalQty: newTotal, availableQty: newAvailable });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl lg:text-2xl font-serif font-bold text-slate-900">
            Vestiaire Événementiel & Gestion des Tenues
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Suivi des tailleurs d'hôtesses, smokings de maîtres d'hôtel, costumes de serveurs et gestion par tailles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {openExportModal && (
            <button
              onClick={() => openExportModal('UNIFORMS')}
              className="px-3 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded text-xs font-medium transition-colors flex items-center gap-1 border border-slate-200"
              title="Exporter l'inventaire du vestiaire"
            >
              <FileDown className="w-3.5 h-3.5 text-slate-500" />
              <span>Exporter</span>
            </button>
          )}

          <button
            id="uniform-batch-btn"
            onClick={() => setActiveTab('BATCH_ENTRY')}
            className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs rounded transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Enregistrer par Tailles</span>
          </button>
        </div>
      </div>

      {/* Sleek Metrics Ribbon (Uncluttered) */}
      <div className="flex flex-wrap items-center gap-6 py-2.5 px-4 bg-white border border-slate-200 rounded-lg text-xs">
        <div>
          <span className="text-slate-400">Total vestiaire :</span>{' '}
          <strong className="text-slate-900 font-semibold">{totalUniformCount} tenues</strong>
        </div>
        <div className="h-3 w-px bg-slate-200 hidden sm:block" />
        <div>
          <span className="text-slate-400">Disponibles :</span>{' '}
          <strong className="text-emerald-700 font-semibold">{availableUniformCount} prêtes</strong>
        </div>
        <div className="h-3 w-px bg-slate-200 hidden sm:block" />
        <div>
          <span className="text-slate-400">En pressing :</span>{' '}
          <strong className="text-amber-700 font-semibold">{inPressingCount} en entretien</strong>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('CATALOG')}
          className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
            activeTab === 'CATALOG'
              ? 'bg-slate-900 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Catalogue ({uniforms.length})
        </button>

        <button
          id="tab-batch-registration"
          onClick={() => setActiveTab('BATCH_ENTRY')}
          className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
            activeTab === 'BATCH_ENTRY'
              ? 'bg-purple-600 text-white font-semibold'
              : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50'
          }`}
        >
          Formulaire par Tailles
        </button>

        <button
          onClick={() => setActiveTab('SIZING_MATRIX')}
          className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
            activeTab === 'SIZING_MATRIX'
              ? 'bg-slate-900 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Concordance RH
        </button>
      </div>

      {/* VIEW 1: FORMULAIRE D'ENREGISTREMENT PAR TAILLES (INLINE) */}
      {activeTab === 'BATCH_ENTRY' && (
        <div className="space-y-4">
          <div className="bg-purple-50/70 border border-purple-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-md bg-purple-600 text-white">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-slate-900 text-sm">
                  Formulaire d'enregistrement d'uniformes selon les tailles
                </h3>
                <p className="text-slate-600">
                  Définissez le modèle de tenue, choisissez votre grille de mensurations (Femme 34-48, Homme 46-58, Standard, Chaussures) et saisissez les quantités en un seul passage.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('CATALOG')}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-700 font-semibold hover:bg-slate-100 transition-colors shrink-0"
            >
              ← Retour au catalogue
            </button>
          </div>

          <UniformBatchForm 
            isInline={true}
            onSuccess={() => {
              setActiveTab('CATALOG');
            }}
          />
        </div>
      )}

      {/* VIEW 2: CATALOGUE PENDERIE & STOCKS */}
      {activeTab === 'CATALOG' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Uniform Stock Cards (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Rechercher par modèle de tenue, référence..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 text-slate-900"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={filterSize}
                    onChange={(e) => setFilterSize(e.target.value)}
                    className="py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="ALL">Toutes les tailles</option>
                    <option value="34">Taille 34</option>
                    <option value="36">Taille 36</option>
                    <option value="38">Taille 38</option>
                    <option value="40">Taille 40</option>
                    <option value="42">Taille 42</option>
                    <option value="44">Taille 44</option>
                    <option value="46">Taille 46</option>
                    <option value="48">Taille 48</option>
                    <option value="50">Taille 50</option>
                    <option value="52">Taille 52</option>
                    <option value="54">Taille 54</option>
                    <option value="56">Taille 56</option>
                    <option value="TU">Taille Unique</option>
                  </select>

                  <button
                    onClick={() => setIsBatchModalOpen(true)}
                    className="px-3 py-2 bg-purple-50 text-purple-900 hover:bg-purple-100 border border-purple-200 rounded-md text-xs font-bold flex items-center gap-1 shrink-0"
                    title="Enregistrer un lot d'uniformes par tailles via modale"
                  >
                    <Layers className="w-3.5 h-3.5" /> + Tailles
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredUniforms.map((uniform) => {
                const isPressing = uniform.condition === 'PRESSING';
                return (
                  <div 
                    key={uniform.id}
                    className="bg-white border border-slate-200 rounded-lg p-4 transition-all hover:border-slate-300 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-mono text-[11px] font-semibold text-slate-600">
                          {uniform.referenceCode}
                        </span>
                        <span className={`text-[11px] font-medium ${
                          isPressing ? 'text-amber-700' : 'text-emerald-700'
                        }`}>
                          {isPressing ? 'En Pressing' : 'Disponible'}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-slate-900 text-sm leading-snug">
                        {uniform.name}
                      </h3>

                      <div className="text-xs text-slate-500 flex flex-wrap items-center gap-1.5 pt-0.5">
                        <span className="font-medium text-slate-700">{uniform.sizeOrDimensions}</span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span>{uniform.locationWarehouse}</span>
                        {uniform.unitValueEuro ? (
                          <>
                            <span aria-hidden="true" className="text-slate-300">·</span>
                            <span>{uniform.unitValueEuro} €</span>
                          </>
                        ) : null}
                      </div>

                      {uniform.notes && (
                        <p className="text-[11px] text-slate-400 line-clamp-1 italic">
                          « {uniform.notes} »
                        </p>
                      )}
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-slate-900">{uniform.availableQty}</span>
                        <span className="text-slate-400 text-[11px]"> / {uniform.totalQty} en stock</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleTogglePressing(uniform)}
                          className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                            isPressing 
                              ? 'text-emerald-700 hover:bg-emerald-50' 
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {isPressing ? 'Marquer Prêt' : 'Pressing'}
                        </button>

                        <button
                          onClick={() => handleOpenEdit(uniform)}
                          className="px-2 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
                        >
                          Modifier
                        </button>

                        <button
                          onClick={() => handleDelete(uniform)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Clean Sizing Summary (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Sizing Distribution Table */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100 text-xs">
                <span className="font-medium text-slate-700">Concordance Tailles RH</span>
                <span className="text-slate-400 text-[11px]">Stock vs Collaborateurs</span>
              </div>

              <div className="space-y-2 text-xs">
                {Object.entries(staffBySize).map(([size, staffArr]) => {
                  const stock = stockBySize[size] || 0;
                  const isShortage = stock < staffArr.length;

                  return (
                    <div key={size} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-b-0">
                      <span className="font-medium text-slate-800">
                        Taille {size}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-500">
                          {staffArr.length} collab.
                        </span>
                        <span className={`text-[11px] font-semibold ${
                          isShortage ? 'text-rose-600' : 'text-emerald-700'
                        }`}>
                          {stock} dispo
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: MATRICE DE CONCORDANCE RH */}
      {activeTab === 'SIZING_MATRIX' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h3 className="text-base font-serif font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                Matrice de Concordance : Tailles en Penderie vs Profils Collaborateurs RH
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Visualisez le taux de couverture du vestiaire pour chaque taille de votre équipe active.
              </p>
            </div>

            <button
              onClick={() => setIsBatchModalOpen(true)}
              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider rounded-md transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
            >
              <Layers className="w-4 h-4" /> Réapprovisionner des Tailles
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                  <th className="p-3">Taille / Mensuration</th>
                  <th className="p-3">Collaborateurs Enregistrés</th>
                  <th className="p-3">Tenues Disponibles en Penderie</th>
                  <th className="p-3">État de Couverture</th>
                  <th className="p-3 text-right">Action Rapide</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {Object.entries(staffBySize).map(([size, staffArr]) => {
                  const stock = stockBySize[size] || 0;
                  const ratio = staffArr.length > 0 ? (stock / staffArr.length) : 1;
                  const isCritical = stock < staffArr.length;

                  return (
                    <tr key={size} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-bold font-serif text-slate-900 text-sm">
                        Taille {size}
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap items-center gap-1">
                          <span className="font-bold text-slate-900 mr-1">{staffArr.length} :</span>
                          {staffArr.map(s => (
                            <span key={s.id} className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 text-[10px] border border-slate-200">
                              {s.fullName} ({s.staffCategory?.charAt(0)})
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="font-mono font-bold text-slate-900 text-sm">
                          {stock} ensembles
                        </span>
                      </td>
                      <td className="p-3">
                        {isCritical ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-rose-50 text-rose-700 font-bold border border-rose-200">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Déficit (-{staffArr.length - stock} tenues)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                            <Check className="w-3.5 h-3.5" />
                            Couvert (+{stock - staffArr.length} en réserve)
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            setActiveTab('BATCH_ENTRY');
                          }}
                          className="px-2.5 py-1 text-[11px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded border border-purple-200 transition-colors"
                        >
                          + Ajouter T.{size}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Uniform Modal */}
      <AddUniformModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Batch Uniform Modal */}
      <UniformBatchModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
      />

      {/* Edit Uniform Modal */}
      <EditUniformModal
        uniform={uniformToEdit}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setUniformToEdit(null);
        }}
      />
    </div>
  );
};
