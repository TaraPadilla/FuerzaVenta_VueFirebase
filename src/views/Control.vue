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
    <v-row>
      <v-col cols="12" class="d-flex justify-center" v-if="fotoPreview">
        <v-img 
          :src="fotoPreview" 
          class="photo-preview" 
          max-width="150" 
          max-height="150" 
          style="border: 1px solid #ccc; border-radius: 8px;" 
          contain 
        />
      </v-col>
    </v-row>

    <!-- Botones de Cámara y PDF (conservados) -->
    <v-row>
      <v-col cols="12" class="text-center">
        <v-btn color="primary" @click="irACamara">Tomar Foto</v-btn>
        <v-btn color="info" class="mx-2" @click="$refs.inputFoto.click()">
          Cargar Foto
        </v-btn>
        <input
          ref="inputFoto"
          type="file"
          accept="image/*"
          @change="manejarCargaFoto"
          style="display: none"
        />

        <v-btn color="secondary" @click="descargarPDF" class="mx-2">
          Descargar PDF
        </v-btn>
      </v-col>
    </v-row>

    <!-- Campo para la URL de la foto -->
    <!-- <v-row>
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
    </v-row> -->

    <!-- Botón para registrar la asistencia -->
    <v-row>
      <v-col class="text-center">
        <v-btn color="success" :disabled="!fotoPreview" @click="registrarAsistencia">
          Registrar Asistencia
        </v-btn>
      </v-col>
    </v-row>
    <v-dialog v-model="dialogErrores" max-width="500">
        <v-card>
          <v-card-title class="text-h6">Aviso</v-card-title>
          <v-card-text>
            <div v-if="Array.isArray(mensajesErrores)">
              <v-list dense>
                <v-list-item v-for="(error, index) in mensajesErrores" :key="index">
                  <v-list-item-content>{{ error }}</v-list-item-content>
                </v-list-item>
              </v-list>
            </div>
            <div v-else>
              {{ mensajesErrores }}
            </div>
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
import { auth, storage } from "@/firebase";
import { obtenerZonas } from "@/services/zonasService";
import { generatePDF } from "@/utils/generatePDF";
import { getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { crearAsistencia } from "../services/asistenciaService";
import { obtenerEquipos } from "../services/equiposService";
import { obtenerUsuariosSupervisores } from "../services/usuariosService";
import { nombresAmigables, validarAsistencia } from "../services/validationService";
import { tempFoto } from "../stores/tempFoto";


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
    const fotoPreview = ref(null);
    const router = useRouter();
    
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

    onMounted(async () => {
      const guardada = sessionStorage.getItem("asistenciaTemporal");
      // Carga datos base primero
      await cargarZonas();
      await cargarSupervisores();
      await cargarEquipos(); // Esperamos que se llene equipos.value

      if (guardada) {
        asistencia.value = JSON.parse(guardada);
        sessionStorage.removeItem("asistenciaTemporal");
        console.log("Asistencia restaurada desde sessionStorage:", asistencia.value);

        if (!asistencia.value.asesores_dia || asistencia.value.asesores_dia.length === 0) {
          cargarAsesoresPorEquipo();
        }
        } else {
          console.log("No hay asistencia guardada en sessionStorage");
        }

      if (tempFoto.fotoBase64) { 
        console.log('tempFoto:', tempFoto.fotoBase64);
        fotoPreview.value = tempFoto.fotoBase64;
      }
    });

    const manejarCargaFoto = (evento) => {
      const archivo = evento.target.files[0];
      if (!archivo) return;

      const lector = new FileReader();
      lector.onload = () => {
        const base64 = lector.result;
        fotoPreview.value = base64;
        tempFoto.fotoBase64 = base64;
      };
      lector.readAsDataURL(archivo);
    };


    function irACamara() {
      try {
        sessionStorage.setItem("asistenciaTemporal", JSON.stringify(asistencia.value));
        console.log("Guardando asistencia temporal:", asistencia.value);
        router.push("/layout/camera");
      } catch (err) {
        console.error("Error en router.push:", err);
      }
    }

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

      // 1. Verificar que haya una foto
      if (!tempFoto.fotoBase64) {
        mensajesErrores.value = "Primero toma o carga una foto para guardar la asistencia";
        dialogErrores.value = true;
        return;
      }

      try {
        // 2. Convertir base64 a blob
        const blob = await fetch(tempFoto.fotoBase64).then(res => res.blob());

         // 3. Subir a Firebase Storage
        const fileRef = storageRef(storage, `fotos/${Date.now()}.png`);
        await uploadBytes(fileRef, blob);
        const downloadURL = await getDownloadURL(fileRef);

        // 4. Asignar URL a la asistencia
        asistencia.value.foto_url = downloadURL;

        // 5. Guardar asistencia como antes
        await crearAsistencia(asistencia.value);
        mensajesErrores.value = "Asistencia guardada con éxito";
        dialogErrores.value = true;

        // 6. Limpiar todo tras guardar exitosamente
        asistencia.value = {
          zona_id: "",
          supervisor_id: "",
          equipo_id: "",
          asesores_dia: [],
          fecha: new Date().toISOString().split("T")[0],
          hora_entrada: "08:00",
          hora_salida: "17:00",
          foto_url: ""
        };

        fotoPreview.value = null;
        asesorTemporal.value = "";
        tempFoto.fotoBase64 = null;

      } catch (error) {
        mensajesErrores.value = "Error al guardar la asistencia";
        dialogErrores.value = true;
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
      mensajesErrores,
      fotoPreview,
      irACamara,
      manejarCargaFoto
    };
  },
};
</script>
