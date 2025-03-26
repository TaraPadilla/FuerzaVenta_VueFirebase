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
      <v-card-text class="d-flex flex-column align-center">
        <v-img :src="photo" class="photo-preview"></v-img>
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn color="success" @click="uploadPhoto">Subir Foto</v-btn>
        <v-btn color="error" @click="retakePhoto">Repetir Foto</v-btn>
      </v-card-actions>
      <v-card-text v-if="uploadURL">
        <p>Foto subida: <a :href="uploadURL" target="_blank">Ver Imagen</a></p>
      </v-card-text>
    </v-card>

  </v-container>
</template>
<script>
import { auth, db, storage } from "@/firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";
import { onMounted, onUnmounted, ref as vueRef } from "vue";

export default {
  setup() {
    const video = vueRef(null);
    const canvas = vueRef(null);
    const photo = vueRef(null);
    const uploadURL = vueRef(null); // <-- Agregado aquí
    let stream = null;

    onMounted(async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.value.srcObject = stream;
      } catch (error) {
        console.error("Error al acceder a la cámara:", error);
      }
    });

    function takePhoto() {
      const context = canvas.value.getContext("2d");
      canvas.value.width = video.value.videoWidth;
      canvas.value.height = video.value.videoHeight;
      context.drawImage(video.value, 0, 0);
      photo.value = canvas.value.toDataURL("image/png");
    }

    async function uploadPhoto() {
      if (!photo.value) {
        console.error("No hay foto para subir");
        return;
      }

      try {
        const blob = await fetch(photo.value).then((res) => res.blob());
        const fileRef = storageRef(storage, `fotos/${Date.now()}.png`);

        console.log("Subiendo archivo a:", fileRef.fullPath);
        await uploadBytes(fileRef, blob);
        uploadURL.value = await getDownloadURL(fileRef); // <-- Ahora sí está definido

        console.log("Foto subida con URL:", uploadURL.value);

        await addDoc(collection(db, "asistencias"), {
          urlFoto: uploadURL.value,
          usuario: auth.currentUser.displayName, // Reemplazar con el usuario real
          fecha: Timestamp.now(),
        });
        console.log("Foto guardada en Firestore");  

      } catch (error) {
        console.error("Error al subir la foto:", error);
      }
    }

    onUnmounted(() => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    });

    return { video, canvas, photo, uploadPhoto, uploadURL, takePhoto };
  }
};
</script>
