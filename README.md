# El Guardián de la Interfaz

Aplicación web de una sola página que permite personalizar el entorno visual
(nombre de usuario, color de fondo y tema claro/oscuro) y **recuerda la
configuración mediante cookies nativas**, incluso al recargar la página o
cerrar el navegador.

Práctica de *Desarrollo Web en Entorno Cliente* (2º DAW).

## Contenido del repositorio

| Archivo | Descripción |
|---|---|
| `index.html` | Estructura y formulario de personalización. |
| `estilos.css` | Estilos base y clases de tema `.tema-claro` / `.tema-oscuro`. |
| `script.js` | Cookies, DOM dinámico y cambio de aspecto. |
| `_docs/` | Documentación técnica (**no publicada** en GitHub Pages). |
| `_config.yml` | Configuración de Pages que excluye `_docs/` del sitio. |

## Funcionalidades

- Bloque de bienvenida generado dinámicamente con `createElement()`,
  `textContent` y `appendChild()`, sin usar `document.write()`.
- Cambio instantáneo del color de fondo con `document.body.style.backgroundColor`.
- Cambio de tema activando clases del CSS con `classList.add()` / `remove()`.
- Tres cookies: `nombre` y `color` con caducidad de **7 días** calculada con
  el objeto `Date`, y `tema` como **cookie de sesión**.
- Botón *Restablecer Interfaz*: pide confirmación, borra las cookies con
  `expires` en el pasado, limpia el estilo en línea y las clases, y elimina
  el bloque de bienvenida con `removeChild()`.

## Documentación

La documentación técnica completa está en
[`_docs/documentacion.md`](_docs/documentacion.md).
