<template>
  <v-dialog v-model="dialogVisible" max-width="600">
    <v-card>
      <!-- Título principal con ícono -->
      <v-card-title class="text-h6 d-flex align-center" 
                    style="background-color: #E3F2FD; 
                    color: #1976D2;"
                    >
        <v-icon class="mr-2">mdi-check-circle-outline</v-icon>
        <span v-if="!soloVista">Confirmar Registro de Asistencia</span>
        <span v-if="soloVista">Registro de asistencia</span>
      </v-card-title>

      <v-card-text>
        <div v-if="!soloVista" class="text-subtitle-1 mb-3">
          Revisa los datos del registro y da clic en confirmar:
        </div>

        <v-container>
          <v-row>
            <v-col cols="12" sm="4">
              <strong>Fecha:</strong><br />{{ asistencia.fecha }}
            </v-col>
            <v-col cols="6" sm="4">
              <strong>Hora Entrada:</strong><br />{{ asistencia.hora_entrada }}
            </v-col>
            <v-col cols="6" sm="4">
              <strong>Hora Salida:</strong><br />{{ asistencia.hora_salida }}
            </v-col>
          </v-row>

          <v-divider class="my-1"></v-divider>

          <!-- Zona, supervisor, equipo -->
          <v-row>
            <v-col cols="12" sm="4">
              <strong>Zona:</strong><br />{{ obtenerNombre(zonas, asistencia.zona_id) }}
            </v-col>
            <v-col cols="12" sm="4">
              <strong>Supervisor:</strong><br />{{ obtenerNombre(supervisores, asistencia.supervisor_id) }}
            </v-col>
            <v-col cols="12" sm="4">
              <strong>Equipo:</strong><br />{{ obtenerNombre(equipos, asistencia.equipo_id) }}
            </v-col>
          </v-row>

          <v-divider class="my-2"></v-divider>

          <!-- Tabla de asesores -->
          <v-row>
            <v-col cols="12">
              <strong>Asesores del Día:</strong>
              <v-table class="mt-2" dense>
                <thead>
                  <tr>
                    <th class="text-left">#</th>
                    <th class="text-left">Nombre</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(asesor, i) in asistencia.asesores_dia" :key="i">
                    <td>{{ i + 1 }}</td>
                    <td>{{ asesor }}</td>
                  </tr>
                </tbody>
              </v-table>
            </v-col>
          </v-row>

          <v-divider class="my-2"></v-divider>

          <!-- Foto -->
          <v-row justify="center" v-if="fotoPreview">
            <v-col cols="12" sm="6" class="text-center">
              <v-img
                :src="fotoPreview"
                max-width="200"
                max-height="200"
                contain
                class="rounded-lg elevation-3"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
          <v-btn
            v-if="soloVista"
            color="primary"
            text
            @click="dialogVisible = false"
          >
            Aceptar
          </v-btn>

          <!-- Si no es solo vista, muestra Confirmar / Cancelar -->
          <template v-else>
            <v-btn text color="error" @click="dialogVisible = false">Cancelar</v-btn>
            <v-btn text color="success" @click="emitirConfirmacion">Confirmar</v-btn>
          </template>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
    name: "ConfirmarAsistenciaDialog",
    props: {
        modelValue: Boolean,
        asistencia: Object,
        fotoPreview: String,
        zonas: Array,
        supervisores: Array,
        equipos: Array,
        soloVista: {
          type: Boolean,
          default: false
        }
    },
    emits: ["update:modelValue", "confirmar"],
    computed: {
        dialogVisible: {
            get() {
                return this.modelValue;
            },
            set(valor) {
                this.$emit("update:modelValue", valor);
            }
        }
    },
    methods: {
        obtenerNombre(lista, id) {
            const encontrado = lista.find((item) => item.id === id);
            return encontrado ? encontrado.nombre : "";
        },
        emitirConfirmacion() {
            this.$emit("confirmar");
            this.dialogVisible = false;
        }
    }
};
</script>
