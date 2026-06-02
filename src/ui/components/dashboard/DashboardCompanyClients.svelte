<script lang="ts">
  import ClientManager from './ClientManager.svelte';

  interface Props {
    clients: any[];
    loading: boolean;
    onAdd: (client: { name: string; email: string; tarjetaCliente: string }) => Promise<void>;
    onToggleStatus: (id: string, currentStatus: boolean) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
  }

  let { clients, loading, onAdd, onToggleStatus, onDelete }: Props = $props();
</script>

<section class="tab-panel animate-fade">
  <ClientManager
    {clients}
    {loading}
    {onAdd}
    {onToggleStatus}
    {onDelete}
  />
</section>

<style>
  .tab-panel {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
</style>
