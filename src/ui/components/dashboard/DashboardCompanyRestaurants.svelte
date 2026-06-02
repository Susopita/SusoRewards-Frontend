<script lang="ts">
  import RestaurantManager from './RestaurantManager.svelte';

  interface Props {
    restaurants: any[];
    loading: boolean;
    onAdd: (rest: { name: string; ruc: string; email: string }) => Promise<void>;
    onToggleStatus: (id: string, currentStatus: boolean) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
  }

  let { restaurants, loading, onAdd, onToggleStatus, onDelete }: Props = $props();
</script>

<section class="tab-panel animate-fade">
  <RestaurantManager
    {restaurants}
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
