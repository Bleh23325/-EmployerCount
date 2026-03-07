import { createRouter, createWebHistory } from 'vue-router'
import EmployeesPage from '@/views/employees/EmployeesPage.vue'
import CreateEmployeePage from '@/views/employees/CreateEmployeePage.vue'
// Импортируем компоненты для организаций
import OrganizationsPage from '@/views/organizations/OrganizationsPage.vue'
import CreateOrganizationPage from '@/views/organizations/CreateOrganizationPage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: '/employees' // можно оставить или изменить на '/organizations'
  },
  // Маршруты сотрудников
  {
    path: '/employees',
    name: 'employees',
    component: EmployeesPage
  },
  {
    path: '/employees/create',
    name: 'CreateEmployee',
    component: CreateEmployeePage
  },
  // Маршруты организаций
  {
    path: '/organizations',
    name: 'organizations',
    component: OrganizationsPage
  },
  {
    path: '/organizations/create',
    name: 'CreateOrganization',
    component: CreateOrganizationPage
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router