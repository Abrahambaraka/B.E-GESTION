import React, { useState, useMemo } from 'react';
import { useEvent } from '../../context/EventContext';
import { Condition } from '../../types/event';
import { 
  Shirt, 
  Sparkles, 
  Check, 
  Layers, 
  Plus, 
  Minus, 
  Tag, 
  CheckCircle2, 
  Users,
  RotateCcw,
  SlidersHorizontal
} from 'lucide-react';

export type SizingGridPreset = 'WOMEN_FR' | 'MEN_SUIT' | 'STANDARD_INT' | 'SHOES' | 'ONE_SIZE' | 'CUSTOM';

export const PRESET_MODELS = [
  {
    name: 'Tailleur Hôtesse Signature Blessing Bleu Nuit',
    category: 'UNIFORM',
    grid: 'WOMEN_FR' as SizingGridPreset,
    refRoot: 'UNI-TLR-NVY',
    colorOrFinish: 'Laine froide bleu nuit impérial & doublure soie, boutons dorés armoriés',
    locationWarehouse: 'Vestiaire Dressing - Penderie H1',
    unitValueEuro: 240,
    unit: 'ensembles',
    notes: 'Comprend veste cintrée et jupe crayon. Fourni avec foulard en soie Blessing.',
  },
  {
    name: 'Costume 3 Pièces Serveur & Chef de Rang Noir',
    category: 'UNIFORM',
    grid: 'MEN_SUIT' as SizingGridPreset,
    refRoot: 'UNI-CST-BLK',
    colorOrFinish: 'Noir satiné infroissable, gilet col châle, pantalon sans pli',
    locationWarehouse: 'Vestiaire Dressing - Penderie M1',
    unitValueEuro: 290,
    unit: 'ensembles',
    notes: 'Comprend veste droite, gilet de service coordonné et cravate noire mate.',
  },
  {
    name: 'Smoking Gala & Frac Maître d’Hôtel Prestige',
    category: 'UNIFORM',
    grid: 'MEN_SUIT' as SizingGridPreset,
    refRoot: 'UNI-SMK-GLA',
    colorOrFinish: 'Laine sergée noire, col châle satin soie & galons latéraux',
    locationWarehouse: 'Vestiaire Dressing - Penderie M2 (Housse Prestige)',
    unitValueEuro: 350,
    unit: 'ensembles',
    notes: 'Usage exclusif dîners officiels et sommets diplomatiques. Nettoyage pressing obligatoire.',
  },
  {
    name: 'Robe Cocktail Hôtesse Accueil Prestige Velours Émeraude',
    category: 'UNIFORM',
    grid: 'WOMEN_FR' as SizingGridPreset,
    refRoot: 'UNI-ROB-EMR',
    colorOrFinish: 'Velours émeraude profond & ceinture dorée satinée',
    locationWarehouse: 'Vestiaire Dressing - Penderie H3',
    unitValueEuro: 210,
    unit: 'ensembles',
    notes: 'Tenue cocktail pour galas d’art et réceptions de haute joaillerie.',
  },
  {
    name: 'Chemise Homme Col Cassé Blanc Cérémonie',
    category: 'UNIFORM',
    grid: 'STANDARD_INT' as SizingGridPreset,
    refRoot: 'UNI-CHM-WHT',
    colorOrFinish: 'Popeline 100% coton égyptien blanc optique double retors',
    locationWarehouse: 'Espace Lingerie - Étagère Chemises C1',
    unitValueEuro: 65,
    unit: 'pièces',
    notes: 'Poignets mousquetaires, livrée sous film protecteur avec boutons de manchette dorés.',
  },
  {
    name: 'Chemisier Femme Soie Lavée Ivoire Accueil',
    category: 'UNIFORM',
    grid: 'WOMEN_FR' as SizingGridPreset,
    refRoot: 'UNI-CHM-IVR',
    colorOrFinish: 'Crêpe de soie ivoire lavée fluide & boutons nacre',
    locationWarehouse: 'Espace Lingerie - Étagère Chemisiers C2',
    unitValueEuro: 75,
    unit: 'pièces',
    notes: 'Col lavallière délicat, lavage à la main ou pressing doux.',
  },
  {
    name: 'Escarpins Cuir Noir Hôtesse Confort Protocole (Talon 5cm)',
    category: 'UNIFORM',
    grid: 'SHOES' as SizingGridPreset,
    refRoot: 'UNI-ESC-BLK',
    colorOrFinish: 'Cuir d’agneau noir souple & semelle amortissante gel mémoire',
    locationWarehouse: 'Vestiaire Dressing - Meuble Chaussures S1',
    unitValueEuro: 95,
    unit: 'paires',
    notes: 'Conforme charte posture 8h debout. Cirage après chaque prestation.',
  },
  {
    name: 'Foulard Soie Sauvage & Nœud Papillon Cérémonie (Pack Accessoires)',
    category: 'UNIFORM',
    grid: 'ONE_SIZE' as SizingGridPreset,
    refRoot: 'UNI-ACC-SILK',
    colorOrFinish: 'Soie sergé 14mm bleu impérial & or royal',
    locationWarehouse: 'Coffret Accessoires Vestiaire - Casier A1',
    unitValueEuro: 35,
    unit: 'pièces',
    notes: 'Accessoire d’apparat aux armoiries Blessing Event.',
  },
];

