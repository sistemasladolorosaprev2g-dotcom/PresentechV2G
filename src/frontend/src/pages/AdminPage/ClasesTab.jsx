import { useEffect, useState } from 'react'
import { Button, Input, Modal, Spinner, SearchableSelect } from '../../components/common'
import {
  obtenerClases,
  crearClase,
  actualizarClase,
  eliminarClase,
  obtenerProfesores,
  obtenerParalelos,
  obtenerMaterias,
  agregarHorario,
  eliminarHorario,
} from '../../services/adminService'
import { getApiData, getApiErrorMessage } from '../../services/api'

export function ClasesTab() {
  const [clases, setClases] = useState([])
  const [profesores, setProfesores] = useState([])
  const [paralelos, setParalelos] = useState([])
  const [materias, setMaterias] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // Modal State para Clase
  const [isClaseModalOpen, setIsClaseModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    id_clase: null,
    id_profesor: '',
    id_paralelo: '',
    id_materia: '',
    observaciones: '',
  })
  const [formError, setFormError] = useState('')

  // Modal State para Horarios
  const [isHorarioModalOpen, setIsHorarioModalOpen] = useState(false)
  const [claseSeleccionada, setClaseSeleccionada] = useState(null)
  const [horarioData, setHorarioData] = useState({
    id_dia: '1',
    hora_inicio: '07:00',
    hora_fin: '09:00',
  })

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    setIsLoading(true)
    setError('')
    try {
      const [resClases, resProf, resParalelos, resMaterias] = await Promise.all([
        obtenerClases(),
        obtenerProfesores(),
        obtenerParalelos(),
        obtenerMaterias(),
      ])
      setClases(getApiData(resClases) || [])
      setProfesores((getApiData(resProf) || []).filter(p => p.activo))
      setParalelos((getApiData(resParalelos) || []).filter(p => p.activo))
      setMaterias((getApiData(resMaterias) || []).filter(m => m.activo))
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  // --- CLASES CRUD ---
  const openCreateModal = () => {
    setModalMode('create')
    setFormData({
      id_clase: null,
      id_profesor: profesores[0]?.id_profesor?.toString() || '',
      id_paralelo: paralelos[0]?.id_paralelo?.toString() || '',
      id_materia: materias[0]?.id_materia?.toString() || '',
      observaciones: '',
    })
    setFormError('')
    setIsClaseModalOpen(true)
  }

  const openEditModal = (clase) => {
    setModalMode('edit')
    setFormData({
      id_clase: clase.id_clase,
      id_profesor: clase.id_profesor.toString(),
      id_paralelo: clase.id_paralelo.toString(),
      id_materia: clase.id_materia?.toString() || '',
      observaciones: clase.observaciones || '',
    })
    setFormError('')
    setIsClaseModalOpen(true)
  }

  const handleSaveClase = async () => {
    if (!formData.id_profesor || !formData.id_paralelo || !formData.id_materia) {
      setFormError('Profesor, Paralelo y Materia son obligatorios.')
      return
    }

    setIsSubmitting(true)
    setFormError('')

    try {
      const payload = {
        id_profesor: Number(formData.id_profesor),
        id_paralelo: Number(formData.id_paralelo),
        id_materia: Number(formData.id_materia),
        observaciones: formData.observaciones,
      }

      if (modalMode === 'create') {
        await crearClase(payload)
      } else {
        await actualizarClase(formData.id_clase, payload)
      }
      setIsClaseModalOpen(false)
      loadAllData()
    } catch (err) {
      setFormError(getApiErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteClase = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta clase?')) return
    try {
      await eliminarClase(id)
      loadAllData()
    } catch (err) {
      alert(getApiErrorMessage(err))
    }
  }

  // --- HORARIOS CRUD ---
  const openHorariosModal = (clase) => {
    setClaseSeleccionada(clase)
    setHorarioData({ id_dia: '1', hora_inicio: '07:00', hora_fin: '09:00' })
    setFormError('')
    setIsHorarioModalOpen(true)
  }

  const handleAddHorario = async () => {
    setIsSubmitting(true)
    setFormError('')
    try {
      await agregarHorario(claseSeleccionada.id_clase, {
        id_dia: Number(horarioData.id_dia),
        hora_inicio: horarioData.hora_inicio,
        hora_fin: horarioData.hora_fin,
      })
      await loadAllData()
      // Actualizar la clase seleccionada para mostrar los nuevos horarios en el modal
      setClaseSeleccionada(prev => {
        const updated = (getApiData(clases) || []).find(c => c.id_clase === prev.id_clase)
        return updated || prev
      })
      setIsHorarioModalOpen(false)
    } catch (err) {
      setFormError(getApiErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteHorario = async (idClase, idHorario) => {
    try {
      await eliminarHorario(idClase, idHorario)
      await loadAllData()
      setIsHorarioModalOpen(false)
    } catch (err) {
      alert(getApiErrorMessage(err))
    }
  }

  if (isLoading) return <Spinner size="lg" />

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Clases y Horarios</h3>
        <Button onClick={openCreateModal}>+ Nueva Clase</Button>
      </div>

      {error && <p className="mb-4 text-sm text-error">{error}</p>}

      <div className="overflow-hidden rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm shadow-sm transition-all duration-300">
          <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-muted-foreground">
          <thead className="bg-muted/50 text-xs uppercase text-foreground">
            <tr>
              <th className="px-4 py-3">Materia</th>
              <th className="px-4 py-3">Profesor</th>
              <th className="px-4 py-3">Paralelo</th>
              <th className="px-4 py-3">Horarios</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clases.map((clase) => (
              <tr key={clase.id_clase} className="border-t border-border">
                <td className="px-4 py-3 font-medium text-foreground">{clase.nombre_materia}</td>
                <td className="px-4 py-3">{clase.nombre_profesor}</td>
                <td className="px-4 py-3">{clase.nombre_paralelo}</td>
                <td className="px-4 py-3 text-xs">
                  {clase.horarios?.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {clase.horarios.map(h => (
                        <span key={h.id_horario} className="bg-muted px-2 py-0.5 rounded text-foreground inline-block w-max">
                          {h.nombre_dia} ({h.hora_inicio} - {h.hora_fin})
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground italic">Sin horarios</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => openHorariosModal(clase)}
                    className="mr-3 font-medium text-secondary-dark hover:underline"
                  >
                    Horarios
                  </button>
                  <button
                    onClick={() => openEditModal(clase)}
                    className="mr-3 font-medium text-primary hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteClase(clase.id_clase)}
                    className="font-medium text-error hover:underline"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {clases.length === 0 && (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-muted-foreground">
                  No hay clases registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
          </div>
        </div>

      {/* Modal Clase */}
      <Modal
        isOpen={isClaseModalOpen}
        onClose={() => setIsClaseModalOpen(false)}
        onConfirm={handleSaveClase}
        title={modalMode === 'create' ? 'Nueva Clase' : 'Editar Clase'}
        confirmLabel="Guardar"
        isSubmitting={isSubmitting}
      >
        <div className="space-y-4 pt-2">
          {formError && (
            <div className="rounded border border-error bg-error-bg p-2 text-sm text-error">
              {formError}
            </div>
          )}
          <SearchableSelect
            label="Materia *"
            value={formData.id_materia}
            onChange={(val) => setFormData({ ...formData, id_materia: val })}
            placeholder="Seleccione una materia"
            options={materias.map(m => ({ value: m.id_materia.toString(), label: m.nombre }))}
          />
          <SearchableSelect
            label="Profesor *"
            value={formData.id_profesor}
            onChange={(val) => setFormData({ ...formData, id_profesor: val })}
            placeholder="Seleccione un profesor"
            options={profesores.map(p => ({ value: p.id_profesor.toString(), label: `${p.nombres} ${p.apellidos}` }))}
          />
          <SearchableSelect
            label="Paralelo *"
            value={formData.id_paralelo}
            onChange={(val) => setFormData({ ...formData, id_paralelo: val })}
            placeholder="Seleccione un paralelo"
            options={paralelos.map(p => ({ value: p.id_paralelo.toString(), label: p.nombre }))}
          />
          <Input
            label="Observaciones"
            value={formData.observaciones}
            onChange={(val) => setFormData({ ...formData, observaciones: val })}
          />
        </div>
      </Modal>

      {/* Modal Horarios */}
      <Modal
        isOpen={isHorarioModalOpen}
        onClose={() => setIsHorarioModalOpen(false)}
        onConfirm={handleAddHorario}
        title={`Horarios: ${claseSeleccionada?.nombre_materia || ''}`}
        confirmLabel="Añadir Franja"
        isSubmitting={isSubmitting}
      >
        <div className="space-y-4 pt-2">
          {formError && (
            <div className="rounded border border-error bg-error-bg p-2 text-sm text-error">
              {formError}
            </div>
          )}

          {/* Listar horarios actuales */}
          {claseSeleccionada?.horarios?.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-semibold mb-2">Franjas actuales:</p>
              <ul className="space-y-2">
                {claseSeleccionada.horarios.map(h => (
                  <li key={h.id_horario} className="flex justify-between items-center bg-muted p-2 rounded text-sm">
                    <span>{h.nombre_dia} ({h.hora_inicio} - {h.hora_fin})</span>
                    <button 
                      onClick={() => handleDeleteHorario(claseSeleccionada.id_clase, h.id_horario)}
                      className="text-error hover:underline text-xs"
                    >
                      Quitar
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="border-t pt-4 space-y-3">
            <p className="text-sm font-semibold">Añadir nueva franja</p>
            <SearchableSelect
              label="Día de la semana"
              value={horarioData.id_dia}
              onChange={(val) => setHorarioData({ ...horarioData, id_dia: val })}
              placeholder="Seleccione un día"
              options={[
                { value: "1", label: "Lunes" },
                { value: "2", label: "Martes" },
                { value: "3", label: "Miércoles" },
                { value: "4", label: "Jueves" },
                { value: "5", label: "Viernes" },
                { value: "6", label: "Sábado" },
                { value: "7", label: "Domingo" },
              ]}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Hora Inicio"
                type="time"
                value={horarioData.hora_inicio}
                onChange={(val) => setHorarioData({ ...horarioData, hora_inicio: val })}
              />
              <Input
                label="Hora Fin"
                type="time"
                value={horarioData.hora_fin}
                onChange={(val) => setHorarioData({ ...horarioData, hora_fin: val })}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
