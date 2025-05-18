import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/challenges',
      name: 'challenges',
      component: () => import('../views/ChallengesView.vue'),
      meta: { requiresAuth: true }, // Add meta field for protected routes
    },
    {
      path: '/leaderboard',
      name: 'leaderboard',
      component: () => import('../views/LeaderboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/stats',
      name: 'stats',
      component: () => import('../views/StatsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/tank',
      name: 'tank',
      component: () => import('../views/TankView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
      meta: { requiresAuth: true },
    },
  ],
});

// Add a global navigation guard
router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('authToken'); // Retrieve the token from sessionStorage
  const userRole = sessionStorage.getItem('userRole'); // Retrieve the user's role

  if (to.meta.requiresAuth && !token) {
    // If the route requires authentication and no token is found, redirect to home
    next({ name: 'home' });
  } else if (to.name === 'admin' && userRole !== 'admin') {
    // If the user tries to access the AdminView but is not an admin, redirect to home
    next({ name: 'home' });
  } else {
    next(); // Allow navigation
  }
});

export default router;
