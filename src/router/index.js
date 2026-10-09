import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import AdminDashboard from '../views/AdminDashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: LoginView },
    {
      path: '/',
      component: AdminLayout,
      children: [
        { path: 'dashboard', name: 'dashboard', component: AdminDashboard },
        { path: 'admins', name: 'admins', component: () => import('../views/AdminList.vue') },
        { path: 'admins/create', name: 'admin-create', component: () => import('../views/AdminCreate.vue') },
        { path: 'admins/:id/edit', name: 'admin-edit', component: () => import('../views/AdminEdit.vue') },
        { path: 'users', name: 'users', component: () => import('../views/UserList.vue') },
        { path: 'users/create', name: 'user-create', component: () => import('../views/UserCreate.vue') },
        { path: 'users/:id/edit', name: 'user-edit', component: () => import('../views/UserEdit.vue') },
        { path: 'categories', name: 'categories', component: () => import('../views/CategoryList.vue') },
        { path: 'categories/create', name: 'category-create', component: () => import('../views/CategoryCreate.vue') },
        { path: 'categories/:id/edit', name: 'category-edit', component: () => import('../views/CategoryEdit.vue') },
        { path: 'products', name: 'products', component: () => import('../views/ProductList.vue') },
        { path: 'products/create', name: 'product-create', component: () => import('../views/ProductCreate.vue') },
        { path: 'products/:id/edit', name: 'product-edit', component: () => import('../views/ProductEdit.vue') },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path !== '/login' && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router