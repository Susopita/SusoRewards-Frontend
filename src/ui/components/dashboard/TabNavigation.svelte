<script lang="ts">
  interface Props {
    activeTab: 'metrics' | 'programs' | 'restaurants' | 'clients';
    onSelect: (tab: 'metrics' | 'programs' | 'restaurants' | 'clients') => void;
  }
  let { activeTab, onSelect }: Props = $props();
</script>

<aside class="sidebar-nav">
  <button 
    class="nav-tab {activeTab === 'metrics' ? 'active' : ''}" 
    onclick={() => onSelect('metrics')}
    data-testid="tab-metrics-btn"
  >
    📊 Métricas Generales
  </button>
  <button 
    class="nav-tab {activeTab === 'programs' ? 'active' : ''}" 
    onclick={() => onSelect('programs')}
    data-testid="tab-programs-btn"
  >
    🏆 Programas de Recompensas
  </button>
  <button 
    class="nav-tab {activeTab === 'restaurants' ? 'active' : ''}" 
    onclick={() => onSelect('restaurants')}
    data-testid="tab-restaurants-btn"
  >
    🍴 Restaurantes Afiliados
  </button>
  <button 
    class="nav-tab {activeTab === 'clients' ? 'active' : ''}" 
    onclick={() => onSelect('clients')}
    data-testid="tab-clients-btn"
  >
    👤 Gestión de Clientes
  </button>
</aside>

<style>
  .sidebar-nav {
    width: 250px;
    background: var(--bg-card);
    border-right: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    flex-direction: column;
    padding: 1.5rem 1rem;
    gap: 0.5rem;
  }

  .nav-tab {
    text-align: left;
    padding: 0.75rem 1rem;
    border: 1px solid transparent;
    background: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    font-size: 0.95rem;
    color: var(--text-muted);
    transition: all var(--transition-fast);
  }

  .nav-tab:hover {
    color: var(--text-main);
    background: rgba(255, 255, 255, 0.02);
  }

  .nav-tab.active {
    color: var(--color-primary);
    background: rgba(37, 99, 235, 0.08);
    border: 1px solid rgba(37, 99, 235, 0.15);
    font-weight: 600;
  }
</style>
