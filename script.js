function crearBloqueBienvenida(nombre) {

  
  const bloque  = document.createElement("div");
  const titulo  = document.createElement("h2");
  const parrafo = document.createElement("p");


  bloque.id = "bloque-bienvenida";
  bloque.className = "bloque-bienvenida";

  titulo.appendChild(document.createTextNode("¡Bienvenido de nuevo, " + nombre + "!"));
  parrafo.appendChild(document.createTextNode("Hemos restaurado tu configuración."));


  bloque.appendChild(titulo);    
  bloque.appendChild(parrafo);   
  contenedor-bienvenida.appendChild(bloque);  
}

crearBloqueBienvenida("ManuelJesus");