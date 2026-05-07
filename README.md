# G1-2519: PresenTech - Sistema Inteligente de Gestión de Asistencia Docente

## Descripción
PresenTech es una aplicación web inteligente para la gestión de asistencia en instituciones educativas de Fe y Alegría Ecuador. Optimiza la toma de asistencia, reduce la carga administrativa y facilita el seguimiento académico mediante automatización, integración con IA y exportación de reportes (PDF/Excel).

## Integrantes y roles
El equipo aplica la metodología ágil Scrum adaptada a 5 sprints. Nota: Los roles de Product Owner y Scrum Master se intercambian en el Sprint 3 (S9).

| Integrante | Rol Scrum | Responsabilidad Técnica |
| :--- | :--- | :--- |
| **Stephano Zapata** | Product Owner / Scrum Master | Frontend y experiencia de usuario. Definición del Sprint Backlog. |
| **Martín Herrera** | Scrum Master / Product Owner | Backend (.NET API) y arquitectura limpia. |
| **María Paulina Estudillo** | Developer | Implementación de módulos de gestión académica, asistencia y base de datos (PostgreSQL). |
| **Katherine Maldonado** | Developer | Módulo de IA, generación QR, exportación PDF/Excel y deploy en la nube. |

## Stack técnico
* **Backend:** .NET API (Arquitectura Limpia)
* **Base de Datos:** PostgreSQL
* **Frontend:** Aplicación web responsiva
* **Inteligencia Artificial:** Integración con API de IA para semáforo de riesgo, alertas y resúmenes semanales automáticos.
* **Deploy:** Plataforma en la nube (Vercel / Railway / Render)
* **Adicionales:** Módulo de códigos QR, generación de reportes estructurados (PDF y Excel).

## Instalación y uso
1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Presentech-puce/g1-Presentech-puce-2025.git
   cd g1-Presentech-puce-2025
   ```
2. **Configuración de Variables de Entorno:**
   Revisa el archivo `.env.example` ubicado en la raíz o en los directorios correspondientes. Crea un archivo `.env` y configura las variables necesarias (conexión a BD, secreto JWT, API Key de IA).
   
3. **Ejecución del Backend (.NET):**
   ```bash
   cd src/backend
   dotnet restore
   dotnet run
   ```

4. **Ejecución del Frontend:**
   ```bash
   cd src/frontend
   npm install
   npm run dev
   ```

## URL deploy + credenciales
* **URL de Deploy:** https://presentech-d2cphbhkduh8b6h0.centralus-01.azurewebsites.net/
* **Credenciales de prueba (Docente):**
  * **Email:** `docente_prueba@feyalegria.edu.ec`
  * **Contraseña:** `Docente123!`
* **Credenciales de prueba (Administrador):**
  * **Email:** `admin_prueba@feyalegria.edu.ec`
  * **Contraseña:** `Admin123!`

*(Nota: Asegúrate de actualizar los enlaces y credenciales definitivos una vez se haya completado el deploy en producción)*