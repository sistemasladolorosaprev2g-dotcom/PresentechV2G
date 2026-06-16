import { Check, Minus, X } from 'lucide-react'
import { Badge, Input } from '../../common'

function getStatus(asistencia) {
  if (asistencia.atrasado) return 'atrasado'
  return asistencia.asistio ? 'presente' : 'ausente'
}

export function AsistenciaItem({ asistencia, onChange }) {
  const status = getStatus(asistencia)

  const updateStatus = (nextStatus) => {
    onChange({
      ...asistencia,
      asistio: nextStatus !== 'ausente',
      atrasado: nextStatus === 'atrasado',
      justificativo: nextStatus !== 'presente' ? asistencia.justificativo : null,
    })
  }

  return (
    <article className="w-full overflow-hidden rounded-xl border border-border/50 bg-card/60 p-4 shadow-sm backdrop-blur-sm transition-all duration-300">
      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-wrap items-start gap-2">
            <h3 className="min-w-0 flex-1 break-words text-sm font-medium leading-snug text-foreground sm:text-base">
              {asistencia.nombres_estudiante} {asistencia.apellidos_estudiante}
            </h3>
            <Badge status={status} />
          </div>
        </div>

        <div className="grid w-full grid-cols-3 gap-3 sm:w-auto sm:flex sm:shrink-0 sm:items-center sm:gap-4">
          <button
            type="button"
            title="Presente"
            className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 ${
              status === 'presente'
                ? 'bg-success text-white shadow-md ring-2 ring-success ring-offset-2 ring-offset-background scale-110'
                : 'bg-card border border-border text-muted-foreground hover:bg-success/10 hover:text-success'
            }`}
            onClick={() => updateStatus('presente')}
          >
            <Check className="h-6 w-6" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            title="Ausente"
            className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 ${
              status === 'ausente'
                ? 'bg-destructive text-white shadow-md ring-2 ring-destructive ring-offset-2 ring-offset-background scale-110'
                : 'bg-card border border-border text-muted-foreground hover:bg-destructive/10 hover:text-destructive'
            }`}
            onClick={() => updateStatus('ausente')}
          >
            <X className="h-6 w-6" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            title="Atrasado"
            className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 ${
              status === 'atrasado'
                ? 'bg-warning text-white shadow-md ring-2 ring-warning ring-offset-2 ring-offset-background scale-110'
                : 'bg-card border border-border text-muted-foreground hover:bg-warning/10 hover:text-warning'
            }`}
            onClick={() => updateStatus('atrasado')}
          >
            <Minus className="h-6 w-6" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {status !== 'presente' ? (
        <div className="mt-6 animate-slide-up space-y-4 rounded-md border border-border bg-card/50 p-4">
          <Input
            label="Justificativo"
            placeholder={
              status === 'atrasado'
                ? 'Ingrese el motivo del atraso...'
                : 'Ingrese el motivo de la falta...'
            }
            value={asistencia.justificativo ?? ''}
            onChange={(value) =>
              onChange({
                ...asistencia,
                justificativo: value,
              })
            }
          />
          <label className="block text-left text-sm font-medium text-foreground">
            Observaciones
            <textarea
              className="mt-2 min-h-20 w-full resize-y rounded-md border border-input-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="Observaciones adicionales..."
              value={asistencia.observaciones ?? ''}
              onChange={(event) =>
                onChange({
                  ...asistencia,
                  observaciones: event.target.value || null,
                })
              }
            />
          </label>
        </div>
      ) : null}
    </article>
  )
}
