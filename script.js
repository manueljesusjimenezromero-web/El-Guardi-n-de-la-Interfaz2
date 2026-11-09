
"use strict";


const COOKIE_NOMBRE = "guardian_nombre";
const COOKIE_COLOR = "guardian_color";
const COOKIE_TEMA = "guardian_tema";   // cookie de sesión

/* Días de caducidad de las cookies persistentes (nombre y color) */
const DIAS_CADUCIDAD = 7;

/* Valores por defecto */
const COLOR_POR_DEFECTO = "#eef1f7";
const CLASES_TEMA = ["tema-claro", "tema-oscuro"];

/* Referencias a los elementos del documento */
const contenedorBienvenida = document.getElementById("contenedor-bienvenida");
const inputNombre = document.getElementById("nombre-usuario");
const inputColor = document.getElementById("color-fondo");
const selectTema = document.getElementById("tema-visual");
const btnGuardar = document.getElementById("btn-guardar");
const btnRestablecer = document.getElementById("btn-restablecer");
const mensajeEstado = document.getElementById("mensaje-estado");
const volcadoCookies = document.getElementById("volcado-cookies");

/**
 * Crea o actualiza una cookie.
 * @param {string} nombre  Nombre de la cookie.
 * @param {string} valor   Valor a almacenar (se codifica para evitar
 *                         problemas con ";", "=" o acentos).
 * @param {number|null} dias  Días de vida. Si es null se crea una
 *                            COOKIE DE SESIÓN (sin Expires ni Max-Age),
 *                            por lo que muere al cerrar el navegador.
 */
function crearCookie(nombre, valor, dias) {
    let cookie = nombre + "=" + encodeURIComponent(valor) + "; path=/; SameSite=Lax";

    /* Solo las cookies persistentes llevan fecha de caducidad.
       La fecha se calcula con el objeto Date: tomamos el instante actual
       y le sumamos los milisegundos equivalentes a los días pedidos. */
    if (dias !== null && dias !== undefined) {
        const caducidad = new Date();
        caducidad.setTime(caducidad.getTime() + dias * 24 * 60 * 60 * 1000);
        cookie += "; expires=" + caducidad.toUTCString();
    }

    document.cookie = cookie;
}

/**
 * Lee el valor de una cookie a partir de document.cookie.
 * @param   {string} nombre Nombre de la cookie buscada.
 * @returns {string|null}   Valor decodificado, o null si no existe.
 */
function leerCookie(nombre) {
    const prefijo = nombre + "=";
    const trozos = document.cookie.split(";");

    for (let i = 0; i < trozos.length; i++) {
        const trozo = trozos[i].trim();

        if (trozo.indexOf(prefijo) === 0) {
            return decodeURIComponent(trozo.substring(prefijo.length));
        }
    }

    return null;
}

/**
 * Borra una cookie dándole una fecha de caducidad en el pasado:
 * el propio navegador la elimina al detectar que ya expiró.
 * @param {string} nombre Nombre de la cookie a eliminar.
 */
function borrarCookie(nombre) {
    const fechaPasada = new Date(0); // 1 de enero de 1970
    document.cookie = nombre + "=; path=/; expires=" + fechaPasada.toUTCString();
}

/**
 * Muestra en pantalla las cookies de la aplicación presentes
 * en el navegador (ayuda visual para corregir la práctica).
 */
function volcarCookies() {
    const lineas = [];
    const cookies = [COOKIE_NOMBRE, COOKIE_COLOR, COOKIE_TEMA];

    for (let i = 0; i < cookies.length; i++) {
        const valor = leerCookie(cookies[i]);

        if (valor !== null) {
            lineas.push(cookies[i] + " = " + valor);
        }
    }

    volcadoCookies.textContent = lineas.length > 0
        ? lineas.join("\n")
        : "(ninguna)";
}
/**
 * Crea el bloque de bienvenida (h2 + p) con createElement() y
 * createTextNode(), y lo inyecta en #contenedor-bienvenida con
 * appendChild(). No se utiliza document.write().
 * @param {string} nombre Nombre del usuario recuperado de la cookie.
 */
function crearBloqueBienvenida(nombre) {
    /* Si ya existe un bloque anterior lo quitamos para no duplicarlo */
    eliminarBloqueBienvenida();

    const bloque = document.createElement("div");
    const titulo = document.createElement("h2");
    const parrafo = document.createElement("p");

    bloque.id = "bloque-bienvenida";

    /* Nodos de texto creados explícitamente con createTextNode() */
    titulo.appendChild(document.createTextNode("¡Bienvenido de nuevo, " + nombre + "!"));
    parrafo.appendChild(document.createTextNode(
        "Hemos restaurado tu configuración guardada en las cookies de este navegador."
    ));

    bloque.appendChild(titulo);
    bloque.appendChild(parrafo);

    /* Inyección en el contenedor vacío del HTML */
    contenedorBienvenida.appendChild(bloque);
}

/**
 * Elimina del DOM el bloque de bienvenida con removeChild()
 * (Parte 4). Si no existe, no hace nada.
 */
function eliminarBloqueBienvenida() {
    const bloque = document.getElementById("bloque-bienvenida");

    if (bloque !== null) {
        bloque.parentNode.removeChild(bloque);
    }
}


