import { createRouter, createWebHistory } from 'vue-router'
import EmployeesPage from '@/views/employees/EmployeesPage.vue'
import CreateEmployeePage from '@/views/employees/CreateEmployeePage.vue'
//компоненты для организаций
import OrganizationsPage from '@/views/organizations/OrganizationsPage.vue'
import CreateOrganizationPage from '@/views/organizations/CreateOrganizationPage.vue'
import EditOrganizationPage from '@/views/organizations/EditOrganizationPage.vue'
//компоненты для отделов
import DepartmentsPage from '@/views/departments/DepartmentsPage.vue'
import CreateDepartmentPage from '@/views/departments/CreateDepartmentPage.vue'
import EditDepartmentsPage from '@/views/departments/EditDepartmentsPage.vue'
//компоненты для должностей
import PositionsPage from '@/views/positions/PositionsPage.vue'
import CreatePositionsPage from '@/views/positions/CreatePositionsPage.vue'
import EditPositionsPage from '@/views/positions/EditPositionsPage.vue'



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
  },

  {
    path: '/organizations',
    name: 'organizations',
    component: OrganizationsPage
  },
  {
    path: '/organizations/create',
    name: 'CreateOrganization',
    component: CreateOrganizationPage
  },

  {
    path: '/organizations/edit/:id',
    name: 'EditOrganization',
    component: EditOrganizationPage
  },

  {
    path: '/departments',
    name: 'departments',
    component: DepartmentsPage
  },
  {
    path: '/departments/create',
    name: 'CreateDepartment',
    component: CreateDepartmentPage
  },
  {
    path: '/departments/edit/:id',
    name: 'EditDepartment',
    component: EditDepartmentsPage
  },
  {
    path: '/positions',
    name: 'positions',
    component: PositionsPage
  },
  {
    path: '/positions/create',
    name: 'CreatePosition',
    component: CreatePositionsPage

  },
  {
    path: '/positions/edit/:id',
    name: 'EditPosition',
    component: EditPositionsPage

  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router