import { Save } from 'lucide-react'
import { Button, Modal } from '../../common'
import { AsistenciaItem } from '../AsistenciaItem'

export function AsistenciaForm({
  asistencias,
  isEditing,
  isSaving,
  onCancelConfirm,
  onChangeAsistencia,
  onConfirmSubmit,
  onSubmit,
  observacionesSesion,
  resumen,
  setObservacionesSesion,
  showConfirm,
}) {
  return (
    <>
      <form className="grid w-full min-w-0 gap-4" onSubmit={onSubmit}>
        <div className="min-w-0">
          <h3 className="mb-3 text-sm font-medium text-foreground">
            Estudiantes ({asistencias.length})
          </h3>
          <div className="grid min-w-0 gap-4">
            {asistencias.map((asistencia) => (
              <AsistenciaItem
                asistencia={asistencia}
                key={asistencia.id_estudiante}
                onChange={onChangeAsistencia}
              />
            ))}
          </div>
        </div>

        <section className="mt-4 w-full min-w-0 overflow-hidden rounded-xl border border-border/50 bg-card/60 p-4 shadow-sm backdrop-blur-sm transition-all duration-300">
          <p className="mb-3 text-sm font-medium text-foreground">Resumen</p>
          <div className="flex min-w-0 flex-wrap gap-4">
            <SummaryItem colorClass="bg-success" label="Presentes" value={resumen.presentes} />
            <SummaryItem colorClass="bg-destructive" label="Ausentes" value={resumen.ausentes} />
            {resumen.atrasados > 0 ? (
              <SummaryItem colorClass="bg-warning" label="Atrasados" value={resumen.atrasados} />
            ) : null}
          </div>
        </section>

        <div className="w-full min-w-0">
          <Button className="h-12 w-full" type="submit" isLoading={isSaving}>
            <Save aria-hidden="true" className="h-4 w-4" />
            {isEditing ? 'Actualizar asistencia' : 'Guardar asistencia'}
          </Button>
        </div>
      </form>

      <Modal
        confirmLabel={isEditing ? 'Actualizar' : 'Guardar'}
        isOpen={showConfirm}
        isSubmitting={isSaving}
        onClose={onCancelConfirm}
        onConfirm={onConfirmSubmit}
        title={isEditing ? 'Actualizar asistencia' : 'Guardar asistencia'}
      >
        Se registrarán {resumen.presentes} presentes y {resumen.ausentes} ausentes.
      </Modal>
    </>
  )
}

function SummaryItem({ colorClass, label, value }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <div className={`h-3 w-3 rounded-full ${colorClass}`} />
      <span className="min-w-0 text-sm text-muted-foreground">
        {label}: <span className="font-medium text-foreground">{value}</span>
      </span>
    </div>
  )
}
