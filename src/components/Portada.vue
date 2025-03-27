<!-- src/components/Portada.vue -->
<template>
    <div class="portada page">
      <h1>Informe Fuerza de Venta Directa</h1>
      <h2>Sercom Claro Honduras | Soporte Comercial | Servicios Fijos</h2>
      <p class="periodo">Periodo: {{ titulo }}</p>
      <p class="anio">Año: {{ anio }}</p>
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
    background: white;
    width: 794px;
    min-height: 1123px;
    padding: 60px;
    margin-bottom: 40px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    color: #000;
    font-family: 'Times New Roman', serif;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    page-break-after: always;
  }
  
  h1 {
    font-size: 32px;
    margin-bottom: 20px;
  }
  
  h2 {
    font-size: 20px;
    margin-bottom: 40px;
  }
  
  .periodo,
  .anio {
    font-size: 16px;
    margin: 5px 0;
  }
  </style>
  