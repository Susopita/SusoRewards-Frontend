import { render, waitFor } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DashboardClient from '../../../src/ui/pages/DashboardClient.svelte';
import { SseClient } from '../../../src/adapters/sse';

vi.mock('../../../src/stores/route.svelte', () => ({
  routeStore: { navigate: vi.fn() }
}));

vi.mock('../../../src/stores/session.svelte', () => ({
  sessionStore: {
    current: { username: 'client_user', token: 'client-token-999' },
    logout: vi.fn()
  }
}));

vi.mock('../../../src/adapters/api', () => ({
  api: {
    get: vi.fn().mockImplementation((path: string) => {
      if (path === '/clientes/me') {
        return Promise.resolve({
          id: 'client-123',
          name: 'client_user',
          empresasAfiliadas: ['empresa-123']
        });
      }
      if (path.startsWith('/recompensas/puntos/')) {
        return Promise.resolve({
          puntos: 150,
          cashback: 25.50
        });
      }
      return Promise.resolve({});
    })
  }
}));

// Mock SseClient
let sseHandler: any;
let mockDisconnect = vi.fn();
let mockConnect = vi.fn().mockImplementation((onMsg, _onErr) => {
  sseHandler = onMsg;
});

vi.mock('../../../src/adapters/sse', () => {
  return {
    SseClient: vi.fn().mockImplementation(() => ({
      connect: mockConnect,
      disconnect: mockDisconnect
    }))
  };
});

describe('DashboardClient Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render client points and cashback initially', async () => {
    const { getByText } = render(DashboardClient);
    await waitFor(() => {
      expect(getByText('150 PTS')).toBeInTheDocument();
      expect(getByText('S/. 25.50')).toBeInTheDocument();
    });
    expect(getByText('No tienes notificaciones por el momento.')).toBeInTheDocument();
  });

  it('should establish SSE connection and process updates reactively', async () => {
    const { getByText, findByText, queryByText } = render(DashboardClient);

    await waitFor(() => {
      expect(SseClient).toHaveBeenCalledWith('/api/notificaciones/stream?token=client-token-999');
      expect(mockConnect).toHaveBeenCalled();
    });

    // Simular un mensaje recibido
    sseHandler({
      mensaje: '¡Acabas de recibir 50 puntos!',
      puntos: 200,
      cashback: 30.00
    });

    // Validar actualizaciones en pantalla
    expect(await findByText('200 PTS')).toBeInTheDocument();
    expect(await findByText('S/. 30.00')).toBeInTheDocument();
    expect(getByText('¡Acabas de recibir 50 puntos!')).toBeInTheDocument();
    expect(queryByText('No tienes notificaciones por el momento.')).toBeNull();
  });

  it('should disconnect SSE on component destroy', async () => {
    const { unmount } = render(DashboardClient);
    await waitFor(() => {
      expect(SseClient).toHaveBeenCalled();
    });
    unmount();
    expect(mockDisconnect).toHaveBeenCalled();
  });
});
