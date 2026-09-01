import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { Equipment, EquipmentCategory, LogisticsDomain, Condition } from '../../types/event';
import { 
  Package, 
  Plus, 
  Search, 
  CheckCircle2, 
  Edit, 
  Trash2, 
  X,
  Warehouse,
  Tag,
  UtensilsCrossed,
  Sparkles,
  Shirt,
  Armchair,
  Layers,
  ChefHat,
  FileDown
} from 'lucide-react';
import { exportEquipmentToCSV, downloadCSV } from '../../utils/exportUtils';
import { ReportType } from '../export/ExportReportModal';

interface EquipmentInventoryProps {
  openExportModal?: (type?: ReportType) => void;
}

export const EquipmentInventory: React.FC<EquipmentInventoryProps> = ({ openExportModal }) => {
  const { equipmentList, addEquipment, updateEquipment, deleteEquipment, currentRole } = useEvent();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedCondition, setSelectedCondition] = useState<string>('ALL');
  const [selectedEquip, setSelectedEquip] = useState<Equipment | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleQuickExportCSV = () => {
    const timestamp = new Date().toISOString().slice(0, 10);
    const csv = exportEquipmentToCSV(equipmentList);
    downloadCSV(`Blessing_Event_Inventaire_Materiel_${timestamp}.csv`, csv);
  };

  // New equipment form state
  const [newEquip, setNewEquip] = useState<Omit<Equipment, 'id'>>({
    name: '',
    category: 'FURNITURE',
    domain: 'DECORATION',
    totalQty: 50,
    availableQty: 50,
    condition: 'EXCELLENT',
    referenceCode: '',
    unit: 'pièces',
    locationWarehouse: 'Hangar A - Allée Déco 1',
    colorOrFinish: '',
    sizeOrDimensions: '',
    unitValueEuro: 80,
    notes: '',
  });

  const filteredList = equipmentList.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.referenceCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.colorOrFinish && item.colorOrFinish.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.locationWarehouse && item.locationWarehouse.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDomain = selectedDomain === 'ALL' || item.domain === selectedDomain;
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesCondition = selectedCondition === 'ALL' || item.condition === selectedCondition;

    return matchesSearch && matchesDomain && matchesCategory && matchesCondition;
  });

  // Count stats by domain
  const decoCount = equipmentList.filter((e) => e.domain === 'DECORATION').length;
  const cateringCount = equipmentList.filter((e) => e.domain === 'CATERING').length;
  const wardrobeCount = equipmentList.filter((e) => e.domain === 'WARDROBE').length;

  const getDomainLabel = (dom: LogisticsDomain) => {
    switch (dom) {
      case 'DECORATION': return 'Décoration & Mobilier';
      case 'CATERING': return 'Service Traiteur & Buffet';
      case 'WARDROBE': return 'Vestiaire & Uniformes';
    }
  };

  const getDomainBadgeClass = (dom: LogisticsDomain) => {
    switch (dom) {
      case 'DECORATION': return 'bg-amber-100/80 text-amber-900 border-amber-300';
      case 'CATERING': return 'bg-emerald-100/80 text-emerald-900 border-emerald-300';
      case 'WARDROBE': return 'bg-purple-100/80 text-purple-900 border-purple-300';
    }
  };

  const getCategoryLabel = (cat: EquipmentCategory) => {
    switch (cat) {
      case 'FURNITURE': return 'Mobilier (Tables & Chaises)';
      case 'COVERS_ACCESSORIES': return 'Housses & Nœuds';
      case 'DECORATION': return 'Scénographie & Centres';
      case 'CATERING_EQUIPMENT': return 'Matériel Traiteur (Chaud/Froid/Plateaux)';
      case 'TABLEWARE': return 'Art de la Table & Verrerie';
      case 'LINEN': return 'Linge de Table & Nappage';
      case 'UNIFORM': return 'Tenues & Uniformes';
    }
  };

  const getCategoryBadgeClass = (cat: EquipmentCategory) => {
    switch (cat) {
      case 'FURNITURE': return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'COVERS_ACCESSORIES': return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'DECORATION': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'CATERING_EQUIPMENT': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'TABLEWARE': return 'bg-cyan-50 text-cyan-800 border-cyan-200';
      case 'LINEN': return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'UNIFORM': return 'bg-purple-50 text-purple-800 border-purple-200';
    }
  };

  const handleDomainChange = (domain: string) => {
    setSelectedDomain(domain);
    setSelectedCategory('ALL'); // Reset subcategory when domain changes
  };

  const handleCreateEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEquip.name) return;
    
    const prefix = newEquip.domain === 'DECORATION' ? 'DEC' : newEquip.domain === 'CATERING' ? 'TRT' : 'UNI';
    const ref = newEquip.referenceCode || `${prefix}-${Date.now().toString().slice(-4)}`;
    
    addEquipment({
      ...newEquip,
      referenceCode: ref,
      availableQty: newEquip.totalQty,
    });
    setIsAddModalOpen(false);
    setNewEquip({
      name: '',
      category: 'FURNITURE',
      domain: 'DECORATION',
      totalQty: 50,
      availableQty: 50,
      condition: 'EXCELLENT',
      referenceCode: '',
      unit: 'pièces',
      locationWarehouse: 'Hangar A - Allée Déco 1',
      colorOrFinish: '',
      sizeOrDimensions: '',
      unitValueEuro: 80,
      notes: '',
    });
  };

  const handleUpdateSelected = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEquip) return;
    updateEquipment(selectedEquip.id, selectedEquip);
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-serif font-bold text-slate-900">
            Logistique & Inventaire du Matériel de Réception
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gestion distincte du pôle <strong>Décoration & Mobilier</strong> (tables, chaises, housses, scénographie) et du pôle <strong>Service Traiteur</strong> (chafing dishes, plateaux, maintien thermique, verrerie, argenterie).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="export-equipment-btn"
            onClick={() => openExportModal ? openExportModal('EQUIPMENT') : handleQuickExportCSV()}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold text-xs uppercase tracking-wider rounded-md transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
            title="Exporter l'inventaire en CSV ou PDF"
          >
            <FileDown className="w-4 h-4 text-amber-600" />
            <span>Exporter Inventaire</span>
          </button>

          {currentRole !== 'STAFF' && (
            <button
              id="add-equip-top-btn"
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider rounded-md transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
            >
              <Plus className="w-4 h-4" /> Référencer un Équipement
            </button>
          )}
        </div>
      </div>

      {/* Domain Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Décoration Card */}
        <div 
          onClick={() => handleDomainChange('DECORATION')}
          className={`cursor-pointer border rounded-lg p-4 transition-all ${
            selectedDomain === 'DECORATION' 
              ? 'bg-amber-50/60 border-amber-400 ring-2 ring-amber-400/20 shadow-xs' 
              : 'bg-white border-slate-200 hover:border-amber-300 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center border border-amber-200">
                <Armchair className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-slate-900 text-sm">Pôle Décoration & Mobilier</h3>
                <span className="text-[11px] text-slate-500">Tables, chaises, housses, nœuds & scénographie</span>
              </div>
            </div>
            <span className="font-mono font-bold text-base text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded border border-amber-200">
              {decoCount}
            </span>
          </div>
        </div>

        {/* Traiteur Card */}
        <div 
          onClick={() => handleDomainChange('CATERING')}
          className={`cursor-pointer border rounded-lg p-4 transition-all ${
            selectedDomain === 'CATERING' 
              ? 'bg-emerald-50/60 border-emerald-400 ring-2 ring-emerald-400/20 shadow-xs' 
              : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center border border-emerald-200">
                <ChefHat className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-slate-900 text-sm">Pôle Service Traiteur</h3>
                <span className="text-[11px] text-slate-500">Chafing dishes, plateaux, nappes, cristaux & vaisselle</span>
              </div>
            </div>
            <span className="font-mono font-bold text-base text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded border border-emerald-200">
              {cateringCount}
            </span>
          </div>
        </div>

        {/* Vestiaire Card */}
        <div 
          onClick={() => handleDomainChange('WARDROBE')}
          className={`cursor-pointer border rounded-lg p-4 transition-all ${
            selectedDomain === 'WARDROBE' 
              ? 'bg-purple-50/60 border-purple-400 ring-2 ring-purple-400/20 shadow-xs' 
              : 'bg-white border-slate-200 hover:border-purple-300 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-md bg-purple-100 text-purple-800 flex items-center justify-center border border-purple-200">
                <Shirt className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-slate-900 text-sm">Pôle Vestiaire & Uniformes</h3>
                <span className="text-[11px] text-slate-500">Tailleurs hôtesses, smokings serveurs & gants</span>
              </div>
            </div>
            <span className="font-mono font-bold text-base text-purple-800 bg-purple-100/70 px-2 py-0.5 rounded border border-purple-200">
              {wardrobeCount}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-3">
        {/* Domain Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-slate-100">
          <button
            onClick={() => handleDomainChange('ALL')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider border transition-colors flex items-center gap-1.5 ${
              selectedDomain === 'ALL' 
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs' 
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Tous les Pôles ({equipmentList.length})
          </button>
          <button
            onClick={() => handleDomainChange('DECORATION')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider border transition-colors flex items-center gap-1.5 ${
              selectedDomain === 'DECORATION' 
                ? 'bg-amber-500 text-white border-amber-600 shadow-xs' 
                : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <Armchair className="w-3.5 h-3.5" /> Pôle Décoration ({decoCount})
          </button>
          <button
            onClick={() => handleDomainChange('CATERING')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider border transition-colors flex items-center gap-1.5 ${
              selectedDomain === 'CATERING' 
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs' 
                : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" /> Pôle Traiteur & Buffet ({cateringCount})
          </button>
          <button
            onClick={() => handleDomainChange('WARDROBE')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider border transition-colors flex items-center gap-1.5 ${
              selectedDomain === 'WARDROBE' 
                ? 'bg-purple-600 text-white border-purple-700 shadow-xs' 
                : 'bg-purple-50 text-purple-900 border-purple-200 hover:bg-purple-100'
            }`}
          >
            <Shirt className="w-3.5 h-3.5" /> Pôle Vestiaire ({wardrobeCount})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher table, chaise, housse, chafing dish, code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-900"
            />
          </div>

          {/* Sub-Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-700"
            >
              <option value="ALL">Toutes les sous-catégories</option>
              {selectedDomain !== 'CATERING' && selectedDomain !== 'WARDROBE' && (
                <>
                  <option value="FURNITURE">Mobilier (Tables & Chaises banquet, Mange-debout)</option>
                  <option value="COVERS_ACCESSORIES">Housses de chaise & Habillage / Nœuds satin</option>
                  <option value="DECORATION">Scénographie, Chandeliers & Potelets</option>
                </>
              )}
              {selectedDomain !== 'DECORATION' && selectedDomain !== 'WARDROBE' && (
                <>
                  <option value="CATERING_EQUIPMENT">Matériel Traiteur (Chafing dishes, Plateaux, Bacs)</option>
                  <option value="TABLEWARE">Art de la Table & Verrerie (Assiettes or, Flûtes)</option>
                  <option value="LINEN">Linge de Table & Nappage (Nappes damassées, Serviettes)</option>
                </>
              )}
              {selectedDomain !== 'DECORATION' && selectedDomain !== 'CATERING' && (
                <option value="UNIFORM">Tenues Professionnelles & Uniformes</option>
              )}
            </select>
          </div>

          {/* Condition */}
          <div>
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-700"
            >
              <option value="ALL">Tous les états de maintenance</option>
              <option value="EXCELLENT">État Excellent (Prêt Réception VIP)</option>
              <option value="BON">Bon État</option>
              <option value="PRESSING">En Pressing / Nettoyage</option>
              <option value="EN_REVISION">En Révision / Contrôle</option>
            </select>
          </div>
        </div>

        {/* Quick Category Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider border transition-colors ${
                selectedCategory === 'ALL' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Tous
            </button>
            {(selectedDomain === 'ALL' || selectedDomain === 'DECORATION') && (
              <>
                <button
                  onClick={() => setSelectedCategory('FURNITURE')}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider border transition-colors ${
                    selectedCategory === 'FURNITURE' ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Tables & Chaises
                </button>
                <button
                  onClick={() => setSelectedCategory('COVERS_ACCESSORIES')}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider border transition-colors ${
                    selectedCategory === 'COVERS_ACCESSORIES' ? 'bg-orange-100 text-orange-900 border-orange-300' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Housses & Nœuds
                </button>
                <button
                  onClick={() => setSelectedCategory('DECORATION')}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider border transition-colors ${
                    selectedCategory === 'DECORATION' ? 'bg-rose-100 text-rose-900 border-rose-300' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Scénographie & Chandeliers
                </button>
              </>
            )}
            {(selectedDomain === 'ALL' || selectedDomain === 'CATERING') && (
              <>
                <button
                  onClick={() => setSelectedCategory('CATERING_EQUIPMENT')}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider border transition-colors ${
                    selectedCategory === 'CATERING_EQUIPMENT' ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Matériel Traiteur / Chafing
                </button>
                <button
                  onClick={() => setSelectedCategory('TABLEWARE')}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider border transition-colors ${
                    selectedCategory === 'TABLEWARE' ? 'bg-cyan-100 text-cyan-900 border-cyan-300' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Vaisselle & Verrerie
                </button>
                <button
                  onClick={() => setSelectedCategory('LINEN')}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider border transition-colors ${
                    selectedCategory === 'LINEN' ? 'bg-sky-100 text-sky-900 border-sky-300' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Nappage & Linge
                </button>
              </>
            )}
            {(selectedDomain === 'ALL' || selectedDomain === 'WARDROBE') && (
              <button
                onClick={() => setSelectedCategory('UNIFORM')}
                className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider border transition-colors ${
                  selectedCategory === 'UNIFORM' ? 'bg-purple-100 text-purple-900 border-purple-300' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Tailleurs & Costumes
              </button>
            )}
          </div>

          <span className="text-slate-500 text-xs">
            <strong>{filteredList.length}</strong> équipement(s) répertorié(s)
          </span>
        </div>
      </div>

      {/* Equipment Table / Grid */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Équipement & Référence</th>
                <th className="py-3 px-4">Pôle & Catégorie</th>
                <th className="py-3 px-4 text-center">Stock Total</th>
                <th className="py-3 px-4 text-center">Engagé / Événement</th>
                <th className="py-3 px-4 text-center">Stock Disponible</th>
                <th className="py-3 px-4">État & Emplacement</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredList.map((item) => {
                const engaged = item.totalQty - item.availableQty;
                const availabilityRate = Math.round((item.availableQty / item.totalQty) * 100);
                const isLowStock = item.availableQty <= item.totalQty * 0.2;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Name & Reference */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="w-11 h-11 rounded-md object-cover border border-slate-200 shrink-0" />
                        ) : (
                          <div className="w-11 h-11 rounded-md bg-slate-100 flex items-center justify-center text-slate-500 shrink-0 border border-slate-200">
                            {item.domain === 'DECORATION' ? (
                              <Armchair className="w-5 h-5 text-amber-600" />
                            ) : item.domain === 'CATERING' ? (
                              <ChefHat className="w-5 h-5 text-emerald-600" />
                            ) : (
                              <Shirt className="w-5 h-5 text-purple-600" />
                            )}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-slate-900 font-serif text-sm">
                            {item.name}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                            <Tag className="w-3 h-3 text-slate-400" /> {item.referenceCode}
                            {item.sizeOrDimensions && <span>• {item.sizeOrDimensions}</span>}
                          </div>
                          {item.colorOrFinish && (
                            <div className="text-[11px] text-slate-600 mt-0.5 font-sans">
                              {item.colorOrFinish}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Domain & Category */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getDomainBadgeClass(item.domain)}`}>
                          {getDomainLabel(item.domain)}
                        </span>
                        <div>
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium border ${getCategoryBadgeClass(item.category)}`}>
                            {getCategoryLabel(item.category)}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Total Stock */}
                    <td className="py-3.5 px-4 text-center font-bold text-slate-800 font-mono">
                      {item.totalQty} <span className="text-slate-400 font-normal text-[11px] font-sans">{item.unit}</span>
                    </td>

                    {/* Engaged */}
                    <td className="py-3.5 px-4 text-center">
                      <span className={`font-semibold font-mono ${engaged > 0 ? 'text-amber-800' : 'text-slate-400'}`}>
                        {engaged} <span className="font-sans text-[11px]">{item.unit}</span>
                      </span>
                    </td>

                    {/* Available */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className={`font-bold px-2 py-0.5 rounded text-xs font-mono ${
                          isLowStock 
                            ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}>
                          {item.availableQty} <span className="font-sans text-[11px]">{item.unit}</span>
                        </span>
                        <div className="w-16 bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
                          <div 
                            className={`h-full ${isLowStock ? 'bg-rose-500' : 'bg-emerald-600'}`} 
                            style={{ width: `${availabilityRate}%` }} 
                          />
                        </div>
                      </div>
                    </td>

                    {/* Condition & Warehouse */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {item.condition}
                        </span>
                        <div className="text-slate-400 text-[10px] flex items-center gap-1">
                          <Warehouse className="w-3 h-3 text-slate-400" /> {item.locationWarehouse}
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            const newTotal = item.totalQty + 5;
                            const newAvail = item.availableQty + 5;
                            updateEquipment(item.id, { totalQty: newTotal, availableQty: newAvail });
                          }}
                          className="px-1.5 py-0.5 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-200"
                          title="Ajouter +5 unités au stock"
                        >
                          +5
                        </button>
                        <button
                          onClick={() => {
                            setSelectedEquip(item);
                            setIsEditModalOpen(true);
                          }}
                          className="px-2.5 py-1 text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 rounded border border-slate-200 transition-colors flex items-center gap-1"
                          title="Modifier les caractéristiques"
                        >
                          <Edit className="w-3 h-3 text-amber-600" />
                          <span>Modifier</span>
                        </button>
                        {currentRole !== 'STAFF' && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Supprimer définitivement ${item.name} (${item.referenceCode}) de l'inventaire ?`)) {
                                deleteEquipment(item.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded border border-slate-200 hover:border-rose-300 transition-colors"
                            title="Supprimer ce matériel"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Equipment Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-serif font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-600" /> Référencer un Matériel / Équipement
            </h3>

            <form onSubmit={handleCreateEquipment} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Désignation de l'équipement *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Table Ronde 180cm, Chaise Napoléon, Chafing Dish Inox..."
                  value={newEquip.name}
                  onChange={(e) => setNewEquip({ ...newEquip, name: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Domain & Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pôle Logistique *</label>
                  <select
                    value={newEquip.domain}
                    onChange={(e) => {
                      const dom = e.target.value as LogisticsDomain;
                      const defaultCat: EquipmentCategory = 
                        dom === 'DECORATION' ? 'FURNITURE' : dom === 'CATERING' ? 'CATERING_EQUIPMENT' : 'UNIFORM';
                      setNewEquip({ ...newEquip, domain: dom, category: defaultCat });
                    }}
                    className="w-full p-2 border border-slate-300 rounded bg-amber-50/40 font-semibold"
                  >
                    <option value="DECORATION">🏛️ Pôle Décoration & Mobilier</option>
                    <option value="CATERING">🍽️ Pôle Service Traiteur & Buffet</option>
                    <option value="WARDROBE">👔 Pôle Vestiaire & Uniformes</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Catégorie Spécifique *</label>
                  <select
                    value={newEquip.category}
                    onChange={(e) => setNewEquip({ ...newEquip, category: e.target.value as EquipmentCategory })}
                    className="w-full p-2 border border-slate-300 rounded"
                  >
                    {newEquip.domain === 'DECORATION' && (
                      <>
                        <option value="FURNITURE">Mobilier (Tables & Chaises)</option>
                        <option value="COVERS_ACCESSORIES">Housses de chaises & Nœuds</option>
                        <option value="DECORATION">Scénographie, Chandeliers & Décor</option>
                      </>
                    )}
                    {newEquip.domain === 'CATERING' && (
                      <>
                        <option value="CATERING_EQUIPMENT">Matériel Traiteur (Chafing dishes, Plateaux, Bacs)</option>
                        <option value="TABLEWARE">Art de la Table & Verrerie</option>
                        <option value="LINEN">Linge de Table & Nappage</option>
                      </>
                    )}
                    {newEquip.domain === 'WARDROBE' && (
                      <option value="UNIFORM">Tenues Professionnelles & Uniformes</option>
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Code Référence</label>
                  <input
                    type="text"
                    placeholder="Ex: DEC-TAB-R180"
                    value={newEquip.referenceCode}
                    onChange={(e) => setNewEquip({ ...newEquip, referenceCode: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">État physique</label>
                  <select
                    value={newEquip.condition}
                    onChange={(e) => setNewEquip({ ...newEquip, condition: e.target.value as Condition })}
                    className="w-full p-2 border border-slate-300 rounded"
                  >
                    <option value="EXCELLENT">Excellent (Prêt réception VIP)</option>
                    <option value="BON">Bon</option>
                    <option value="PRESSING">En Pressing</option>
                    <option value="EN_REVISION">En Révision</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Quantité Totale en Stock *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newEquip.totalQty}
                    onChange={(e) => setNewEquip({ ...newEquip, totalQty: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unité de mesure</label>
                  <input
                    type="text"
                    placeholder="pièces, housses, lots..."
                    value={newEquip.unit}
                    onChange={(e) => setNewEquip({ ...newEquip, unit: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Finition / Matière</label>
                  <input
                    type="text"
                    placeholder="Lycra blanc, Dorure feuille d'or, Inox 18/10..."
                    value={newEquip.colorOrFinish || ''}
                    onChange={(e) => setNewEquip({ ...newEquip, colorOrFinish: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dimensions / Format</label>
                  <input
                    type="text"
                    placeholder="Ø 180cm, H: 92cm, Bac GN 1/1..."
                    value={newEquip.sizeOrDimensions || ''}
                    onChange={(e) => setNewEquip({ ...newEquip, sizeOrDimensions: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Emplacement Entrepôt</label>
                <input
                  type="text"
                  placeholder="Hangar A - Allée Déco 1 / Zone Traiteur T2"
                  value={newEquip.locationWarehouse}
                  onChange={(e) => setNewEquip({ ...newEquip, locationWarehouse: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Instructions de maintenance & conditionnement</label>
                <textarea
                  rows={2}
                  placeholder="Consignes de lavage, housses de transport nécessaires, contrôle température..."
                  value={newEquip.notes || ''}
                  onChange={(e) => setNewEquip({ ...newEquip, notes: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded hover:bg-slate-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold uppercase tracking-wider rounded transition-colors"
                >
                  Ajouter à l'inventaire
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Equipment Modal */}
      {isEditModalOpen && selectedEquip && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-serif font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
              Modifier : {selectedEquip.name}
            </h3>

            <form onSubmit={handleUpdateSelected} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Désignation</label>
                <input
                  type="text"
                  required
                  value={selectedEquip.name}
                  onChange={(e) => setSelectedEquip({ ...selectedEquip, name: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pôle Logistique</label>
                  <select
                    value={selectedEquip.domain}
                    onChange={(e) => setSelectedEquip({ ...selectedEquip, domain: e.target.value as LogisticsDomain })}
                    className="w-full p-2 border border-slate-300 rounded font-semibold"
                  >
                    <option value="DECORATION">🏛️ Pôle Décoration & Mobilier</option>
                    <option value="CATERING">🍽️ Pôle Service Traiteur & Buffet</option>
                    <option value="WARDROBE">👔 Pôle Vestiaire & Uniformes</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Catégorie</label>
                  <select
                    value={selectedEquip.category}
                    onChange={(e) => setSelectedEquip({ ...selectedEquip, category: e.target.value as EquipmentCategory })}
                    className="w-full p-2 border border-slate-300 rounded"
                  >
                    <option value="FURNITURE">Mobilier (Tables & Chaises)</option>
                    <option value="COVERS_ACCESSORIES">Housses de chaises & Nœuds</option>
                    <option value="DECORATION">Scénographie & Décoration</option>
                    <option value="CATERING_EQUIPMENT">Matériel Traiteur & Buffet</option>
                    <option value="TABLEWARE">Art de la Table & Verrerie</option>
                    <option value="LINEN">Linge de Table & Nappage</option>
                    <option value="UNIFORM">Tenues & Uniformes</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Stock Total</label>
                  <input
                    type="number"
                    min="1"
                    value={selectedEquip.totalQty}
                    onChange={(e) => setSelectedEquip({ ...selectedEquip, totalQty: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">État physique</label>
                  <select
                    value={selectedEquip.condition}
                    onChange={(e) => setSelectedEquip({ ...selectedEquip, condition: e.target.value as Condition })}
                    className="w-full p-2 border border-slate-300 rounded"
                  >
                    <option value="EXCELLENT">Excellent</option>
                    <option value="BON">Bon</option>
                    <option value="PRESSING">En Pressing</option>
                    <option value="EN_REVISION">En Révision</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Emplacement Entrepôt</label>
                  <input
                    type="text"
                    value={selectedEquip.locationWarehouse}
                    onChange={(e) => setSelectedEquip({ ...selectedEquip, locationWarehouse: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Finition</label>
                  <input
                    type="text"
                    value={selectedEquip.colorOrFinish || ''}
                    onChange={(e) => setSelectedEquip({ ...selectedEquip, colorOrFinish: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded hover:bg-slate-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold uppercase tracking-wider rounded transition-colors"
                >
                  Mettre à jour
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

