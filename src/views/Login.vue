<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="6" md="4">
        <!-- Formulario de login con email y contraseña -->
        <v-form @submit.prevent="login">
          <v-text-field
            v-model="email"
            label="Correo Electrónico"
            type="email"
            required
          />
          <v-text-field
            v-model="password"
            label="Contraseña"
            type="password"
            required
          />
          <v-btn type="submit" color="primary" block>Iniciar sesión</v-btn>
          <v-alert v-if="errorMessage" type="error" class="mt-3">
            {{ errorMessage }}
          </v-alert>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import { deleteUser, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const auth = getAuth();
    const db = getFirestore();
    const router = useRouter();

    const email = ref("");
    const password = ref("");
    const loginMethod = ref("email"); // Puede ser "email" o "google"
    const errorMessage = ref("");

    // Login con Email y Contraseña
    const login = async () => {
      if (!email.value || !password.value) {
        errorMessage.value = "Por favor ingrese correo y contraseña";
        return;
      }

      try {
        // Autenticación con Email y Contraseña
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
        console.log("Usuario autenticado:", userCredential.user.email);
        const user = userCredential.user;
        await checkUserRole(user);  // Verificar el rol del usuario
      } catch (error) {
        errorMessage.value = "Credenciales incorrectas: " + error.message;
      }
    };

    // Verificación del rol del usuario
    const checkUserRole = async (user) => {
      const userEmail = user.email.toLowerCase();
      console.log("Verificando rol de usuario:", userEmail);
      const q = query(collection(db, "usuarios"), where("email", "==", userEmail));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        try {
          await deleteUser(user);
          console.log("Usuario eliminado de Firebase Auth porque no estaba registrado en Firestore");
        } catch (err) {
          console.error("Error al eliminar el usuario de Firebase Auth:", err);
        }
        errorMessage.value = "Usuario no registrado en el sistema";
        return;
      }


      const userData = querySnapshot.docs[0].data();
      console.log("Datos del usuario:", userData);
      console.log("Rol del usuario:", userData.role);
      if (userData.role === "admin") {
        router.push("/layout/control");
      } else if (userData.role === "supervisor") {
        router.push("/layout/control");
      } else {
        errorMessage.value = "Usuario sin rol asignado";
      }
    };

    return { email, password, loginMethod, errorMessage, login };
  }
};
</script>

<style scoped>
/* Estilos personalizados para hacer el formulario más agradable */
.v-btn {
  margin-top: 20px;
}
</style>
