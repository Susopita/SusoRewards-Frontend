<script lang="ts">
  import FormGroup from '../forms/FormGroup.svelte';

  interface Restaurant {
    id: string;
    nombre: string;
    ruc: string;
    email: string;
    habilitado: boolean;
  }

  interface Props {
    restaurants: Restaurant[];
    loading: boolean;
    onAdd: (rest: { name: string; ruc: string; email: string }) => Promise<void>;
    onToggleStatus: (id: string, currentStatus: boolean) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
  }

  let { restaurants, loading, onAdd, onToggleStatus, onDelete }: Props = $props();

  // Local Form state
  let restNombre = $state('');
  let restRuc = $state('');
  let restEmail = $state('');
  let formError = $state('');

  async function handleAddRestaurant(e: SubmitEvent) {
    e.preventDefault();
    formError = '';

    if (!restNombre || !restRuc || !restEmail) {
      formError = 'Todos los campos son obligatorios.';
      return;
    }

    if (restRuc.length < 11) {
      formError = 'El RUC debe tener 11 dígitos.';
      return;
    }

    try {
      await onAdd({
        name: restNombre,
        ruc: restRuc,
        email: restEmail
      });
      restNombre = '';
      restRuc = '';
      restEmail = '';
    } catch (err: any) {
      formError = err.message || 'Error al afiliar el restaurante.';
    }
  }
</script>

<div class="split-layout">
  <!-- Form -->
  <div class="card form-panel-card">
    <h3>Afiliar Nuevo Local</h3>
    
    {#if formError}
      <div class="alert alert-danger" data-testid="form-error-alert">
        {formError}
      </div>
    {/if}

    <form onsubmit={handleAddRestaurant} class="crud-form" data-testid="restaurant-form">
      <FormGroup
        id="rNombre"
        label="Nombre Comercial"
        bind:value={restNombre}
        placeholder="Ej. El Hornero"
        disabled={loading}
        required
      />

      <FormGroup
        id="rRuc"
        label="RUC del Local"
        bind:value={restRuc}
        maxlength={11}
        placeholder="11 dígitos"
        disabled={loading}
        required
      />

      <FormGroup
        id="rEmail"
        label="Correo del Restaurante"
        type="email"
        bind:value={restEmail}
        placeholder="sucursal@restaurante.com"
        disabled={loading}
        required
      />

      <button type="submit" class="btn-primary w-full" disabled={loading} data-testid="submit-restaurant-btn">
        Afiliar Local
      </button>
    </form>
  </div>

  <!-- List -->
  <div class="list-panel-container">
    <h3>Locales Afiliados</h3>
    <table class="dashboard-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>RUC</th>
          <th>Correo</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {#each restaurants as rest}
          <tr data-testid="restaurant-row-{rest.id}">
            <td>{rest.nombre}</td>
            <td><code>{rest.ruc}</code></td>
            <td>{rest.email}</td>
            <td>
              <span class="status-indicator {rest.habilitado ? 'active' : 'inactive'}">
                {rest.habilitado ? 'Habilitado' : 'Inactivo'}
              </span>
            </td>
            <td>
              <div class="row-actions">
                <button 
                  class="btn-action-status" 
                  onclick={() => onToggleStatus(rest.id, rest.habilitado)}
                  disabled={loading}
                  data-testid="toggle-restaurant-btn-{rest.id}"
                >
                  {rest.habilitado ? 'Deshabilitar' : 'Habilitar'}
                </button>
                <button 
                  class="btn-action-delete" 
                  onclick={() => onDelete(rest.id)}
                  disabled={loading}
                  data-testid="delete-restaurant-btn-{rest.id}"
                >
                  Eliminar
                </button>
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
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

  .w-full {
    width: 100%;
  }

  .list-panel-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow-x: auto;
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
