import { Plus, Trash2, Link as LinkIcon, RefreshCw, Upload, FileSpreadsheet, Camera } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Button, Input, Modal, Spinner, SearchableSelect } from '../../components/common'
import { ImportarExcelButton } from '../../components/estudiantes/ImportarExcelButton'
import { EscanearListaButton } from '../../components/estudiantes/EscanearListaButton'
import { getApiData, getApiErrorMessage } from '../../services/api'
import { obtenerEstudiantes, crearEstudiante, asignarParaleloEstudiante, obtenerParalelos } from '../../services/adminService'

export function EstudiantesTab() {
  const [estudiantes, setEstudiantes] = useState([])
  const [paralelos, setParalelos] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Crear estudiante
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false)
  const [nuevoEstudiante, setNuevoEstudiante] = useState({ nombres: '', apellidos: '' })
  const [isCreating, setIsCreating] = useState(false)

  // Asignar paralelo a estudiante
  const [isAsignarModalOpen, setIsAsignarModalOpen] = useState(false)
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null)
  const [paraleloIdSeleccionado, setParaleloIdSeleccionado] = useState('')
  const [isAssigning, setIsAssigning] = useState(false)

  // Importar estudiantes (Modal)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)

  const loadData = useCallback(async () => {
    setError('')
    setIsLoading(true)

    try {
      const [estudiantesRes, paralelosRes] = await Promise.all([
        obtenerEstudiantes(),
        obtenerParalelos()
      ])
      
      setEstudiantes(getApiData(estudiantesRes) || [])
      setParalelos(getApiData(paralelosRes) || [])
    } catch (requestError) {
      setError(getApiErrorMessage(requestError))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleCrearEstudiante = async () => {
    setIsCreating(true)
    setError('')
    try {
      await crearEstudiante(nuevoEstudiante)
      setNuevoEstudiante({ nombres: '', apellidos: '' })
      setIsCrearModalOpen(false)
      loadData()
    } catch (requestError) {
      setError(getApiErrorMessage(requestError))
    } finally {
      setIsCreating(false)
    }
  }

  const handleAsignarParalelo = async () => {
    if (!estudianteSeleccionado || !paraleloIdSeleccionado) return
    setIsAssigning(true)
    setError('')
    try {
      await asignarParaleloEstudiante(estudianteSeleccionado.id_estudiante, parseInt(paraleloIdSeleccionado, 10))
      setIsAsignarModalOpen(false)
      setEstudianteSeleccionado(null)
      setParaleloIdSeleccionado('')
      loadData()
    } catch (requestError) {
      setError(getApiErrorMessage(requestError))
    } finally {
      setIsAssigning(false)
    }
  }

  const openAsignarModal = (estudiante) => {
    setEstudianteSeleccionado(estudiante)
    setParaleloIdSeleccionado('')
    setIsAsignarModalOpen(true)
  }

  const paraleloOptions = paralelos.map((p) => ({
    value: p.id_paralelo.toString(),
    label: p.nombre
  }))

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-medium text-foreground">Estudiantes</h3>
          <p className="text-sm text-muted-foreground">Gestiona los estudiantes y su asignación a paralelos.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" onClick={() => setIsImportModalOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
          <Button onClick={() => setIsCrearModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Crear estudiante
          </Button>
          <Button variant="outline" onClick={loadData} isLoading={isLoading}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {error ? (
        <p className="mb-4 rounded-md border border-error bg-error-bg px-3 py-2 text-sm text-error">
          {error}
        </p>
      ) : null}

      {isLoading ? (
        <div className="flex h-32 items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm shadow-sm transition-all duration-300">
          <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Nombres</th>
                <th className="px-4 py-3 font-medium">Apellidos</th>
                <th className="px-4 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {estudiantes.length > 0 ? (
                estudiantes.map((estudiante) => (
                  <tr key={estudiante.id_estudiante} className="hover:bg-muted/50">
                    <td className="px-4 py-3 text-foreground">{estudiante.nombres}</td>
                    <td className="px-4 py-3 text-foreground">{estudiante.apellidos}</td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-muted-foreground hover:text-primary"
                        onClick={() => openAsignarModal(estudiante)}
                      >
                        <LinkIcon className="h-4 w-4 mr-1" /> Asignar a Paralelo
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                    No se encontraron estudiantes registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {/* Modal Crear Estudiante */}
      <Modal
        isOpen={isCrearModalOpen}
        onClose={() => setIsCrearModalOpen(false)}
        title="Crear estudiante"
        confirmLabel="Guardar"
        onConfirm={handleCrearEstudiante}
        isSubmitting={isCreating}
      >
        <div className="space-y-4">
          <Input
            label="Nombres"
            placeholder="Nombres del estudiante"
            value={nuevoEstudiante.nombres}
            onChange={(e) => setNuevoEstudiante({ ...nuevoEstudiante, nombres: e.target.value })}
          />
          <Input
            label="Apellidos"
            placeholder="Apellidos del estudiante"
            value={nuevoEstudiante.apellidos}
            onChange={(e) => setNuevoEstudiante({ ...nuevoEstudiante, apellidos: e.target.value })}
          />
        </div>
      </Modal>

      {/* Modal Asignar Paralelo */}
      <Modal
        isOpen={isAsignarModalOpen}
        onClose={() => setIsAsignarModalOpen(false)}
        title="Asignar paralelo"
        confirmLabel="Asignar"
        onConfirm={handleAsignarParalelo}
        isSubmitting={isAssigning}
      >
        <div className="space-y-4">
          {estudianteSeleccionado && (
            <p className="text-sm text-foreground">
              Seleccione el paralelo para asignar al estudiante <strong>{estudianteSeleccionado.nombres} {estudianteSeleccionado.apellidos}</strong>.
            </p>
          )}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Paralelo</label>
            <SearchableSelect
              options={paraleloOptions}
              value={paraleloIdSeleccionado}
              onChange={setParaleloIdSeleccionado}
              placeholder="Buscar y seleccionar paralelo..."
            />
          </div>
        </div>
      </Modal>
      {/* Modal Importar Estudiantes */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Importar estudiantes"
        confirmLabel="Cerrar"
        onConfirm={() => setIsImportModalOpen(false)}
      >
        <div className="space-y-6 text-center">
          <p className="text-sm text-foreground">
            Seleccione el método para importar estudiantes. Puede subir un archivo Excel o escanear una lista física con la cámara. Los estudiantes se registrarán sin paralelo asignado.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 bg-card/50 p-6 rounded-xl border border-border">
            <ImportarExcelButton 
              onImportSuccess={() => {
                setIsImportModalOpen(false)
                loadData()
              }} 
            >
              <FileSpreadsheet className="h-5 w-5 mr-2" />
              Importar Excel
            </ImportarExcelButton>
            <span className="text-sm text-muted-foreground font-medium">o</span>
            <EscanearListaButton 
              onScanSuccess={() => {
                setIsImportModalOpen(false)
                loadData()
              }}
            >
              <Camera className="h-5 w-5 mr-2" />
              Escanear
            </EscanearListaButton>
          </div>
        </div>
      </Modal>

    </div>
  )
}
