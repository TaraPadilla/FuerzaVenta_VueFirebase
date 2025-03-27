<template>
  <div class="portada page">
    <div class="encabezado-rojo">
      <div class="banda-anio">
        <span>{{ anio }}</span>
      </div>
      <div class="titulo">
        <h1>Informe Fuerza</h1>
        <h1>de Venta Directa</h1>
      </div>
    </div>
    <div class="contenido-blanco">
      <p class="periodo">DEL {{ titulo.toUpperCase() }}</p>
      <p class="sub">PERIODO</p>
      <p class="footer">SERCOM CLARO HONDURAS | Soporte Comercial | Servicios Fijos</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  titulo: String,
  anio: Number
})
</script>

<style scoped>
.page {
  width: 794px;
  min-height: 1123px;
  margin-bottom: 40px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  font-family: 'Arial', sans-serif;
  color: #000;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  page-break-after: always;
}

.encabezado-rojo {
  background-color: #e50000;
  color: white;
  padding-top: 200px;
  padding-bottom: 100px;
  position: relative;
  text-align: center;
  clip-path: ellipse(130% 100% at 50% 0%);
}

.titulo h1 {
  font-size: 36px;
  margin: 0;
  font-weight: bold;
}

.banda-anio {
  position: absolute;
  top: 0;
  right: 0;
  background: #ccc;
  color: white;
  padding: 10px 15px;
  writing-mode: vertical-rl;
  text-align: center;
  font-weight: bold;
}

.contenido-blanco {
  background: white;
  flex-grow: 1;
  padding: 60px;
  text-align: center;
}

.periodo {
  font-size: 16px;
  color: #e50000;
  font-weight: bold;
  margin: 20px 0 5px 0;
}

.sub {
  text-transform: uppercase;
  font-size: 12px;
  color: #555;
  margin-bottom: 40px;
}

.footer {
  font-size: 11px;
  color: #333;
}
</style>
