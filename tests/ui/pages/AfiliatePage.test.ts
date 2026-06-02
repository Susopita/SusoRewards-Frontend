import { render, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import AfiliatePage from '../../../src/ui/pages/AfiliatePage.svelte';
import { routeStore } from '../../../src/stores/route.svelte';
import { api } from '../../../src/adapters/api';

vi.mock('../../../src/stores/route.svelte', () => ({
  routeStore: { navigate: vi.fn() }
}));

vi.mock('../../../src/adapters/api', () => ({
  api: { post: vi.fn() }
}));

describe('AfiliatePage Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render all inputs and labels', () => {
    const { getByLabelText, getByText } = render(AfiliatePage);
    expect(getByText('Registra tu Empresa')).toBeInTheDocument();
    expect(getByLabelText('Nombre de Empresa')).toBeInTheDocument();
    expect(getByLabelText('RUC de Empresa')).toBeInTheDocument();
    expect(getByLabelText('Correo Corporativo')).toBeInTheDocument();
    expect(getByLabelText('Contraseña')).toBeInTheDocument();
  });

  it('should show error when fields are empty', async () => {
    const { getByTestId, findByTestId } = render(AfiliatePage);
    const form = getByTestId('register-form');
    
    await fireEvent.submit(form);
    
    const alert = await findByTestId('error-alert');
    expect(alert.textContent).toContain('Todos los campos son obligatorios.');
  });

  it('should show error when RUC is less than 11 digits', async () => {
    const { getByLabelText, getByTestId, findByTestId } = render(AfiliatePage);
    const companyInput = getByLabelText('Nombre de Empresa') as HTMLInputElement;
    const rucInput = getByLabelText('RUC de Empresa') as HTMLInputElement;
    const emailInput = getByLabelText('Correo Corporativo') as HTMLInputElement;
    const passwordInput = getByLabelText('Contraseña') as HTMLInputElement;
    const form = getByTestId('register-form');

    await fireEvent.input(companyInput, { target: { value: 'SusoCorp' } });
    await fireEvent.input(rucInput, { target: { value: '123456789' } });
    await fireEvent.input(emailInput, { target: { value: 'admin@susocorp.com' } });
    await fireEvent.input(passwordInput, { target: { value: 'pwd123' } });

    await fireEvent.submit(form);

    const alert = await findByTestId('error-alert');
    expect(alert.textContent).toContain('El RUC debe tener al menos 11 dígitos.');
  });

  it('should call api.post and redirect to /login on success', async () => {
    (api.post as any).mockResolvedValueOnce({ success: true });

    const { getByLabelText, getByTestId, findByTestId } = render(AfiliatePage);
    const companyInput = getByLabelText('Nombre de Empresa') as HTMLInputElement;
    const rucInput = getByLabelText('RUC de Empresa') as HTMLInputElement;
    const emailInput = getByLabelText('Correo Corporativo') as HTMLInputElement;
    const passwordInput = getByLabelText('Contraseña') as HTMLInputElement;
    const form = getByTestId('register-form');

    await fireEvent.input(companyInput, { target: { value: 'SusoCorp' } });
    await fireEvent.input(rucInput, { target: { value: '12345678901' } });
    await fireEvent.input(emailInput, { target: { value: 'admin@susocorp.com' } });
    await fireEvent.input(passwordInput, { target: { value: 'pwd123' } });

    await fireEvent.submit(form);

    expect(api.post).toHaveBeenCalledWith('/empresas/registrar', {
      name: 'SusoCorp',
      email: 'admin@susocorp.com',
      password: 'pwd123'
    });

    const successAlert = await findByTestId('success-alert');
    expect(successAlert.textContent).toContain('Empresa registrada con éxito.');

    vi.runAllTimers();
    expect(routeStore.navigate).toHaveBeenCalledWith('/login');
  });

  it('should show error alert when API call fails', async () => {
    (api.post as any).mockRejectedValueOnce(new Error('RUC duplicado'));

    const { getByLabelText, getByTestId, findByTestId } = render(AfiliatePage);
    const companyInput = getByLabelText('Nombre de Empresa') as HTMLInputElement;
    const rucInput = getByLabelText('RUC de Empresa') as HTMLInputElement;
    const emailInput = getByLabelText('Correo Corporativo') as HTMLInputElement;
    const passwordInput = getByLabelText('Contraseña') as HTMLInputElement;
    const form = getByTestId('register-form');

    await fireEvent.input(companyInput, { target: { value: 'SusoCorp' } });
    await fireEvent.input(rucInput, { target: { value: '12345678901' } });
    await fireEvent.input(emailInput, { target: { value: 'admin@susocorp.com' } });
    await fireEvent.input(passwordInput, { target: { value: 'pwd123' } });

    await fireEvent.submit(form);

    const errorAlert = await findByTestId('error-alert');
    expect(errorAlert.textContent).toContain('RUC duplicado');
  });

  it('should navigate back to home on back click', async () => {
    const { getByTestId } = render(AfiliatePage);
    const backBtn = getByTestId('back-btn');
    await fireEvent.click(backBtn);
    expect(routeStore.navigate).toHaveBeenCalledWith('/');
  });
});
