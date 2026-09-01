import { UserStaff, Equipment, EventItem, EventEquipment, Assignment } from '../types/event';

/**
 * Helper to escape CSV cell contents for Excel/CSV compatibility
 */
function escapeCSV(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return '""';
  const str = String(value);
  // If string contains semicolon, comma, quotes or newline, wrap in quotes and escape existing quotes
  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
}

/**
 * Universal CSV download trigger with UTF-8 BOM for flawless French accent display in Excel
 */
export function downloadCSV(filename: string, csvContent: string): void {
  const bom = '\uFEFF';
  const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 1. Export Staff / HR to CSV
 */
export function exportStaffToCSV(staffList: UserStaff[]): string {
  const headers = [
    'ID Profil',
    'Nom Complet',
    'Email',
    'Téléphone',
    'Rôle / Catégorie',
    'Statut Disponibilité',
    'Langues Parlées',
    'Taille Vêtement',
    'Stature (cm)',
    'Pointure',
    'Années Expérience',
    'Habilitation Protocole VIP',
    'Date Inscription',
    'Notes / Profil'
  ];

  const rows = staffList.map(staff => {
    const roleLabel = 
      staff.staffCategory === 'HOSTESS' ? 'Hôtesse d\'Accueil VIP' :
      staff.staffCategory === 'SERVER' ? 'Serveur / Chef de Rang' :
      staff.staffCategory === 'BUTLER' ? 'Maître d\'Hôtel & Butler' :
      staff.staffCategory === 'COORDINATOR' ? 'Coordinateur Protocole' :
      staff.role;

    const statusLabel = 
      staff.status === 'AVAILABLE' ? 'Disponible' :
      staff.status === 'ASSIGNED' ? 'En Mission' : 'Indisponible';

    return [
      escapeCSV(staff.id),
      escapeCSV(staff.fullName),
      escapeCSV(staff.email),
      escapeCSV(staff.phone),
      escapeCSV(roleLabel),
      escapeCSV(statusLabel),
      escapeCSV(staff.languages?.join(', ') || 'FR'),
      escapeCSV(staff.uniformSize || 'N/A'),
      escapeCSV(staff.heightCm || 'N/A'),
      escapeCSV(staff.shoeSize || 'N/A'),
      escapeCSV(staff.experienceYears !== undefined ? `${staff.experienceYears} ans` : 'N/A'),
      escapeCSV(staff.vipProtocolCertified ? 'OUI - Certifié Prestige' : 'NON'),
      escapeCSV(staff.createdAt ? new Date(staff.createdAt).toLocaleDateString('fr-FR') : 'N/A'),
      escapeCSV(staff.notes || '')
    ].join(';');
  });

  return [headers.join(';'), ...rows].join('\r\n');
}

/**
 * 2. Export Inventory / Equipment to CSV
 */
export function exportEquipmentToCSV(equipmentList: Equipment[]): string {
  const headers = [
    'Référence Code',
    'Désignation Matériel',
    'Pôle Logistique',
    'Catégorie Spécifique',
    'Stock Total',
    'Stock Disponible',
    'Quantité Engagée / Sortie',
    'Unité de Mesure',
    'État / Maintenance',
    'Valeur Unitaire (€)',
    'Valeur Totale (€)',
    'Emplacement Stockage / Hangar',
    'Couleur & Finition',
    'Dimensions / Taille',
    'Notes Logistique'
  ];

  const rows = equipmentList.map(item => {
    const domainLabel = 
      item.domain === 'DECORATION' ? 'Décoration & Mobilier' :
      item.domain === 'CATERING' ? 'Service Traiteur & Buffet' : 'Vestiaire & Uniformes';

    const categoryLabel = 
      item.category === 'FURNITURE' ? 'Mobilier & Assises' :
      item.category === 'COVERS_ACCESSORIES' ? 'Housses & Habillage' :
      item.category === 'DECORATION' ? 'Scénographie & Déco' :
      item.category === 'CATERING_EQUIPMENT' ? 'Matériel Traiteur' :
      item.category === 'TABLEWARE' ? 'Art de la Table' :
      item.category === 'LINEN' ? 'Linge de Table' : 'Uniforme';

    const conditionLabel = 
      item.condition === 'EXCELLENT' ? 'Excellent (Prêt VIP)' :
      item.condition === 'BON' ? 'Bon État' :
      item.condition === 'PRESSING' ? 'En Pressing' :
      item.condition === 'EN_REVISION' ? 'En Révision' : 'Moyen';

    const engagedQty = Math.max(0, item.totalQty - item.availableQty);
    const unitVal = item.unitValueEuro || 0;
    const totalVal = unitVal * item.totalQty;

    return [
      escapeCSV(item.referenceCode),
      escapeCSV(item.name),
      escapeCSV(domainLabel),
      escapeCSV(categoryLabel),
      escapeCSV(item.totalQty),
      escapeCSV(item.availableQty),
      escapeCSV(engagedQty),
      escapeCSV(item.unit || 'pièces'),
      escapeCSV(conditionLabel),
      escapeCSV(unitVal.toFixed(2)),
      escapeCSV(totalVal.toFixed(2)),
      escapeCSV(item.locationWarehouse || 'Entrepôt Principal'),
      escapeCSV(item.colorOrFinish || ''),
      escapeCSV(item.sizeOrDimensions || ''),
      escapeCSV(item.notes || '')
    ].join(';');
  });

  return [headers.join(';'), ...rows].join('\r\n');
}

/**
 * 3. Export Events List to CSV
 */
export function exportEventsToCSV(events: EventItem[]): string {
  const headers = [
    'ID Événement',
    'Titre de la Réception',
    'Client / Commanditaire',
    'Typologie',
    'Statut Opérationnel',
    'Date Début',
    'Date Fin',
    'Heure Début',
    'Heure Fin',
    'Lieu & Salle',
    'Adresse Complète',
    'Exigence Protocolaire VIP',
    'Nombre Invités Attendus',
    'Budget Prévisionnel (€)',
    'Dress Code Exigé',
    'Langues Requises',
    'Effectif RH Affecté',
    'Matériels Réservés',
    'Date Création'
  ];

  const rows = events.map(ev => {
    const typeLabel = 
      ev.type === 'GALA' ? 'Gala de Prestige' :
      ev.type === 'CORPORATE' ? 'Corporate & Sommet' :
      ev.type === 'DIPLOMATIC' ? 'Diplomatique & Officiel' :
      ev.type === 'WEDDING' ? 'Mariage & Réception Privée' : 'Dîner Privé';

    const statusLabel = 
      ev.status === 'IN_PROGRESS' ? 'En Cours (Jour J)' :
      ev.status === 'PLANNED' ? 'Planifié' :
      ev.status === 'COMPLETED' ? 'Terminé' : 'Annulé';

    const totalEquipReserved = ev.bookedItems.reduce((sum, item) => sum + item.quantity, 0);

    return [
      escapeCSV(ev.id),
      escapeCSV(ev.title),
      escapeCSV(ev.clientName),
      escapeCSV(typeLabel),
      escapeCSV(statusLabel),
      escapeCSV(ev.startDate),
      escapeCSV(ev.endDate || ev.startDate),
      escapeCSV(ev.startTime || 'N/A'),
      escapeCSV(ev.endTime || 'N/A'),
      escapeCSV(ev.location),
      escapeCSV(ev.address || ''),
      escapeCSV(ev.vipProtocolLevel || 'PRESTIGE'),
      escapeCSV(ev.guestCount || 0),
      escapeCSV(ev.budget ? `${ev.budget} €` : 'N/A'),
      escapeCSV(ev.dressCodeRequired || 'Tenue de Gala'),
      escapeCSV(ev.requiredLanguages?.join(', ') || 'FR, EN'),
      escapeCSV(ev.assignments?.length || 0),
      escapeCSV(totalEquipReserved),
      escapeCSV(ev.createdAt ? new Date(ev.createdAt).toLocaleDateString('fr-FR') : 'N/A')
    ].join(';');
  });

  return [headers.join(';'), ...rows].join('\r\n');
}

/**
 * 4. Export a Single Event Roadmap (Feuille de Route & Émargement) to CSV
 */
export function exportEventRoadmapToCSV(
  event: EventItem, 
  staffList: UserStaff[], 
  equipmentList: Equipment[]
): string {
  const lines: string[] = [];

  // Title Header block
  lines.push(`"BLESSING EVENT - FEUILLE DE ROUTE & RAPPORT ADMINISTRATIF"`);
  lines.push(`"Réception :";${escapeCSV(event.title)};"Client :";${escapeCSV(event.clientName)}`);
  lines.push(`"Lieu :";${escapeCSV(event.location)};"Date :";${escapeCSV(`${event.startDate} (${event.startTime} - ${event.endTime})`)}`);
  lines.push(`"Protocole :";${escapeCSV(event.vipProtocolLevel)};"Invités :";${escapeCSV(event.guestCount)}`);
  lines.push(`"Dress Code :";${escapeCSV(event.dressCodeRequired)};"Statut :";${escapeCSV(event.status)}`);
  lines.push('');

  // Staff Assignments Section
  lines.push(`"--- REGISTRE DES EFFECTIFS & ÉMARGEMENT JOUR J ---"`);
  lines.push([
    'Nom Collaborateur',
    'Poste / Rôle sur Mission',
    'Téléphone',
    'Langues',
    'Taille Vestiaire',
    'Statut Émargement',
    'Heure Pointage',
    'Tenue Assignée'
  ].map(escapeCSV).join(';'));

  event.assignments.forEach(a => {
    const staff = staffList.find(s => s.id === a.userId) || a.user;
    const uniformItem = equipmentList.find(e => e.id === a.assignedUniformId);

    const checkInText = 
      a.checkInStatus === 'PRESENT' ? 'PRÉSENT (Validé)' :
      a.checkInStatus === 'LATE' ? 'EN RETARD' :
      a.checkInStatus === 'ABSENT' ? 'ABSENT' :
      a.checkInStatus === 'EXCUSED' ? 'EXCUSÉ' : 'EN ATTENTE';

    lines.push([
      escapeCSV(staff?.fullName || 'Collaborateur Inconnu'),
      escapeCSV(a.roleOnDay),
      escapeCSV(staff?.phone || 'N/A'),
      escapeCSV(staff?.languages?.join(', ') || 'FR'),
      escapeCSV(staff?.uniformSize || 'N/A'),
      escapeCSV(checkInText),
      escapeCSV(a.checkInTime || 'N/A'),
      escapeCSV(uniformItem ? `${uniformItem.name} (${uniformItem.referenceCode})` : 'Standard Blessing')
    ].join(';'));
  });

  lines.push('');

  // Equipment Reserved Section
  lines.push(`"--- INVENTAIRE MATÉRIEL ET MOBILIER ENGAGÉ ---"`);
  lines.push([
    'Référence',
    'Désignation Matériel',
    'Pôle',
    'Quantité Réservée',
    'Unité',
    'Statut Logistique',
    'Emplacement Dépôt'
  ].map(escapeCSV).join(';'));

  event.bookedItems.forEach(b => {
    const equip = equipmentList.find(e => e.id === b.equipmentId) || b.equipment;
    const statusText = 
      b.status === 'CHECKED' ? 'CONTRÔLÉ & VÉRIFIÉ' :
      b.status === 'DISPATCHED' ? 'EXPÉDIÉ SUR SITE' :
      b.status === 'RETURNED' ? 'RETOURNÉ EN STOCK' : 'RÉSERVÉ';

    lines.push([
      escapeCSV(equip?.referenceCode || 'MAT-GEN'),
      escapeCSV(equip?.name || 'Matériel'),
      escapeCSV(equip?.domain || 'LOGISTIQUE'),
      escapeCSV(b.quantity),
      escapeCSV(equip?.unit || 'unités'),
      escapeCSV(statusText),
      escapeCSV(equip?.locationWarehouse || 'Entrepôt')
    ].join(';'));
  });

  return lines.join('\r\n');
}

/**
 * 5. Print a designated element or trigger formatted browser print
 */
export function triggerPrintReport(elementId: string): void {
  const element = document.getElementById(elementId);
  if (!element) {
    window.print();
    return;
  }

  // Use print style wrapper
  window.print();
}
