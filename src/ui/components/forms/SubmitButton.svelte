<script lang="ts">
  interface Props {
    loading: boolean;
    text: string;
    loadingText: string;
    testid?: string;
    disabled?: boolean;
  }

  let { loading, text, loadingText, testid, disabled = false }: Props = $props();
</script>

<button type="submit" class="btn-primary w-full" disabled={loading || disabled} data-testid={testid}>
  {#if loading}
    <div class="spinner" data-testid="loading-spinner"></div>
    <span>{loadingText}</span>
  {:else}
    <span>{text}</span>
  {/if}
</button>

<style>
  .w-full {
    width: 100%;
  }

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }
</style>
