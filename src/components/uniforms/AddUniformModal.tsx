import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { Condition } from '../../types/event';
import { X, Shirt, Sparkles } from 'lucide-react';

interface AddUniformModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddUniformModal: React.FC<AddUniformModalProps> = ({ isOpen, onClose }) => {
  const { addEquipment } = useEvent();

  const [name, setName] = useState('');
  const [sizeOrDimensions, setSizeOrDimensions] = useState('38');
  const [totalQty, setTotalQty] = useState<number>(20);
  const [colorOrFinish, setColorOrFinish] = useState('Bleu Marine & Boutons Dorés');
  const [locationWarehouse, setLocationWarehouse] = useState('Penderie A - Rayon Tailleur');
  const [condition, setCondition] = useState<Condition>('EXCELLENT');
  const [referenceCode, setReferenceCode] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const ref = referenceCode || `UNI-${Date.now().toString().slice(-4)}`;

    addEquipment({
      name,
      domain: 'WARDROBE',
      category: 'UNIFORM',
      totalQty: Number(totalQty) || 1,
      availableQty: Number(totalQty) || 1,
      condition,
      referenceCode: ref,
      unit: 'ensembles',
      locationWarehouse,
      colorOrFinish,
      sizeOrDimensions,
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
          <div className="p-2 rounded-md bg-purple-50 text-purple-900 border border-purple-200">
            <Shirt className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-slate-900">
              Nouvelle Tenue / Ensemble Vestiaire
            </h3>
            <p className="text-xs text-slate-500">
              Ajout d'un modèle de tailleur, smoking, costume ou accessoire protocole au vestiaire.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Désignation de la tenue *</label>
            <input
              type="text"
              required
              placeholder="Ex: Tailleur Hôtesse Signature Blessing"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-hidden text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Taille / Mensuration *</label>
              <select
                value={sizeOrDimensions}
                onChange={(e) => setSizeOrDimensions(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-hidden text-slate-900 font-semibold"
              >
                <option value="36">Taille 36 (Femme)</option>
                <option value="38">Taille 38 (Femme)</option>
                <option value="40">Taille 40 (Femme)</option>
                <option value="42">Taille 42 (Femme)</option>
                <option value="48">Taille 48 (Homme)</option>
                <option value="50">Taille 50 (Homme)</option>
                <option value="52">Taille 52 (Homme)</option>
                <option value="54">Taille 54 (Homme)</option>
                <option value="TU">Taille Unique / Accessoire</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Quantité confectionnée *</label>
              <input
                type="number"
                min="1"
                required
                value={totalQty}
                onChange={(e) => setTotalQty(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-hidden text-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Code Référence</label>
              <input
                type="text"
                placeholder="Ex: UNI-TL-38"
                value={referenceCode}
                onChange={(e) => setReferenceCode(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-hidden text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">État initial</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as Condition)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-hidden text-slate-900"
              >
                <option value="EXCELLENT">Prêt en Penderie (Excellent)</option>
                <option value="BON">Bon état</option>
                <option value="PRESSING">En Pressing / Nettoyage</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Couleur & Finition</label>
            <input
              type="text"
              placeholder="Ex: Laine froide marine, doublure soie, boutons nacre"
              value={colorOrFinish}
              onChange={(e) => setColorOrFinish(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-hidden text-slate-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Emplacement Vestiaire</label>
            <input
              type="text"
              placeholder="Ex: Penderie A - Rayon Tailleur 1"
              value={locationWarehouse}
              onChange={(e) => setLocationWarehouse(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-hidden text-slate-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Consignes d'entretien & Remarques</label>
            <textarea
              rows={2}
              placeholder="Nettoyage à sec uniquement, repassage à la vapeur douce..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-hidden text-slate-900"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-md hover:bg-slate-100 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider rounded-md transition-colors shadow-xs"
            >
              Ajouter au Vestiaire
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
