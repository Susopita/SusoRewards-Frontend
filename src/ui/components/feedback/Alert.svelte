<script lang="ts">
  interface Props {
    type: 'danger' | 'success';
    message: string;
  }

  let { type, message }: Props = $props();
</script>

<div class="alert alert-{type}" data-testid="{type === 'danger' ? 'error-alert' : 'success-alert'}">
  {message}
</div>

<style>
  .alert {
    padding: 0.75rem 1rem;
    border-radius: var(--radius-md);
    font-size: 0.9rem;
    line-height: 1.4;
    width: 100%;
    box-sizing: border-box;
  }

  .alert-danger {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
    color: #fca5a5;
  }

  .alert-success {
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.2);
    color: #a7f3d0;
  }
</style>
