# Contexto de Frontend: SusoRewards

## Arquitectura y Principios de Diseño
- **Clean Architecture en Frontend**: Mantener una separación clara entre la UI (componentes visuales), el estado de la aplicación (stores/casos de uso) y los adaptadores de infraestructura (servicios HTTP, SSE).
- **Alta Cohesión y Bajo Acoplamiento**: Los componentes de UI, módulos y páginas deben estar fuertemente cohesionados (cada archivo/componente tiene una sola responsabilidad) y débilmente acoplados entre sí. Evitar lógica duplicada o cruce directo de responsabilidades entre vistas.

## Stack Tecnológico
- **Framework**: Svelte / SvelteKit (o Vite + Svelte puro).
- **Estilos**: CSS modular o TailwindCSS. Enfocado en diseño moderno, rápido y amigable.

## Flujos Críticos de Datos (Seguridad de Sesión)
> [!IMPORTANT]
> **Registro de Cenas/Ventas en el Restaurante:**
> Al registrar el consumo de un cliente en la sección **Sale** del Restaurante, el frontend debe enviar al backend los siguientes datos:
> 1. **Monto consumido** (ingresado por el restaurante).
> 2. **Número de tarjeta del cliente** (ingresado por el restaurante).
> 3. **Código del restaurante afiliado** (NO ingresado por el usuario).
> 4. **Fecha y hora de la transacción** (generado automáticamente).
> 
> *Nota de Seguridad:* El **Código del restaurante afiliado** debe obtenerse de los datos de la sesión activa del usuario autenticado. El frontend debe gestionar este dato internamente y de forma 100% segura para enviarlo en la petición sin requerir intervención del usuario o exposición en inputs editables.

## Calidad y Pruebas Automatizadas
> [!IMPORTANT]
> **Obligatoriedad de Pruebas en Frontend:**
> El proyecto de frontend debe estructurar pruebas unitarias e integración de componentes (utilizando herramientas como Vitest o Testing Library para Svelte).
> Es obligatorio alcanzar y mantener una **cobertura mínima de pruebas del 85%**. Las métricas de cobertura de frontend se reportarán a SonarQube de forma aislada a través del proyecto `susorewards-frontend`.

## Rutas y Flujos Principales
1. **SaaS Page (Landing `/`)**: Promoción del SaaS. Barra de navegación hacia pagos o afiliación (`/afiliate`).
2. **Registro de Empresa (`/afiliate`)**: Formulario para registrar la empresa luego de la suscripción.
3. **Login (`/login`)**: Ingreso universal para Empresas, Restaurantes y Clientes. Redirección basada en el rol. Cambio de contraseña temporal.
4. **Dashboard de Restaurante**: 
   - Vista de programas disponibles.
   - Métricas de ventas/beneficios.
   - Formulario para registrar venta/cena del cliente (con animaciones de carga y manejo de errores).
5. **Dashboard de Empresa**:
   - Métricas globales de clientes, consumos y beneficios.
   - Gráficos de barras y de pie sobre el uso de programas.
   - Gestión de **Programas** (CRUD), **Afiliaciones** de restaurantes, y **Clientes**.
6. **Dashboard de Cliente**:
   - Métricas personales (puntos, cashback acumulado).
   - Bandeja de **Notificaciones** actualizada en tiempo real mediante SSE (Server-Sent Events).

## Reglas de Desarrollo
- Cobertura de pruebas unitarias de componentes.
- Integración de configuración de SonarQube independiente para el Frontend con la key `susorewards-frontend`.
