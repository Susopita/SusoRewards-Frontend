<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { sessionStore } from '../../stores/session.svelte';
  import { SseClient } from '../../adapters/sse';
  import { api } from '../../adapters/api';
  import Navbar from '../components/layout/Navbar.svelte';
  import StatsCard from '../components/dashboard/StatsCard.svelte';

  let puntos = $state(150);
  let cashback = $state(25.50);
  let notifications = $state<string[]>([]);
  let sseClient: SseClient | null = null;

  onMount(async () => {
    try {
      const client = await api.get<any>('/clientes/me');
      if (client && client.empresasAfiliadas && client.empresasAfiliadas.length > 0) {
        const empresaId = client.empresasAfiliadas[0];
        const pointsData = await api.get<any>(`/recompensas/puntos/${client.id}/${empresaId}`);
        puntos = pointsData.puntos ?? 0;
        cashback = pointsData.cashback ?? 0.0;
      } else {
        puntos = 0;
        cashback = 0.0;
      }
    } catch (err) {
      console.error('Error al cargar puntos y cashback del cliente:', err);
      puntos = 0;
      cashback = 0.0;
    }

    const token = sessionStore.current?.token;
    sseClient = new SseClient(`/api/notificaciones/stream?token=${token}`);
    sseClient.connect(
      (data: any) => {
        if (data && data.mensaje) {
          notifications = [data.mensaje, ...notifications];
          if (data.puntos !== undefined) puntos = data.puntos;
          if (data.cashback !== undefined) cashback = data.cashback;
        } else if (typeof data === 'string') {
          notifications = [data, ...notifications];
        }
      },
      (error) => {
        console.error('SSE Error:', error);
      }
    );
  });

  onDestroy(() => {
    if (sseClient) {
      sseClient.disconnect();
    }
  });
</script>

<Navbar role="client" username={sessionStore.current?.username || ''} />

<div class="client-dashboard">
  <div class="metrics">
    <StatsCard
      title="Puntos Acumulados"
      value="{puntos} PTS"
      themeClass="gold"
    />
    <StatsCard
      title="Cashback Disponible"
      value="S/. {cashback.toFixed(2)}"
      themeClass="emerald"
    />
  </div>

  <section class="card notification-section">
    <h3>Buzón de Notificaciones (Tiempo Real)</h3>
    {#if notifications.length === 0}
      <p class="empty-state">No tienes notificaciones por el momento.</p>
    {:else}
      <ul class="notification-list" data-testid="notification-list">
        {#each notifications as notification}
          <li class="notification-item">
            <span class="bell">🔔</span>
            <span class="msg">{notification}</span>
          </li>
        {/each}
      </ul>
    {/if}
  </section>
</div>

<style>
  .client-dashboard {
    max-width: 800px;
    margin: 4rem auto;
    padding: 0 1rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  .metrics {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
  .notification-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .empty-state {
    color: var(--text-muted);
    font-style: italic;
  }
  .notification-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 0;
  }
  .notification-item {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    padding: 0.75rem 1rem;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
</style>
