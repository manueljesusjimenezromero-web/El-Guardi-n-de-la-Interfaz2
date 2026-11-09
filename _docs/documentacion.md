# Documentación técnica — El Guardián de la Interfaz

**Autor:** Manuel Jesús Jiménez Romero
**Módulo:** Desarrollo Web en Entorno Cliente (2º DAW)
**Repositorio:** `El-Guardi-n-de-la-Interfaz2`

> Esta carpeta (`_docs/`) **no se publica en GitHub Pages**: Jekyll ignora las
> carpetas que empiezan por `_` y además está excluida en `_config.yml`.

---

## 1. Estructura del proyecto

| Archivo | Contenido |
|---|---|
| `index.html` | Estructura: contenedor de bienvenida vacío, formulario de tres controles y botones. |
| `estilos.css` | Aspecto base y las clases de tema `.tema-claro` / `.tema-oscuro`. |
| `script.js` | Toda la lógica: DOM dinámico, aplicación del aspecto, cookies y restablecimiento. |
| `_config.yml` | Exclusión de la documentación del sitio publicado. |
| `_docs/documentacion.md` | Este documento. |

---

## 2. Parte 1 — Generación dinámica del DOM

El HTML solo aporta el contenedor vacío:

```html
<div id="contenedor-bienvenida"></div>
```

La función `crearBloqueBienvenida(nombre)` construye el bloque nodo a nodo:

1. `document.createElement("div" | "h2" | "p")` crea los tres elementos.
2. `document.createTextNode(...)` crea los nodos de texto.
3. `appendChild()` ensambla el árbol (`texto → h2/p → div`) y finalmente
   inyecta el `div` dentro de `#contenedor-bienvenida`.

No se usa `document.write()` en ningún punto del proyecto, porque al
ejecutarse después de que el documento esté cargado borraría todo el
contenido de la página.

El bloque solo se genera si existe la cookie del nombre, es decir, si el
usuario **ya se había registrado antes**.

---

## 3. Parte 2 — Modificación inmediata del aspecto

| Control | Evento | Acción |
|---|---|---|
| `input[type="color"]` | `input` | `document.body.style.backgroundColor = color;` |
| `select` de tema | `change` | `classList.remove()` de ambos temas + `classList.add()` del elegido |

Se usa el evento `input` en el selector de color (y no `change`) para que el
fondo cambie **mientras** el usuario arrastra el cursor por la paleta.

Los colores de cada tema están definidos exclusivamente en `estilos.css`
(`body.tema-claro`, `body.tema-oscuro` y sus descendientes). El JavaScript
nunca escribe esos colores en línea: solo activa o desactiva la clase.

### Nota sobre la cascada CSS

El color de fondo se aplica como **estilo en línea**, que tiene más
prioridad que la regla `background-color` de la clase de tema. Por eso, si el
usuario elige un color, ese color manda sobre el fondo del tema; el tema
sigue controlando el resto (texto, tarjetas, bordes, botones). Es el
comportamiento esperado de la cascada: en línea > clase.

---

## 4. Parte 3 — Persistencia con cookies

### Funciones auxiliares

| Función | Cometido |
|---|---|
| `crearCookie(nombre, valor, dias)` | Escribe la cookie. Si `dias` es `null` **no** añade `expires` → cookie de sesión. |
| `leerCookie(nombre)` | Parte `document.cookie` por `;`, recorta espacios y devuelve el valor decodificado o `null`. |
| `borrarCookie(nombre)` | Reescribe la cookie con `expires` en `new Date(0)` (01/01/1970). |

### Cálculo de la caducidad de 7 días

```js
const caducidad = new Date();
caducidad.setTime(caducidad.getTime() + dias * 24 * 60 * 60 * 1000);
cookie += "; expires=" + caducidad.toUTCString();
```

`getTime()` devuelve los milisegundos desde 1970; se le suman los de 7 días
(`7 × 24 × 60 × 60 × 1000`) y `toUTCString()` lo formatea como exige la
cabecera `Set-Cookie`.

### Las tres cookies

| Cookie | Contenido | Caducidad |
|---|---|---|
| `guardian_nombre` | Nombre de usuario | 7 días (persistente) |
| `guardian_color` | Color de fondo `#rrggbb` | 7 días (persistente) |
| `guardian_tema` | `tema-claro` / `tema-oscuro` | **De sesión**: sin `Expires` ni `Max-Age` |

Los valores se codifican con `encodeURIComponent()` al escribir y se
decodifican con `decodeURIComponent()` al leer, para que acentos, espacios o
caracteres como `;` y `=` no rompan la cookie.

### Recuperación

`recuperarPreferencias()` se ejecuta al final del script (el `<script>` está
al cierre del `<body>`, así que el DOM ya existe). Lee las tres cookies y,
para cada una que exista, aplica el aspecto **y** rellena el campo
correspondiente del formulario.

Comportamiento observable: al recargar se mantiene todo; al cerrar el
navegador y volver a entrar se conservan nombre y color, pero el tema vuelve
al estado por defecto, porque su cookie era de sesión.

---

## 5. Parte 4 — Restablecer interfaz

`restablecerInterfaz()` hace tres cosas:

1. **Borra las cookies** con `borrarCookie()`, que fija `expires` en una fecha
   pasada; el navegador las descarta por caducadas.
2. **Devuelve el aspecto por defecto**: `document.body.style.backgroundColor = ""`
   elimina la declaración en línea (no pone blanco: la borra, de modo que
   vuelve a mandar el CSS) y `classList.remove()` quita las clases de tema.
3. **Elimina el bloque de bienvenida** del DOM con
   `bloque.parentNode.removeChild(bloque)`.

Además resetea los tres controles del formulario a sus valores iniciales.

---

## 6. Objetos utilizados: BOM frente a objetos nativos

| Instrucción | Categoría |
|---|---|
| `document.cookie`, `document.createElement()`, `document.body` | BOM/DOM (propiedades del objeto global `window`) |
| `navigator`, `screen`, `window.open()` | BOM |
| `Date`, `encodeURIComponent()`, `parseFloat()`, `Math`, `JSON` | Objetos y funciones nativos de JavaScript |

`document` y `navigator` son propiedades de `window`, el objeto global del
navegador. `Date` o `Math` pertenecen al propio lenguaje: existirían también
fuera del navegador (Node.js, Deno), donde no hay `window`.

---

## 7. Pruebas realizadas

| Prueba | Resultado esperado |
|---|---|
| Mover el selector de color | El fondo cambia al instante. |
| Cambiar el tema a Modo Oscuro | El `body` gana la clase `tema-oscuro`; cambian texto, tarjetas y botones. |
| Guardar y recargar (F5) | Se restauran color, tema y nombre; aparece el bloque de bienvenida. |
| Cerrar el navegador y volver | Nombre y color persisten; el tema se pierde (cookie de sesión). |
| Restablecer interfaz | Desaparecen las cookies, el fondo y el bloque de bienvenida. |
| Inspector → Application → Cookies | Se ven las tres cookies con su caducidad (7 días / Session). |

---

## 8. Despliegue

El sitio se publica con **GitHub Pages** desde la rama `main`, carpeta raíz
(*Settings → Pages → Source: Deploy from a branch → main / (root)*).

URL del proyecto:
`https://manueljesusjimenezromero-web.github.io/El-Guardi-n-de-la-Interfaz2/`
