<script lang="ts">
  import { onMount } from 'svelte';
  import { sessionStore } from '../../stores/session.svelte';
  import { api } from '../../adapters/api';
  
  import Navbar from '../components/layout/Navbar.svelte';
  import Alert from '../components/feedback/Alert.svelte';
  
  import TabNavigation from '../components/dashboard/TabNavigation.svelte';
  import DashboardCompanyMetrics from '../components/dashboard/DashboardCompanyMetrics.svelte';
  import DashboardCompanyPrograms from '../components/dashboard/DashboardCompanyPrograms.svelte';
  import DashboardCompanyRestaurants from '../components/dashboard/DashboardCompanyRestaurants.svelte';
  import DashboardCompanyClients from '../components/dashboard/DashboardCompanyClients.svelte';

  // Tabs: 'metrics' | 'programs' | 'restaurants' | 'clients'
  let activeTab = $state<'metrics' | 'programs' | 'restaurants' | 'clients'>('metrics');

  // Loading and alerts
  let loading = $state(false);
  let errorMsg = $state('');
  let successMsg = $state('');

  // --- STATE DATA ---
  let programs = $state([
    { id: '1', nombre: 'Club Oro', beneficios: '10% cashback en cenas', requisitos: 'Consumo mínimo S/. 100', restaurantes: ['1'] },
    { id: '2', nombre: 'Cena Premium', beneficios: 'Postre de cortesía', requisitos: '3 visitas al mes', restaurantes: ['1', '2'] }
  ]);

  let restaurants = $state([
    { id: '1', nombre: 'La Choza Náutica', ruc: '20123456789', email: 'contacto@chozanautica.com', habilitado: true },
    { id: '2', nombre: 'El Hornero', ruc: '20987654321', email: 'reservas@elhornero.pe', habilitado: true }
  ]);

  let clients = $state([
    { id: '1', nombre: 'Juan Pérez', email: 'juan.perez@gmail.com', tarjeta: 'CARD_123', habilitado: true },
    { id: '2', nombre: 'Ana Gómez', email: 'ana.gomez@yahoo.com', tarjeta: 'CARD_456', habilitado: true }
  ]);

  // --- METRICS DATA ---
  const metricTotalClients = $derived(clients.length);
  const metricActivePrograms = $derived(programs.length);
  const metricTotalRestaurants = $derived(restaurants.length);
  
  // Program usage stats (for charts)
  const programUsage = $derived(
    programs.map((p, idx) => ({
      name: p.nombre,
      value: idx === 0 ? 85 : idx === 1 ? 42 : 23
    })).slice(0, 3)
  );

  async function loadAllData() {
    loading = true;
    errorMsg = '';
    try {
      const rawPrograms = await api.get<any[]>('/programas');
      programs = rawPrograms.map(p => ({
        id: p.id,
        nombre: p.name,
        beneficios: p.beneficios || `Regla: ${p.pointsRule} ptos/sol`,
        requisitos: p.requisitos || `Regla: ${p.pointsRule} ptos/sol`,
        restaurantes: p.restaurantes || []
      }));

      const rawRestaurants = await api.get<any[]>('/restaurantes');
      restaurants = rawRestaurants.map(r => ({
        id: r.id,
        nombre: r.name,
        ruc: r.code,
        email: r.email,
        habilitado: r.active !== false
      }));

      const rawClients = await api.get<any[]>('/clientes');
      clients = rawClients.map(c => ({
        id: c.id,
        nombre: c.name,
        email: c.email,
        tarjeta: c.tarjetaCliente,
        habilitado: c.active !== false
      }));
    } catch (err: any) {
      errorMsg = err.message || 'Error al cargar los datos de la empresa.';
    } finally {
      loading = false;
    }
  }

  onMount(async () => {
    await loadAllData();
  });

  // --- ACTIONS: PROGRAMS ---
  async function handleSaveProgram(program: { id?: string; name: string; beneficios: string; requisitos: string; restaurantes: string[] }) {
    loading = true;
    errorMsg = '';
    successMsg = '';
    try {
      if (program.id) {
        const res = await api.put<any>(`/programas/${program.id}`, {
          name: program.name,
          pointsRule: 1,
          active: true,
          beneficios: program.beneficios,
          requisitos: program.requisitos,
          restaurantes: program.restaurantes
        });

        programs = programs.map(p => 
          p.id === program.id 
            ? { ...p, nombre: res.name || program.name, beneficios: program.beneficios, requisitos: program.requisitos, restaurantes: program.restaurantes }
            : p
        );
        successMsg = 'Programa actualizado correctamente.';
      } else {
        const res = await api.post<any>('/programas', {
          name: program.name,
          pointsRule: 1,
          active: true,
          beneficios: program.beneficios,
          requisitos: program.requisitos,
          restaurantes: program.restaurantes
        });

        programs = [...programs, {
          id: res.id,
          nombre: res.name || program.name,
          beneficios: program.beneficios,
          requisitos: program.requisitos,
          restaurantes: program.restaurantes
        }];
        successMsg = 'Programa creado correctamente.';
      }
    } catch (err: any) {
      errorMsg = err.message || 'Error al guardar el programa.';
      throw err;
    } finally {
      loading = false;
    }
  }

  async function handleDeleteProgram(id: string) {
    if (!confirm('¿Estás seguro de que deseas de eliminar este programa?')) return;
    errorMsg = '';
    successMsg = '';
    loading = true;

    try {
      await api.delete(`/programas/${id}`);
      programs = programs.filter(p => p.id !== id);
      successMsg = 'Programa eliminado correctamente.';
    } catch (err: any) {
      errorMsg = err.message || 'Error al eliminar el programa.';
    } finally {
      loading = false;
    }
  }

  // --- ACTIONS: RESTAURANTS ---
  async function handleAddRestaurant(rest: { name: string; ruc: string; email: string }) {
    loading = true;
    errorMsg = '';
    successMsg = '';
    try {
      const res = await api.post<any>('/restaurantes', {
        name: rest.name,
        email: rest.email,
        code: rest.ruc
      });

      restaurants = [...restaurants, {
        id: res.id,
        nombre: res.name || rest.name,
        ruc: res.code || rest.ruc,
        email: res.email || rest.email,
        habilitado: res.active !== false
      }];
      successMsg = 'Restaurante afiliado con éxito.';
    } catch (err: any) {
      errorMsg = err.message || 'Error al afiliar el restaurante.';
      throw err;
    } finally {
      loading = false;
    }
  }

  async function handleToggleRestaurantStatus(id: string, currentStatus: boolean) {
    errorMsg = '';
    successMsg = '';
    loading = true;

    try {
      await api.patch(`/restaurantes/${id}/status`, { active: !currentStatus });
      restaurants = restaurants.map(r => r.id === id ? { ...r, habilitado: !currentStatus } : r);
      successMsg = `Restaurante ${!currentStatus ? 'habilitado' : 'deshabilitado'} correctamente.`;
    } catch (err: any) {
      errorMsg = err.message || 'Error al cambiar el estado del restaurante.';
    } finally {
      loading = false;
    }
  }

  async function handleDeleteRestaurant(id: string) {
    if (!confirm('¿Estás seguro de que deseas desvincular este restaurante?')) return;
    errorMsg = '';
    successMsg = '';
    loading = true;

    try {
      await api.delete(`/restaurantes/${id}`);
      restaurants = restaurants.filter(r => r.id !== id);
      programs = programs.map(p => ({
        ...p,
        restaurantes: p.restaurantes.filter(rId => rId !== id)
      }));
      successMsg = 'Restaurante desvinculado correctamente.';
    } catch (err: any) {
      errorMsg = err.message || 'Error al desvincular el restaurante.';
    } finally {
      loading = false;
    }
  }

  // --- ACTIONS: CLIENTS ---
  async function handleAddClient(client: { name: string; email: string; tarjetaCliente: string }) {
    loading = true;
    errorMsg = '';
    successMsg = '';
    try {
      const res = await api.post<any>('/clientes', {
        name: client.name,
        email: client.email,
        tarjetaCliente: client.tarjetaCliente
      });

      clients = [...clients, {
        id: res.id,
        nombre: res.name || client.name,
        email: res.email || client.email,
        tarjeta: res.tarjetaCliente || client.tarjetaCliente,
        habilitado: res.active !== false
      }];
      successMsg = 'Cliente afiliado con éxito.';
    } catch (err: any) {
      errorMsg = err.message || 'Error al afiliar al cliente.';
      throw err;
    } finally {
      loading = false;
    }
  }

  async function handleToggleClientStatus(id: string, currentStatus: boolean) {
    errorMsg = '';
    successMsg = '';
    loading = true;

    try {
      await api.patch(`/clientes/${id}/status`, { active: !currentStatus });
      clients = clients.map(c => c.id === id ? { ...c, habilitado: !currentStatus } : c);
      successMsg = `Cliente ${!currentStatus ? 'habilitado' : 'deshabilitado'} correctamente.`;
    } catch (err: any) {
      errorMsg = err.message || 'Error al cambiar el estado del cliente.';
    } finally {
      loading = false;
    }
  }

  async function handleDeleteClient(id: string) {
    if (!confirm('¿Estás seguro de que deseas desvincular este cliente?')) return;
    errorMsg = '';
    successMsg = '';
    loading = true;

    try {
      await api.delete(`/clientes/${id}`);
      clients = clients.filter(c => c.id !== id);
      successMsg = 'Cliente desvinculado correctamente.';
    } catch (err: any) {
      errorMsg = err.message || 'Error al desvincular al cliente.';
    } finally {
      loading = false;
    }
  }
