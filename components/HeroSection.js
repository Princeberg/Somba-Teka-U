import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Le marché local à portée de clic !</h1>
        <h5>
          Trouvez tout ce dont vous avez besoin <br />
          à Brazzaville et ses environs.
        </h5>
        <div className="btn-container">
          <Link href="/somba" className="btn btn-primary">
            <i className="fas fa-shopping-cart me-2"></i> Acheter des articles
          </Link>
          <Link href="/seka" className="btn btn-outline">
            <i className="fas fa-shop me-2"></i> Vendre des articles
          </Link>
          <Link href="/login" className="btn btn-primary">
            <i className="fas fa-cogs me-2"></i> Gérer ma boutique
          </Link>
        </div>
      </div>
    </section>
  );
}
