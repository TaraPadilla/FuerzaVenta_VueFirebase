import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import Camera from '../views/Camera.vue'
import Control from '../views/Control.vue'
import EquiposView from '../views/EquiposView.vue'
import HistoricoView from '../views/HistoricoView.vue'
import UsuariosView from '../views/UsuariosView.vue'
import ZonasView from '../views/ZonasView.vue'

const routes = [
  {
    path: '/',
    redirect: '/layout/control',
  },  
  {
    path: '/layout',
    component: DefaultLayout,
    children: [
      {
        path: 'control',
        name: 'Control',
        component: Control,
      },
      {
        path: 'camera',
        name: 'Camera',
        component: Camera,
      },
      {
        path: 'usuarios',
        name: 'Usuarios',
        component: UsuariosView,
      },
      {
        path: 'equipos',
        name: 'equipos',
        component: EquiposView,
      },
      {
        path: 'zonas',
        name: 'zonas',
        component: ZonasView,
      },
      {
        path: 'historico',
        name: 'historico',
        component: HistoricoView,
      },
      {
        path: 'informe',
        name: 'informe',
        component: () => import('../views/InformeView.vue'),
        props: true
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
