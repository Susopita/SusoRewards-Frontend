<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    title: string;
    subtitle: string;
    goBack: () => void;
    children: Snippet;
  }

  let { title, subtitle, goBack, children }: Props = $props();
</script>

<div class="auth-container">
  <button class="back-link" onclick={goBack} data-testid="back-btn">
    &larr; Volver al inicio
  </button>

  <div class="card auth-card">
    <div class="auth-header">
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>

    {@render children()}
  </div>
</div>

<style>
  .auth-container {
    max-width: 440px;
    margin: 4rem auto;
    padding: 0 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .back-link {
    color: var(--text-muted);
    font-size: 0.9rem;
    text-align: left;
    transition: color var(--transition-fast);
    align-self: flex-start;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
  }

  .back-link:hover {
    color: var(--text-main);
  }

  .auth-card {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .auth-header {
    text-align: center;
  }

  .auth-header h2 {
    font-size: 1.85rem;
    letter-spacing: -0.5px;
    margin-bottom: 0.25rem;
  }

  .auth-header p {
    color: var(--text-muted);
    font-size: 0.95rem;
  }
</style>
