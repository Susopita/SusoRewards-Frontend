import { render, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import LoginPage from '../../../src/ui/pages/LoginPage.svelte';
import { routeStore } from '../../../src/stores/route.svelte';
import { sessionStore } from '../../../src/stores/session.svelte';
import { api } from '../../../src/adapters/api';

vi.mock('../../../src/stores/route.svelte', () => ({
  routeStore: { navigate: vi.fn() }
}));

vi.mock('../../../src/stores/session.svelte', () => ({
  sessionStore: { login: vi.fn(), logout: vi.fn() }
}));

vi.mock('../../../src/adapters/api', () => ({
  api: { post: vi.fn() }
}));

describe('LoginPage Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render login layout by default', () => {
    const { getByLabelText, getByText, queryByLabelText } = render(LoginPage);
    expect(getByText('Iniciar Sesión')).toBeInTheDocument();
    expect(getByLabelText('Correo Electrónico')).toBeInTheDocument();
    expect(getByLabelText('Contraseña')).toBeInTheDocument();
    expect(queryByLabelText('Nueva Contraseña')).toBeNull();
  });

  it('should redirect based on role on successful login', async () => {
    (api.post as any).mockResolvedValueOnce({
      username: 'company_admin',
      role: 'admin',
      token: 'jwt-123',
    });

    const { getByLabelText, getByTestId } = render(LoginPage);
    const emailInput = getByLabelText('Correo Electrónico');
    const passwordInput = getByLabelText('Contraseña');
    const form = getByTestId('login-form');

    await fireEvent.input(emailInput, { target: { value: 'admin@company.com' } });
    await fireEvent.input(passwordInput, { target: { value: 'normal-pwd' } });
    await fireEvent.submit(form);

    expect(api.post).toHaveBeenCalledWith('/auth/login', {
      email: 'admin@company.com',
      password: 'normal-pwd',
    });

    expect(sessionStore.login).toHaveBeenCalledWith({
      username: 'company_admin',
      role: 'admin',
      restaurantCode: undefined,
      token: 'jwt-123',
    });

    vi.runAllTimers();
    expect(routeStore.navigate).toHaveBeenCalledWith('/dashboard-company');
  });

  it('should redirect to restaurant dashboard when logged as restaurant', async () => {
    (api.post as any).mockResolvedValueOnce({
      username: 'rest_mgr',
      role: 'restaurant',
      restaurantCode: 'REST_789',
      token: 'jwt-456',
    });

    const { getByLabelText, getByTestId } = render(LoginPage);
    await fireEvent.input(getByLabelText('Correo Electrónico'), { target: { value: 'rest@company.com' } });
    await fireEvent.input(getByLabelText('Contraseña'), { target: { value: 'normal-pwd' } });
    await fireEvent.submit(getByTestId('login-form'));

    expect(sessionStore.login).toHaveBeenCalledWith({
      username: 'rest_mgr',
      role: 'restaurant',
      restaurantCode: 'REST_789',
      token: 'jwt-456',
    });

    vi.runAllTimers();
    expect(routeStore.navigate).toHaveBeenCalledWith('/dashboard-restaurant');
  });

  it('should switch to change-password mode when password matches email (temporal password)', async () => {
    (api.post as any).mockResolvedValueOnce({
      username: 'temp_user',
      role: 'client',
      token: 'jwt-temp',
      requirePasswordChange: true
    });

    // Si la contraseña es igual al email
    const { getByLabelText, getByTestId, findByTestId, getByText } = render(LoginPage);
    await fireEvent.input(getByLabelText('Correo Electrónico'), { target: { value: 'temp@test.com' } });
    await fireEvent.input(getByLabelText('Contraseña'), { target: { value: 'temp@test.com' } });
    await fireEvent.submit(getByTestId('login-form'));

    // Debe saltar a la pantalla de cambiar contraseña
    expect(getByText('Cambiar Contraseña')).toBeInTheDocument();
    const alert = await findByTestId('error-alert');
    expect(alert.textContent).toContain('Debes cambiar tu contraseña temporal antes de continuar.');
  });

  it('should toggle change password form manually and display currentPassword conditionally', async () => {
    const { getByTestId, getByLabelText, queryByLabelText } = render(LoginPage);
    
    const changePwdLink = getByTestId('to-change-pwd-btn');
    await fireEvent.click(changePwdLink);

    expect(getByLabelText('Nueva Contraseña')).toBeInTheDocument();
    // Por defecto, isTemporalPassword es false, así que muestra Contraseña Actual
    expect(getByLabelText('Contraseña Actual')).toBeInTheDocument();

    // Activar checkbox de temporal
    const checkbox = getByTestId('temporal-pwd-checkbox');
    await fireEvent.click(checkbox);

    // Debe ocultar Contraseña Actual
    expect(queryByLabelText('Contraseña Actual')).toBeNull();
  });

  it('should request only new password if changing a temporal password', async () => {
    (api.post as any).mockResolvedValueOnce({ success: true });

    const { getByTestId, getByLabelText } = render(LoginPage);
    
    // Ir a cambio de contraseña
    await fireEvent.click(getByTestId('to-change-pwd-btn'));

    // Activar temporal
    await fireEvent.click(getByTestId('temporal-pwd-checkbox'));

    // Rellenar
    await fireEvent.input(getByLabelText('Correo Electrónico'), { target: { value: 'temp@test.com' } });
    await fireEvent.input(getByLabelText('Nueva Contraseña'), { target: { value: 'super-new-pwd' } });

    await fireEvent.submit(getByTestId('change-pwd-form'));

    expect(api.post).toHaveBeenCalledWith('/auth/cambio-password', {
      email: 'temp@test.com',
      currentPassword: 'temp@test.com', // Se pasa el email como contraseña actual
      newPassword: 'super-new-pwd',
    });
  });

  it('should request current and new password if changing a normal password', async () => {
    (api.post as any).mockResolvedValueOnce({ success: true });

    const { getByTestId, getByLabelText } = render(LoginPage);
    
    // Ir a cambio de contraseña
    await fireEvent.click(getByTestId('to-change-pwd-btn'));

    // Dejar isTemporalPassword en false

    // Rellenar
    await fireEvent.input(getByLabelText('Correo Electrónico'), { target: { value: 'normal@test.com' } });
    await fireEvent.input(getByLabelText('Contraseña Actual'), { target: { value: 'old-pwd' } });
    await fireEvent.input(getByLabelText('Nueva Contraseña'), { target: { value: 'super-new-pwd' } });

    await fireEvent.submit(getByTestId('change-pwd-form'));

    expect(api.post).toHaveBeenCalledWith('/auth/cambio-password', {
      email: 'normal@test.com',
      currentPassword: 'old-pwd',
      newPassword: 'super-new-pwd',
    });
  });

  it('should display error if API call fails', async () => {
    (api.post as any).mockRejectedValueOnce(new Error('Password weak'));

    const { getByTestId, getByLabelText, findByTestId } = render(LoginPage);
    await fireEvent.click(getByTestId('to-change-pwd-btn'));
    await fireEvent.click(getByTestId('temporal-pwd-checkbox'));
    await fireEvent.input(getByLabelText('Correo Electrónico'), { target: { value: 'temp@test.com' } });
    await fireEvent.input(getByLabelText('Nueva Contraseña'), { target: { value: '123' } });
    await fireEvent.submit(getByTestId('change-pwd-form'));

    const alert = await findByTestId('error-alert');
    expect(alert.textContent).toContain('Password weak');
  });
});
