<script lang="ts">
  import { routeStore } from '../../stores/route.svelte';
  import { api } from '../../adapters/api';
  import AuthCard from '../components/layout/AuthCard.svelte';
  import Alert from '../components/feedback/Alert.svelte';
  import FormGroup from '../components/forms/FormGroup.svelte';
  import SubmitButton from '../components/forms/SubmitButton.svelte';

  let email = $state('');
  let password = $state('');
  let ruc = $state('');
  let companyName = $state('');

  let loading = $state(false);
  let errorMsg = $state('');
  let successMsg = $state('');

  let isSubmitDisabled = $derived(!email.trim() || !password.trim() || !ruc.trim() || !companyName.trim() || ruc.trim().length < 11);

  function goHome() {
    routeStore.navigate('/');
  }

  function goToLogin() {
    routeStore.navigate('/login');
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    errorMsg = '';
    successMsg = '';

    // Basic Validation
    if (!email || !password || !ruc || !companyName) {
      errorMsg = 'Todos los campos son obligatorios.';
      return;
    }

    if (ruc.length < 11) {
      errorMsg = 'El RUC debe tener al menos 11 dígitos.';
      return;
    }

    loading = true;

    try {
      await api.post('/empresas/registrar', {
        name: companyName,
        email,
        password,
      });

      successMsg = 'Empresa registrada con éxito. Redirigiendo al login...';
      email = '';
      password = '';
      ruc = '';
      companyName = '';

      setTimeout(() => {
        routeStore.navigate('/login');
      }, 2000);
    } catch (e: any) {
      errorMsg = e.message || 'Error en el servidor al registrar la empresa.';
    } finally {
      loading = false;
    }
  }
</script>

<AuthCard
  title="Registra tu Empresa"
  subtitle="Comienza a ofrecer recompensas de fidelidad en minutos"
  goBack={goHome}
>
  {#if errorMsg}
    <Alert type="danger" message={errorMsg} />
  {/if}

  {#if successMsg}
    <Alert type="success" message={successMsg} />
  {/if}

  <form onsubmit={handleSubmit} class="auth-form" data-testid="register-form">
    <FormGroup
      id="companyName"
      label="Nombre de Empresa"
      bind:value={companyName}
      placeholder="Ej. Susopita S.A.C."
      disabled={loading}
      required
    />

    <FormGroup
      id="ruc"
      label="RUC de Empresa"
      bind:value={ruc}
      placeholder="11 dígitos numéricos"
      disabled={loading}
      maxlength={11}
      required
    />

    <FormGroup
      id="email"
      label="Correo Corporativo"
      type="email"
      bind:value={email}
      placeholder="admin@tuempresa.com"
      disabled={loading}
      required
    />

    <FormGroup
      id="password"
      label="Contraseña"
      type="password"
      bind:value={password}
      placeholder="Mínimo 6 caracteres"
      disabled={loading}
      required
    />

    <SubmitButton
      {loading}
      text="Completar Registro"
      loadingText="Registrando..."
      testid="submit-btn"
      disabled={isSubmitDisabled}
    />
  </form>

  <div class="auth-footer">
    ¿Ya tienes una cuenta? <button type="button" class="link-action-btn" onclick={goToLogin}>Inicia Sesión</button>
  </div>
</AuthCard>

<style>
  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .auth-footer {
    text-align: center;
    font-size: 0.9rem;
    color: var(--text-muted);
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    padding-top: 1rem;
  }

  .link-action-btn {
    background: none;
    border: none;
    padding: 0;
    color: var(--color-secondary);
    font-weight: 600;
    cursor: pointer;
    font-size: inherit;
    font-family: inherit;
    transition: color var(--transition-fast);
  }

  .link-action-btn:hover {
    color: var(--color-primary);
  }
</style>
