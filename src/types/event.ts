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

export type ProtocolAccreditation = 'PRESTIGE' | 'VIP' | 'STANDARD';

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
  shoeSize?: number; // Ex: 39 (Optionnel, si souliers fournis)
  shoesProvidedByAgency?: boolean;
  experienceYears?: number;
  vipProtocolCertified?: boolean;
  protocolAccreditation?: ProtocolAccreditation; // 'PRESTIGE' | 'VIP' | 'STANDARD'
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

export interface HonoredCouple {
  partner1: string; // Ex: "Alexandre de Montmirail"
  partner2: string; // Ex: "Inès Baraka"
  title?: string; // Ex: "Les Mariés", "Les Époux Jubilaires", "Couple d'Honneur"
  notes?: string; // Ex: "Arrivée prévue à 17h00 en Rolls-Royce d'époque"
}

export interface GuestItem {
  id: string;
  fullName: string;
  category?: 'HONOR' | 'VIP' | 'FAMILY' | 'OFFICIAL' | 'GENERAL' | 'CHILD';
  assignedTableName?: string; // Ex: "Table d'Honneur", "Table 1"
  seatNumber?: number;
  dietaryRequirements?: string; // Ex: "Sans gluten", "Halal", "Végétarien", "Standard"
  plusOne?: string; // Nom de l'accompagnant si applicable
  phone?: string;
  status?: 'CONFIRMED' | 'PENDING' | 'DECLINED' | 'CHECKED_IN';
  notes?: string;
}

export interface TableItem {
  id: string;
  name: string; // Ex: "Table d'Honneur - Versailles", "Table 1 - Royale"
  capacity: number; // Nombre de places (ex: 10)
  shape?: 'ROUND' | 'RECTANGULAR' | 'HONOR_U' | 'SQUARE' | 'HIGH_TOP';
  assignedServerName?: string; // Ex: "Alexandre Mercier (Chef de rang)"
  locationZone?: string; // Ex: "Devant la scène", "Côté jardin", "Terrasse"
  notes?: string;
}

export interface EventHostess {
  id: string;
  staffId?: string; // ID if linked to an existing UserStaff in the database
  fullName: string;
  phone?: string;
  assignedPost: string; // Ex: "Accueil VIP / Tapis rouge", "Remise des livrets & badges", "Vestiaire d'honneur", "Placement en salle"
  uniformInfo?: string; // Ex: "Tailleur Signature Bleu Nuit T.36 + Foulard"
  languages?: string[]; // Ex: ["FR", "EN"]
  status?: 'CONFIRMED' | 'PRESENT' | 'LATE' | 'PENDING';
  shiftTime?: string; // Ex: "15:00 - 23:00"
  notes?: string;
}

export interface CatererServer {
  id: string;
  staffId?: string; // if linked to existing UserStaff
  fullName: string;
  phone?: string;
  role: string; // Ex: "Maître d'Hôtel", "Chef de Rang", "Serveur Cocktail", "Sommelier", "Commis de Débarrassage"
  assignedZone: string; // Ex: "Table d'Honneur & Table 1", "Buffet Chaud", "Bar à Champagne"
  shiftTime?: string; // Ex: "16:00 - 02:00"
  catererCompany?: string; // Ex: "Maison Lenôtre", "Baraka Catering"
  status?: 'CONFIRMED' | 'PRESENT' | 'PENDING';
  notes?: string;
}

export type BeverageCategory = 'CHAMPAGNE' | 'WINE_RED' | 'WINE_WHITE' | 'WINE_ROSE' | 'COCKTAIL' | 'SOFT_WATER' | 'SPIRITS' | 'BEER';

export interface BeverageItem {
  id: string;
  name: string; // Ex: "Dom Pérignon Vintage 2013", "Château Talbot Saint-Julien", "San Pellegrino 1L", "Cocktail Signature Royal Berry"
  category: BeverageCategory;
  quantityOrdered: number; // Ex: 80
  unit: string; // "Bouteilles (75cl)", "Magnums (1.5L)", "Cartons de 6", "Packs", "Litres", "Verres"
  temperatureOrService?: string; // Ex: "Servir glacé à 6-8°C dans vasque argent", "Chambré à 16°C, décanter 30min"
  allocatedBarOrZone?: string; // Ex: "Bar Principal & Cocktail", "Dîner Assis", "Buffet Accueil"
  quantityConsumed?: number; // Pour le suivi de consommation
  notes?: string;
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

  // Détails approfondis de gestion d'événement
  couple?: HonoredCouple;
  guests?: GuestItem[];
  tables?: TableItem[];
  hostesses?: EventHostess[];
  catererServers?: CatererServer[];
  catererCompanyName?: string;
  catererHeadButler?: string;
  catererNotes?: string;
  beverages?: BeverageItem[];
}

export interface FilterState {
  search: string;
  category?: string;
  role?: string;
  language?: string;
  status?: string;
  eventType?: string;
}
