import { useEffect, useState, useCallback } from 'react'
import { RefreshCw, Users, BookOpen, AlertTriangle } from 'lucide-react'
import { getApiData, getApiErrorMessage } from '../../services/api'
import { obtenerDashboardAdmin, obtenerDashboardProfesor } from '../../services/dashboardService'
import { Button, Spinner } from '../common'

export function DashboardView({ role }) {
  const [dashboardData, setDashboardData] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const loadData = useCallback(async () => {
    setError('')
    setIsLoading(true)

    try {
      const response = role === 'admin' 
        ? await obtenerDashboardAdmin() 
        : await obtenerDashboardProfesor()
        
      setDashboardData(getApiData(response))
    } catch (requestError) {
      setError(getApiErrorMessage(requestError))
    } finally {
      setIsLoading(false)
    }
  }, [role])

  useEffect(() => {
    loadData()
  }, [loadData])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-medium text-foreground">
            {role === 'admin' ? 'Vista General de la Institución' : 'Resumen de Mis Clases'}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Estadísticas de asistencia y alertas de estudiantes.
          </p>
        </div>
        <Button variant="secondary" onClick={loadData} isLoading={isLoading}>
          <RefreshCw aria-hidden="true" className="h-4 w-4" />
          Actualizar
        </Button>
      </div>

      {error && (
        <p className="rounded-md border border-error bg-error-bg px-3 py-2 text-sm text-error">
          {error}
        </p>
      )}

      {isLoading && (
        <div className="flex min-h-[300px] items-center justify-center rounded-lg rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm shadow-sm transition-all duration-300">
          <Spinner size="lg" />
        </div>
      )}

      {!isLoading && dashboardData && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-primary/10 p-3 text-primary">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Estudiantes</p>
                  <p className="text-3xl font-bold">{dashboardData.total_estudiantes}</p>
                </div>
              </div>
            </div>
            
            <div className="rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-emerald-500/10 p-3 text-emerald-500">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Clases Activas</p>
                  <p className="text-3xl font-bold">{dashboardData.total_clases}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-blue-500/10 p-3 text-blue-500">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tasa de Asistencia</p>
                  <p className="text-3xl font-bold">{dashboardData.porcentaje_asistencia_global?.toFixed(1) || 0}%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
            <div className="border-b border-border p-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <h3 className="font-semibold text-foreground">Estudiantes en Riesgo (2+ Faltas)</h3>
              </div>
              <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded-full dark:bg-amber-900/30 dark:text-amber-400">
                {dashboardData.estudiantes_en_riesgo.length} estudiantes
              </span>
            </div>
            <div className="p-0">
              {dashboardData.estudiantes_en_riesgo.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No hay estudiantes en riesgo de deserción en este momento.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                      <tr>
                        <th className="px-6 py-3 font-medium">Estudiante</th>
                        <th className="px-6 py-3 font-medium text-center">Faltas Totales</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {dashboardData.estudiantes_en_riesgo.map((est) => (
                        <tr key={est.id_estudiante} className="hover:bg-muted/50">
                          <td className="px-6 py-4 font-medium text-foreground">
                            {est.nombres} {est.apellidos}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-error/10 text-error font-medium">
                              {est.numero_faltas}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
