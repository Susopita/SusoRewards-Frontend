<script lang="ts">
  import StatsCard from './StatsCard.svelte';
  import ChartPanel from './ChartPanel.svelte';

  interface Props {
    metricTotalClients: number;
    metricActivePrograms: number;
    metricTotalRestaurants: number;
    programUsage: { name: string; value: number }[];
  }

  let {
    metricTotalClients,
    metricActivePrograms,
    metricTotalRestaurants,
    programUsage
  }: Props = $props();
</script>

<section class="tab-panel animate-fade">
  <h2 class="tab-title premium-gradient-text">Métricas de Rendimiento</h2>
  
  <div class="metrics-grid">
    <StatsCard title="Clientes Registrados" value={metricTotalClients} testid="metric-clients" />
    <StatsCard title="Programas Activos" value={metricActivePrograms} testid="metric-programs" />
    <StatsCard title="Restaurantes Vinculados" value={metricTotalRestaurants} testid="metric-restaurants" />
  </div>

  <ChartPanel
    {programUsage}
    {metricTotalClients}
    {metricTotalRestaurants}
    {metricActivePrograms}
  />
</section>

<style>
  .tab-title {
    font-size: 1.75rem;
    margin-top: 0;
    margin-bottom: 1.5rem;
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .tab-panel {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
</style>
