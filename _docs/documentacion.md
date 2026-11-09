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
| `index.html` | Contenedor de bienvenida vacío, formulario de tres controles y botones. |
| `estilos.css` | Aspecto base y clases de tema `.tema-claro` / `.tema-oscuro`. |
| `script.js` | Cookies, generación dinámica del DOM, cambio de aspecto y restablecimiento. |
| `_config.yml` | Exclusión de la documentación del sitio publicado. |
| `_docs/documentacion.md` | Este documento. |

### Identificadores que conectan HTML y JavaScript

| Elemento HTML | Constante en `script.js` |
|---|---|
| `#contenedor-bienvenida` | `contenedorBienvenida` |
| `#nombre` | `inputNombre` |
| `#color` | `inputColor` |
| `#tema` | `selectTema` |
| `#btnGuardar` | `btnGuardar` |
| `#btnReset` | `btnReset` |
| `#aviso` | `aviso` |

El `<script>` se carga al final del `<body>`, de modo que todos estos
elementos ya existen cuando se ejecutan los `getElementById()`.

---

## 2. Parte 1 — Generación dinámica del DOM

El HTML solo aporta el contenedor vacío:

```html
<div id="contenedor-bienvenida"></div>
```

`crearBloqueBienvenida(nombre)` construye el bloque nodo a nodo:

1. `document.createElement("div" | "h2" | "p")` crea los tres elementos.
2. `setAttribute("id", "bloque-saludo")` identifica el bloque para poder
   localizarlo después y borrarlo.
3. `textContent` inyecta el texto (el enunciado admite `createTextNode()`
   **o** `.textContent`; se usa la segunda por ser más directa y segura).
4. `appendChild()` ensambla el árbol (`h2` y `p` dentro del `div`) y
   finalmente mete el `div` dentro de `#contenedor-bienvenida`.

No se usa `document.write()` en ningún punto: al ejecutarse después de que
el documento esté cargado, borraría toda la página.

La función empieza llamando a `eliminarBloqueBienvenida()` para no duplicar
el saludo si se pulsa *Guardar* varias veces seguidas.

El bloque solo aparece si existe la cookie `nombre`, es decir, si el usuario
**ya se había registrado antes**.

---

## 3. Parte 2 — Modificación inmediata del aspecto

| Control | Evento | Acción |
|---|---|---|
| `#color` | `input` | `document.body.style.backgroundColor = inputColor.value;` |
| `#tema` | `change` | `aplicarTema()`: `classList.remove()` de ambos temas + `classList.add()` del elegido |

Se usa `input` y no `change` en el selector de color para que el fondo cambie
**mientras** se arrastra el cursor por la paleta.

Los colores de cada tema están definidos exclusivamente en `estilos.css`
(`.tema-claro`, `.tema-oscuro` y sus descendientes). El JavaScript nunca
escribe esos colores en línea: solo activa o desactiva la clase.

### Nota sobre la cascada CSS

El color de fondo se aplica como **estilo en línea**, que tiene más prioridad
que el `background-color` de la clase de tema. Para que al cambiar de tema se
vea el fondo del tema y no el color anterior, el manejador del `select`
limpia el estilo en línea con `document.body.style.backgroundColor = ""`
(asignar la cadena vacía **elimina** la declaración; no pinta de blanco).

---

## 4. Parte 3 — Persistencia con cookies

### Funciones auxiliares

| Función | Cometido |
|---|---|
| `setCookie(nombre, valor, dias)` | Cookie **persistente**: calcula la caducidad con `Date` y añade `expires`. |
| `setCookieSesion(nombre, valor)` | Cookie **de sesión**: sin `expires` ni `Max-Age`, muere al cerrar el navegador. |
| `getCookie(nombre)` | Parte `document.cookie` por `"; "`, separa clave y valor y devuelve el valor decodificado o `null`. |
| `borrarCookie(nombre)` | Reescribe la cookie con `expires` en `Thu, 01 Jan 1970 00:00:00 UTC`. |

### Cálculo de la caducidad de 7 días

```js
const fecha = new Date();            // fecha y hora actuales
fecha.setDate(fecha.getDate() + dias); // setDate ajusta mes y año solo
const caducidad = fecha.toUTCString(); // formato exigido por "expires"
```

`setDate()` admite valores mayores que 31: si hoy es 28 de febrero y se suman
7 días, el propio objeto `Date` corrige el mes y, si hace falta, el año.
`toUTCString()` devuelve la fecha en el formato exacto que exige el atributo
`expires` de la cabecera `Set-Cookie`.

