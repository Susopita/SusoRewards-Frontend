<script lang="ts">
  import ProgramManager from './ProgramManager.svelte';

  interface Props {
    programs: any[];
    restaurants: any[];
    loading: boolean;
    onSave: (program: { id?: string; name: string; beneficios: string; requisitos: string; restaurantes: string[] }) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
  }

  let { programs, restaurants, loading, onSave, onDelete }: Props = $props();
</script>

<section class="tab-panel animate-fade">
  <ProgramManager
    {programs}
    {restaurants}
    {loading}
    {onSave}
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
