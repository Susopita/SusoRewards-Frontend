<script lang="ts">
  interface Usage {
    name: string;
    value: number;
  }

  interface Props {
    programUsage: Usage[];
    metricTotalClients: number;
    metricTotalRestaurants: number;
    metricActivePrograms: number;
  }

  let { programUsage, metricTotalClients, metricTotalRestaurants, metricActivePrograms }: Props = $props();
</script>

<div class="charts-section">
  <!-- Chart 1: Bar Chart -->
  <div class="card chart-card">
    <h3>Participación por Programa</h3>
    <div class="chart-container">
      <svg viewBox="0 0 400 200" width="100%" height="100%" class="svg-chart">
        <!-- Grid Lines -->
        <line x1="50" y1="150" x2="350" y2="150" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
        <line x1="50" y1="100" x2="350" y2="100" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4" stroke-width="1" />
        <line x1="50" y1="50" x2="350" y2="50" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4" stroke-width="1" />
        
        <!-- Y Axis Labels -->
        <text x="40" y="153" fill="var(--text-muted)" font-size="10" text-anchor="end">0</text>
        <text x="40" y="103" fill="var(--text-muted)" font-size="10" text-anchor="end">50</text>
        <text x="40" y="53" fill="var(--text-muted)" font-size="10" text-anchor="end">100</text>

        <!-- Bars -->
        {#each programUsage as item, i}
          {@const xPos = 80 + i * 100}
          {@const barHeight = item.value}
          <rect 
            x={xPos} 
            y={150 - barHeight} 
            width="40" 
            height={barHeight} 
            rx="4" 
            fill="url(#indigo-pink-gradient)" 
            class="chart-rect"
          />
          <!-- Bar Value label -->
          <text x={xPos + 20} y={145 - barHeight} fill="white" font-size="9" text-anchor="middle" font-weight="600">{item.value}</text>
          <!-- X Label -->
          <text x={xPos + 20} y="170" fill="var(--text-muted)" font-size="10" text-anchor="middle">{item.name}</text>
        {/each}

        <defs>
          <linearGradient id="indigo-pink-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#6366f1" />
            <stop offset="100%" stop-color="#ec4899" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  </div>

  <!-- Chart 2: Pie Chart -->
  <div class="card chart-card">
    <h3>Distribución de Afiliados</h3>
    <div class="chart-container pie-container">
      <svg viewBox="0 0 200 200" width="100%" height="100%">
        <!-- Donut chart -->
        <circle cx="100" cy="100" r="70" fill="transparent" stroke="rgba(255,255,255,0.03)" stroke-width="25" />
        
        <!-- Segment 1: Clients -->
        <!-- Circumference = 2 * PI * r = 2 * 3.14159 * 70 = 439.8 -->
        <circle cx="100" cy="100" r="70" fill="transparent" 
          stroke="var(--color-primary)" 
          stroke-width="25" 
          stroke-dasharray="260 440" 
          stroke-dashoffset="0"
          transform="rotate(-90 100 100)"
        />
        <!-- Segment 2: Restaurants -->
        <circle cx="100" cy="100" r="70" fill="transparent" 
          stroke="var(--color-secondary)" 
          stroke-width="25" 
          stroke-dasharray="100 440" 
          stroke-dashoffset="-260"
          transform="rotate(-90 100 100)"
        />
        <!-- Segment 3: Programs -->
        <circle cx="100" cy="100" r="70" fill="transparent" 
          stroke="var(--color-accent)" 
          stroke-width="25" 
          stroke-dasharray="80 440" 
          stroke-dashoffset="-360"
          transform="rotate(-90 100 100)"
        />
        
        <text x="100" y="105" fill="white" font-size="12" font-weight="bold" text-anchor="middle">SusoRewards</text>
      </svg>

      <div class="chart-legend">
        <div class="legend-item"><span class="color-dot primary"></span>Clientes ({metricTotalClients})</div>
        <div class="legend-item"><span class="color-dot secondary"></span>Locales ({metricTotalRestaurants})</div>
        <div class="legend-item"><span class="color-dot accent"></span>Programas ({metricActivePrograms})</div>
      </div>
    </div>
  </div>
</div>

<style>
  .charts-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  .chart-card {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
    background: var(--bg-card);
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .chart-card h3 {
    margin: 0;
    font-size: 1.1rem;
  }

  .chart-container {
    height: 220px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .svg-chart {
    height: 100%;
  }

  .pie-container {
    flex-direction: column;
    gap: 1rem;
    height: auto;
  }

  .chart-legend {
    display: flex;
    gap: 1rem;
    font-size: 0.8rem;
    color: var(--text-muted);
    justify-content: center;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .color-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .color-dot.primary {
    background: var(--color-primary);
  }

  .color-dot.secondary {
    background: var(--color-secondary);
  }

  .color-dot.accent {
    background: var(--color-accent);
  }

  .chart-rect {
    transition: opacity var(--transition-fast);
  }

  .chart-rect:hover {
    opacity: 0.85;
  }
</style>