### Las tres cookies

| Cookie | Contenido | Caducidad |
|---|---|---|
| `nombre` | Nombre de usuario | 7 días (persistente) |
| `color` | Color de fondo `#rrggbb` | 7 días (persistente) |
| `tema` | `tema-claro` / `tema-oscuro` | **De sesión** (sin `expires`) |

Los valores se codifican con `encodeURIComponent()` al escribir y se
decodifican con `decodeURIComponent()` al leer, para que acentos, espacios o
caracteres como `;` y `=` no rompan la cookie (el `#` del color se guarda
como `%23`).

Todas se crean con `path=/` para que sean válidas en todo el sitio; el
borrado usa el mismo `path`, requisito imprescindible para que el navegador
las dé por caducadas.

### Recuperación al cargar

`cargarPreferencias()` se ejecuta al final del script:

1. Comprueba `window.navigator.cookieEnabled`; si el navegador tiene las
   cookies desactivadas avisa al usuario y no sigue.
2. Lee las tres cookies y, para cada una que exista, aplica el aspecto **y**
   rellena el control correspondiente del formulario.
3. Si existe `nombre`, genera además el bloque de bienvenida.

Comportamiento observable: al recargar (F5) se mantiene todo; al cerrar el
navegador y volver a entrar se conservan nombre y color, pero el tema vuelve
al estado por defecto, porque su cookie era de sesión.

---

## 5. Parte 4 — Restablecer interfaz

El botón *Restablecer Interfaz* pide confirmación con `window.confirm()`, que
devuelve un booleano; si el usuario cancela, la función termina sin tocar
nada. Si acepta:

1. **Borra las tres cookies** con `borrarCookie()`, que fija `expires` en una
   fecha pasada; el navegador las descarta por caducadas.
2. **Devuelve el aspecto por defecto**: `document.body.style.backgroundColor = ""`
   elimina la declaración en línea y `classList.remove()` quita las dos
   clases de tema.
3. **Elimina el bloque de bienvenida** del DOM con
   `contenedorBienvenida.removeChild(bloque)`.
4. Resetea los tres controles (`value = ""`, color por defecto y
   `selectedIndex = 0`).

---

## 6. Modo depuración

La constante `DEBUG` y la función `log(mensaje, dato)` centralizan los
mensajes de consola: cada operación con cookies y cada cambio en el DOM
dejan traza mientras `DEBUG` valga `true`. Poniéndola a `false` se silencian
todos los avisos sin tocar una sola línea más del código.

---

## 7. Objetos utilizados: BOM frente a objetos nativos

| Instrucción | Categoría |
|---|---|
| `document.cookie`, `document.createElement()`, `document.body` | DOM, accesible desde el objeto global `window` |
| `window.confirm()`, `window.navigator.cookieEnabled` | BOM |
| `Date`, `encodeURIComponent()`, `decodeURIComponent()`, `console` | Objetos y funciones nativos del lenguaje |

`document` y `navigator` son propiedades de `window`, el objeto global del
navegador; por eso no hace falta escribir `window.document`. En cambio `Date`
pertenece al propio lenguaje y existiría también fuera del navegador
(Node.js, Deno), donde no hay `window`.

---

## 8. Pruebas realizadas

| Prueba | Resultado esperado |
|---|---|
| Mover el selector de color | El fondo cambia al instante. |
| Cambiar a Modo Oscuro | El `body` gana la clase `tema-oscuro`; cambian texto, tarjeta y bloque. |
| Guardar sin nombre | Aviso en `#aviso` y no se crea ninguna cookie. |
| Guardar y recargar (F5) | Se restauran nombre, color y tema; aparece el bloque de bienvenida. |
| Cerrar el navegador y volver | Nombre y color persisten; el tema se pierde (cookie de sesión). |
| Restablecer y aceptar | Desaparecen las cookies, el fondo, las clases y el bloque. |
| Restablecer y cancelar | No cambia nada. |
| DevTools → Application → Cookies | Se ven las tres cookies con su caducidad (fecha / Session). |

---

## 9. Despliegue

El sitio se publica con **GitHub Pages** desde la rama `main`, carpeta raíz
(*Settings → Pages → Source: Deploy from a branch → `main` / `(root)`*).

URL del proyecto:
`https://manueljesusjimenezromero-web.github.io/El-Guardi-n-de-la-Interfaz2/`

La carpeta `_docs/` queda fuera del sitio publicado, tal y como pide el
enunciado.
