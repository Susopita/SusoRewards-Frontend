<script lang="ts">
  import { routeStore } from './stores/route.svelte';
  import { sessionStore } from './stores/session.svelte';
  import LandingPage from './ui/pages/LandingPage.svelte';
  import AfiliatePage from './ui/pages/AfiliatePage.svelte';
  import LoginPage from './ui/pages/LoginPage.svelte';
  import DashboardCompany from './ui/pages/DashboardCompany.svelte';
  import DashboardRestaurant from './ui/pages/DashboardRestaurant.svelte';
  import DashboardClient from './ui/pages/DashboardClient.svelte';

  $effect(() => {
    const isAuth = sessionStore.isAuthenticated;
    const currentPath = routeStore.current;

    if (!isAuth && currentPath.startsWith('/dashboard')) {
      routeStore.navigate('/login');
    }

    if (isAuth && (currentPath === '/login' || currentPath === '/afiliate')) {
      const role = sessionStore.current?.role;
      if (role === 'admin') {
        routeStore.navigate('/dashboard-company');
      } else if (role === 'restaurant') {
        routeStore.navigate('/dashboard-restaurant');
      } else {
        routeStore.navigate('/dashboard-client');
      }
    }
  });
</script>

{#if routeStore.current === '/'}
  <LandingPage />
{:else if routeStore.current === '/afiliate'}
  <AfiliatePage />
{:else if routeStore.current === '/login'}
  <LoginPage />
{:else if routeStore.current === '/dashboard-company'}
  <DashboardCompany />
{:else if routeStore.current === '/dashboard-restaurant'}
  <DashboardRestaurant />
{:else if routeStore.current === '/dashboard-client'}
  <DashboardClient />
{:else}
  <div class="not-found">
    <h2>404 - Página no encontrada</h2>
    <button onclick={() => routeStore.navigate('/')}>Volver al inicio</button>
  </div>
{/if}

<style>
  .not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    gap: 1rem;
  }
  
  .not-found button {
    background: var(--color-primary);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: var(--radius-sm);
  }
</style>