/**
 * Aplica el color de fondo al documento mediante estilo en línea.
 * @param {string} color Color en formato hexadecimal (#rrggbb).
 */
function aplicarColorFondo(color) {
    document.body.style.backgroundColor = color;
}

/**
 * Activa el tema visual manipulando las CLASES del body.
 * Los colores del tema están definidos en estilos.css, aquí solo
 * se añaden o quitan las clases con classList.
 * @param {string} tema "tema-claro" o "tema-oscuro".
 */
function aplicarTema(tema) {
    /* Primero retiramos cualquier clase de tema anterior */
    for (let i = 0; i < CLASES_TEMA.length; i++) {
        document.body.classList.remove(CLASES_TEMA[i]);
    }

    /* Después activamos la pedida, si es válida */
    if (CLASES_TEMA.indexOf(tema) !== -1) {
        document.body.classList.add(tema);
    }
}

/**
 * Escribe un aviso para el usuario en la zona de mensajes.
 * @param {string} texto Mensaje a mostrar.
 * @param {string} tipo  "exito" o "aviso".
 */
function mostrarMensaje(texto, tipo) {
    mensajeEstado.textContent = texto;
    mensajeEstado.className = "mensaje " + (tipo || "");
}


/**
 * Guarda las tres preferencias en tres cookies distintas:
 *   - nombre y color -> caducan en 7 días (fecha calculada con Date)
 *   - tema           -> cookie de sesión (sin Expires ni Max-Age)
 */
function guardarPreferencias() {
    const nombre = inputNombre.value.trim();
    const color = inputColor.value;
    const tema = selectTema.value;

    if (nombre === "") {
        mostrarMensaje("Escribe un nombre de usuario antes de guardar.", "aviso");
        inputNombre.focus();
        return;
    }

    crearCookie(COOKIE_NOMBRE, nombre, DIAS_CADUCIDAD); // persistente 7 días
    crearCookie(COOKIE_COLOR, color, DIAS_CADUCIDAD);  // persistente 7 días
    crearCookie(COOKIE_TEMA, tema, null);              // cookie de sesión

    /* Reflejamos el cambio al momento */
    aplicarColorFondo(color);
    aplicarTema(tema);
    crearBloqueBienvenida(nombre);

    volcarCookies();
    mostrarMensaje(
        "Preferencias guardadas. Nombre y color caducan en " + DIAS_CADUCIDAD +
        " días; el tema se perderá al cerrar el navegador.",
        "exito"
    );
}

/**
 * Lee las cookies al cargar la página y, si existen, restaura
 * el aspecto y rellena los campos del formulario.
 */
function recuperarPreferencias() {
    const nombre = leerCookie(COOKIE_NOMBRE);
    const color = leerCookie(COOKIE_COLOR);
    const tema = leerCookie(COOKIE_TEMA);

    if (color !== null) {
        inputColor.value = color;
        aplicarColorFondo(color);
    }

    if (tema !== null) {
        selectTema.value = tema;
        aplicarTema(tema);
    }

    if (nombre !== null) {
        inputNombre.value = nombre;
        /* Solo generamos el bloque si el usuario ya se había registrado */
        crearBloqueBienvenida(nombre);
    }

    volcarCookies();

    if (nombre !== null || color !== null || tema !== null) {
        mostrarMensaje("Configuración restaurada desde las cookies.", "exito");
    }
}

/**
 * Devuelve la aplicación a su estado inicial:
 *   1. Borra las tres cookies (Expires en el pasado).
 *   2. Quita el color en línea y las clases de tema del body.
 *   3. Elimina del DOM el bloque de bienvenida con removeChild().
 */
function restablecerInterfaz() {
    /* 1. Eliminación de las cookies */
    borrarCookie(COOKIE_NOMBRE);
    borrarCookie(COOKIE_COLOR);
    borrarCookie(COOKIE_TEMA);

    /* 2. Aspecto visual por defecto */
    document.body.style.backgroundColor = "";   // borra el estilo en línea
    for (let i = 0; i < CLASES_TEMA.length; i++) {
        document.body.classList.remove(CLASES_TEMA[i]);
    }

    /* 3. Eliminación del bloque generado dinámicamente */
    eliminarBloqueBienvenida();

    /* Formulario a sus valores iniciales */
    inputNombre.value = "";
    inputColor.value = COLOR_POR_DEFECTO;
    selectTema.value = "tema-claro";

    volcarCookies();
    mostrarMensaje("Interfaz restablecida y cookies eliminadas.", "aviso");
}

/* Cambio de color: se aplica al instante mientras se mueve el selector */
inputColor.addEventListener("input", function () {
    aplicarColorFondo(inputColor.value);
});

/* Cambio de tema: se activan o desactivan las clases del CSS */
selectTema.addEventListener("change", function () {
    aplicarTema(selectTema.value);
});

/* Botones de la Parte 3 y de la Parte 4 */
btnGuardar.addEventListener("click", guardarPreferencias);
btnRestablecer.addEventListener("click", restablecerInterfaz);

/* Al cargar la página se intenta restaurar la configuración guardada */
recuperarPreferencias();
