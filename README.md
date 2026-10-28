# Conectar Laboulaye - Frontend Web

Interfaz web para la plataforma municipal Conectar Laboulaye. Permite a los vecinos reportar problemas en la vía pública y consultar alertas de la ciudad, mientras que brinda al personal municipal un panel de administración para gestionar reclamos, emitir alertas y configurar parámetros del sistema.

Este repositorio corresponde al Trabajo Final Integrador del 2° Semestre de la carrera de Desarrollo de Software.

## Qué hace el sistema
- *Módulo Vecino:* Registro e inicio de sesión, reporte de problemas con selección de ubicación en mapa interactivo (Leaflet), seguimiento de estado de mis reportes y consulta de alertas públicas.
- *Panel Municipio:* Visualización de métricas de gestión, listado y cambio de estado de reclamos, emisión y cierre de alertas municipales, directorio de usuarios y gestión de zonas y categorías.
- Soporte para modo oscuro / claro y adaptabilidad a dispositivos móviles.

## Tecnologías utilizadas
- React 19
- Vite
- Redux Toolkit
- React Router 7
- Axios
- Leaflet / React-Leaflet
- Sass / CSS Variables

## Variables de entorno
Crear un archivo .env en la raíz del proyecto con el siguiente contenido:

VITE_API_BASE_URL=http://localhost:8080/api

Para producción, reemplazar el valor de VITE_API_BASE_URL por la URL pública del backend desplegado.

## Cómo correr el proyecto en local

1. Clonar el repositorio:
   git clone https://github.com/lucioreinaudi/ProyectoFinalIntegrador2doSemestre_Front.git
   cd ProyectoFinalIntegrador2doSemestre_Front

2. Instalar las dependencias del proyecto:
   npm install

3. Iniciar el servidor de desarrollo:
   npm run dev

La aplicación estará disponible localmente en http://localhost:5173.

## Links de deploy
- Aplicación Web en vivo (Vercel): https://conectar-laboulaye.vercel.app/

## Usuarios de prueba para navegación

### Para probar el Panel Administrativo (Municipio)
- Email: municipio@laboulaye.gob.ar
- Contraseña: (credencial asignada al ambiente)

### Para probar el Módulo Vecino
- Email: vecino.demo@email.com
- Contraseña: (credencial elegida en el registro o demo)
- Se puede utilizar también la opción de registro dentro de la propia aplicación para crear una cuenta de vecino nueva.

## Pruebas de punta a punta (Playwright)

Las pruebas están en `tests/` y prueban la app en un navegador real (Chromium).

### Preparación (una sola vez)

```bash
npm install
npx playwright install chromium
```

### Antes de correrlas

1. **El back tiene que estar corriendo** en local (`http://localhost:8080`).
2. El front **no hace falta levantarlo**: Playwright ejecuta `npm run dev` solo, o reutiliza el que ya tengas abierto en `http://localhost:5173`.
3. Para la prueba de login correcto, definí un usuario que exista en la base:

```powershell
# Windows (PowerShell), vale para esa terminal
$env:TEST_EMAIL="vecino@ejemplo.com"
$env:TEST_PASS="SuContraseña"
```

```bash
# Linux / macOS
export TEST_EMAIL="vecino@ejemplo.com"
export TEST_PASS="SuContraseña"
```

Si no están definidas, esa prueba se **saltea** (aparece como *skipped*) y el resto corre igual. No subas credenciales reales al repositorio.

### Comandos

| Comando | Para qué |
|---|---|
| `npx playwright test` | Corre todas las pruebas sin abrir ventana |
| `npx playwright test --headed` | Igual, pero se ve el navegador |
| `npx playwright test --ui` | Modo interactivo, para ir paso a paso |
| `npx playwright show-report` | Abre el reporte HTML de la última corrida |

### Qué se prueba

| Archivo | Prueba | Resultado esperado |
|---|---|---|
| `home.spec.js` | El Home carga sin sesión | Se ve el título "Conectar Laboulaye" y el enlace "Ingresar" |
| `auth.spec.js` | Ruta protegida sin sesión | Entrar a `/mis-reportes` redirige a `/login` |
| `auth.spec.js` | Login correcto | Después de ingresar vuelve a `/mis-reportes` y se ve "Mis reportes" |
| `auth.spec.js` | Contraseña incorrecta | Se muestra "Email o contraseña incorrectos" |

## Casos probados manualmente

La tabla de casos probados a mano (front y API) está en el repositorio del back: [docs/casos-probados-manualmente.md](https://github.com/lucioreinaudi/ProyectoFinalIntegrador2doSemestre_Back/blob/develop/docs/casos-probados-manualmente.md).

