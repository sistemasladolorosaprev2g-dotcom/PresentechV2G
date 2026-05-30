import { useEffect, useState } from 'react'
import { Button, Input, Modal, Spinner } from '../../components/common'
import {
  obtenerParalelos,
  crearParalelo,
  actualizarParalelo,
  eliminarParalelo,
} from '../../services/adminService'
import { getApiData, getApiErrorMessage } from '../../services/api'

export function ParalelosTab() {
  const [paralelos, setParalelos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    id_paralelo: null,
    nombre: '',
    descripcion: '',
    capacidad_maxima: 30,
  })
  const [formError, setFormError] = useState('')

  useEffect(() => {
    loadParalelos()
  }, [])

  const loadParalelos = async () => {
    setIsLoading(true)
    setError('')
    try {
      const res = await obtenerParalelos()
      setParalelos(getApiData(res) || [])
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  const openCreateModal = () => {
    setModalMode('create')
    setFormData({
      id_paralelo: null,
      nombre: '',
      descripcion: '',
      capacidad_maxima: 30,
    })
    setFormError('')
    setIsModalOpen(true)
  }

  const openEditModal = (paralelo) => {
    setModalMode('edit')
    setFormData({
      id_paralelo: paralelo.id_paralelo,
      nombre: paralelo.nombre,
      descripcion: paralelo.descripcion || '',
      capacidad_maxima: paralelo.capacidad_maxima,
    })
    setFormError('')
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    if (!formData.nombre || !formData.capacidad_maxima) {
      setFormError('El nombre y la capacidad máxima son obligatorios.')
      return
    }

    setIsSubmitting(true)
    setFormError('')

    try {
      if (modalMode === 'create') {
        await crearParalelo({
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          capacidad_maxima: Number(formData.capacidad_maxima),
        })
      } else {
        await actualizarParalelo(formData.id_paralelo, {
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          capacidad_maxima: Number(formData.capacidad_maxima),
        })
      }
      setIsModalOpen(false)
      loadParalelos()
    } catch (err) {
      setFormError(getApiErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de desactivar este paralelo?')) return
    try {
      await eliminarParalelo(id)
      loadParalelos()
    } catch (err) {
      alert(getApiErrorMessage(err))
    }
  }

  if (isLoading) {
    return <Spinner size="lg" />
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Paralelos</h3>
        <Button onClick={openCreateModal}>+ Nuevo Paralelo</Button>
      </div>

      {error && <p className="mb-4 text-sm text-error">{error}</p>}

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-sm text-muted-foreground">
          <thead className="bg-muted/50 text-xs uppercase text-foreground">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Descripción</th>
              <th className="px-4 py-3">Capacidad</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paralelos.map((p) => (
              <tr key={p.id_paralelo} className="border-t border-border">
                <td className="px-4 py-3 font-medium text-foreground">{p.nombre}</td>
                <td className="px-4 py-3">{p.descripcion || '—'}</td>
                <td className="px-4 py-3">{p.capacidad_maxima}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => openEditModal(p)}
                    className="mr-3 font-medium text-primary hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(p.id_paralelo)}
                    className="font-medium text-error hover:underline"
                  >
                    Desactivar
                  </button>
                </td>
              </tr>
            ))}
            {paralelos.length === 0 && (
              <tr>
                <td colSpan="4" className="px-4 py-8 text-center text-muted-foreground">
                  No hay paralelos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleSave}
        title={modalMode === 'create' ? 'Nuevo Paralelo' : 'Editar Paralelo'}
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
            label="Nombre *"
            value={formData.nombre}
            onChange={(val) => setFormData({ ...formData, nombre: val })}
          />
          <Input
            label="Descripción"
            value={formData.descripcion}
            onChange={(val) => setFormData({ ...formData, descripcion: val })}
          />
          <Input
            label="Capacidad Máxima *"
            type="number"
            min="1"
            value={formData.capacidad_maxima.toString()}
            onChange={(val) => setFormData({ ...formData, capacidad_maxima: val })}
          />
        </div>
      </Modal>
    </div>
  )
}
