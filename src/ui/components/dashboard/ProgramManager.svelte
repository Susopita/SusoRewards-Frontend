<script lang="ts">
  import FormGroup from '../forms/FormGroup.svelte';

  interface Program {
    id: string;
    nombre: string;
    beneficios: string;
    requisitos: string;
    restaurantes: string[];
  }

  interface Restaurant {
    id: string;
    nombre: string;
    ruc: string;
    email: string;
    habilitado: boolean;
  }

  interface Props {
    programs: Program[];
    restaurants: Restaurant[];
    loading: boolean;
    onSave: (program: { id?: string; name: string; beneficios: string; requisitos: string; restaurantes: string[] }) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
  }

  let { programs, restaurants, loading, onSave, onDelete }: Props = $props();

  // Local Form state
  let programId = $state('');
  let programNombre = $state('');
  let programBeneficios = $state('');
  let programRequisitos = $state('');
  let programRestaurantes = $state<string[]>([]);
  let isEditingProgram = $state(false);
  let formError = $state('');

  function resetProgramForm() {
    programId = '';
    programNombre = '';
    programBeneficios = '';
    programRequisitos = '';
    programRestaurantes = [];
    isEditingProgram = false;
    formError = '';
  }

  async function handleSaveProgram(e: SubmitEvent) {
    e.preventDefault();
    formError = '';

    if (!programNombre || !programBeneficios || !programRequisitos) {
      formError = 'Todos los campos del programa son obligatorios.';
      return;
    }

    try {
      await onSave({
        id: isEditingProgram ? programId : undefined,
        name: programNombre,
        beneficios: programBeneficios,
        requisitos: programRequisitos,
        restaurantes: programRestaurantes
      });
      resetProgramForm();
    } catch (err: any) {
      formError = err.message || 'Error al guardar el programa.';
    }
  }

  function handleEditProgram(p: Program) {
    programId = p.id;
    programNombre = p.nombre;
    programBeneficios = p.beneficios;
    programRequisitos = p.requisitos;
    programRestaurantes = [...p.restaurantes];
    isEditingProgram = true;
    formError = '';
  }

  function toggleRestaurantInProgram(restId: string) {
    if (programRestaurantes.includes(restId)) {
      programRestaurantes = programRestaurantes.filter(id => id !== restId);
    } else {
      programRestaurantes = [...programRestaurantes, restId];
    }
  }
</script>

<div class="split-layout">
  <!-- Form panel -->
  <div class="card form-panel-card">
    <h3>{isEditingProgram ? 'Editar Programa' : 'Crear Programa'}</h3>
    
    {#if formError}
      <div class="alert alert-danger" data-testid="form-error-alert">
        {formError}
      </div>
    {/if}

    <form onsubmit={handleSaveProgram} class="crud-form" data-testid="program-form">
      <FormGroup
        id="pNombre"
        label="Nombre del Programa"
        bind:value={programNombre}
        placeholder="Ej. Beneficio Almuerzo"
        disabled={loading}
        required
      />
      
      <div class="form-group-textarea">
        <label for="pBeneficios">Beneficios</label>
        <textarea
          id="pBeneficios"
          bind:value={programBeneficios}
          placeholder="Ej. Bebida gratis en el local"
          disabled={loading}
          required
        ></textarea>
      </div>

      <FormGroup
        id="pRequisitos"
        label="Requisitos"
        bind:value={programRequisitos}
        placeholder="Ej. Consumir 3 veces"
        disabled={loading}
        required
      />
      
      <div class="form-group-checkboxes">
        <span class="section-label">Locales Participantes</span>
        <div class="restaurant-checkbox-list">
          {#each restaurants as rest}
            <label class="rest-checkbox-item">
              <input 
                type="checkbox" 
                checked={programRestaurantes.includes(rest.id)} 
                onclick={() => toggleRestaurantInProgram(rest.id)}
                disabled={loading}
                data-testid="program-rest-checkbox-{rest.id}"
              />
              <span>{rest.nombre}</span>
            </label>
          {/each}
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-primary" disabled={loading} data-testid="submit-program-btn">
          {isEditingProgram ? 'Actualizar' : 'Crear'}
        </button>
        {#if isEditingProgram}
          <button type="button" class="btn-secondary" onclick={resetProgramForm} disabled={loading}>
            Cancelar
          </button>
        {/if}
      </div>
    </form>
  </div>

  <!-- List panel -->
  <div class="list-panel-container">
    <h3>Programas Existentes</h3>
    <div class="list-grid">
      {#each programs as prog}
        <div class="card list-item-card" data-testid="program-card-{prog.id}">
          <div class="item-header">
            <h4>{prog.nombre}</h4>
            <div class="item-actions">
              <button class="btn-icon edit" onclick={() => handleEditProgram(prog)} data-testid="edit-program-btn-{prog.id}">✏️</button>
              <button class="btn-icon delete" onclick={() => onDelete(prog.id)} data-testid="delete-program-btn-{prog.id}">🗑️</button>
            </div>
          </div>
          <p><strong>Beneficios:</strong> {prog.beneficios}</p>
          <p><strong>Requisitos:</strong> {prog.requisitos}</p>
          <p class="rest-count">📍 {prog.restaurantes.length} local(es) participante(s)</p>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .split-layout {
    display: grid;
    grid-template-columns: 350px 1fr;
    gap: 2rem;
    align-items: start;
  }

  .crud-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .form-group-textarea {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-group-textarea label {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-muted);
  }

  .form-group-textarea textarea {
    background: var(--bg-input);
    border: 1px solid var(--border-input);
    border-radius: var(--radius-md);
    padding: 0.75rem 1rem;
    font-size: 0.95rem;
    color: var(--text-main);
    transition: border-color var(--transition-fast), background var(--transition-fast);
    resize: vertical;
    min-height: 80px;
  }

  .form-group-textarea textarea:focus {
    border-color: var(--color-primary);
    background: var(--bg-input-focus);
    outline: none;
  }

  .form-group-checkboxes {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .section-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-muted);
  }

  .restaurant-checkbox-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-height: 150px;
    overflow-y: auto;
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: var(--radius-sm);
    padding: 0.75rem;
  }

  .rest-checkbox-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.9rem;
  }

  .rest-checkbox-item input {
    cursor: pointer;
  }

  .form-actions {
    display: flex;
    gap: 0.75rem;
  }

  .list-panel-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .list-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.25rem;
  }

  .list-item-card {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1.25rem;
    background: var(--bg-card);
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    padding-bottom: 0.5rem;
    margin-bottom: 0.25rem;
  }

  .item-header h4 {
    margin: 0;
    font-size: 1.1rem;
  }

  .item-actions {
    display: flex;
    gap: 0.5rem;
  }

  .btn-icon {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    padding: 0.25rem;
    border-radius: var(--radius-sm);
    transition: background var(--transition-fast);
  }

  .btn-icon:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  .list-item-card p {
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.4;
  }

  .rest-count {
    font-size: 0.8rem !important;
    color: var(--text-muted);
    margin-top: 0.25rem !important;
  }

  .alert {
    padding: 0.75rem 1rem;
    border-radius: var(--radius-md);
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }

  .alert-danger {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
    color: #fca5a5;
  }
</style>
