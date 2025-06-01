"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import supabase from "../lib/supabase"; 
import '@/styles/seller.css';

export default function SellerHome() {
  const [shopName, setShopName] = useState("");
  const [accountStatus, setAccountStatus] = useState(null);
  const [products, setProducts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push("/login");
        return;
      }

      const { data: sellerData, error: sellerError } = await supabase
        .from("sellers")
        .select("shop_name, statut")
        .eq("id_user", user.id)
        .single();

      if (sellerError) {
        console.error("Erreur lors de la récupération du vendeur :", sellerError);
        alert("Une erreur s'est produite.");
        return;
      }

      setShopName(sellerData?.shop_name || "Vendeur");
      setAccountStatus(sellerData.statut);

      // Charger les produits du vendeur
      const { data: productData, error: productError } = await supabase
        .from("products")
        .select("id, name, price, vues, picture1")
        .eq("id_user", user.id);

      if (productError) {
        console.error("Erreur lors de la récupération des produits :", productError);
      } else {
        setProducts(productData);
      }
    };

    checkAuthAndLoadData();

    const blockRightClick = (e) => e.preventDefault();
    document.addEventListener("contextmenu", blockRightClick);
    return () => document.removeEventListener("contextmenu", blockRightClick);
  }, [router]);

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert("Erreur lors de la déconnexion.");
    } else {
      router.push("/");
    }
  };

  return (
    <>
      <Head>
        <title>Espace Vendeur - SOMBATEKA</title>
        <meta name="description" content="Espace vendeur SOMBATEKA" />
        <meta name="keywords" content="vendeur, dashboard, ecommerce" />
      </Head>

      <div className="site-wrap">
        <header className="site-navbar py-3" role="banner">
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col-6 col-xl-3"></div>
              <div className="col-6 col-xl-9 text-right">
                <button className="logout-btn" onClick={logout}>
                  <i className="fas fa-sign-out-alt mr-2" /> Déconnexion
                </button>

                 <button className="btn btn-seller btn-seller-danger" style={{marginLeft: "10px"}}  onClick={() => router.push(`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`)}>
  <i className="fas fa-message" /> Nous écrire
</button>

              </div>
            </div>
          </div>
        </header>

        <div className="container seller-container">
          <div className="seller-header text-center">
            <h1>Espace Vendeur</h1>
            <p>Gérez vos produits en toute simplicité</p>
          </div>

          {accountStatus === 0 && (
            <div className="account-status account-inactive">
              <h4><i className="fas fa-exclamation-circle mr-2" /> Compte non activé</h4>
              <p>Votre compte est en attente d&apos;activation.</p>
              <a href="/ActivationScreen" className="btn btn-seller btn-success mt-2">
                <i className="fas fa-plus" /> Activer un abonnement
              </a>
              <a href="/demande" className="btn btn-seller btn-danger mt-2">
                <i className="fas fa-plus" /> Ajouter un produit sans abonnement
              </a>
            </div>
          )}

          <div className="welcome-text text-center">
            <h2>
              Nom de la Boutique: <span className="text-success">{shopName}</span>
            </h2>
            <p className={accountStatus === 0 ? "text-danger" : ""}>
              {accountStatus === 0
                ? "Votre compte est en attente d'activation"
                : "Accédez à vos produits et gérez votre boutique"}
            </p>
          </div>

          {accountStatus === 1 && (
            <>
              <div className="text-center my-4">
                <button
                  className="btn btn-seller btn-seller-success"
                  onClick={() => router.push("/demandeSeller")}
                >
                  <i className="fas fa-plus-circle" /> Ajouter un nouveau produit
                </button>  

                  <button className="btn btn-seller btn-seller-primary" style={{marginLeft: "10px"}}  onClick={() => router.push("/Produits")}
>
  <i className="fas fa-box-open" /> Mes produits
</button>



              
              </div>

              <div className="product-list row">
                {products.map((product) => (
                  <div key={product.id} className="col-md-4 mb-4">
                    <div className="card h-100">
                      <img
                        src={product.picture1 || "/default-product.jpg"}
                        alt={product.name}
                        className="card-img-top"
                        style={{ maxHeight: "200px", objectFit: "cover" }}
                      />
                      <div className="card-body text-center">
                        <h5 className="card-title">{product.name}</h5>
                        <p className="card-text">Prix: {product.price} FCFA</p>
                        <p className="card-text">
                          <i className="fas fa-eye" /> {product.vues} vues
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
