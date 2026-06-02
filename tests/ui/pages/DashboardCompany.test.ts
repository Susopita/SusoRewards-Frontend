import { render, fireEvent, waitFor } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DashboardCompany from '../../../src/ui/pages/DashboardCompany.svelte';
import { routeStore } from '../../../src/stores/route.svelte';
import { sessionStore } from '../../../src/stores/session.svelte';
import { api } from '../../../src/adapters/api';

vi.mock('../../../src/stores/route.svelte', () => ({
  routeStore: { navigate: vi.fn() }
}));

vi.mock('../../../src/stores/session.svelte', () => ({
  sessionStore: {
    current: { username: 'super_admin', role: 'admin', token: 'admin-token-111' },
    logout: vi.fn()
  }
}));

vi.mock('../../../src/adapters/api', () => ({
  api: {
    get: vi.fn().mockImplementation((path) => {
      if (path === '/programas') {
        return Promise.resolve([
          { id: '1', name: 'Club Oro', pointsRule: 1, active: true, beneficios: '10% cashback en cenas', requisitos: 'Consumo mínimo S/. 100', restaurantes: ['1'] },
          { id: '2', name: 'Cena Premium', pointsRule: 1, active: true, beneficios: 'Postre de cortesía', requisitos: '3 visitas al mes', restaurantes: ['1', '2'] }
        ]);
      }
      if (path === '/restaurantes') {
        return Promise.resolve([
          { id: '1', name: 'La Choza Náutica', code: '20123456789', email: 'contacto@chozanautica.com', active: true },
          { id: '2', name: 'El Hornero', code: '20987654321', email: 'reservas@elhornero.pe', active: true }
        ]);
      }
      if (path === '/clientes') {
        return Promise.resolve([
          { id: '1', name: 'Juan Pérez', email: 'juan.perez@gmail.com', active: true },
          { id: '2', name: 'Ana Gómez', email: 'ana.gomez@yahoo.com', active: true }
        ]);
      }
      return Promise.resolve([]);
    }),
    post: vi.fn().mockImplementation((path, body) => {
      if (path === '/programas') {
        return Promise.resolve({ id: '3', name: body.name || 'Nuevo Descuento', active: true });
      }
      if (path === '/restaurantes') {
        return Promise.resolve({ id: '3', name: body.name || 'Bembos', code: body.code || '20202020202', email: body.email, active: true });
      }
      if (path === '/clientes') {
        return Promise.resolve({ id: '3', name: body.name || 'Carlos Torres', email: body.email, active: true });
      }
      return Promise.resolve({ success: true });
    }),
    put: vi.fn().mockImplementation((path, body) => {
      const id = path.split('/').pop();
      return Promise.resolve({ id, name: body.name || 'Club Platino', active: true });
    }),
    patch: vi.fn().mockResolvedValue({ success: true }),
    delete: vi.fn().mockResolvedValue({ success: true })
  }
}));

