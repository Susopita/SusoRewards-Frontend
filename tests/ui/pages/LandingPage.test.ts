import { render, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LandingPage from '../../../src/ui/pages/LandingPage.svelte';
import { routeStore } from '../../../src/stores/route.svelte';

vi.mock('../../../src/stores/route.svelte', () => {
  return {
    routeStore: {
      navigate: vi.fn(),
    },
  };
});

describe('LandingPage Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render navbar and CTA headings', () => {
    const { getByText } = render(LandingPage);
    expect(getByText('Suso')).toBeInTheDocument();
    expect(getByText('Rewards')).toBeInTheDocument();
    expect(getByText('Fideliza a tus clientes con un sistema')).toBeInTheDocument();
    expect(getByText('Premium de Recompensas')).toBeInTheDocument();
  });

  it('should navigate to login when login button is clicked', async () => {
    const { getByTestId } = render(LandingPage);
    const loginBtn = getByTestId('nav-login-btn');
    await fireEvent.click(loginBtn);
    expect(routeStore.navigate).toHaveBeenCalledWith('/login');
  });

  it('should navigate to afiliate when register or cta buttons are clicked', async () => {
    const { getByTestId } = render(LandingPage);
    const registerBtn = getByTestId('nav-register-btn');
    await fireEvent.click(registerBtn);
    expect(routeStore.navigate).toHaveBeenCalledWith('/afiliate');

    const heroCtaBtn = getByTestId('hero-cta-btn');
    await fireEvent.click(heroCtaBtn);
    expect(routeStore.navigate).toHaveBeenCalledWith('/afiliate');
  });
});
