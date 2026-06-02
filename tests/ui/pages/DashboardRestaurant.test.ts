import { render, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DashboardRestaurant from '../../../src/ui/pages/DashboardRestaurant.svelte';
import { routeStore } from '../../../src/stores/route.svelte';
import { sessionStore } from '../../../src/stores/session.svelte';
import { api } from '../../../src/adapters/api';

vi.mock('../../../src/stores/route.svelte', () => ({
  routeStore: { navigate: vi.fn() }
}));

vi.mock('../../../src/stores/session.svelte', () => {
  let sessionData: any = {
    username: 'mcdonalds_user',
    role: 'restaurant',
    restaurantCode: 'MCD_PERU_12',
    token: 'jwt-mcd-789'
  };
  return {
    sessionStore: {
      get current() {
        return sessionData;
      },
      get restaurantCode() {
        return sessionData?.restaurantCode || null;
      },
      login: vi.fn(),
      logout: vi.fn().mockImplementation(() => {
        sessionData = null;
      })
    }
  };
});

vi.mock('../../../src/adapters/api', () => ({
  api: { post: vi.fn() }
}));

describe('DashboardRestaurant Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render header with logged username and restaurant code', () => {
    const { getByText, getAllByText, queryByLabelText } = render(DashboardRestaurant);
    expect(getByText('mcdonalds_user')).toBeInTheDocument();
    expect(getAllByText('MCD_PERU_12').length).toBe(2);
    // Verify there is no input field for restaurant code
    expect(queryByLabelText(/código/i)).toBeNull();
  });

  it('should show error when fields are empty or invalid', async () => {
    const { getByTestId, findByTestId } = render(DashboardRestaurant);
    const form = getByTestId('sale-form');

    await fireEvent.submit(form);
    const errorAlert = await findByTestId('error-alert');
    expect(errorAlert.textContent).toContain('El monto debe ser mayor a 0');
  });

  it('should call api.post with implicit restaurant code and ISO date', async () => {
    (api.post as any).mockResolvedValueOnce({ success: true });

    const { getByLabelText, getByTestId, findByTestId } = render(DashboardRestaurant);
    const montoInput = getByLabelText('Monto Consumido (S/.)');
    const tarjetaInput = getByLabelText('Número de Tarjeta del Cliente');
    const form = getByTestId('sale-form');

    await fireEvent.input(montoInput, { target: { value: '45.50' } });
    await fireEvent.input(tarjetaInput, { target: { value: '987654321' } });
    await fireEvent.submit(form);

    expect(api.post).toHaveBeenCalledWith('/ventas', {
      monto: 45.50,
      tarjeta_cliente: '987654321',
    });

    const successAlert = await findByTestId('success-alert');
    expect(successAlert.textContent).toContain('Consumo registrado con éxito');
  });

  it('should logout and redirect to /login', async () => {
    const { getByTestId } = render(DashboardRestaurant);
    const logoutBtn = getByTestId('logout-btn');

    await fireEvent.click(logoutBtn);

    expect(sessionStore.logout).toHaveBeenCalled();
    expect(routeStore.navigate).toHaveBeenCalledWith('/login');
  });
});
