import { ArrowLeft, BookOpen, RefreshCw } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Spinner } from '../../components/common'
import { ClasesGrid } from '../../components/clases'
import { AppLayout } from '../../components/layout'
import { getApiData, getApiErrorMessage } from '../../services/api'
import { obtenerMisClases } from '../../services/clasesService'
import { DashboardView } from '../../components/dashboard'
import { ReportesView } from '../../components/reportes'
import { OpinionesView } from '../../components/opiniones'

export function ClasesPage() {
  const [clases, setClases] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('clases')
  const [selectedCurso, setSelectedCurso] = useState('')

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'clases', label: 'Mis Clases' },
    { id: 'reportes', label: 'Reportes' },
    { id: 'opiniones', label: 'Opiniones y Recomendaciones' },
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

  const cursos = useMemo(() => {
    const cursosMap = new Map()

    clases.forEach((clase) => {
      if (!clase.nombre_paralelo) {
        return
      }

      const curso = cursosMap.get(clase.nombre_paralelo) ?? {
        nombre: clase.nombre_paralelo,
        materias: new Set(),
        totalHorarios: 0,
      }

      curso.materias.add(clase.materia)
      curso.totalHorarios += clase.horarios?.length ?? 0
      cursosMap.set(clase.nombre_paralelo, curso)
    })

    return [...cursosMap.values()]
      .map((curso) => ({
        ...curso,
        totalMaterias: curso.materias.size,
      }))
      .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
  }, [clases])

  const clasesFiltradas = useMemo(() => {
    if (!selectedCurso) {
      return clases
    }

    return clases.filter((clase) => clase.nombre_paralelo === selectedCurso)
  }, [clases, selectedCurso])

  useEffect(() => {
    if (!selectedCurso) {
      return
    }

    const cursoExiste = cursos.some((curso) => curso.nombre === selectedCurso)
    if (!cursoExiste) {
      setSelectedCurso('')
    }
  }, [cursos, selectedCurso])

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
          {activeTab === 'dashboard' && <DashboardView role="profesor" />}
          {activeTab === 'reportes' && <ReportesView />}
          {activeTab === 'opiniones' && <OpinionesView />}
          
          {activeTab === 'clases' && (
            <>
              {error ? (
                <p className="mb-4 rounded-md border border-error bg-error-bg px-3 py-2 text-sm text-error">
                  {error}
                </p>
              ) : null}

              {isLoading ? (
                <div className="flex min-h-64 items-center justify-center">
                  <Spinner size="lg" />
                </div>
              ) : null}

              {!isLoading && clases.length ? (
                <>
                  {!selectedCurso ? (
                    <div>
                      <div className="mb-5">
                        <h3 className="text-lg font-semibold text-foreground">Selecciona un curso</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Luego podrás escoger la materia y continuar con el flujo actual.
                        </p>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {cursos.map((curso) => (
                          <button
                            key={curso.nombre}
                            type="button"
                            onClick={() => setSelectedCurso(curso.nombre)}
                            className="rounded-xl border border-border/50 bg-card/70 p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                          >
                            <div className="mb-4 flex items-start justify-between gap-3">
                              <div>
                                <h3 className="text-base font-semibold text-foreground">
                                  {curso.nombre}
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                  {curso.totalMaterias}{' '}
                                  {curso.totalMaterias === 1 ? 'materia' : 'materias'}
                                </p>
                              </div>
                              <span className="rounded-lg bg-primary/10 p-2 text-primary">
                                <BookOpen aria-hidden="true" className="h-5 w-5" />
                              </span>
                            </div>

                            <div className="rounded-lg bg-primary/5 px-3 py-2 text-sm text-muted-foreground">
                              {curso.totalHorarios}{' '}
                              {curso.totalHorarios === 1 ? 'horario semanal' : 'horarios semanales'}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mb-5 flex flex-col gap-3 rounded-xl border border-border/50 bg-card/70 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Curso seleccionado</p>
                          <h3 className="text-lg font-semibold text-foreground">{selectedCurso}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {clasesFiltradas.length}{' '}
                            {clasesFiltradas.length === 1 ? 'materia disponible' : 'materias disponibles'}
                          </p>
                        </div>
                        <Button variant="secondary" onClick={() => setSelectedCurso('')}>
                          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                          Volver a cursos
                        </Button>
                      </div>

                      <ClasesGrid clases={clasesFiltradas} onImportSuccess={loadClases} />
                    </>
                  )}
                </>
              ) : null}

              {!isLoading && !clases.length && !error ? (
                <div className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-5 text-center shadow-sm">
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
