# Ionic Technical Test - Family Calendar App

## Overview
Este proyecto es una prueba técnica para evaluar tus habilidades como desarrollador Ionic Senior. El proyecto consiste en una aplicación de calendario familiar donde los miembros de una familia pueden gestionar eventos compartidos y ver días festivos.

## Contexto
La aplicación actual es un prototipo funcional que permite a los usuarios ver, crear y gestionar eventos del calendario familiar. La aplicación se conecta a la API de Holidays by API Ninjas para obtener información sobre días festivos de diferentes países.

## Requisitos para la Prueba Técnica

### Tiempo Estimado
La prueba está diseñada para ser completada en aproximadamente 2-3 horas.

### Tareas Principales

1. **Análisis y Refactorización**
   - Revisa la estructura y arquitectura actual del proyecto
   - Identifica y corrige los problemas de diseño y arquitectura
   - Refactoriza el código siguiendo buenas prácticas y patrones de diseño
   - Implementa una arquitectura modular y escalable

2. **Mejora del Manejo de API**
   - Refactoriza la comunicación con la API utilizando interceptores HTTP
   - Implementa un manejo adecuado de tokens de autenticación
   - Mejora el manejo de errores HTTP

3. **Optimización del Sistema de Logging y Error Handling**
   - Mejora el sistema de logging actual
   - Implementa un manejo de errores centralizado
   - Asegura que los errores se manejen y registren adecuadamente

4. **Corrección de Funcionalidades**
   - Corrige el filtrado de eventos según si son "All events", "Holidays" o "Family events" (los tres tabs en la vista de calendario)
   - Implementa la funcionalidad para añadir un nuevo evento festivo al calendario
   - Asegúrate de que los eventos se muestren correctamente en todos los filtros después de ser añadidos

## API Utilizada

Para esta prueba técnica, estamos utilizando la API de Holidays by API Ninjas. Esta API proporciona información sobre días festivos de diferentes países. Para utilizarla, necesitarás:

1. Registrarte en [RapidAPI](https://rapidapi.com/)
2. Suscribirte a [Public holidays](https://rapidapi.com/hefesto-technologies-hefesto-technologies-default/api/public-holidays7)
3. Obtener una clave de API
4. Reemplazar la clave de API en el código con tu clave de API

Nota: En un entorno de producción real, esta clave debería manejarse de forma segura utilizando variables de entorno o algún otro método seguro.

## Entorno de Desarrollo

Para comenzar a trabajar en el proyecto:

```bash
npm install
npm start
```

## Evaluación
Tu solución será evaluada en base a:
1. Calidad del código y adherencia a buenas prácticas
2. Arquitectura y estructura de carpetas
3. Resolución efectiva de los problemas planteados
4. Implementación correcta de las funcionalidades solicitadas

## Entrega
Al finalizar, por favor:
1. Crea un repositorio git público con tu solución
2. Incluye un README con explicaciones sobre tu enfoque
3. Describe los cambios realizados y las decisiones de diseño tomadas
4. Envía el enlace al repositorio

¡Buena suerte!
