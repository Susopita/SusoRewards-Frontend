<script lang="ts">
  import { routeStore } from '../../stores/route.svelte';
  import { sessionStore } from '../../stores/session.svelte';
  import { api } from '../../adapters/api';
  import AuthCard from '../components/layout/AuthCard.svelte';
  import Alert from '../components/feedback/Alert.svelte';
  import FormGroup from '../components/forms/FormGroup.svelte';
  import SubmitButton from '../components/forms/SubmitButton.svelte';

  // Login state
  let email = $state('');
  let password = $state('');

  // Password change state
  let isChangingPassword = $state(false);
  let isTemporalPassword = $state(false);
  let currentPassword = $state('');
  let newPassword = $state('');

  // Status state
  let loading = $state(false);
  let errorMsg = $state('');
  let successMsg = $state('');

  let isSubmitDisabled = $derived(!email.trim() || !password.trim());
  let isChangeSubmitDisabled = $derived(
    !email.trim() || 
    !newPassword.trim() || 
    (!isTemporalPassword && !currentPassword.trim())
  );

  function goHome() {
    routeStore.navigate('/');
  }

  function goToRegister() {
    routeStore.navigate('/afiliate');
  }

  function toggleMode() {
    isChangingPassword = !isChangingPassword;
    errorMsg = '';
    successMsg = '';
    password = '';
    currentPassword = '';
    newPassword = '';
  }

  async function handleLogin(e: SubmitEvent) {
    e.preventDefault();
    errorMsg = '';
    successMsg = '';

    if (!email || !password) {
      errorMsg = 'Todos los campos son obligatorios.';
      return;
    }

    loading = true;

    try {
      const response = await api.post<{
        username: string;
        role: 'admin' | 'restaurant' | 'client';
        restaurantCode?: string;
        token: string;
        requirePasswordChange?: boolean;
      }>('/auth/login', { email, password });

      if (response.requirePasswordChange || password === email) {
        isChangingPassword = true;
        isTemporalPassword = true;
        errorMsg = 'Debes cambiar tu contraseña temporal antes de continuar.';
        loading = false;
        return;
      }

      sessionStore.login({
        username: response.username,
        role: response.role,
        restaurantCode: response.restaurantCode,
        token: response.token,
      });

      successMsg = '¡Sesión iniciada con éxito!';
      
      setTimeout(() => {
        if (response.role === 'admin') {
          routeStore.navigate('/dashboard-company');
        } else if (response.role === 'restaurant') {
          routeStore.navigate('/dashboard-restaurant');
        } else {
          routeStore.navigate('/dashboard-client');
        }
      }, 1000);
    } catch (e: any) {
      errorMsg = e.message || 'Credenciales inválidas o error de servidor.';
    } finally {
      loading = false;
    }
  }

  async function handleChangePassword(e: SubmitEvent) {
    e.preventDefault();
    errorMsg = '';
    successMsg = '';

    if (!email || !newPassword) {
      errorMsg = 'El correo y la nueva contraseña son obligatorios.';
      return;
    }

    if (!isTemporalPassword && !currentPassword) {
      errorMsg = 'Debes ingresar tu contraseña actual.';
      return;
    }

    loading = true;

    try {
      const payload: Record<string, string> = {
        email,
        newPassword,
      };

      if (!isTemporalPassword) {
        payload.currentPassword = currentPassword;
      } else {
        payload.currentPassword = email;
      }

      await api.post('/auth/cambio-password', payload);

      successMsg = 'Contraseña cambiada con éxito. Por favor, inicia sesión.';
      isChangingPassword = false;
      password = '';
      currentPassword = '';
      newPassword = '';
    } catch (e: any) {
      errorMsg = e.message || 'Error al cambiar la contraseña.';
    } finally {
      loading = false;
    }
  }
</script>

{#if !isChangingPassword}
  <AuthCard
    title="Iniciar Sesión"
    subtitle="Ingresa a tu cuenta de SusoRewards"
    goBack={goHome}
  >
    {#if errorMsg}
      <Alert type="danger" message={errorMsg} />
    {/if}

    {#if successMsg}
      <Alert type="success" message={successMsg} />
    {/if}

    <form onsubmit={handleLogin} class="auth-form" data-testid="login-form">
      <FormGroup
        id="email"
        label="Correo Electrónico"
        type="email"
        bind:value={email}
        placeholder="correo@ejemplo.com"
        disabled={loading}
        required
      />

      <FormGroup
        id="password"
        label="Contraseña"
        type="password"
        bind:value={password}
        placeholder="••••••••"
        disabled={loading}
        required
      />

      <SubmitButton
        {loading}
        text="Ingresar"
        loadingText="Validando..."
        testid="login-submit-btn"
        disabled={isSubmitDisabled}
      />
    </form>

    <div class="auth-options">
      <button type="button" class="link-action-btn" onclick={toggleMode} data-testid="to-change-pwd-btn">Cambiar mi contraseña</button>
    </div>

    <div class="auth-footer">
      ¿No tienes una cuenta de empresa? <button type="button" class="link-action-btn" onclick={goToRegister}>Regístrate</button>
    </div>
  </AuthCard>
{:else}
  <AuthCard
    title="Cambiar Contraseña"
    subtitle="Actualiza tus credenciales de acceso"
    goBack={goHome}
  >
    {#if errorMsg}
      <Alert type="danger" message={errorMsg} />
    {/if}

    {#if successMsg}
      <Alert type="success" message={successMsg} />
    {/if}

    <form onsubmit={handleChangePassword} class="auth-form" data-testid="change-pwd-form">
      <FormGroup
        id="change-email"
        label="Correo Electrónico"
        type="email"
        bind:value={email}
        placeholder="correo@ejemplo.com"
        disabled={loading}
        required
      />

      <div class="checkbox-group">
        <label class="checkbox-label">
          <input
            type="checkbox"
            bind:checked={isTemporalPassword}
            disabled={loading}
            data-testid="temporal-pwd-checkbox"
          />
          <span>¿Es contraseña temporal (igual a tu correo)?</span>
        </label>
      </div>

      {#if !isTemporalPassword}
        <FormGroup
          id="currentPassword"
          label="Contraseña Actual"
          type="password"
          bind:value={currentPassword}
          placeholder="••••••••"
          disabled={loading}
          required
        />
      {/if}

      <FormGroup
        id="newPassword"
        label="Nueva Contraseña"
        type="password"
        bind:value={newPassword}
        placeholder="Mínimo 6 caracteres"
        disabled={loading}
        required
      />

      <SubmitButton
        {loading}
        text="Guardar Nueva Contraseña"
        loadingText="Guardando..."
        testid="change-pwd-submit-btn"
        disabled={isChangeSubmitDisabled}
      />
    </form>

    <div class="auth-options">
      <button type="button" class="link-action-btn" onclick={toggleMode} data-testid="to-login-btn">Volver al inicio de sesión</button>
    </div>

    <div class="auth-footer">
      ¿No tienes una cuenta de empresa? <button type="button" class="link-action-btn" onclick={goToRegister}>Regístrate</button>
    </div>
  </AuthCard>
{/if}

<style>
  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .checkbox-group {
    display: flex;
    align-items: center;
    margin: 0.25rem 0;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
  }

  .checkbox-label input {
    width: 16px;
    height: 16px;
    accent-color: var(--color-primary);
    cursor: pointer;
  }

  .auth-options {
    text-align: right;
    font-size: 0.85rem;
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
