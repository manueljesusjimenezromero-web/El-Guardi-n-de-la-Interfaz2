function bloquebienvenida(nombre){

  const bloque = document.createElement("div");
  const h2 = document.createElement("h2");
  const p = document.createElement("p");

  h2.textContent="Hola";
  p.textContent="Identificate perro";

  document.getElementById("contenedor-bienvenida").appendChild(bloque);
}
