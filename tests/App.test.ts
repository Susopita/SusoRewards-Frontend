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

  it('should redirect authenticated admin from /login to /dashboard-company', async () => {
    sessionStore.login({ username: 'admin', role: 'admin', token: 'token' });
    render(App);
    routeStore.navigate('/login');

    await waitFor(() => {
      expect(routeStore.current).toBe('/dashboard-company');
    });
  });

  it('should redirect authenticated restaurant from /login to /dashboard-restaurant', async () => {
    sessionStore.login({ username: 'rest', role: 'restaurant', token: 'token' });
    render(App);
    routeStore.navigate('/login');

    await waitFor(() => {
      expect(routeStore.current).toBe('/dashboard-restaurant');
    });
  });

  it('should redirect authenticated client from /afiliate to /dashboard-client', async () => {
    sessionStore.login({ username: 'client', role: 'client', token: 'token' });
    render(App);
    routeStore.navigate('/afiliate');

    await waitFor(() => {
      expect(routeStore.current).toBe('/dashboard-client');
    });
  });
});
