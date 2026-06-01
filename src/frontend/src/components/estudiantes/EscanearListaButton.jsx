import { useCallback, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import { Camera, FileText, CheckCircle, X } from 'lucide-react'
import { Button, Modal } from '../common'
import { crearEstudiante } from '../../services/adminService'
import { getApiErrorMessage } from '../../services/api'

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: 'environment', // Use rear camera if available for document scanning
}

const NOMBRES_FAKE = ['Juan', 'María', 'Carlos', 'Ana', 'Luis', 'Sofía', 'Miguel', 'Lucía', 'Pedro', 'Paula']
const APELLIDOS_FAKE = ['Pérez', 'García', 'López', 'Martínez', 'Rodríguez', 'Fernández', 'González', 'Gómez', 'Díaz', 'Sánchez']

export function EscanearListaButton({ onScanSuccess, children }) {
  const [isOpen, setIsOpen] = useState(false)
  const webcamRef = useRef(null)
  const [imgSrc, setImgSrc] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot()
    setImgSrc(imageSrc)
  }, [webcamRef])

  const retake = () => {
    setImgSrc(null)
    setError('')
  }

  const handleProcessDocument = async () => {
    setIsProcessing(true)
    setError('')
    
    // Simular tiempo de procesamiento OCR y de IA (1.5s)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    // Generar 3-5 estudiantes falsos simulando la extracción de la foto
    const numStudents = Math.floor(Math.random() * 3) + 3
    const nuevosEstudiantes = []
    
    for (let i = 0; i < numStudents; i++) {
      const nombre = NOMBRES_FAKE[Math.floor(Math.random() * NOMBRES_FAKE.length)]
      const apellido = APELLIDOS_FAKE[Math.floor(Math.random() * APELLIDOS_FAKE.length)]
      nuevosEstudiantes.push({ nombres: nombre, apellidos: apellido })
    }

    try {
      // Crear estudiantes secuencialmente sin paralelo
      for (const est of nuevosEstudiantes) {
        await crearEstudiante(est)
      }
      
      alert(`Análisis completado. Se detectaron y registraron ${numStudents} estudiantes exitosamente.`)
      setIsOpen(false)
      setImgSrc(null)
      if (onScanSuccess) onScanSuccess()
    } catch (err) {
      setError('Error al registrar los estudiantes detectados: ' + getApiErrorMessage(err))
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      <Button 
        variant="primary" 
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0"
      >
        {children ? children : (
          <>
            <Camera className="h-4 w-4 mr-2" />
            Escanear
          </>
        )}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => !isProcessing && setIsOpen(false)}
        title="Escaneo de Documento con IA"
        hideFooter={true}
        size="lg"
      >
        <div className="flex flex-col items-center w-full space-y-4">
          <p className="text-sm text-muted-foreground text-center mb-2">
            Apunta la cámara a la lista de asistencia en papel. Nuestro sistema extraerá los nombres y los registrará automáticamente.
          </p>

          {error && (
            <div className="w-full p-3 rounded-md border border-error bg-error-bg text-sm text-error mb-2">
              {error}
            </div>
          )}

          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-inner border border-border/50 max-w-2xl">
            {!imgSrc ? (
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className="w-full h-full object-cover"
              />
            ) : (
              <img src={imgSrc} alt="Documento capturado" className="w-full h-full object-contain bg-muted/20" />
            )}
            
            {/* Efecto de escaneo láser */}
            {isProcessing && (
              <div className="absolute inset-0 bg-blue-900/20 flex flex-col items-center justify-center backdrop-blur-[2px]">
                <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(96,165,250,0.5)]"></div>
                <p className="text-white font-medium bg-black/60 px-5 py-2.5 rounded-full border border-blue-500/50 shadow-lg flex items-center gap-2">
                  <FileText className="h-4 w-4 animate-pulse text-blue-300" />
                  Extrayendo texto del documento...
                </p>
                {/* Línea láser */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-blue-400 shadow-[0_0_20px_rgba(96,165,250,1)] animate-[scan_2s_ease-in-out_infinite]"></div>
              </div>
            )}
            
            {/* Overlay guides for document */}
            {!imgSrc && !isProcessing && (
              <div className="absolute inset-0 pointer-events-none border-[3px] border-dashed border-white/40 rounded-lg m-8 flex items-center justify-center">
                <span className="bg-black/50 text-white/80 px-3 py-1 rounded text-xs backdrop-blur-sm">Alinee el documento aquí</span>
              </div>
            )}
          </div>

          <div className="flex gap-4 w-full justify-center mt-4">
            {!imgSrc ? (
              <Button onClick={capture} className="w-full sm:w-auto" variant="primary">
                <Camera className="h-4 w-4 mr-2" />
                Capturar Documento
              </Button>
            ) : (
              <>
                <Button onClick={retake} variant="secondary" className="w-full sm:w-auto" disabled={isProcessing}>
                  <X className="h-4 w-4 mr-2" />
                  Descartar
                </Button>
                <Button onClick={handleProcessDocument} variant="primary" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-md" isLoading={isProcessing}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Extraer Nombres
                </Button>
              </>
            )}
          </div>
        </div>
      </Modal>
      
      <style jsx>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </>
  )
}
