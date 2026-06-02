<script lang="ts">
  import { routeStore } from '../../stores/route.svelte';

  function goToLogin() {
    routeStore.navigate('/login');
  }

  function goToAfiliate() {
    routeStore.navigate('/afiliate');
  }
</script>

<div class="landing-wrapper">
  <!-- Navbar -->
  <nav class="navbar">
    <button type="button" class="nav-logo-btn" onclick={() => routeStore.navigate('/')}>
      <span class="logo-text">Suso<span class="logo-accent">Rewards</span></span>
    </button>
    <div class="nav-links">
      <a href="#features">Características</a>
      <a href="#benefits">Beneficios</a>
    </div>
    <div class="nav-actions">
      <button class="btn-text" onclick={goToLogin} data-testid="nav-login-btn">Iniciar Sesión</button>
      <button class="btn-primary" onclick={goToAfiliate} data-testid="nav-register-btn">Registrarse</button>
    </div>
  </nav>

  <!-- Hero Section -->
  <header class="hero">
    <h1 class="hero-title">
      Fideliza a tus clientes con un sistema <br />
      <span class="premium-gradient-text">Premium de Recompensas</span>
    </h1>
    <p class="hero-subtitle">
      La plataforma SaaS moderna para gestionar cashback, puntos y beneficios en tiempo real para empresas, restaurantes y comensales.
    </p>
    <div class="hero-actions">
      <button class="btn-primary btn-lg" onclick={goToAfiliate} data-testid="hero-cta-btn">
        Comenzar Ahora
      </button>
      <button class="btn-secondary btn-lg" onclick={goToLogin}>
        Ver Demo
      </button>
    </div>
  </header>

  <!-- Features Grid -->
  <section id="features" class="features-section">
    <h2 class="section-title">Diseñado para cada rol</h2>
    <div class="features-grid">
      <div class="card feature-card">
        <div class="feature-icon font-gold">🏢</div>
        <h3>Empresas</h3>
        <p>Crea programas de fidelización dinámicos, gestiona tus sucursales y analiza los consumos globales con dashboards de alto nivel.</p>
      </div>

      <div class="card feature-card">
        <div class="feature-icon font-indigo">🍴</div>
        <h3>Restaurantes</h3>
        <p>Registra ventas y consumos al instante. Nuestro sistema seguro deduce el código de sucursal directamente desde la sesión activa.</p>
      </div>

      <div class="card feature-card">
        <div class="feature-icon font-emerald">👤</div>
        <h3>Clientes</h3>
        <p>Consulta tus puntos y cashback acumulado. Recibe alertas instantáneas en tu bandeja en tiempo real vía Server-Sent Events (SSE).</p>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <p>&copy; 2026 SusoRewards. Todos los derechos reservados.</p>
  </footer>
</div>

<style>
  .landing-wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  /* Navbar */
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 4rem;
    background: rgba(9, 13, 22, 0.7);
    backdrop-filter: blur(12px);
    position: sticky;
    top: 0;
    z-index: 100;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .nav-logo-btn {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    text-align: left;
    font-family: inherit;
    color: inherit;
  }

  .logo-text {
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: -0.5px;
  }

  .logo-accent {
    background: var(--gradient-premium);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .nav-links {
    display: flex;
    gap: 2rem;
  }

  .nav-links a {
    color: var(--text-muted);
    font-weight: 500;
    transition: color var(--transition-fast);
  }

  .nav-links a:hover {
    color: var(--text-main);
  }

  .nav-actions {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .btn-text {
    color: var(--text-muted);
    font-weight: 600;
    transition: color var(--transition-fast);
  }

  .btn-text:hover {
    color: var(--text-main);
  }

  /* Hero Section */
  .hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 8rem 2rem 6rem 2rem;
    max-width: 1000px;
    margin: 0 auto;
    gap: 2rem;
  }

  .hero-title {
    font-size: 3.5rem;
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -1px;
  }

  .hero-subtitle {
    font-size: 1.25rem;
    color: var(--text-muted);
    max-width: 700px;
    line-height: 1.6;
  }

  .hero-actions {
    display: flex;
    gap: 1.5rem;
    margin-top: 1rem;
  }



  /* Features */
  .features-section {
    padding: 6rem 2rem;
    max-width: 1100px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }

  .section-title {
    text-align: center;
    font-size: 2.25rem;
    letter-spacing: -0.5px;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }

  .feature-card {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    text-align: left;
  }

  .feature-icon {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }

  .font-gold {
    filter: drop-shadow(0 0 10px rgba(245, 158, 11, 0.2));
  }

  .font-indigo {
    filter: drop-shadow(0 0 10px rgba(99, 102, 241, 0.2));
  }

  .font-emerald {
    filter: drop-shadow(0 0 10px rgba(16, 185, 129, 0.2));
  }

  .feature-card h3 {
    font-size: 1.5rem;
  }

  .feature-card p {
    color: var(--text-muted);
    font-size: 0.95rem;
  }

  /* Footer */
  .footer {
    margin-top: auto;
    padding: 3rem 2rem;
    text-align: center;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    color: var(--text-muted);
    font-size: 0.9rem;
  }

  @media (max-width: 768px) {
    .navbar {
      padding: 1.5rem;
    }
    .nav-links {
      display: none;
    }
    .hero-title {
      font-size: 2.5rem;
    }
    .hero-actions {
      flex-direction: column;
      width: 100%;
      gap: 1rem;
    }
    .btn-lg {
      width: 100%;
    }
  }
</style>
