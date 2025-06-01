export default function Header() {
  return (
    <header id="mainHeader">
      <div className="header-container">
        <a href="/" className="logo">SOMBA TEKA</a>
        <button className="mobile-menu-btn" onClick={() => {
          document.getElementById('mainNav').classList.toggle('active');
        }}>
          <i className="fas fa-bars"></i>
        </button>
        <nav id="mainNav">
          <ul>
            <li><a href="/ad">Espace Publicitaire</a></li>
            <li><a href="/About-us">À Propos de Nous</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
