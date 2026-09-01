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
  Trash2
} from 'lucide-react';
import { AddUniformModal } from './AddUniformModal';
import { EditUniformModal } from './EditUniformModal';

export const UniformManagement: React.FC = () => {
  const { equipmentList, staffList, events, updateEquipment, deleteEquipment, currentRole } = useEvent();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterSize, setFilterSize] = useState('ALL');

  // Modals state
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-serif font-bold text-slate-900">
            Vestiaire Événementiel & Gestion des Tenues
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Suivi des tailleurs d'hôtesses, smokings de maîtres d'hôtel, costumes de serveurs et calibrage des mensurations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentRole !== 'STAFF' && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider rounded-md transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
            >
              <Plus className="w-4 h-4" /> Nouvelle Tenue
            </button>
          )}
          <span className="hidden md:flex px-3 py-1.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold uppercase tracking-wider items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Standard Blessing
          </span>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Ensembles Vestiaire</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-serif font-bold text-slate-900">{totalUniformCount}</span>
            <span className="text-xs text-slate-500">tenues confectionnées</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Tailleurs 36-42, Costumes 48-54, Foulards & Cravates</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Disponibles en Penderie</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-serif font-bold text-emerald-700">{availableUniformCount}</span>
            <span className="text-xs text-slate-500">prêts pour affectation</span>
          </div>
          <p className="text-xs text-emerald-600 mt-1 font-semibold">Contrôlés et repassés</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">En Pressing / Entretien</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-serif font-bold text-amber-700">{inPressingCount}</span>
            <span className="text-xs text-slate-500">en cycle de nettoyage</span>
          </div>
          <p className="text-xs text-amber-800 mt-1 font-semibold">Laine froide & doublures soie</p>
        </div>
      </div>

      {/* Grid: Uniform Inventory on Left (8 cols) + Staff Size Matching Matrix on Right (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Uniform Stock Cards */}
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
                  className="py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="ALL">Toutes les tailles</option>
                  <option value="36">Taille 36</option>
                  <option value="38">Taille 38</option>
                  <option value="40">Taille 40</option>
                  <option value="42">Taille 42</option>
                  <option value="48">Taille 48</option>
                  <option value="50">Taille 50</option>
                  <option value="52">Taille 52</option>
                  <option value="54">Taille 54</option>
                </select>

                {currentRole !== 'STAFF' && (
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-3 py-2 bg-purple-50 text-purple-900 hover:bg-purple-100 border border-purple-200 rounded-md text-xs font-bold flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" /> Nouveau
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredUniforms.map((uniform) => {
              const isPressing = uniform.condition === 'PRESSING';
              return (
                <div 
                  key={uniform.id}
                  className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs hover:border-purple-300 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold font-mono text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        {uniform.referenceCode}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                          isPressing ? 'bg-amber-100 text-amber-900 border-amber-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        }`}>
                          {isPressing ? 'En Pressing' : 'Disponible'}
                        </span>
                        {currentRole !== 'STAFF' && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleOpenEdit(uniform)}
                              title="Modifier la tenue"
                              className="p-1 text-slate-400 hover:text-purple-700 hover:bg-purple-50 rounded"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(uniform)}
                              title="Supprimer du vestiaire"
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <h3 className="font-serif font-bold text-slate-900 text-sm">
                      {uniform.name}
                    </h3>

                    <div className="mt-2.5 p-2.5 bg-slate-50 rounded-md text-xs space-y-1 text-slate-600 border border-slate-100">
                      <p><strong>Finition :</strong> {uniform.colorOrFinish}</p>
                      <p><strong>Mensuration :</strong> <span className="font-mono">{uniform.sizeOrDimensions}</span></p>
                      <p><strong>Penderie :</strong> {uniform.locationWarehouse}</p>
                    </div>

                    {uniform.notes && (
                      <p className="mt-2 text-[11px] text-slate-500 italic">
                        « {uniform.notes} »
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div>
                        <span className="font-bold text-slate-900 text-sm font-mono">{uniform.availableQty}</span>
                        <span className="text-slate-500 text-[11px]"> / {uniform.totalQty} en stock</span>
                      </div>
                      {currentRole !== 'STAFF' && (
                        <div className="flex items-center bg-slate-100 rounded border border-slate-200">
                          <button
                            onClick={() => handleQuickAdjustStock(uniform, -1)}
                            className="px-1.5 py-0.5 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-l"
                            title="Diminuer stock"
                          >
                            -
                          </button>
                          <button
                            onClick={() => handleQuickAdjustStock(uniform, 1)}
                            className="px-1.5 py-0.5 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-r"
                            title="Augmenter stock"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(uniform)}
                        className="px-2.5 py-1 text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3 text-purple-600" /> Modifier
                      </button>

                      <button
                        onClick={() => handleTogglePressing(uniform)}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors ${
                          isPressing 
                            ? 'bg-emerald-600 text-white hover:bg-emerald-500' 
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                        }`}
                      >
                        <RefreshCw className="w-3 h-3" />
                        {isPressing ? 'Retour' : 'Pressing'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Staff Size Distribution & Sizing Matrix */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <h3 className="text-sm font-serif font-bold text-slate-900 pb-2 mb-3 border-b border-slate-100 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-600" /> Concordance Tailles / Effectif RH
            </h3>

            <div className="space-y-3 text-xs">
              {Object.entries(staffBySize).map(([size, staffArr]) => (
                <div key={size} className="p-3 bg-slate-50 rounded-md border border-slate-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Shirt className="w-3.5 h-3.5 text-slate-400" /> Taille {size}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded-full font-bold text-[10px] font-mono">
                      {staffArr.length} collab.
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {staffArr.map(s => (
                      <span key={s.id} className="text-[11px] bg-white border border-slate-300 px-2 py-0.5 rounded text-slate-800 font-medium">
                        {s.fullName.split(' ')[0]} ({s.staffCategory?.charAt(0)})
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Uniform Modal */}
      <AddUniformModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
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


