namespace Presentech.Business.DTOs.Ocr
{
    public class OcrEstudiantesResponse
    {
        public IReadOnlyList<EstudianteOcrDto> estudiantes { get; set; } = new List<EstudianteOcrDto>();
        public string texto_detectado { get; set; } = string.Empty;
        public IReadOnlyList<string> advertencias { get; set; } = new List<string>();
    }
}
