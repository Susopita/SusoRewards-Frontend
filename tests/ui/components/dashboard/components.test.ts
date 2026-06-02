import { render, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import StatsCard from '../../../../src/ui/components/dashboard/StatsCard.svelte';
import ClientManager from '../../../../src/ui/components/dashboard/ClientManager.svelte';
import RestaurantManager from '../../../../src/ui/components/dashboard/RestaurantManager.svelte';
import ProgramManager from '../../../../src/ui/components/dashboard/ProgramManager.svelte';

describe('StatsCard Component', () => {
  it('should render with themeClass', () => {
    const { container, getByText } = render(StatsCard, { title: 'Puntos', value: 100, themeClass: 'gold' });
    expect(getByText('Puntos')).toBeInTheDocument();
    expect(getByText('100')).toBeInTheDocument();
    expect(container.querySelector('.gold')).toBeInTheDocument();
  });

  it('should render with default themeClass', () => {
    const { container } = render(StatsCard, { title: 'Cashback', value: 50 });
    expect(container.querySelector('.metric-card')).toBeInTheDocument();
    expect(container.querySelector('.gold')).toBeNull();
  });
});

describe('ClientManager Component', () => {
  it('should show error when fields are empty', async () => {
    const onAdd = vi.fn();
    const { getByTestId, findByTestId } = render(ClientManager, {
      clients: [],
      loading: false,
      onAdd,
      onToggleStatus: vi.fn(),
      onDelete: vi.fn()
    });

    const form = getByTestId('client-form');
    await fireEvent.submit(form);

    const alert = await findByTestId('form-error-alert');
    expect(alert.textContent).toContain('Todos los campos son obligatorios.');
    expect(onAdd).not.toHaveBeenCalled();
  });

  it('should show error when onAdd API rejects', async () => {
    const onAdd = vi.fn().mockRejectedValue(new Error('RUC duplicado'));
    const { getByLabelText, getByTestId, findByTestId } = render(ClientManager, {
      clients: [],
      loading: false,
      onAdd,
      onToggleStatus: vi.fn(),
      onDelete: vi.fn()
    });

    await fireEvent.input(getByLabelText('Nombre Completo'), { target: { value: 'Juan' } });
    await fireEvent.input(getByLabelText('Correo Electrónico'), { target: { value: 'juan@test.com' } });
    await fireEvent.input(getByLabelText('Número de Tarjeta'), { target: { value: 'CARD123' } });

    const form = getByTestId('client-form');
    await fireEvent.submit(form);

    const alert = await findByTestId('form-error-alert');
    expect(alert.textContent).toContain('RUC duplicado');
  });
});

describe('RestaurantManager Component', () => {
  it('should show error when fields are empty', async () => {
    const onAdd = vi.fn();
    const { getByTestId, findByTestId } = render(RestaurantManager, {
      restaurants: [],
      loading: false,
      onAdd,
      onToggleStatus: vi.fn(),
      onDelete: vi.fn()
    });

    const form = getByTestId('restaurant-form');
    await fireEvent.submit(form);

    const alert = await findByTestId('form-error-alert');
    expect(alert.textContent).toContain('Todos los campos son obligatorios.');
    expect(onAdd).not.toHaveBeenCalled();
  });

  it('should show error when RUC is less than 11 digits', async () => {
    const onAdd = vi.fn();
    const { getByLabelText, getByTestId, findByTestId } = render(RestaurantManager, {
      restaurants: [],
      loading: false,
      onAdd,
      onToggleStatus: vi.fn(),
      onDelete: vi.fn()
    });

    await fireEvent.input(getByLabelText('Nombre Comercial'), { target: { value: 'Bembos' } });
    await fireEvent.input(getByLabelText('RUC del Local'), { target: { value: '123' } });
    await fireEvent.input(getByLabelText('Correo del Restaurante'), { target: { value: 'bembos@test.com' } });

    const form = getByTestId('restaurant-form');
    await fireEvent.submit(form);

    const alert = await findByTestId('form-error-alert');
    expect(alert.textContent).toContain('El RUC debe tener 11 dígitos.');
    expect(onAdd).not.toHaveBeenCalled();
  });

  it('should show error when onAdd API rejects', async () => {
    const onAdd = vi.fn().mockRejectedValue(new Error('Connection error'));
    const { getByLabelText, getByTestId, findByTestId } = render(RestaurantManager, {
      restaurants: [],
      loading: false,
      onAdd,
      onToggleStatus: vi.fn(),
      onDelete: vi.fn()
    });

    await fireEvent.input(getByLabelText('Nombre Comercial'), { target: { value: 'Bembos' } });
    await fireEvent.input(getByLabelText('RUC del Local'), { target: { value: '12345678901' } });
    await fireEvent.input(getByLabelText('Correo del Restaurante'), { target: { value: 'bembos@test.com' } });

    const form = getByTestId('restaurant-form');
    await fireEvent.submit(form);

    const alert = await findByTestId('form-error-alert');
    expect(alert.textContent).toContain('Connection error');
  });
});

describe('ProgramManager Component', () => {
  it('should show error when fields are empty', async () => {
    const onSave = vi.fn();
    const { getByTestId, findByTestId } = render(ProgramManager, {
      programs: [],
      restaurants: [],
      loading: false,
      onSave,
      onDelete: vi.fn()
    });

    const form = getByTestId('program-form');
    await fireEvent.submit(form);

    const alert = await findByTestId('form-error-alert');
    expect(alert.textContent).toContain('Todos los campos del programa son obligatorios.');
    expect(onSave).not.toHaveBeenCalled();
  });

  it('should show error when onSave API rejects', async () => {
    const onSave = vi.fn().mockRejectedValue(new Error('Validation fail'));
    const { getByLabelText, getByTestId, findByTestId, getByPlaceholderText } = render(ProgramManager, {
      programs: [],
      restaurants: [],
      loading: false,
      onSave,
      onDelete: vi.fn()
    });

    await fireEvent.input(getByLabelText('Nombre del Programa'), { target: { value: 'Club VIP' } });
    await fireEvent.input(getByPlaceholderText('Ej. Bebida gratis en el local'), { target: { value: 'Cashback 5%' } });
    await fireEvent.input(getByLabelText('Requisitos'), { target: { value: 'Consumo S/. 100' } });

    const form = getByTestId('program-form');
    await fireEvent.submit(form);

    const alert = await findByTestId('form-error-alert');
    expect(alert.textContent).toContain('Validation fail');
  });

  it('should support selecting/deselecting restaurants and editing/cancelling', async () => {
    const mockRestaurants = [
      { id: 'rest1', nombre: 'Pizza Hut', ruc: '20123456789', email: 'ph@test.com', habilitado: true }
    ];
    const mockPrograms = [
      { id: 'prog1', nombre: 'Club VIP', beneficios: 'Cashback 5%', requisitos: 'Consumo S/. 100', restaurantes: [] }
    ];
    const onSave = vi.fn().mockResolvedValue(undefined);

    const { getByTestId, queryByText, getByText } = render(ProgramManager, {
      programs: mockPrograms,
      restaurants: mockRestaurants,
      loading: false,
      onSave,
      onDelete: vi.fn()
    });

    // 1. Toggle restaurant checkbox
    const checkbox = getByTestId('program-rest-checkbox-rest1');
    await fireEvent.click(checkbox); // check it
    await fireEvent.click(checkbox); // uncheck it

    // 2. Click edit button on the program
    const editBtn = getByTestId('edit-program-btn-prog1');
    await fireEvent.click(editBtn);

    // Verify it is in editing mode
    expect(queryByText('Cancelar')).toBeInTheDocument();

    // Cancel edit
    const cancelBtn = getByText('Cancelar');
    await fireEvent.click(cancelBtn);
    expect(queryByText('Cancelar')).toBeNull();
  });
});