</script>

<div class="company-dashboard-wrapper">
  <Navbar
    role="admin"
    username={sessionStore.current?.username || ''}
  />

  <!-- Sidebar + Content Layout -->
  <div class="dashboard-body">
    <!-- Sidebar Navigation -->
    <TabNavigation
      {activeTab}
      onSelect={(tab) => { activeTab = tab; errorMsg = ''; successMsg = ''; }}
    />

    <!-- Main Content Area -->
    <main class="main-content">
      {#if errorMsg}
        <Alert type="danger" message={errorMsg} />
      {/if}

      {#if successMsg}
        <Alert type="success" message={successMsg} />
      {/if}

      <!-- TAB 1: METRICS -->
      {#if activeTab === 'metrics'}
        <DashboardCompanyMetrics
          {metricTotalClients}
          {metricActivePrograms}
          {metricTotalRestaurants}
          {programUsage}
        />
      {/if}

      <!-- TAB 2: PROGRAMS CRUD -->
      {#if activeTab === 'programs'}
        <DashboardCompanyPrograms
          {programs}
          {restaurants}
          {loading}
          onSave={handleSaveProgram}
          onDelete={handleDeleteProgram}
        />
      {/if}

      <!-- TAB 3: RESTAURANTS CRUD -->
      {#if activeTab === 'restaurants'}
        <DashboardCompanyRestaurants
          {restaurants}
          {loading}
          onAdd={handleAddRestaurant}
          onToggleStatus={handleToggleRestaurantStatus}
          onDelete={handleDeleteRestaurant}
        />
      {/if}

      <!-- TAB 4: CLIENTS CRUD -->
      {#if activeTab === 'clients'}
        <DashboardCompanyClients
          {clients}
          {loading}
          onAdd={handleAddClient}
          onToggleStatus={handleToggleClientStatus}
          onDelete={handleDeleteClient}
        />
      {/if}
    </main>
  </div>
</div>

<style>
  .company-dashboard-wrapper {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .dashboard-body {
    flex: 1;
    display: flex;
  }

  .main-content {
    flex: 1;
    padding: 2.5rem;
    overflow-y: auto;
  }
</style>
