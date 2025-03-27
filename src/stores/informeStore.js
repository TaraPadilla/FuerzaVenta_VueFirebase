let datosInforme = []
let tituloInforme = ''

export function setInforme(datos, titulo) {
  datosInforme = datos
  tituloInforme = titulo
}

export function getInforme() {
  return {
    datos: datosInforme,
    titulo: tituloInforme
  }
}