describe('DashboardCompany Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock global confirm
    vi.spyOn(window, 'confirm').mockImplementation(() => true);
  });

  it('should render metrics panel by default', () => {
    const { getByText, getByTestId } = render(DashboardCompany);
    expect(getByText('Métricas de Rendimiento')).toBeInTheDocument();
    expect(getByTestId('metric-clients').textContent).toBe('2'); // 2 clients initially
    expect(getByTestId('metric-programs').textContent).toBe('2'); // 2 programs initially
    expect(getByTestId('metric-restaurants').textContent).toBe('2'); // 2 restaurants initially
  });

  it('should navigate to programs tab and handle program creation/editing/deletion', async () => {
    const { getByTestId, getByLabelText, getByText, queryByText } = render(DashboardCompany);
    
    // Go to Programs tab
    const tabBtn = getByTestId('tab-programs-btn');
    await fireEvent.click(tabBtn);

    expect(getByText('Crear Programa')).toBeInTheDocument();
    expect(getByText('Programas Existentes')).toBeInTheDocument();

    // 1. Create a program
    await fireEvent.input(getByLabelText('Nombre del Programa'), { target: { value: 'Nuevo Descuento' } });
    await fireEvent.input(getByLabelText('Beneficios'), { target: { value: '20% off en postres' } });
    await fireEvent.input(getByLabelText('Requisitos'), { target: { value: 'Consumo mínimo S/. 50' } });
    
    // Check one restaurant checkbox
    const restCheckbox = getByTestId('program-rest-checkbox-1');
    await fireEvent.click(restCheckbox);

    await fireEvent.submit(getByTestId('program-form'));

    expect(api.post).toHaveBeenCalledWith('/programas', {
      name: 'Nuevo Descuento',
      pointsRule: 1,
      active: true,
      beneficios: '20% off en postres',
      requisitos: 'Consumo mínimo S/. 50',
      restaurantes: ['1']
    });

    await waitFor(() => {
      expect(getByText('Nuevo Descuento')).toBeInTheDocument();
    });

    // 2. Edit the program
    const editBtn = getByTestId('edit-program-btn-1'); // edit 'Club Oro'
    await fireEvent.click(editBtn);

    expect(getByText('Editar Programa')).toBeInTheDocument();
    const nameInput = getByLabelText('Nombre del Programa') as HTMLInputElement;
    expect(nameInput.value).toBe('Club Oro');

    await fireEvent.input(nameInput, { target: { value: 'Club Platino' } });
    await fireEvent.submit(getByTestId('program-form'));

    expect(api.put).toHaveBeenCalledWith('/programas/1', {
      name: 'Club Platino',
      pointsRule: 1,
      active: true,
      beneficios: '10% cashback en cenas',
      requisitos: 'Consumo mínimo S/. 100',
      restaurantes: ['1']
    });

    await waitFor(() => {
      expect(getByText('Club Platino')).toBeInTheDocument();
    });

    // 3. Delete program
    const deleteBtn = getByTestId('delete-program-btn-2'); // delete 'Cena Premium'
    await fireEvent.click(deleteBtn);

    expect(api.delete).toHaveBeenCalledWith('/programas/2');
    await waitFor(() => {
      expect(queryByText('Cena Premium')).toBeNull();
    });
  });

  it('should navigate to restaurants tab and manage restaurant affiliation, state and deletion', async () => {
    const { getByTestId, getByLabelText, getByText, queryByText } = render(DashboardCompany);
    
    // Go to Restaurants tab
    await fireEvent.click(getByTestId('tab-restaurants-btn'));

    expect(getByText('Afiliar Nuevo Local')).toBeInTheDocument();
    expect(getByText('La Choza Náutica')).toBeInTheDocument();

    // 1. Add restaurant
    await fireEvent.input(getByLabelText('Nombre Comercial'), { target: { value: 'Bembos' } });
    await fireEvent.input(getByLabelText('RUC del Local'), { target: { value: '20202020202' } });
    await fireEvent.input(getByLabelText('Correo del Restaurante'), { target: { value: 'contacto@bembos.pe' } });

    await fireEvent.submit(getByTestId('restaurant-form'));

    expect(api.post).toHaveBeenCalledWith('/restaurantes', {
      name: 'Bembos',
      email: 'contacto@bembos.pe',
      code: '20202020202'
    });

    await waitFor(() => {
      expect(getByText('Bembos')).toBeInTheDocument();
    });

    // 2. Toggle status (Deactivate La Choza Náutica id=1)
    const toggleBtn = getByTestId('toggle-restaurant-btn-1');
    await fireEvent.click(toggleBtn);

    expect(api.patch).toHaveBeenCalledWith('/restaurantes/1/status', { active: false });
    await waitFor(() => {
      expect(getByText('Inactivo')).toBeInTheDocument();
    });

    // 3. Delete Restaurant (El Hornero id=2)
    const deleteBtn = getByTestId('delete-restaurant-btn-2');
    await fireEvent.click(deleteBtn);

    expect(api.delete).toHaveBeenCalledWith('/restaurantes/2');
    await waitFor(() => {
      expect(queryByText('El Hornero')).toBeNull();
    });
  });

  it('should navigate to clients tab and manage client affiliation, state and deletion', async () => {
    const { getByTestId, getByLabelText, getByText, queryByText } = render(DashboardCompany);
    
    // Go to Clients tab
    await fireEvent.click(getByTestId('tab-clients-btn'));

    expect(getByText('Afiliar Nuevo Cliente')).toBeInTheDocument();
    expect(getByText('Juan Pérez')).toBeInTheDocument();

    // 1. Add client
    await fireEvent.input(getByLabelText('Nombre Completo'), { target: { value: 'Carlos Torres' } });
    await fireEvent.input(getByLabelText('Correo Electrónico'), { target: { value: 'carlos@torres.com' } });
    await fireEvent.input(getByLabelText('Número de Tarjeta'), { target: { value: 'CARD_789' } });

    await fireEvent.submit(getByTestId('client-form'));

    expect(api.post).toHaveBeenCalledWith('/clientes', {
      name: 'Carlos Torres',
      email: 'carlos@torres.com',
      tarjetaCliente: 'CARD_789'
    });

    await waitFor(() => {
      expect(getByText('Carlos Torres')).toBeInTheDocument();
    });

    // 2. Toggle status (Deactivate Juan Pérez id=1)
    const toggleBtn = getByTestId('toggle-client-btn-1');
    await fireEvent.click(toggleBtn);

    expect(api.patch).toHaveBeenCalledWith('/clientes/1/status', { active: false });
    await waitFor(() => {
      expect(getByText('Deshabilitado')).toBeInTheDocument();
    });

    // 3. Delete Client (Ana Gómez id=2)
    const deleteBtn = getByTestId('delete-client-btn-2');
    await fireEvent.click(deleteBtn);

    expect(api.delete).toHaveBeenCalledWith('/clientes/2');
    await waitFor(() => {
      expect(queryByText('Ana Gómez')).toBeNull();
    });
  });

  it('should logout and redirect to /login', async () => {
    const { getByTestId } = render(DashboardCompany);
    const logoutBtn = getByTestId('logout-btn');

    await fireEvent.click(logoutBtn);

    expect(sessionStore.logout).toHaveBeenCalled();
    expect(routeStore.navigate).toHaveBeenCalledWith('/login');
  });
});