export const GRID_SIZES: Record<SizingGridPreset, string[]> = {
  WOMEN_FR: ['34', '36', '38', '40', '42', '44', '46', '48'],
  MEN_SUIT: ['46', '48', '50', '52', '54', '56', '58'],
  STANDARD_INT: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
  SHOES: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'],
  ONE_SIZE: ['TU'],
  CUSTOM: ['36', '38', '40', '42', '48', '50'],
};

interface UniformBatchFormProps {
  onSuccess?: (totalPieces: number) => void;
  onCancel?: () => void;
  defaultModelName?: string;
  isInline?: boolean;
}

export const UniformBatchForm: React.FC<UniformBatchFormProps> = ({
  onSuccess,
  onCancel,
  defaultModelName,
  isInline = false,
}) => {
  const { batchAddOrUpdateUniforms, equipmentList, staffList } = useEvent();

  // Model & Attributes State
  const [modelName, setModelName] = useState(defaultModelName || 'Tailleur Hôtesse Signature Blessing Bleu Nuit');
  const [refRoot, setRefRoot] = useState('UNI-TLR-NVY');
  const [colorOrFinish, setColorOrFinish] = useState('Laine froide bleu nuit impérial & doublure soie, boutons dorés armoriés');
  const [locationWarehouse, setLocationWarehouse] = useState('Vestiaire Dressing - Penderie H1');
  const [condition, setCondition] = useState<Condition>('EXCELLENT');
  const [unit, setUnit] = useState('ensembles');
  const [unitValueEuro, setUnitValueEuro] = useState<number>(240);
  const [notes, setNotes] = useState('Comprend veste cintrée et jupe crayon. Fourni avec foulard en soie Blessing.');

  // Sizing Grid State
  const [activeGrid, setActiveGrid] = useState<SizingGridPreset>('WOMEN_FR');
  const [customSizeInput, setCustomSizeInput] = useState('');
  
  // Quantities per size
  const [sizeQuantities, setSizeQuantities] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    GRID_SIZES.WOMEN_FR.forEach(s => {
      init[s] = s === '36' || s === '38' || s === '40' ? 10 : s === '42' ? 5 : 0;
    });
    return init;
  });

  const [notification, setNotification] = useState<string | null>(null);

  // Switch preset model
  const handleSelectPresetModel = (preset: typeof PRESET_MODELS[0]) => {
    setModelName(preset.name);
    setRefRoot(preset.refRoot);
    setColorOrFinish(preset.colorOrFinish);
    setLocationWarehouse(preset.locationWarehouse);
    setUnitValueEuro(preset.unitValueEuro);
    setUnit(preset.unit);
    setNotes(preset.notes);
    setActiveGrid(preset.grid);

    const newQty: Record<string, number> = {};
    GRID_SIZES[preset.grid].forEach((s) => {
      newQty[s] = preset.grid === 'ONE_SIZE' ? 30 : 10;
    });
    setSizeQuantities(newQty);
  };

  // Switch sizing system
  const handleGridChange = (grid: SizingGridPreset) => {
    setActiveGrid(grid);
    setSizeQuantities((prev) => {
      const next: Record<string, number> = {};
      GRID_SIZES[grid].forEach((s) => {
        next[s] = prev[s] ?? 0;
      });
      return next;
    });
  };

  // Add custom size
  const handleAddCustomSize = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customSizeInput.trim().toUpperCase();
    if (!clean) return;
    if (!GRID_SIZES[activeGrid].includes(clean)) {
      GRID_SIZES[activeGrid].push(clean);
    }
    setSizeQuantities(prev => ({ ...prev, [clean]: 5 }));
    setCustomSizeInput('');
  };

  // Steppers & Bulk tools
  const handleQtyChange = (size: string, qty: number) => {
    setSizeQuantities(prev => ({
      ...prev,
      [size]: Math.max(0, qty),
    }));
  };

  const handleAdjustQty = (size: string, delta: number) => {
    setSizeQuantities(prev => ({
      ...prev,
      [size]: Math.max(0, (prev[size] || 0) + delta),
    }));
  };

  const handleApplyAll = (qty: number) => {
    setSizeQuantities(prev => {
      const updated: Record<string, number> = {};
      Object.keys(prev).forEach(size => {
        updated[size] = qty;
      });
      return updated;
    });
  };

  // Compute stats
  const activeSizesList = useMemo(() => {
    return (Object.entries(sizeQuantities) as [string, number][]).filter(([_, qty]) => Number(qty) > 0);
  }, [sizeQuantities]);

  const totalPieces = useMemo(() => {
    return (Object.values(sizeQuantities) as number[]).reduce((acc: number, q: number) => acc + (Number(q) || 0), 0);
  }, [sizeQuantities]);

  const totalBatchValue = useMemo(() => {
    return totalPieces * (unitValueEuro || 0);
  }, [totalPieces, unitValueEuro]);

  // Existing stock in inventory for this model name or reference
  const existingStockBySize = useMemo(() => {
    const map: Record<string, number> = {};
    equipmentList
      .filter(eq => eq.category === 'UNIFORM')
      .forEach(eq => {
        const size = eq.sizeOrDimensions?.replace('Taille ', '').trim() || eq.sizeOrDimensions || '';
        if (eq.name.toLowerCase().includes(modelName.toLowerCase()) || 
           (refRoot && eq.referenceCode.startsWith(refRoot))) {
          map[size] = (map[size] || 0) + eq.totalQty;
        }
      });
    return map;
  }, [equipmentList, modelName, refRoot]);

  // Collaborators with matching uniform sizes
  const staffBySize = useMemo(() => {
    const map: Record<string, number> = {};
    staffList.forEach(s => {
      if (s.uniformSize) {
        map[s.uniformSize] = (map[s.uniformSize] || 0) + 1;
      }
    });
    return map;
  }, [staffList]);

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modelName.trim()) return;

    if (totalPieces <= 0) {
      alert('Veuillez renseigner au moins une quantité supérieure à 0 pour une taille.');
      return;
    }

    const itemsToCreate = activeSizesList.map(([size, qty]) => {
      const cleanRoot = refRoot.trim() || 'UNI';
      const referenceCode = `${cleanRoot}-${size}`;
      const fullName = `${modelName.trim()} (T.${size})`;

      return {
        name: fullName,
        category: 'UNIFORM' as const,
        domain: 'WARDROBE' as const,
        totalQty: qty,
        availableQty: qty,
        condition,
        referenceCode,
        unit,
        locationWarehouse,
        colorOrFinish,
        sizeOrDimensions: `Taille ${size}`,
        unitValueEuro: Number(unitValueEuro) || 0,
        notes,
      };
    });

    const result = batchAddOrUpdateUniforms(itemsToCreate);

    setNotification(
      `Succès : ${result.totalPieces} tenues réparties sur ${activeSizesList.length} tailles enregistrées au vestiaire !`
    );

    if (onSuccess) {
      setTimeout(() => {
        onSuccess(result.totalPieces);
      }, 1200);
    }
  };

  return (
    <div className={`space-y-6 ${isInline ? 'bg-white p-6 rounded-lg border border-slate-200 shadow-xs' : ''}`}>
      {/* Success Notification */}
      {notification && (
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center gap-3 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold text-sm">{notification}</p>
            <p className="text-xs text-emerald-700">Mise à jour en direct de la penderie et de la concordance RH effectuée.</p>
          </div>
        </div>
      )}

      {/* Quick Presets / Modèles Fréquents */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Modèles de Tenues Fréquents (Standard Blessing)
          </span>
          <span className="text-[11px] text-slate-400">Pré-remplissage en un clic</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_MODELS.map((preset) => (
            <button
              key={preset.refRoot}
              type="button"
              onClick={() => handleSelectPresetModel(preset)}
              className={`text-xs px-2.5 py-1.5 rounded-md border font-medium transition-all ${
                refRoot === preset.refRoot
                  ? 'bg-purple-600 text-white border-purple-700 shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {preset.name.split('(')[0].replace('Blessing', '').trim()}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1 : Caractéristiques du Modèle */}
        <div className="bg-slate-50/80 border border-slate-200 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-purple-600" /> 1. Modèle & Caractéristiques Vestiaire
            </h4>
            <span className="text-[11px] text-slate-500">Champs requis marqués d'un *</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 text-xs">
            {/* Modèle */}
            <div className="md:col-span-8">
              <label className="block font-semibold text-slate-700 mb-1">
                Désignation du modèle de tenue *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Tailleur Hôtesse Signature Bleu Nuit"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-purple-500 text-slate-900 font-semibold"
              />
            </div>

            {/* Racine Référence */}
            <div className="md:col-span-4">
              <label className="block font-semibold text-slate-700 mb-1">
                Code Racine Référence *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: UNI-TLR-NVY"
                value={refRoot}
                onChange={(e) => setRefRoot(e.target.value.toUpperCase())}
                className="w-full p-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-purple-500 text-slate-900 font-mono font-bold"
              />
            </div>

            {/* Couleur & Matière */}
            <div className="md:col-span-6">
              <label className="block font-semibold text-slate-700 mb-1">
                Finition, Matière & Détails Stylistiques
              </label>
              <input
                type="text"
                placeholder="Ex: Laine froide, boutons dorés armoriés, doublure soie"
                value={colorOrFinish}
                onChange={(e) => setColorOrFinish(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-purple-500 text-slate-900"
              />
            </div>

            {/* Emplacement Vestiaire */}
            <div className="md:col-span-6">
              <label className="block font-semibold text-slate-700 mb-1">
                Emplacement en Penderie / Rayon *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Vestiaire Dressing - Penderie H1"
                value={locationWarehouse}
                onChange={(e) => setLocationWarehouse(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-purple-500 text-slate-900"
              />
            </div>

            {/* État initial & Unité & Valeur */}
            <div className="md:col-span-4">
              <label className="block font-semibold text-slate-700 mb-1">État initial</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as Condition)}
                className="w-full p-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-purple-500 text-slate-900 font-medium"
              >
                <option value="EXCELLENT">Prêt en Penderie (Excellent)</option>
                <option value="BON">Bon état</option>
                <option value="PRESSING">En Pressing / Entretien</option>
              </select>
            </div>

            <div className="md:col-span-4">
              <label className="block font-semibold text-slate-700 mb-1">Unité de mesure</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-purple-500 text-slate-900 font-medium"
              >
                <option value="ensembles">Ensembles complets</option>
                <option value="pièces">Pièces individuelles</option>
                <option value="paires">Paires (Souliers/Escarpins)</option>
              </select>
            </div>

            <div className="md:col-span-4">
              <label className="block font-semibold text-slate-700 mb-1">Valeur unitaire estimée (€)</label>
              <input
                type="number"
                min="0"
                value={unitValueEuro}
                onChange={(e) => setUnitValueEuro(Number(e.target.value))}
                className="w-full p-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-purple-500 text-slate-900 font-mono font-bold"
              />
            </div>

            {/* Consignes d'entretien */}
            <div className="md:col-span-12">
              <label className="block font-semibold text-slate-700 mb-1">
                Consignes d'entretien protocolaire & Remarques
              </label>
              <input
                type="text"
                placeholder="Nettoyage à sec uniquement, suspendre sur cintres bois..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-purple-500 text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Section 2 : Système de Tailles & Répartition des Quantités */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-purple-600" /> 2. Grille de Tailles & Saisie des Pièces
              </h4>
              <p className="text-[11px] text-slate-500">
                Définissez les quantités reçues ou confectionnées pour chaque mensuration.
              </p>
            </div>

            {/* Sizing Grid Switcher */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => handleGridChange('WOMEN_FR')}
                className={`px-2.5 py-1 text-xs font-bold rounded-md border transition-colors ${
                  activeGrid === 'WOMEN_FR' ? 'bg-purple-600 text-white border-purple-600 shadow-xs' : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                }`}
              >
                Femme (34-48)
              </button>
              <button
                type="button"
                onClick={() => handleGridChange('MEN_SUIT')}
                className={`px-2.5 py-1 text-xs font-bold rounded-md border transition-colors ${
                  activeGrid === 'MEN_SUIT' ? 'bg-purple-600 text-white border-purple-600 shadow-xs' : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                }`}
              >
                Homme (46-58)
              </button>
              <button
                type="button"
                onClick={() => handleGridChange('STANDARD_INT')}
                className={`px-2.5 py-1 text-xs font-bold rounded-md border transition-colors ${
                  activeGrid === 'STANDARD_INT' ? 'bg-purple-600 text-white border-purple-600 shadow-xs' : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                }`}
              >
                Standard (XS-3XL)
              </button>
              <button
                type="button"
                onClick={() => handleGridChange('SHOES')}
                className={`px-2.5 py-1 text-xs font-bold rounded-md border transition-colors ${
                  activeGrid === 'SHOES' ? 'bg-purple-600 text-white border-purple-600 shadow-xs' : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                }`}
              >
                Pointures (36-46)
              </button>
              <button
                type="button"
                onClick={() => handleGridChange('ONE_SIZE')}
                className={`px-2.5 py-1 text-xs font-bold rounded-md border transition-colors ${
                  activeGrid === 'ONE_SIZE' ? 'bg-purple-600 text-white border-purple-600 shadow-xs' : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                }`}
              >
                Taille Unique (TU)
              </button>
            </div>
          </div>

          {/* Bulk Fill Tools */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-50 rounded-md border border-slate-200 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-600">Remplissage rapide :</span>
              <button
                type="button"
                onClick={() => handleApplyAll(5)}
                className="px-2 py-0.5 bg-white hover:bg-slate-100 border border-slate-300 rounded font-medium text-slate-700"
              >
                +5 partout
              </button>
              <button
                type="button"
                onClick={() => handleApplyAll(10)}
                className="px-2 py-0.5 bg-white hover:bg-slate-100 border border-slate-300 rounded font-medium text-slate-700"
              >
                +10 partout
              </button>
              <button
                type="button"
                onClick={() => handleApplyAll(15)}
                className="px-2 py-0.5 bg-white hover:bg-slate-100 border border-slate-300 rounded font-medium text-slate-700"
              >
                +15 partout
              </button>
              <button
                type="button"
                onClick={() => handleApplyAll(0)}
                className="px-2 py-0.5 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded font-medium"
              >
                Réinitialiser
              </button>
            </div>

            {/* Add Custom Size Form */}
            <div className="flex items-center gap-1">
              <input
                type="text"
                placeholder="Autre taille..."
                value={customSizeInput}
                onChange={(e) => setCustomSizeInput(e.target.value)}
                className="p-1 px-2 text-xs bg-white border border-slate-300 rounded w-24 text-slate-900 uppercase"
              />
              <button
                type="button"
                onClick={handleAddCustomSize}
                className="px-2 py-1 bg-slate-800 text-white rounded text-xs font-semibold hover:bg-slate-700"
              >
                + Ajouter
              </button>
            </div>
          </div>

          {/* Grid of Sizes and Quantities */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {(Object.entries(sizeQuantities) as [string, number][]).map(([size, qty]) => {
              const existingQty = existingStockBySize[size] || 0;
              const staffCountForSize = staffBySize[size] || 0;
              const hasQty = Number(qty) > 0;

              return (
                <div
                  key={size}
                  className={`p-3 rounded-lg border transition-all ${
                    hasQty 
                      ? 'bg-purple-50/50 border-purple-300 ring-1 ring-purple-300/40' 
                      : 'bg-slate-50 border-slate-200 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-serif font-bold text-sm text-slate-900">
                        Taille {size}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                      {refRoot ? `${refRoot}-${size}` : `T.${size}`}
                    </span>
                  </div>

                  {/* Stepper Input */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleAdjustQty(size, -1)}
                      className="w-7 h-7 flex items-center justify-center rounded bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 font-bold text-sm"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={qty}
                      onChange={(e) => handleQtyChange(size, Number(e.target.value))}
                      className="flex-1 w-full text-center py-1 bg-white border border-slate-300 rounded font-mono font-bold text-sm text-slate-900 focus:ring-1 focus:ring-purple-500 focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => handleAdjustQty(size, 1)}
                      className="w-7 h-7 flex items-center justify-center rounded bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 font-bold text-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Live Context Info */}
                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                    <span className="text-slate-500">
                      En stock : <strong className="text-slate-800">{existingQty}</strong>
                    </span>
                    {staffCountForSize > 0 && (
                      <span className="text-amber-700 bg-amber-50 px-1 py-0.2 rounded font-semibold" title="Collaborateurs ayant cette taille de vêtement">
                        {staffCountForSize} collab. RH
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3 : Récapitulatif du Lot & Boutons de Soumission */}
        <div className="bg-slate-900 text-white rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
              Récapitulatif de la commande / confection
            </span>
            <div className="flex flex-wrap items-baseline gap-4">
              <div className="text-xl sm:text-2xl font-serif font-bold text-white flex items-baseline gap-1.5">
                <span>{totalPieces}</span>
                <span className="text-xs font-sans text-slate-400 font-normal">
                  {unit} au total ({activeSizesList.length} tailles sélectionnées)
                </span>
              </div>
              <div className="text-sm font-mono text-emerald-400 font-bold">
                Valeur estimée : {totalBatchValue.toLocaleString('fr-FR')} €
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              Destination : <strong className="text-slate-200">{locationWarehouse}</strong> • Réf. : <span className="font-mono text-amber-300">{refRoot}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-md border border-slate-700 transition-colors"
              >
                Annuler
              </button>
            )}
            <button
              type="submit"
              disabled={totalPieces <= 0}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-md transition-all shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4" />
              <span>Enregistrer au Vestiaire ({totalPieces})</span>
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};
