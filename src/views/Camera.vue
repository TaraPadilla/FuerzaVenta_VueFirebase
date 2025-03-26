<template>
  <v-container class="d-flex flex-column justify-center align-center" :class="{ 'fullscreen-mode': photo }">
    
    <!-- Vista para tomar la foto -->
    <v-card v-if="!photo" class="video-card">
      <v-card-text class="d-flex flex-column align-center">
        <video ref="video" autoplay class="video-preview"></video>
        <canvas ref="canvas" style="display: none;"></canvas>
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn color="primary" @click="takePhoto">Capturar</v-btn>
        <v-btn color="secondary" v-if="hasMultipleCameras" @click="switchCamera">Cambiar Cámara</v-btn>
      </v-card-actions>
    </v-card>

    <!-- Vista para mostrar la foto tomada -->
    <v-card v-if="photo" class="photo-card">
      <v-card-title class="text-h5">Foto Capturada</v-card-title>
      <v-card-text class="d-flex flex-column align-center">
        <img :src="photo" class="photo-preview" style="max-width: 100%; border: 1px solid #ccc;" />
      </v-card-text>
      <v-card-actions class="justify-center">
        <!-- <v-btn color="success" @click="uploadPhoto">Subir Foto</v-btn> -->
        <v-btn color="error" @click="retakePhoto">Repetir Foto</v-btn>
        <v-btn color="success" @click="uploadPhoto">Usar Foto</v-btn>

      </v-card-actions>
      <v-card-text v-if="photo">
        <p>Foto subida: <a :href="uploadURL" target="_blank">Ver Imagen</a></p>
      </v-card-text>
    </v-card>

  </v-container>
</template>
<script>
import { onMounted, onUnmounted, ref as vueRef } from "vue";
import { useRouter } from "vue-router";
import { tempFoto } from "../stores/tempFoto";



export default {
  setup() {
    const video = vueRef(null);
    const canvas = vueRef(null);
    const photo = vueRef(null);
    const uploadURL = vueRef(null); // <-- Agregado aquí
    let stream = null;
    const router = useRouter();

    onMounted(async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.value.srcObject = stream;
      } catch (error) {
        console.error("Error al acceder a la cámara:", error);
      }
    });

    onUnmounted(() => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    })

    async function retakePhoto() {
      photo.value = null;
      uploadURL.value = null;

      // Si ya había un stream anterior, lo detenemos
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.value.srcObject = stream;
      } catch (error) {
        console.error("Error al reiniciar la cámara:", error);
      }
    }


    // function takePhoto() {
    //   const context = canvas.value.getContext("2d");
    //   canvas.value.width = video.value.videoWidth;
    //   canvas.value.height = video.value.videoHeight;
    //   context.drawImage(video.value, 0, 0);
    //   photo.value = canvas.value.toDataURL("image/png");
    // }

    function takePhoto() {
      const context = canvas.value.getContext("2d");
      canvas.value.width = video.value.videoWidth;
      canvas.value.height = video.value.videoHeight;
      context.drawImage(video.value, 0, 0);

      photo.value = canvas.value.toDataURL("image/png");
      console.log("Base64:", photo.value);

      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      video.value.srcObject = null;
    }

    async function uploadPhoto() {
      if (!photo.value) {
        console.error("No hay foto para subir");
        return;
      }

        try {
            // Luego, al final de uploadPhoto() o donde tú decidas:
            tempFoto.fotoBase64 = photo.value;
            router.push("/layout/control");
        } catch (error) {
          console.error("Error al subir la foto:", error);
        }
    }

    // async function uploadPhoto() {
    //   if (!photo.value) {
    //     console.error("No hay foto para subir");
    //     return;
    //   }

    //   try {
    //     const blob = await fetch(photo.value).then((res) => res.blob());
    //     const fileRef = storageRef(storage, `fotos/${Date.now()}.png`);

    //     console.log("Subiendo archivo a:", fileRef.fullPath);
    //     await uploadBytes(fileRef, blob);
    //     uploadURL.value = await getDownloadURL(fileRef); // <-- Ahora sí está definido

    //     console.log("Foto subida con URL:", uploadURL.value);

    //     await addDoc(collection(db, "asistencias"), {
    //       urlFoto: uploadURL.value,
    //       usuario: auth.currentUser.displayName, // Reemplazar con el usuario real
    //       fecha: Timestamp.now(),
    //     });
    //     console.log("Foto guardada en Firestore");  

    //   } catch (error) {
    //     console.error("Error al subir la foto:", error);
    //   }
    // }

    return { video, canvas, photo, uploadPhoto, uploadURL, takePhoto,
      retakePhoto };
  }
};
</script>
