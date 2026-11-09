
const DEBUG = true;

/** Escribe en la consola solo si DEBUG está activo */
function log(mensaje, dato) {
  if (DEBUG === true) {
    console.log(mensaje, dato);
  }
}


/** Se llaman a los objetos del DOM */
const contenedorBienvenida = document.getElementById("contenedor-bienvenida");
const inputNombre = document.getElementById("nombre");
const inputColor  = document.getElementById("color");
const selectTema  = document.getElementById("tema");
const btnGuardar  = document.getElementById("btnGuardar");
const btnReset    = document.getElementById("btnReset");
const aviso       = document.getElementById("aviso");


/* configuración  */
const diasCaducidad = 7;
const colorPorDefecto = "#ffffff";
const fechaPasada = "Thu, 01 Jan 1970 00:00:00 UTC";


/* coockies */

/**
 * Crea una cookie persistente que caduca dentro de N días.
 * La fecha de caducidad se calcula con el objeto Date.
 *
 * @param {string} nombre - clave de la cookie
 * @param {string} valor  - contenido a guardar
 * @param {number} dias   - días que debe durar
 */
function setCookie(nombre, valor, dias) {
  const fecha = new Date(); // fecha y hora actuales

  // setDate() admite valores mayores que 31.
  fecha.setDate(fecha.getDate() + dias);

  // toUTCString() devuelve el formato exacto que exige el atributo expires
  const caducidad = fecha.toUTCString();

  document.cookie = nombre + "=" + encodeURIComponent(valor) + "; expires=" + caducidad + "; path=/";

  log("Cookie persistente creada:", nombre + " -> caduca " + caducidad);
}

/**
 * Crea una cookie de sesión.
 * El navegador la elimina al cerrarse.
 */
function setCookieSesion(nombre, valor) {
  document.cookie = nombre + "=" + encodeURIComponent(valor) + "; path=/";

  log("Cookie de sesión creada:", nombre);
}

/**
 * Devuelve el valor de una cookie.
 * document.cookie es una sola cadena: "idioma=es; usuario=Ana; tema=oscuro"
 */
function getCookie(nombre) {
  const pares = document.cookie.split("; ");

  for (let par of pares) {
    const [clave, valor] = par.split("=");

    if (clave === nombre) {
      return decodeURIComponent(valor);
    }
  }

  return null;   
}

/**
 * Borra una cookie asignándole una fecha de caducidad ya pasada.
 * El path debe ser el mismo con el que se creó.
 */
function borrarCookie(nombre) {
  document.cookie = nombre + "=; expires=" + fechaPasada + "; path=/";

  log("Cookie borrada:", nombre);
}




function crearBloqueBienvenida(nombre) {

 
  eliminarBloqueBienvenida();

  
  const bloque  = document.createElement("div");
  const titulo  = document.createElement("h2");
  const parrafo = document.createElement("p");


  bloque.setAttribute("id", "bloque-saludo");
  titulo.textContent = "Bienvenido de nuevo, " + nombre;
  parrafo.textContent = "Hemos recuperado tus preferencias guardadas.";

 
  bloque.appendChild(titulo);
  bloque.appendChild(parrafo);

 
  contenedorBienvenida.appendChild(bloque);

  log("Bloque de bienvenida generado para:", nombre);
}

/**
 *  elimina el bloque del DOM con removeChild()
 */
function eliminarBloqueBienvenida() {
  const bloque = document.getElementById("bloque-saludo");

  if (bloque !== null) {
    contenedorBienvenida.removeChild(bloque);
    log("Bloque de bienvenida eliminado", "");
  }
}


/* modificacion */

/**
 * Activa la clase del tema elegido y desactiva la otra.
 * Los colores están definidos en estilos.css: aquí NO se escriben
 * estilos en línea para los temas.
 */
function aplicarTema(tema) {
  document.body.classList.remove("tema-claro");
  document.body.classList.remove("tema-oscuro");
  document.body.classList.add(tema);

  log("Tema aplicado:", tema);
}


function mostrarAviso(texto) {
  aviso.textContent = texto;
}





inputColor.addEventListener("input", function () {
  document.body.style.backgroundColor = inputColor.value;
});



selectTema.addEventListener("change", function () {
  aplicarTema(selectTema.value);


  document.body.style.backgroundColor = "";
});



btnGuardar.addEventListener("click", function () {
  const nombre = inputNombre.value.trim();

  if (nombre === "") {
    mostrarAviso("Escribe un nombre de usuario antes de guardar.");
    return;
  }

  // Nombre y color: cookies persistentes de 7 días
  setCookie("nombre", nombre, diasCaducidad);
  setCookie("color", inputColor.value, diasCaducidad);

  // Tema: cookie de sesión (sin expires)
  setCookieSesion("tema", selectTema.value);

  crearBloqueBienvenida(nombre);
  mostrarAviso("Preferencias guardadas. Nombre y color duran 7 días; el tema, hasta cerrar el navegador.");
});



btnReset.addEventListener("click", function () {

  // confirm() devuelve un booleano: true si pulsa Aceptar (CE e)
  const usuarioConfirma = window.confirm("¿Seguro que quieres borrar tus preferencias?");

  if (usuarioConfirma === false) {
    return;
  }

  // 1. Borrar las tres cookies con caducidad en el pasado
  borrarCookie("nombre");
  borrarCookie("color");
  borrarCookie("tema");

  // 2. Volver al aspecto por defecto
  document.body.style.backgroundColor = "";        
  document.body.classList.remove("tema-claro");    
  document.body.classList.remove("tema-oscuro");

  // 3. Eliminar del DOM el bloque generado.
  eliminarBloqueBienvenida();

  // Dejamos el formulario como al principio
  inputNombre.value = "";
  inputColor.value = colorPorDefecto;
  selectTema.selectedIndex = 0;

  mostrarAviso("Interfaz restablecida y cookies eliminadas.");
});




function cargarPreferencias() {

  // navigator.cookieEnabled indica si el navegador permite cookies
  if (window.navigator.cookieEnabled === false) {
    mostrarAviso("Tu navegador tiene las cookies desactivadas: no se podrán guardar las preferencias.");
    return;
  }

  log("Cadena completa de cookies:", document.cookie);

  const nombre = getCookie("nombre");
  const color  = getCookie("color");
  const tema   = getCookie("tema");

 
  if (tema !== null) {
    aplicarTema(tema);
    selectTema.value = tema;
  }

  if (color !== null) {
    document.body.style.backgroundColor = color;
    inputColor.value = color;
  }

  
  if (nombre !== null) {
    inputNombre.value = nombre;
    crearBloqueBienvenida(nombre);
    mostrarAviso("Preferencias recuperadas de las cookies.");
  }
}

cargarPreferencias();