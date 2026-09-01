export type Role = 'ADMIN' | 'PROJECT_MANAGER' | 'STAFF';

export type StaffCategory = 'HOSTESS' | 'SERVER' | 'BUTLER' | 'COORDINATOR';

export type EquipmentCategory = 
  | 'FURNITURE'          // Mobilier & Assises (Tables, Chaises, Mange-debout)
  | 'COVERS_ACCESSORIES' // Housses & Habillage (Housses de chaises, Nœuds, Nappes de buffet)
  | 'DECORATION'         // Scénographie & Déco (Chandeliers, Arches, Centres de table, Potelets)
  | 'CATERING_EQUIPMENT' // Matériel Traiteur & Buffet (Chafing dishes, Plateaux, Bacs thermiques, Percolateurs)
  | 'TABLEWARE'          // Art de la Table & Verrerie (Assiettes dorées, Couverts, Cristaux, Flûtes)
  | 'LINEN'              // Linge de Table & Nappage (Nappes damassées, Serviettes coton)
  | 'UNIFORM';           // Vestiaire & Uniformes (Tailleurs, Costumes, Smokings)

export type LogisticsDomain = 'DECORATION' | 'CATERING' | 'WARDROBE';

export type EventType = 'CORPORATE' | 'PRIVATE' | 'DIPLOMATIC' | 'GALA' | 'WEDDING';

export type EventStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type Condition = 'EXCELLENT' | 'BON' | 'MOYEN' | 'EN_REVISION' | 'PRESSING';

export type CheckInStatus = 'PRESENT' | 'LATE' | 'ABSENT' | 'EXCUSED' | 'PENDING';

export interface UserStaff {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: Role;
  staffCategory?: StaffCategory;
  languages: string[]; // Ex: ["FR", "EN", "ES", "AR", "ZH"]
  uniformSize?: string; // Ex: "S", "M", "L", "38", "40", "42", "50"
  heightCm?: number; // Ex: 175
  shoeSize?: number; // Ex: 39
  experienceYears?: number;
  vipProtocolCertified?: boolean;
  avatarUrl?: string;
  notes?: string;
  status?: 'AVAILABLE' | 'ASSIGNED' | 'UNAVAILABLE';
  createdAt: string;
}

export interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  domain: LogisticsDomain; // 'DECORATION' (Décoration, Tables, Chaises, Housses...) | 'CATERING' (Service Traiteur, Chafing dishes, Plateaux...) | 'WARDROBE'
  totalQty: number;
  availableQty: number;
  condition: Condition;
  referenceCode: string;
  unit: string; // "pièces", "lots", "paires", "ensembles", "housses"
  locationWarehouse: string;
  colorOrFinish?: string;
  sizeOrDimensions?: string;
  unitValueEuro?: number;
  imageUrl?: string;
  notes?: string;
}

export interface EventEquipment {
  id: string;
  eventId: string;
  equipmentId: string;
  quantity: number;
  status: 'RESERVED' | 'DISPATCHED' | 'RETURNED' | 'CHECKED';
  assignedUniformStaffId?: string; // If it's a specific uniform allocated to a staff
  equipment?: Equipment;
}

export interface Assignment {
  id: string;
  userId: string;
  eventId: string;
  roleOnDay: string; // Ex: "Hôtesse d'Accueil VIP", "Maître d'Hôtel Direction", "Chef de Rang Salon d'Honneur"
  briefingNotes?: string;
  assignedUniformId?: string;
  uniformStatus?: 'ASSIGNED' | 'FITTED' | 'RETURNED' | 'PENDING';
  checkInStatus?: CheckInStatus;
  checkInTime?: string;
  signature?: string;
  shiftStart?: string;
  shiftEnd?: string;
  user?: UserStaff;
}

export interface EventItem {
  id: string;
  title: string;
  clientName: string;
  type: EventType;
  location: string;
  address?: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  vipProtocolLevel: 'PRESTIGE' | 'OFFICIAL' | 'STANDARD';
  dressCodeRequired: string; // Ex: "Tailleur Marine & Foulard Soie", "Smoking Noir & Nœud Papillon"
  requiredLanguages: string[];
  guestCount: number;
  budget?: number;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  description?: string;
  assignments: Assignment[];
  bookedItems: EventEquipment[];
  createdAt: string;
}

export interface FilterState {
  search: string;
  category?: string;
  role?: string;
  language?: string;
  status?: string;
  eventType?: string;
}
