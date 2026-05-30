import { useEffect, useState } from 'react'
import { Button, Input, Modal, Spinner } from '../../components/common'
import {
  obtenerProfesores,
  crearProfesor,
  actualizarProfesor,
  eliminarProfesor,
} from '../../services/adminService'
import { getApiData, getApiErrorMessage } from '../../services/api'

export function ProfesoresTab() {
  const [profesores, setProfesores] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create') // 'create' or 'edit'
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    id_profesor: null,
    nombres: '',
    apellidos: '',
    correo_institucional: '',
    contrasena: '',
    telefono: '',
    especialidad: '',
  })
  const [formError, setFormError] = useState('')

  useEffect(() => {
    loadProfesores()
  }, [])

  const loadProfesores = async () => {
    setIsLoading(true)
    setError('')
    try {
      const res = await obtenerProfesores()
      setProfesores(getApiData(res) || [])
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  const openCreateModal = () => {
    setModalMode('create')
    setFormData({
      id_profesor: null,
      nombres: '',
      apellidos: '',
      correo_institucional: '',
      contrasena: '',
      telefono: '',
      especialidad: '',
    })
    setFormError('')
    setIsModalOpen(true)
  }

  const openEditModal = (prof) => {
    setModalMode('edit')
    setFormData({
      id_profesor: prof.id_profesor,
      nombres: prof.nombres,
      apellidos: prof.apellidos,
      correo_institucional: prof.correo_institucional,
      contrasena: '', // en edit, nueva_contrasena es opcional
      telefono: prof.telefono || '',
      especialidad: prof.especialidad || '',
    })
    setFormError('')
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    if (!formData.nombres || !formData.apellidos || !formData.correo_institucional) {
      setFormError('Nombres, apellidos y correo son obligatorios.')
      return
    }

    if (modalMode === 'create' && !formData.contrasena) {
      setFormError('La contraseña es obligatoria para nuevos profesores.')
      return
    }

    setIsSubmitting(true)
    setFormError('')

    try {
      if (modalMode === 'create') {
        await crearProfesor({
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          correo_institucional: formData.correo_institucional,
          contrasena: formData.contrasena,
          telefono: formData.telefono,
          especialidad: formData.especialidad,
        })
      } else {
        await actualizarProfesor(formData.id_profesor, {
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          correo_institucional: formData.correo_institucional,
          nueva_contrasena: formData.contrasena, // si está vacía, no se actualiza
          telefono: formData.telefono,
          especialidad: formData.especialidad,
        })
      }
      setIsModalOpen(false)
      loadProfesores()
    } catch (err) {
      setFormError(getApiErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de desactivar este profesor?')) return
    try {
      await eliminarProfesor(id)
      loadProfesores()
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
        <h3 className="text-lg font-semibold text-foreground">Profesores</h3>
        <Button onClick={openCreateModal}>+ Nuevo Profesor</Button>
      </div>

      {error && <p className="mb-4 text-sm text-error">{error}</p>}

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-sm text-muted-foreground">
          <thead className="bg-muted/50 text-xs uppercase text-foreground">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Correo</th>
              <th className="px-4 py-3">Especialidad</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {profesores.map((prof) => (
              <tr key={prof.id_profesor} className="border-t border-border">
                <td className="px-4 py-3 font-medium text-foreground">
                  {prof.apellidos} {prof.nombres}
                </td>
                <td className="px-4 py-3">{prof.correo_institucional}</td>
                <td className="px-4 py-3">{prof.especialidad || '—'}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      prof.activo
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {prof.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => openEditModal(prof)}
                    className="mr-3 font-medium text-primary hover:underline"
                  >
                    Editar
                  </button>
                  {prof.activo && (
                    <button
                      onClick={() => handleDelete(prof.id_profesor)}
                      className="font-medium text-error hover:underline"
                    >
                      Desactivar
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {profesores.length === 0 && (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-muted-foreground">
                  No hay profesores registrados.
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
        title={modalMode === 'create' ? 'Nuevo Profesor' : 'Editar Profesor'}
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
            label="Nombres *"
            value={formData.nombres}
            onChange={(val) => setFormData({ ...formData, nombres: val })}
          />
          <Input
            label="Apellidos *"
            value={formData.apellidos}
            onChange={(val) => setFormData({ ...formData, apellidos: val })}
          />
          <Input
            label="Correo Institucional *"
            type="email"
            value={formData.correo_institucional}
            onChange={(val) => setFormData({ ...formData, correo_institucional: val })}
          />
          <Input
            label={modalMode === 'create' ? 'Contraseña *' : 'Nueva Contraseña (opcional)'}
            type="password"
            value={formData.contrasena}
            onChange={(val) => setFormData({ ...formData, contrasena: val })}
          />
          <Input
            label="Teléfono"
            value={formData.telefono}
            onChange={(val) => setFormData({ ...formData, telefono: val })}
          />
          <Input
            label="Especialidad"
            value={formData.especialidad}
            onChange={(val) => setFormData({ ...formData, especialidad: val })}
          />
        </div>
      </Modal>
    </div>
  )
}
