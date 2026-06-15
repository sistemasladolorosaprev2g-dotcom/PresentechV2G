import { createPortal } from 'react-dom'
import { Download, Printer, X } from 'lucide-react'
import { Button } from '../common'

export function ReportPreviewModal({
  fileName,
  isOpen,
  onClose,
  onDownload,
  pdfUrl,
}) {
  if (!isOpen) return null

  const handlePrint = () => {
    const frame = document.getElementById('report-pdf-preview')
    frame?.contentWindow?.focus()
    frame?.contentWindow?.print()
  }

  return createPortal(
    <div className="fixed inset-0 z-[70] flex flex-col bg-foreground/45 p-3 backdrop-blur-sm sm:p-6">
      <section className="mx-auto flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div>
            <h2 className="font-semibold text-foreground">Vista previa del reporte</h2>
            <p className="max-w-xl truncate text-xs text-muted-foreground">{fileName}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={onDownload}>
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Exportar PDF</span>
            </Button>
            <Button onClick={handlePrint}>
              <Printer className="h-4 w-4" />
              Imprimir
            </Button>
            <Button
              aria-label="Cerrar vista previa"
              className="w-10 px-0"
              variant="ghost"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </header>
        <iframe
          id="report-pdf-preview"
          className="min-h-0 flex-1 bg-muted"
          src={pdfUrl}
          title="Vista previa del reporte de asistencia"
        />
      </section>
    </div>,
    document.body,
  )
}
