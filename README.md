# El Guardián de la Interfaz

Aplicación web de una sola página que permite personalizar el entorno visual
(nombre de usuario, color de fondo y tema claro/oscuro) y **recuerda la
configuración mediante cookies nativas**, incluso al recargar o cerrar el
navegador.

Práctica de *Desarrollo Web en Entorno Cliente* (2º DAW).

## Contenido

| Archivo | Descripción |
|---|---|
| `index.html` | Estructura y formulario de personalización. |
| `estilos.css` | Estilos base y clases de tema `.tema-claro` / `.tema-oscuro`. |
| `script.js` | DOM dinámico, aplicación del aspecto y gestión de cookies. |
| `_docs/` | Documentación técnica (**no publicada** en GitHub Pages). |

## Funcionalidades

- Bloque de bienvenida generado dinámicamente con `createElement()`,
  `createTextNode()` y `appendChild()` (sin `document.write()`).
- Cambio instantáneo del color de fondo con `document.body.style.backgroundColor`.
- Cambio de tema activando clases del CSS con `classList.add()` / `remove()`.
- Tres cookies: nombre y color con caducidad de **7 días** calculada con
  `Date`, y tema como **cookie de sesión**.
- Botón *Restablecer Interfaz*: borra las cookies con `Expires` en el pasado,
  limpia el estilo en línea y las clases, y elimina el bloque con `removeChild()`.

## Despliegue

GitHub Pages desde la rama `main` (carpeta raíz):

https://manueljesusjimenezromero-web.github.io/El-Guardi-n-de-la-Interfaz2/

## Documentación

La documentación técnica completa está en [`_docs/documentacion.md`](_docs/documentacion.md).
