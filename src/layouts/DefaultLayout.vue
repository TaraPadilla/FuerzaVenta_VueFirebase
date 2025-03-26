<template>
  <v-app>
    <!-- Menú lateral (sidebar) -->
    <v-navigation-drawer v-model="drawer" app :permanent="!isMobile">
      <v-list dense>
        <!-- Opciones del menú disponibles para todos -->
        <v-list-item @click="router.push('/layout/control')">
          <v-list-item-content>
            <v-list-item-title>Registro de asistencias</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="router.push('/layout/equipos')">
          <v-list-item-content>
            <v-list-item-title>Gestión de Equipos</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="router.push('/layout/zonas')">
          <v-list-item-content>
            <v-list-item-title>Gestión de Zonas</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="router.push('/layout/usuarios')">
          <v-list-item-content>
            <v-list-item-title>Gestión de Usuarios</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="router.push('/layout/historico')">
          <v-list-item-content>
            <v-list-item-title>Historico de asistencias</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="logout">
          <v-list-item-content>
            <v-list-item-title>Cerrar sesión</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Barra de navegación superior -->
    <v-app-bar app dense>
      <v-btn icon @click="toggleDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-typography variant="h6">
        Bienvenido, {{ user?.displayName || 'Invitado' }}
      </v-typography>
    </v-app-bar>

    <!-- Contenido principal -->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

export default {
  setup() {
    const drawer = ref(true); // Se inicia abierto en PC
    const isMobile = ref(false);
    const router = useRouter();
    
    // Autenticación y usuario
    const { user, logout } = useAuth(); // Composable de autenticación

    const checkScreenSize = () => {
      isMobile.value = window.innerWidth < 960; // Cambia a menú cerrado en móviles
      drawer.value = !isMobile.value; // En PC se mantiene abierto
    };

    const toggleDrawer = () => {
      drawer.value = !drawer.value; // Alternar el estado del menú lateral
    };

    onMounted(() => {
      checkScreenSize();
      window.addEventListener('resize', checkScreenSize);
    });

    return {
      drawer,
      isMobile,
      user,
      logout,
      router,
      toggleDrawer,
    };
  },
};
</script>

<style scoped>
/* Personalización de estilos del layout si es necesario */
</style>
