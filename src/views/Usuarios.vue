<template>
    <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <v-form @submit.prevent="registerUser">
            <v-text-field
              label="Correo Electrónico"
              v-model="newUser.email"
              required
              type="email"
            />
            <v-text-field
              label="Contraseña"
              v-model="newUser.password"
              required
              type="password"
            />
            <v-select
              v-model="newUser.role"
              :items="roles"
              label="Rol"
              required
            />
            <v-btn type="submit" color="primary">Registrar Usuario</v-btn>
          </v-form>
        </v-col>
      </v-row>
  
      <!-- Tabla de usuarios -->
      <v-row>
        <v-col cols="12">
          <v-data-table
            :headers="headers"
            :items="users"
            item-key="email"
            class="elevation-1"
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title>Gestión de Usuarios</v-toolbar-title>
              </v-toolbar>
            </template>
  
            <template v-slot:item.role="{ item }">
              <v-select
                v-model="item.role"
                :items="roles"
                @change="updateRole(item)"
                dense
              />
            </template>
  
            <template v-slot:item.actions="{ item }">
              <v-btn
                color="red"
                @click="deleteUser(item.email)"
                icon
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { collection, deleteDoc, doc, getDocs, getFirestore, setDoc } from "firebase/firestore";
  
  export default {
    data() {
      return {
        newUser: {
          email: '',
          password: '',
          role: 'user',
        },
        
        users: [], // Aquí se almacenarán los usuarios obtenidos de Firestore
        roles: ['admin', 'supervisor', 'user'], // Roles disponibles
        headers: [
          { text: 'Correo Electrónico', align: 'start', key: 'email' },
          { text: 'Rol', key: 'role' },
          { text: 'Acciones', key: 'actions' },
        ],
      };
    },
    methods: {
      async registerUser() {
        const auth = getAuth();
        const db = getFirestore();
  
        try {
          // Registrar el usuario en Firebase Authentication
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            this.newUser.email,
            this.newUser.password
          );
  
          // Registrar el usuario en Firestore
          const userRef = doc(db, "usuarios", this.newUser.email);
          await setDoc(userRef, {
            email: this.newUser.email,
            role: this.newUser.role,
            createdAt: new Date(),
          });
  
          // Limpiar formulario
          this.newUser.email = '';
          this.newUser.password = '';
          this.newUser.role = 'user';
  
          // Recargar la lista de usuarios
          this.fetchUsers();
        } catch (error) {
          console.error("Error al registrar el usuario:", error.message);
        }
      },
  
      async fetchUsers() {
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, "usuarios"));
        this.users = querySnapshot.docs.map(doc => doc.data());
      },
  
      async updateRole(user) {
        const db = getFirestore();
        const userRef = doc(db, "usuarios", user.email);
        await setDoc(userRef, { role: user.role }, { merge: true });
      },
  
      async deleteUser(email) {
        const db = getFirestore();
        const userRef = doc(db, "usuarios", email);
        await deleteDoc(userRef);
        this.fetchUsers(); // Recargar la lista después de eliminar
      }
    },
  
    created() {
      this.fetchUsers(); // Cargar la lista de usuarios cuando se cree el componente
    },
  };
  </script>
  
  <style scoped>
  /* Aquí puedes agregar estilos específicos si lo deseas */
  </style>
  