import { describe, it, expect } from 'vitest';
import { routeStore } from '../../src/stores/route.svelte';

describe('RouteStore', () => {
  it('should initialize at root /', () => {
    expect(routeStore.current).toBe('/');
  });

  it('should navigate to another path', () => {
    routeStore.navigate('/login');
    expect(routeStore.current).toBe('/login');
  });
});
