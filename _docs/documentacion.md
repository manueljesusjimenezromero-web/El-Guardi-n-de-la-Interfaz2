# Documentación — El Guardián de la Interfaz

**Autor:** Manuel Jesús Jiménez Romero — 2º DAW
**Repositorio:** `El-Guardi-n-de-la-Interfaz2`

> Esta carpeta `_docs/` no se publica en GitHub Pages (Jekyll ignora las
> carpetas que empiezan por `_` y además está excluida en `_config.yml`).

## 1. Archivos

| Archivo | Contenido |
|---|---|
| `index.html` | Contenedor de bienvenida, formulario y botones. |
| `estilos.css` | Estilos base y clases `.tema-claro` / `.tema-oscuro`. |
| `script.js` | Cookies, DOM dinámico y cambio de aspecto. |

## 2. Parte 1 — Bloque de bienvenida

`crearBloqueBienvenida(nombre)` crea un `div`, un `h2` y un `p` con
`createElement()`, les pone el texto con `textContent` y los inserta en
`#contenedor-bienvenida` con `appendChild()`. No se usa `document.write()`.

El bloque solo aparece si existe la cookie `nombre`, es decir, si el usuario
ya se había guardado antes.

## 3. Parte 2 — Cambiar el aspecto

- **Color:** el evento `input` del selector hace
  `document.body.style.backgroundColor = inputColor.value`.
- **Tema:** el evento `change` del `select` llama a `aplicarTema()`, que usa
  `classList.remove()` y `classList.add()`. Los colores están en el CSS, no
  en línea.

Al cambiar de tema se limpia el color con
`document.body.style.backgroundColor = ""`, porque el estilo en línea tiene
más prioridad que la clase y taparía el fondo del tema.

## 4. Parte 3 — Cookies

| Cookie | Guarda | Caducidad |
|---|---|---|
| `nombre` | Nombre de usuario | 7 días |
| `color` | Color de fondo | 7 días |
| `tema` | `tema-claro` o `tema-oscuro` | De sesión (sin `expires`) |

Los 7 días se calculan con el objeto `Date`:

```js
const fecha = new Date();
fecha.setDate(fecha.getDate() + dias);
document.cookie = nombre + "=" + valor + "; expires=" + fecha.toUTCString() + "; path=/";
```

`getCookie()` parte `document.cookie` por `"; "` y devuelve el valor, o
`null` si no existe. Al cargar la página, `cargarPreferencias()` lee las tres
cookies, aplica el color y el tema y rellena el formulario.

## 5. Parte 4 — Restablecer

El botón pide confirmación con `confirm()` y después:

1. Borra las tres cookies poniendo `expires` en una fecha de 1970.
2. Quita el color en línea (`= ""`) y las clases de tema.
3. Elimina el bloque de bienvenida con `removeChild()`.
4. Deja el formulario con sus valores iniciales.

## 6. Pruebas

| Prueba | Resultado |
|---|---|
| Mover el selector de color | El fondo cambia al instante. |
| Elegir Modo Oscuro | El `body` recibe la clase `tema-oscuro`. |
| Guardar y recargar | Se recuperan nombre, color y tema. |
| Cerrar el navegador y volver | Se pierde el tema; nombre y color siguen. |
| Restablecer | Se borra todo y vuelve el aspecto por defecto. |

## 7. Despliegue

GitHub Pages, rama `main`, carpeta raíz:
[`https://manueljesusjimenezromero-web.github.io/El-Guardi-n-de-la-Interfaz2/`](https://manueljesusjimenezromero-web.github.io/El-Guardi-n-de-la-Interfaz2/)
