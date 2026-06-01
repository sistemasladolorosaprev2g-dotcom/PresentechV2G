import { useState } from 'react'
import { AppLayout } from '../../components/layout'
import { ProfesoresTab } from './ProfesoresTab'
import { ParalelosTab } from './ParalelosTab'
import { ClasesTab } from './ClasesTab'
import { EstudiantesTab } from './EstudiantesTab'
import { DashboardView } from '../../components/dashboard'

export function AdminPage() {
  const [activeTab, setActiveTab] = useState('profesores')

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'profesores', label: 'Profesores' },
    { id: 'paralelos', label: 'Paralelos' },
    { id: 'clases', label: 'Clases y Horarios' },
    { id: 'estudiantes', label: 'Estudiantes' },
  ]

  return (
    <AppLayout title="Administración">
      <section className="container mx-auto max-w-5xl px-4 py-4 md:py-6">
        <div className="mb-6">
          <h2 className="text-xl font-medium text-foreground">Panel de Control</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestión de profesores, paralelos, clases y sus respectivos horarios.
          </p>
        </div>

        {/* Tabs Navegación */}
        <div className="mb-6 flex space-x-1 rounded-lg bg-card p-1 shadow-sm border border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenido del Tab */}
        <div className="rounded-lg border border-border bg-card p-4 md:p-6 shadow-sm">
          {activeTab === 'dashboard' && <DashboardView role="admin" />}
          {activeTab === 'profesores' && <ProfesoresTab />}
          {activeTab === 'paralelos' && <ParalelosTab />}
          {activeTab === 'clases' && <ClasesTab />}
          {activeTab === 'estudiantes' && <EstudiantesTab />}
        </div>
      </section>
    </AppLayout>
  )
}
