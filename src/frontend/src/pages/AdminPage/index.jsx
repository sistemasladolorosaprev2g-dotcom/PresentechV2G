import { useState } from 'react'
import { AppLayout } from '../../components/layout'
import { ProfesoresTab } from './ProfesoresTab'
import { ParalelosTab } from './ParalelosTab'
import { ClasesTab } from './ClasesTab'
import { MateriasTab } from './MateriasTab'
import { EstudiantesTab } from './EstudiantesTab'
import { DashboardView } from '../../components/dashboard'

export function AdminPage() {
  const [activeTab, setActiveTab] = useState('profesores')

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'profesores', label: 'Profesores' },
    { id: 'paralelos', label: 'Paralelos' },
    { id: 'materias', label: 'Materias' },
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
        <div className="mb-6 flex flex-wrap gap-2 rounded-xl bg-card/60 backdrop-blur-sm p-1.5 shadow-sm border border-border/50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 rounded-lg py-2.5 px-4 text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary to-primary-dark text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenido del Tab */}
        <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-md p-4 md:p-6 shadow-xl animate-fade-in">
          {activeTab === 'dashboard' && <DashboardView role="admin" />}
          {activeTab === 'profesores' && <ProfesoresTab />}
          {activeTab === 'paralelos' && <ParalelosTab />}
          {activeTab === 'materias' && <MateriasTab />}
          {activeTab === 'clases' && <ClasesTab />}
          {activeTab === 'estudiantes' && <EstudiantesTab />}
        </div>
      </section>
    </AppLayout>
  )
}
