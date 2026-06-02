<script lang="ts">
  import FormGroup from '../forms/FormGroup.svelte';

  interface Client {
    id: string;
    nombre: string;
    email: string;
    tarjeta: string;
    habilitado: boolean;
  }

  interface Props {
    clients: Client[];
    loading: boolean;
    onAdd: (client: { name: string; email: string; tarjetaCliente: string }) => Promise<void>;
    onToggleStatus: (id: string, currentStatus: boolean) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
  }

  let { clients, loading, onAdd, onToggleStatus, onDelete }: Props = $props();

  // Local Form state
  let clientNombre = $state('');
  let clientEmail = $state('');
  let clientTarjeta = $state('');
  let formError = $state('');

  async function handleAddClient(e: SubmitEvent) {
    e.preventDefault();
    formError = '';

    if (!clientNombre || !clientEmail || !clientTarjeta) {
      formError = 'Todos los campos son obligatorios.';
      return;
    }

    try {
      await onAdd({
        name: clientNombre,
        email: clientEmail,
        tarjetaCliente: clientTarjeta
      });
      clientNombre = '';
      clientEmail = '';
      clientTarjeta = '';
    } catch (err: any) {
      formError = err.message || 'Error al afiliar al cliente.';
    }
  }
</script>

<div class="split-layout">
  <!-- Form -->
  <div class="card form-panel-card">
    <h3>Afiliar Nuevo Cliente</h3>
    
    {#if formError}
      <div class="alert alert-danger" data-testid="form-error-alert">
        {formError}
      </div>
    {/if}

    <form onsubmit={handleAddClient} class="crud-form" data-testid="client-form">
      <FormGroup
        id="cNombre"
        label="Nombre Completo"
        bind:value={clientNombre}
        placeholder="Ej. Juan Pérez"
        disabled={loading}
        required
      />

      <FormGroup
        id="cEmail"
        label="Correo Electrónico"
        type="email"
        bind:value={clientEmail}
        placeholder="juan@correo.com"
        disabled={loading}
        required
      />

      <FormGroup
        id="cTarjeta"
        label="Número de Tarjeta"
        bind:value={clientTarjeta}
        placeholder="Ej. 12893352452"
        disabled={loading}
        required
      />

      <button type="submit" class="btn-primary w-full" disabled={loading} data-testid="submit-client-btn">
        Afiliar Cliente
      </button>
    </form>
  </div>

  <!-- List -->
  <div class="list-panel-container">
    <h3>Clientes Registrados</h3>
    <table class="dashboard-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Correo</th>
          <th>Tarjeta</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {#each clients as client}
          <tr data-testid="client-row-{client.id}">
            <td>{client.nombre}</td>
            <td>{client.email}</td>
            <td><code>{client.tarjeta || '-'}</code></td>
            <td>
              <span class="status-indicator {client.habilitado ? 'active' : 'inactive'}">
                {client.habilitado ? 'Activo' : 'Deshabilitado'}
              </span>
            </td>
            <td>
              <div class="row-actions">
                <button 
                  class="btn-action-status" 
                  onclick={() => onToggleStatus(client.id, client.habilitado)}
                  disabled={loading}
                  data-testid="toggle-client-btn-{client.id}"
                >
                  {client.habilitado ? 'Deshabilitar' : 'Habilitar'}
                </button>
                <button 
                  class="btn-action-delete" 
                  onclick={() => onDelete(client.id)}
                  disabled={loading}
                  data-testid="delete-client-btn-{client.id}"
                >
                  Desvincular
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
