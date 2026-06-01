import { RefreshCw } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Button, Spinner } from '../../components/common'
import { ClasesGrid } from '../../components/clases'
import { AppLayout } from '../../components/layout'
import { getApiData, getApiErrorMessage } from '../../services/api'
import { obtenerMisClases } from '../../services/clasesService'
import { DashboardView } from '../../components/dashboard'

export function ClasesPage() {
  const [clases, setClases] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('clases')

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'clases', label: 'Mis Clases' },
  ]

  const loadClases = useCallback(async () => {
    setError('')
    setIsLoading(true)

    try {
      const response = await obtenerMisClases()
      setClases(getApiData(response) ?? [])
    } catch (requestError) {
      setError(getApiErrorMessage(requestError))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let isActive = true

    async function loadInitialClases() {
      try {
          const response = await obtenerMisClases()

        if (isActive) {
          setClases(getApiData(response) ?? [])
        }
      } catch (requestError) {
        if (isActive) {
          setError(getApiErrorMessage(requestError))
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadInitialClases()

    return () => {
      isActive = false
    }
  }, [])

  return (
    <AppLayout title="Mis clases">
      <section className="container mx-auto max-w-4xl px-4 py-4 md:py-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-medium text-foreground">Panel Docente</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Revisa tus estadísticas y clases asignadas.
            </p>
          </div>
          {activeTab === 'clases' && (
            <Button variant="secondary" onClick={loadClases} isLoading={isLoading}>
              <RefreshCw aria-hidden="true" className="h-4 w-4" />
              Actualizar
            </Button>
          )}
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
          {activeTab === 'dashboard' && <DashboardView role="profesor" />}
          
          {activeTab === 'clases' && (
            <>
              {error ? (
                <p className="mb-4 rounded-md border border-error bg-error-bg px-3 py-2 text-sm text-error">
                  {error}
                </p>
              ) : null}

              {isLoading ? (
                <div className="flex min-h-64 items-center justify-center rounded-lg border border-border bg-card">
                  <Spinner size="lg" />
                </div>
              ) : null}

              {!isLoading && clases.length ? (
                <ClasesGrid clases={clases} onImportSuccess={loadClases} />
              ) : null}

              {!isLoading && !clases.length && !error ? (
                <div className="rounded-lg border border-border bg-card p-5 text-center shadow-sm">
                  <h2 className="text-lg font-medium text-foreground">
                    No hay clases asignadas
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Cuando tengas clases registradas, aparecerán en esta sección.
                  </p>
                </div>
              ) : null}
            </>
          )}
        </div>
      </section>
    </AppLayout>
  )
}
