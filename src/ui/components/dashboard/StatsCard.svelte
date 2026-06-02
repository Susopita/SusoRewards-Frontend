<script lang="ts">
  interface Props {
    title: string;
    value: string | number;
    testid?: string;
    themeClass?: string;
  }

  let { title, value, testid, themeClass = '' }: Props = $props();
</script>

<div class="card metric-card {themeClass}">
  <h4>{title}</h4>
  <span class="metric-value" data-testid={testid}>{value}</span>
</div>

<style>
  .metric-card {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1.5rem;
    background: var(--bg-card);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: var(--radius-md);
  }

  .metric-card h4 {
    font-size: 0.9rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0;
  }

  .metric-value {
    font-size: 2rem;
    font-weight: 800;
    color: var(--text-main);
  }

  /* Themes */
  .metric-card.gold {
    border-color: rgba(245, 158, 11, 0.2);
  }
  .metric-card.gold .metric-value {
    color: var(--color-warning);
  }

  .metric-card.emerald {
    border-color: rgba(16, 185, 129, 0.2);
  }
  .metric-card.emerald .metric-value {
    color: var(--color-accent);
  }
</style>
