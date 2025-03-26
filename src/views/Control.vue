<template>
  <v-container>

    <!-- Encabezado / Saludo -->
    <v-row>
      <v-col cols="12">
        <v-typography variant="h2" class="text-center">
          Bienvenido, {{ user?.displayName || user?.email }}
        </v-typography>
      </v-col>
    </v-row>
    <v-row class="mt-5">
      <v-col cols="12" md="4">
        <v-text-field
          label="Fecha"
          v-model="asistencia.fecha"
          type="date"
          outlined
          dense
        />
      </v-col>
      <v-col cols="12" md="4">
        <!-- Hora de entrada y salida -->
        <v-text-field
          label="Hora de Entrada"
          v-model="asistencia.hora_entrada"
          type="time"
          outlined
          dense
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          label="Hora de Salida"
          v-model="asistencia.hora_salida"
          type="time"
          outlined
          dense
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="4">
                <!-- Combo de Equipo -->
                <v-select
          v-model="asistencia.equipo_id"
          :items="equipos"
          item-title="nombre"
          item-value="id"
          label="Selecciona un equipo"
          required
          outlined
          dense
          @update:modelValue="cargarAsesoresPorEquipo"
        />
      </v-col>
        <!-- Combo de Zona -->
        <v-col cols="12" md="4">
        <v-select
            v-model="asistencia.zona_id"
            :items="zonas"
            item-title="nombre"
            item-value="id"
            label="Selecciona una Zona"
            required
        ></v-select>
        </v-col>
       <!-- Combo de Supervisor -->
      <v-col cols="12" md="4">
        <v-select
          label="Supervisor"
          :items="supervisores"
          item-title="nombre"
          item-value="id"
          v-model="asistencia.supervisor_id"
          outlined
          dense
        />
     </v-col>
    </v-row>

    <!-- ASESOR(ES) -->
    <v-row>
      <v-col cols="12">
        <!-- Campo para agregar un asesor con ícono de "plus" -->
        <v-text-field
          v-model="asesorTemporal"
          label="Agregar asesor (nombre y apellido)"
          append-inner-icon="mdi-plus"
          @click:append-inner="agregarAsesor"
          outlined
          dense
        />

        <!-- Chips con asesores cargados o agregados -->
        <v-chip-group v-if="asistencia.asesores_dia.length">
          <v-chip
            v-for="(asesor, index) in asistencia.asesores_dia"
            :key="index"
            closable
            @click:close="eliminarAsesor(index)"
          >
            {{ asesor }}
          </v-chip>
        </v-chip-group>
      </v-col>
    </v-row>

    <!-- Botones de Cámara y PDF (conservados) -->
    <v-row>
      <v-col cols="12" class="text-center">
        <router-link to="/layout/camera">
          <v-btn color="primary" class="mx-2">
            Ir a la Cámara
          </v-btn>
        </router-link>

        <v-btn color="secondary" @click="descargarPDF" class="mx-2">
          Descargar PDF
        </v-btn>
      </v-col>
    </v-row>

    <!-- Campo para la URL de la foto -->
    <v-row>
      <v-col cols="12">
        <v-text-field
          label="URL de la foto"
          v-model="asistencia.foto_url"
          readonly
          outlined
          dense
          disabled
        />
      </v-col>
    </v-row>

    <!-- Botón para registrar la asistencia -->
    <v-row>
      <v-col class="text-center">
        <v-btn color="success" @click="registrarAsistencia">
          Registrar Asistencia
        </v-btn>
      </v-col>
    </v-row>
    <v-dialog v-model="dialogErrores" max-width="500">
      <v-card>
        <v-card-title class="text-h6">Campos incompletos</v-card-title>
        <v-card-text>
          <v-list dense>
            <v-list-item v-for="(error, index) in mensajesErrores" :key="index">
              <v-list-item-content>{{ error }}</v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialogErrores = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { auth } from "@/firebase";
import { obtenerZonas } from "@/services/zonasService";
import { generatePDF } from "@/utils/generatePDF";
import { onMounted, ref } from "vue";
import { crearAsistencia } from "../services/asistenciaService";
import { obtenerEquipos } from "../services/equiposService";
import { obtenerUsuariosSupervisores } from "../services/usuariosService";
import { nombresAmigables, validarAsistencia } from "../services/validationService";


export default {
  setup() {
    const user = ref(auth.currentUser);
    const zonas = ref([]);
    const supervisores = ref([]);
    const equipos = ref([]);
    const fecha = ref(new Date().toISOString().split("T")[0]);
    const dialogErrores = ref(false);
    const mensajesErrores = ref([]);
    const errores = ref([]);

    const asistencia = ref({
      zona_id: "",
      supervisor_id: "",
      equipo_id: "",
      asesores_dia: [],
      fecha: ref(new Date().toISOString().split("T")[0]), // Mantiene la reactividad
      hora_entrada: "08:00",
      hora_salida: "17:00",
      foto_url: ""
    });

    const asesorTemporal = ref("");
    const descargarPDF = () => {
      generatePDF();
    };

    // Se dispara cuando cambian de equipo en el combo
    const cargarAsesoresPorEquipo = () => {
      console.log('entro')
      const equipoSeleccionado = equipos.value.find(
        (eq) => eq.id === asistencia.value.equipo_id
      )
      console.log(equipoSeleccionado)
      if (equipoSeleccionado) {
        // Asegúrate de que 'asesores' exista en el objeto
        asistencia.value.asesores_dia = equipoSeleccionado.asesores
          ? [...equipoSeleccionado.asesores]
          : []
      } else {
        // Si no se encontró o no tenía asesores, vacías la lista
        asistencia.value.asesores_dia = []
      }
    }


    // Agrega un asesor a la lista
    const agregarAsesor = () => {
      if (asesorTemporal.value.trim()) {
        asistencia.value.asesores_dia.push(asesorTemporal.value.trim());
        asesorTemporal.value = "";
      }
    };

    // Elimina un asesor de la lista
    const eliminarAsesor = (index) => {
      asistencia.value.asesores_dia.splice(index, 1);
    };

    // Registra la asistencia
    const registrarAsistencia = async () => {
      console.log("Registrando asistencia:", asistencia.value);
      const errores = validarAsistencia(asistencia.value);
      console.log("Errores:", errores);

      if (Object.keys(errores).length > 0) {
        mensajesErrores.value = Object.entries(errores).map(
          ([campo, mensaje]) => `${nombresAmigables[campo] || campo}: ${mensaje}`
        );
        dialogErrores.value = true;
        return;
      }

      try {
        await crearAsistencia(asistencia.value);
        alert("Asistencia guardada con éxito");
      } catch (error) {
        console.error("Error al guardar la asistencia:", error);
        alert("Error al guardar la asistencia");
      }
    };


    const cargarZonas = async () => {
      zonas.value = await obtenerZonas();
    };

    const cargarSupervisores = async () => {
      supervisores.value = await obtenerUsuariosSupervisores();
    };

    const cargarEquipos = async () => {
      equipos.value = await obtenerEquipos();
    };

    onMounted(() => {
      cargarZonas();
      cargarSupervisores();
      cargarEquipos();
    });

    return {
      user,
      zonas,
      supervisores,
      equipos,
      asistencia,
      asesorTemporal,
      // Métodos
      descargarPDF,
      cargarAsesoresPorEquipo,
      agregarAsesor,
      eliminarAsesor,
      registrarAsistencia,
      // Carga de combos
      cargarZonas,
      cargarSupervisores,
      cargarEquipos,
      dialogErrores,
      mensajesErrores
    };
  },
};
</script>
