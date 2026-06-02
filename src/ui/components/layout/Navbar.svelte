<script lang="ts">
  import { sessionStore } from '../../../stores/session.svelte';
  import { routeStore } from '../../../stores/route.svelte';

  interface Props {
    role: 'admin' | 'restaurant' | 'client';
    username: string;
    restaurantCode?: string;
  }

  let { role, username, restaurantCode }: Props = $props();

  function handleLogout() {
    sessionStore.logout();
    routeStore.navigate('/login');
  }
</script>

<header class="dashboard-header">
  <div class="brand">
    <span class="logo">Suso<span class="logo-accent">Rewards</span></span>
    {#if role === 'admin'}
      <span class="badge admin">Empresa</span>
    {:else if role === 'restaurant'}
      <span class="badge restaurant">Restaurante</span>
    {:else}
      <span class="badge client">Cliente</span>
    {/if}
  </div>
  <div class="user-actions">
    <span>
      {#if role === 'restaurant'}
        Sesión: <strong>{username}</strong>
        {#if restaurantCode}
          <span class="divider">|</span> Código: <strong>{restaurantCode}</strong>
        {/if}
      {:else}
        Hola, <strong>{username}</strong>
      {/if}
    </span>
    <button class="btn-logout" onclick={handleLogout} data-testid="logout-btn">
      Cerrar Sesión
    </button>
  </div>
</header>

<style>
  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2.5rem;
    background: var(--bg-card);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .logo {
    font-size: 1.25rem;
    font-weight: 800;
  }

  .logo-accent {
    background: var(--gradient-premium);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .badge {
    padding: 0.15rem 0.5rem;
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
    font-weight: 700;
  }

  .badge.admin {
    background: rgba(99, 102, 241, 0.15);
    border: 1px solid rgba(99, 102, 241, 0.25);
    color: var(--color-primary);
  }

  .badge.restaurant {
    background: rgba(16, 185, 129, 0.15);
    border: 1px solid rgba(16, 185, 129, 0.25);
    color: var(--color-accent);
  }

  .badge.client {
    background: rgba(245, 158, 11, 0.15);
    border: 1px solid rgba(245, 158, 11, 0.25);
    color: var(--color-warning);
  }

  .user-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 0.9rem;
    color: var(--text-muted);
  }

  .divider {
    color: rgba(255, 255, 255, 0.1);
    margin: 0 0.5rem;
  }

  .btn-logout {
    color: var(--color-danger);
    background: none;
    border: none;
    font-weight: 600;
    cursor: pointer;
    font-size: 0.9rem;
    transition: opacity var(--transition-fast);
  }

  .btn-logout:hover {
    opacity: 0.8;
  }
</style>
