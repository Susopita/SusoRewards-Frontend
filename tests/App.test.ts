import { render, waitFor } from '@testing-library/svelte';
import { describe, it, expect, beforeEach } from 'vitest';
import App from '../src/App.svelte';
import { routeStore } from '../src/stores/route.svelte';
import { sessionStore } from '../src/stores/session.svelte';

describe('App Routing', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStore.logout();
    routeStore.navigate('/');
  });

  it('should render LandingPage by default at / path', () => {
    const { getByText } = render(App);
    expect(getByText('Fideliza a tus clientes con un sistema')).toBeInTheDocument();
  });

  it('should render LoginPage when navigating to /login', async () => {
    const { getByText } = render(App);
    routeStore.navigate('/login');
    
    await waitFor(() => {
      expect(getByText('Ingresar')).toBeInTheDocument();
    });
  });

  it('should render AfiliatePage when navigating to /afiliate', async () => {
    const { getByText } = render(App);
    routeStore.navigate('/afiliate');
    
    await waitFor(() => {
      expect(getByText('Completar Registro')).toBeInTheDocument();
    });
  });

  it('should redirect to /login if accessing dashboard unauthenticated', async () => {
    const { getByText } = render(App);
    routeStore.navigate('/dashboard-restaurant');

    await waitFor(() => {
      expect(getByText('Iniciar Sesión')).toBeInTheDocument();
      expect(routeStore.current).toBe('/login');
    });
  });
});
