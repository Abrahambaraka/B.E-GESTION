import React, { useState } from 'react';
import { 
  Code2, 
  Database, 
  Copy, 
  Check, 
  Layers, 
  ShieldCheck, 
  Server, 
  Sparkles, 
  FileText, 
  ExternalLink,
  Workflow
} from 'lucide-react';

export const TechSpecViewer: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'SCHEMA' | 'API' | 'ARCHITECTURE'>('SCHEMA');

  const prismaSchemaCode = `// Prisma Schema - Blessing Event Management System
// Protocole Haute Réception & Logistique Opérationnelle

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  ADMIN
  PROJECT_MANAGER
  STAFF
}

enum StaffCategory {
  HOSTESS        // Hôtesses d'Accueil VIP & Salons
  SERVER         // Chefs de rang & Serveurs
  BUTLER         // Maîtres d'Hôtel & Butlers
  COORDINATOR    // Coordinateurs Régie & Protocole
}

enum LogisticsDomain {
  DECORATION     // Pôle Décoration & Mobilier (Tables, Chaises, Housses, Nœuds, Scénographie)
  CATERING       // Pôle Service Traiteur & Buffet (Chafing dishes, Plateaux, Percolateurs, Verrerie)
  WARDROBE       // Pôle Vestiaire & Uniformes (Tailleurs, Smokings)
}

enum EquipmentCategory {
  FURNITURE          // Mobilier de réception (Tables rondes, Chaises Napoléon/Médaillon, Mange-debout)
  COVERS_ACCESSORIES // Housses de chaises, Nœuds de ruban satin, Spandex mange-debout
  DECORATION         // Scénographie (Chandeliers baroques, Vases Médicis, Potelets cordons)
  CATERING_EQUIPMENT // Matériel Traiteur (Chafing dishes inox, Plateaux serveur, Bacs isothermes GN 1/1)
  TABLEWARE          // Art de la Table (Porcelaine dorée, Couverts or/inox, Flûtes en cristal)
  LINEN              // Nappage & Linge (Nappes damassées, Serviettes coton d'Égypte)
  UNIFORM            // Vestiaire Professionnel (Tailleurs d'hôtesses, Smokings maîtres d'hôtel)
}

enum CheckInStatus {
  PRESENT
  LATE
  ABSENT
  EXCUSED
  PENDING
}

model User {
  id                    String         @id @default(uuid())
  email                 String         @unique
  passwordHash          String
  fullName              String
  phone                 String?
  role                  Role           @default(STAFF)
  staffCategory         StaffCategory?
  languages             String[]       // Ex: ["FR", "EN", "ES", "AR"]
  uniformSize           String?        // Ex: "36", "38", "50"
  heightCm              Int?           // Ex: 175
  shoeSize              Int?           // Ex: 38
  experienceYears       Int            @default(0)
  vipProtocolCertified  Boolean        @default(false)
  assignments           Assignment[]
  createdAt             DateTime       @default(now())
  updatedAt             DateTime       @updatedAt
}

model Event {
  id                 String          @id @default(uuid())
  title              String          // Ex: "Gala Diplomatique des Ambassadeurs"
  type               String          // "CORPORATE", "DIPLOMATIC", "WEDDING", "GALA"
  clientName         String
  location           String
  address            String?
  startDate          DateTime
  endDate            DateTime
  startTime          String          // Ex: "18:00"
  endTime            String          // Ex: "02:00"
  vipProtocolLevel   String          // "PRESTIGE", "OFFICIAL", "STANDARD"
  dressCodeRequired  String
  requiredLanguages  String[]
  guestCount         Int
  budget             Float?
  status             String          @default("PLANNED") // "PLANNED", "IN_PROGRESS", "COMPLETED"
  assignments        Assignment[]
  bookedItems        EventEquipment[]
  createdAt          DateTime        @default(now())
  updatedAt          DateTime        @updatedAt
}

model Assignment {
  id                 String          @id @default(uuid())
  userId             String
  eventId            String
  roleOnDay          String          // Ex: "Hôtesse d'Accueil VIP Table Présidentielle"
  briefingNotes      String?
  assignedUniformId  String?
  checkInStatus      CheckInStatus   @default(PENDING)
  checkInTime        String?
  signature          String?
  shiftStart         String?
  shiftEnd           String?
  user               User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  event              Event           @relation(fields: [eventId], references: [id], onDelete: Cascade)

  @@unique([userId, eventId])
}

model Equipment {
  id                 String            @id @default(uuid())
  name               String            // Ex: "Chaise Napoléon III Dorée", "Chafing Dish Inox"
  category           EquipmentCategory
  domain             LogisticsDomain   // "DECORATION", "CATERING", "WARDROBE"
  referenceCode      String            @unique
  totalQty           Int
  availableQty       Int
  condition          String            // "EXCELLENT", "BON", "PRESSING", "EN_REVISION"
  unit               String            @default("pièces")
  locationWarehouse  String
  colorOrFinish      String?
  sizeOrDimensions   String?
  unitValueEuro      Float?
  events             EventEquipment[]
  createdAt          DateTime          @default(now())
  updatedAt          DateTime          @updatedAt
}

model EventEquipment {
  id                 String            @id @default(uuid())
  eventId            String
  equipmentId        String
  quantity           Int
  status             String            @default("RESERVED") // "RESERVED", "DISPATCHED", "RETURNED"
  event              Event             @relation(fields: [eventId], references: [id], onDelete: Cascade)
  equipment          Equipment         @relation(fields: [equipmentId], references: [id], onDelete: Cascade)

  @@unique([eventId, equipmentId])
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(prismaSchemaCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl lg:text-2xl font-serif font-bold text-slate-900">
              Spécifications Techniques & Architecture Senior
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-slate-900 text-amber-400 text-[10px] font-bold uppercase tracking-wider font-mono">
              Prisma / PostgreSQL
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Cahier des charges d'architecture logicielle, schéma de base de données relationnelle et contrats d'API.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyToClipboard}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-100 text-xs font-bold uppercase tracking-wider rounded-md flex items-center gap-1.5 shadow-xs transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
            {copied ? 'Schéma Copié !' : 'Copier le Schéma Prisma'}
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex space-x-2 border-b border-slate-200 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('SCHEMA')}
          className={`px-3 py-1.5 rounded-md font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 text-xs ${
            activeTab === 'SCHEMA' ? 'bg-slate-900 text-slate-100' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Database className="w-4 h-4 text-amber-400" /> Schéma Prisma & Modèles SQL
        </button>
        <button
          onClick={() => setActiveTab('ARCHITECTURE')}
          className={`px-3 py-1.5 rounded-md font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 text-xs ${
            activeTab === 'ARCHITECTURE' ? 'bg-slate-900 text-slate-100' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Workflow className="w-4 h-4 text-amber-400" /> Architecture Full-Stack & RBAC
        </button>
        <button
          onClick={() => setActiveTab('API')}
          className={`px-3 py-1.5 rounded-md font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 text-xs ${
            activeTab === 'API' ? 'bg-slate-900 text-slate-100' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Server className="w-4 h-4 text-amber-400" /> Endpoints REST & Contrats
        </button>
      </div>

      {/* Tab 1: Prisma Schema Code Viewer */}
      {activeTab === 'SCHEMA' && (
        <div className="space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden shadow-md">
            <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <span className="font-mono flex items-center gap-2 text-amber-300 font-bold">
                <FileText className="w-4 h-4" /> prisma/schema.prisma
              </span>
              <span className="text-[11px] text-slate-400 font-mono">PostgreSQL Relational Dialect</span>
            </div>

            <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed max-h-[600px] scrollbar-thin">
              <code>{prismaSchemaCode}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Tab 2: Architecture & Security */}
      {activeTab === 'ARCHITECTURE' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
            <h3 className="font-serif font-bold text-slate-900 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600" /> Matrice des Rôles & Sécurité RBAC
            </h3>
            <div className="space-y-2.5">
              <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
                <strong className="text-slate-900 block text-xs">1. ADMIN (Direction d'Agence)</strong>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Accès complet : Création & suppression d'événements, gestion des stocks et de la valorisation, édition des profils permanents/extras, tarification.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
                <strong className="text-slate-900 block text-xs">2. PROJECT_MANAGER (Chef de Projet & Régie)</strong>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Opérations événementielles : Affectation des postes Jour J, réservation du matériel, gestion de l'émargement live et attribution des tenues.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
                <strong className="text-slate-900 block text-xs">3. STAFF (Hôtesse, Maître d'Hôtel, Serveur)</strong>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Accès terrain : Consultation de son planning, feuille de route de poste, dress code, et check-in / signature sur le lieu de réception.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
            <h3 className="font-serif font-bold text-slate-900 text-sm flex items-center gap-2">
              <Server className="w-4 h-4 text-amber-600" /> Flux Opérationnels Métier (Workflows)
            </h3>
            <div className="space-y-2.5">
              <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
                <strong className="text-slate-900 block text-xs">A. Matching Sizing & Vestiaire</strong>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Calcul automatique de la compatibilité entre la taille de tenue du collaborateur (ex: 36, 38, 50) et le stock disponible de tailleurs ou costumes.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
                <strong className="text-slate-900 block text-xs">B. Vérification Anti-Surréservation</strong>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Contrôle des quantités disponibles par date pour éviter tout conflit de réservation de chaises Napoléon, vaisselle ou chandeliers entre plusieurs galas simultanés.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
                <strong className="text-slate-900 block text-xs">C. Émargement & Registre Légal</strong>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Signature électronique et horodatage certifié sur site avec calcul des vacations pour la paie des extras.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: API Endpoints */}
      {activeTab === 'API' && (
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4 text-xs">
          <h3 className="font-serif font-bold text-slate-900 text-sm">
            Architecture des Endpoints REST / Server Actions
          </h3>

          <div className="divide-y divide-slate-200">
            {/* Events */}
            <div className="py-3 flex items-start gap-3">
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold text-[11px] border border-emerald-200">
                GET /api/events
              </span>
              <div>
                <strong className="text-slate-900">Liste des événements & statuts</strong>
                <p className="text-slate-500 text-[11px]">Retourne les réceptions avec leurs affectations et matériels réservés.</p>
              </div>
            </div>

            {/* Staff */}
            <div className="py-3 flex items-start gap-3">
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono font-bold text-[11px] border border-blue-200">
                GET /api/staff
              </span>
              <div>
                <strong className="text-slate-900">Annuaire du personnel</strong>
                <p className="text-slate-500 text-[11px]">Filtres par catégorie (HOSTESS, BUTLER), langues, mensurations, certifications VIP.</p>
              </div>
            </div>

            {/* Assignment */}
            <div className="py-3 flex items-start gap-3">
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-mono font-bold text-[11px] border border-amber-200">
                POST /api/events/:id/assign
              </span>
              <div>
                <strong className="text-slate-900">Affectation d'un collaborateur</strong>
                <p className="text-slate-500 text-[11px]">Payload: <code className="bg-slate-100 p-1 rounded font-mono text-slate-700">{"{ userId, roleOnDay, assignedUniformId, briefingNotes }"}</code></p>
              </div>
            </div>

            {/* Check-in */}
            <div className="py-3 flex items-start gap-3">
              <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-mono font-bold text-[11px] border border-purple-200">
                POST /api/check-in
              </span>
              <div>
                <strong className="text-slate-900">Émargement numérique Jour J</strong>
                <p className="text-slate-500 text-[11px]">Payload: <code className="bg-slate-100 p-1 rounded font-mono text-slate-700">{"{ assignmentId, status: 'PRESENT' | 'LATE', signature, timestamp }"}</code></p>
              </div>
            </div>

            {/* Logistics */}
            <div className="py-3 flex items-start gap-3">
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-mono font-bold text-[11px] border border-amber-200">
                POST /api/events/:id/book-equipment
              </span>
              <div>
                <strong className="text-slate-900">Réservation de matériel</strong>
                <p className="text-slate-500 text-[11px]">Payload: <code className="bg-slate-100 p-1 rounded font-mono text-slate-700">{"{ equipmentId, quantity }"}</code> avec validation anti-surréservation.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

