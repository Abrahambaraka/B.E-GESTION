/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { EventProvider, useEvent } from './context/EventContext';
import { Navbar, NavigationTab } from './components/layout/Navbar';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { StaffDirectory } from './components/staff/StaffDirectory';
import { AddStaffModal } from './components/staff/AddStaffModal';
import { EquipmentInventory } from './components/logistics/EquipmentInventory';
import { EventManagement } from './components/events/EventManagement';
import { CreateEventModal } from './components/events/CreateEventModal';
import { UniformManagement } from './components/uniforms/UniformManagement';
import { UniformBatchModal } from './components/uniforms/UniformBatchModal';
import { ExportReportModal, ReportType } from './components/export/ExportReportModal';
import { Menu, Plus, Calendar, Users, FileDown, Shirt } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [isNewStaffModalOpen, setIsNewStaffModalOpen] = useState(false);
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isUniformBatchModalOpen, setIsUniformBatchModalOpen] = useState(false);
  const [exportInitialType, setExportInitialType] = useState<ReportType>('STAFF');
  const [exportInitialEventId, setExportInitialEventId] = useState<string | undefined>(undefined);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { events } = useEvent();
  const activeEvent = events.find(e => e.status === 'IN_PROGRESS') || events[0];

  const handleOpenExport = (type: ReportType = 'STAFF', eventId?: string) => {
    setExportInitialType(type);
    setExportInitialEventId(eventId);
    setIsExportModalOpen(true);
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Tableau de bord de direction';
      case 'events': return 'Événements & Réceptions de Prestige';
      case 'staff': return 'Ressources Humaines & Profils Extra';
      case 'logistics': return 'Logistique, Matériel & Mobilier';
      case 'uniforms': return 'Vestiaire & Dressing Événementiel';
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onOpenExport={() => handleOpenExport('STAFF')}
      />

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between shrink-0 shadow-xs z-10">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-800 uppercase tracking-widest font-sans">
                {getPageTitle()}
              </h1>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Blessing Event • Système Opérationnel Haute Réception & Protocole
              </p>
            </div>
          </div>

          {/* Streamlined Header Actions */}
          <div className="flex items-center space-x-2">
            {activeEvent && (
              <button
                onClick={() => setActiveTab('events')}
                className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 transition-colors"
                title="Accéder à l'événement en cours"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="font-medium truncate max-w-[140px]">{activeEvent.title.split('&')[0]}</span>
                <span className="text-[10px] text-slate-400">· Jour J</span>
              </button>
            )}

            {/* Quiet Export action */}
            <button
              id="top-header-export-btn"
              onClick={() => {
                const mapType: Record<NavigationTab, ReportType> = {
                  dashboard: 'STAFF',
                  staff: 'STAFF',
                  logistics: 'EQUIPMENT',
                  events: 'EVENTS',
                  uniforms: 'UNIFORMS'
                };
                handleOpenExport(mapType[activeTab]);
              }}
              className="flex items-center space-x-1 px-2.5 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded text-xs font-medium transition-colors"
              title="Exporter les données (CSV / PDF)"
            >
              <FileDown className="w-3.5 h-3.5 text-slate-500" />
              <span>Exporter</span>
            </button>

            {/* Contextual primary action (single button) */}
            {(activeTab === 'dashboard' || activeTab === 'events') && (
              <button
                id="top-header-new-event-btn"
                onClick={() => setIsNewEventModalOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded text-xs font-semibold transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nouvel Événement</span>
              </button>
            )}

            {activeTab === 'staff' && (
              <button
                id="top-header-new-staff-btn"
                onClick={() => setIsNewStaffModalOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nouveau Profil</span>
              </button>
            )}

            {activeTab === 'uniforms' && (
              <button
                id="top-header-uniform-batch-btn"
                onClick={() => setIsUniformBatchModalOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-semibold transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Enregistrer Tenues</span>
              </button>
            )}
          </div>
        </header>

        {/* Scrollable Body Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50">
          <div className="max-w-7xl mx-auto space-y-6">
            {activeTab === 'dashboard' && (
              <OverviewDashboard 
                setActiveTab={setActiveTab}
                openNewEventModal={() => setIsNewEventModalOpen(true)}
                openNewStaffModal={() => setIsNewStaffModalOpen(true)}
                openExportModal={handleOpenExport}
              />
            )}

            {activeTab === 'events' && (
              <EventManagement 
                setActiveTab={setActiveTab}
                openCreateModal={() => setIsNewEventModalOpen(true)}
                openExportModal={handleOpenExport}
              />
            )}

            {activeTab === 'staff' && (
              <StaffDirectory 
                openAddModal={() => setIsNewStaffModalOpen(true)}
                openExportModal={handleOpenExport}
              />
            )}

            {activeTab === 'logistics' && (
              <EquipmentInventory 
                openExportModal={handleOpenExport}
                onNavigateToUniforms={() => setActiveTab('uniforms')}
              />
            )}

            {activeTab === 'uniforms' && (
              <UniformManagement 
                openExportModal={handleOpenExport}
              />
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <AddStaffModal 
        isOpen={isNewStaffModalOpen}
        onClose={() => setIsNewStaffModalOpen(false)}
      />

      <CreateEventModal 
        isOpen={isNewEventModalOpen}
        onClose={() => setIsNewEventModalOpen(false)}
      />

      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        initialType={exportInitialType}
        initialEventId={exportInitialEventId}
      />

      <UniformBatchModal
        isOpen={isUniformBatchModalOpen}
        onClose={() => setIsUniformBatchModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <EventProvider>
      <AppContent />
    </EventProvider>
  );
}

