import { useEffect, useState } from 'react'
import { Button, Input, Modal, Spinner } from '../../components/common'
import {
  obtenerMaterias,
  crearMateria,
  actualizarMateria,
  eliminarMateria
} from '../../services/adminService'
import { getApiData, getApiErrorMessage } from '../../services/api'

export function MateriasTab() {
  const [materias, setMaterias] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({ id_materia: null, nombre: '', descripcion: '', activo: true })
  const [formError, setFormError] = useState('')

  useEffect(() => {
    loadMaterias()
  }, [])

  const loadMaterias = async () => {
    setIsLoading(true)
    setError('')
    try {
      const response = await obtenerMaterias()
      setMaterias(getApiData(response) || [])
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  const openCreateModal = () => {
    setModalMode('create')
    setFormData({ id_materia: null, nombre: '', descripcion: '', activo: true })
    setFormError('')
    setIsModalOpen(true)
  }

  const openEditModal = (materia) => {
    setModalMode('edit')
    setFormData({ ...materia })
    setFormError('')
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    if (!formData.nombre.trim()) {
      setFormError('El nombre de la materia es requerido.')
      return
    }

    setIsSubmitting(true)
    setFormError('')

    try {
      if (modalMode === 'create') {
        await crearMateria({ nombre: formData.nombre, descripcion: formData.descripcion })
      } else {
        await actualizarMateria(formData.id_materia, { 
          nombre: formData.nombre, 
          descripcion: formData.descripcion, 
          activo: formData.activo 
        })
      }
      setIsModalOpen(false)
      loadMaterias()
    } catch (err) {
      setFormError(getApiErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de desactivar esta materia?')) return
    try {
      await eliminarMateria(id)
      loadMaterias()
    } catch (err) {
      alert(getApiErrorMessage(err))
    }
  }

  if (isLoading) return <Spinner size="lg" />

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Gestión de Materias</h3>
        <Button onClick={openCreateModal}>+ Nueva Materia</Button>
      </div>

      {error && <p className="mb-4 text-sm text-error">{error}</p>}

      <div className="overflow-hidden rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm shadow-sm transition-all duration-300">
          <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-muted-foreground">
          <thead className="bg-muted/50 text-xs uppercase text-foreground">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Descripción</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {materias.map((m) => (
              <tr key={m.id_materia} className="border-t border-border">
                <td className="px-4 py-3 font-medium text-foreground">{m.nombre}</td>
                <td className="px-4 py-3">{m.descripcion || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${m.activo ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                    {m.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => openEditModal(m)}
                    className="mr-3 font-medium text-primary hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(m.id_materia)}
                    className="font-medium text-error hover:underline"
                    disabled={!m.activo}
                  >
                    Desactivar
                  </button>
                </td>
              </tr>
            ))}
            {materias.length === 0 && (
              <tr>
                <td colSpan="4" className="px-4 py-8 text-center text-muted-foreground">
                  No hay materias registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
          </div>
        </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleSave}
        title={modalMode === 'create' ? 'Nueva Materia' : 'Editar Materia'}
        confirmLabel="Guardar"
        isSubmitting={isSubmitting}
      >
        <div className="space-y-4 pt-2">
          {formError && (
            <div className="rounded border border-error bg-error-bg p-2 text-sm text-error">
              {formError}
            </div>
          )}
          <Input
            label="Nombre de la Materia *"
            value={formData.nombre}
            onChange={(val) => setFormData({ ...formData, nombre: val })}
          />
          <Input
            label="Descripción"
            value={formData.descripcion || ''}
            onChange={(val) => setFormData({ ...formData, descripcion: val })}
          />
        </div>
      </Modal>
    </div>
  )
}
