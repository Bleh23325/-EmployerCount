import { createRouter, createWebHistory } from 'vue-router'
import EmployeesPage from '@/views/employees/EmployeesPage.vue'
import CreateEmployeePage from '@/views/employees/CreateEmployeePage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: '/employees'
  },
  {
    path: '/employees',
    name: 'employees',
    component: EmployeesPage
  },
  {
    path: '/employees/create',
    name: 'CreateEmployee',
    component: CreateEmployeePage
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router