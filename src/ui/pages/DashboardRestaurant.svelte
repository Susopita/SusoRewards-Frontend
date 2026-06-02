<script lang="ts">
  import { sessionStore } from '../../stores/session.svelte';
  import { api } from '../../adapters/api';
  import Navbar from '../components/layout/Navbar.svelte';
  import Alert from '../components/feedback/Alert.svelte';
  import FormGroup from '../components/forms/FormGroup.svelte';
  import SubmitButton from '../components/forms/SubmitButton.svelte';

  let monto = $state<number | ''>('');
  let tarjetaCliente = $state('');

  let loading = $state(false);
  let successMsg = $state('');
  let errorMsg = $state('');

  async function handleRegisterSale(e: SubmitEvent) {
    e.preventDefault();
    errorMsg = '';
    successMsg = '';

    if (!monto || monto <= 0) {
      errorMsg = 'El monto debe ser mayor a 0.';
      return;
    }

    if (!tarjetaCliente || tarjetaCliente.trim().length < 8) {
      errorMsg = 'Ingrese un número de tarjeta válido (mínimo 8 caracteres).';
      return;
    }

    const restaurantCode = sessionStore.restaurantCode;
    if (!restaurantCode) {
      errorMsg = 'Error de seguridad: No se pudo obtener el código del restaurante afiliado.';
      return;
    }

    loading = true;

    try {
      const payload = {
        monto: Number(monto),
        tarjeta_cliente: tarjetaCliente,
      };

      await api.post('/ventas', payload);

      successMsg = '¡Consumo registrado con éxito!';
      monto = '';
      tarjetaCliente = '';
    } catch (e: any) {
      errorMsg = e.message || 'Error al registrar la venta.';
    } finally {
      loading = false;
    }
  }
</script>

<div class="dashboard-wrapper">
  <Navbar
    role="restaurant"
    username={sessionStore.current?.username || ''}
    restaurantCode={sessionStore.restaurantCode || undefined}
  />

  <main class="dashboard-content">
    <section class="card sale-card">
      <div class="card-header">
        <h2 class="premium-gradient-text">Registrar Consumo (Sale)</h2>
        <p>Registra la venta del cliente para acumulación de beneficios</p>
      </div>

      {#if errorMsg}
        <Alert type="danger" message={errorMsg} />
      {/if}

      {#if successMsg}
        <Alert type="success" message={successMsg} />
      {/if}

      <form onsubmit={handleRegisterSale} class="sale-form" data-testid="sale-form">
        <FormGroup
          id="monto"
          label="Monto Consumido (S/.)"
          type="number"
          step="0.01"
          min="0.01"
          bind:value={monto}
          placeholder="0.00"
          disabled={loading}
          required
        />

        <FormGroup
          id="tarjeta"
          label="Número de Tarjeta del Cliente"
          bind:value={tarjetaCliente}
          placeholder="Ingrese la tarjeta del comensal"
          disabled={loading}
          required
        />

        <div class="security-info">
          <span class="lock-icon">🔒</span>
          <span>Transacción vinculada al restaurante <strong>{sessionStore.restaurantCode}</strong> de forma segura.</span>
        </div>

        <SubmitButton
          {loading}
          text="Registrar Consumo"
          loadingText="Procesando Venta..."
          testid="submit-sale-btn"
        />
      </form>
    </section>
  </main>
</div>

<style>
  .dashboard-wrapper {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .dashboard-content {
    flex: 1;
    padding: 4rem 2rem;
    max-width: 600px;
    width: 100%;
    margin: 0 auto;
    box-sizing: border-box;
  }

  .sale-card {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .card-header h2 {
    font-size: 1.6rem;
    margin-bottom: 0.25rem;
  }

  .card-header p {
    color: var(--text-muted);
    font-size: 0.9rem;
  }

  .sale-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .security-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    color: var(--text-muted);
    background: rgba(16, 185, 129, 0.05);
    border: 1px solid rgba(16, 185, 129, 0.1);
    padding: 0.5rem 0.75rem;
    border-radius: var(--radius-sm);
  }

  .lock-icon {
    font-size: 0.95rem;
  }
</style>
