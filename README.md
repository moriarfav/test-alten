# Preparacion del proyecto

Uso de Formateadores de codigo: Antes de comenzar a trabajar se formatearon todos los archivos con prettier, ya que uso formateador de codigo y para visualizar los cambios que se realizan deberian estar todos los archivos con el mismo formato. Esta decision se deberia tomar al inicio del proyecto y trasladar al resto del equipo para poder revisar de forma clara los cambios que se realizan.

Repositorio: Dependiendo del tamaño del equipo y del proyecto tambien se debe definir de forma clara la estructura de de ramas, su borrado cuando no sean necesarias y las reglas para las subidas a la rama principal, mediante pull request.

## 1. Análisis y Refactorización

### Cambios Realizados:

- Se adoptó una arquitectura **MVVM (Model-View-ViewModel)** para separar las responsabilidades y mejorar la mantenibilidad del código.
- Se dividieron las capas de la aplicación en:
  - **Modelos**: Representan los datos de la aplicación (models).
  - **Servicios**: Manejan la lógica de negocio y la comunicación con las APIs (services).
  - **Vistas**: Componentes que se encargan de la interfaz de usuario, (features).

Carpetas adicionales:

- **Interceptors**: Se agrega una carpeta de interceptores
- **Shared**: Se agrega una carpeta para utilidades y pequeños componentes, que sean reutilizables en toda la aplicacion.
- **Mocks**: se añade una carpeta para mock en asset que dependiendo del tamaño de proyecto podria agruparse en features

Se mejoraron algunos metodos como: sortHolidaysByDate por uno mas claro y eficiente
Se renombraron los archivos para una mayor claridad por ejemplo tab1 por familiary-calendar
Se modifica el modelo creando IHolidayApiResponse para la respuesta de la api y HolidayViewModel para el modelo que utilizara la vista

### Decisiones de Diseño:

- **Separación de Responsabilidades**: Cada capa tiene una resp
  onsabilidad clara, lo que facilita la escalabilidad y el mantenimiento.
- **Reutilización**: Los servicios y modelos son reutilizables en diferentes partes de la aplicación.
- **Testabilidad**: La lógica de negocio y de presentación está desacoplada de las vistas, lo que facilita la escritura de pruebas unitarias.

---

## 2. Mejora del Manejo de API

### Cambios Realizados:

- Se implementaron **interceptores** para manejar la autenticación, agregar encabezados y registrar solicitudes y respuestas.
- Se realizo una refactorizacion en calendar-service para que sea holidays-api.service.ts el que maneje los datos relativos a esa api y solo se encarge de la logica de negocio.
- Se centralizó el manejo de errores HTTP en el interceptor.

### Decisiones de Diseño:

- **Independencia del Interceptor**: El interceptor es genérico y puede ser reutilizado por múltiples servicios.
- **Flexibilidad**: Cada servicio puede configurar su propia base URL y lógica específica.
- **Centralización del Manejo de Errores**: Los errores HTTP se manejan de manera uniforme en toda la aplicación, lo que mejora la consistencia y la experiencia del usuario.

---

## 3. Optimización del Sistema de Logging y Manejo de Errores

### Cambios Realizados:

- Se mejoro el (`Logger`), incorporando el timestamp para un mejor control de los errores, un metodo para habilitar el registro de errores en el servidor cuando son de tipo error o criticos y sustituyendo todos los console.log que se utilizaban por el log que correspondia en cada caso.
- Se separo el manejador de errores del logger utilizandolo (`AppErrorHandler`) para capturar y manejar errores inesperados en toda la aplicación.

### Decisiones de Diseño:

- **Centralización**: El sistema de logging y el manejo de errores están centralizados, lo que facilita su mantenimiento y mejora la consistencia.
- **Testabilidad**: El manejo de errores está desacoplado de las vistas, lo que facilita la escritura de pruebas unitarias.

---

## 4. Corrección de Funcionalidades

### Cambios Realizados:

- Se corrigió el filtrado de eventos en los tabs ("All events", "Holidays", "Family events") para que funcione correctamente.
- Se implementó la funcionalidad para añadir un nuevo evento al calendario.
- Se aseguraron las actualizaciones dinámicas de los eventos en los filtros después de ser añadidos.
- Ademas se agregaron los iconos que faltaban para su correcta visualización

---

## 5. Uso de Datos Mockeados (EXTRA)

### Cambios Realizados:

- Los datos mockeados (`events`, `familyMembers`, `holidays`) se movieron a archivos JSON en la carpeta `assets/mocks`.
- Se eliminaron los métodos del componente para obtener mocks de `CalendarComponent` y se añadieron metodos en `CalendarService` para cargar los archivos json (esto deberia ser configurable segun el entorno o algun parametros y recibirlos del mismo modo que la respuesta de un servicio. No se ha implementado en este ejercicio pero creo que seria la mejor manera de manejar los mocks)

### Decisiones de Diseño:

- **Separación de Datos Mockeados**: Los datos mockeados están separados del código de la aplicación, lo que mejora la claridad y facilita las pruebas.
- **Reutilización**: Los datos mockeados pueden ser utilizados por otros componentes o servicios.

---

## Conclusión

Los cambios realizados han transformado la aplicación en una solución más modular, escalable y mantenible. La adopción de una arquitectura MVVM, junto con la reorganización del proyecto y la mejora de funcionalidades, hacen que la aplicación sea fácil de entender, escalar y probar.
