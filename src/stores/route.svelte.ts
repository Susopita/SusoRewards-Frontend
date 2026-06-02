class RouteStore {
  #current = $state<string>('/');

  get current() {
    return this.#current;
  }

  navigate(path: string) {
    this.#current = path;
  }
}

export const routeStore = new RouteStore();
