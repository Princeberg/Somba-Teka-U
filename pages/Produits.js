"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase";
import { Loader2, Eye, Calendar, Trash2 } from "lucide-react";
import '@/styles/mesProduits.css';

export default function MesProduits() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shopName, setShopName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const loadProducts = async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push("/login");
        return;
      }

      const { data: sellerData } = await supabase
        .from("sellers")
        .select("shop_name")
        .eq("id_user", user.id)
        .single();

      setShopName(sellerData?.shop_name || "Ma Boutique");

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id_sellers", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erreur chargement produits :", error);
        return;
      }

      setProducts(data);
      setLoading(false);
    };

    loadProducts();
  }, [router]);

  const handleDelete = async (id) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) {
        alert("Erreur lors de la suppression du produit.");
        return;
      }
      setProducts(products.filter((product) => product.id !== id));
    }
  };

  return (
    <div className="mes-produits-container">
      <h1 className="mes-produits-title">
        Mes Produits - <span className="mes-produits-shop">{shopName}</span>
      </h1>

      {loading ? (
        <div className="loader">
          <Loader2 className="spinner" />
        </div>
      ) : products.length === 0 ? (
        <p className="empty-message">Aucun produit trouvé.</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <img
                src={product.productPicture1 || "/default-product.jpg"}
                alt={product.name}
                className="product-image"
              />
              <div className="product-details">
                <h2 className="product-title">{product.name}</h2>
                <p><strong>Prix :</strong> {product.price} FCFA</p>
                <p><strong>Catégorie :</strong> {product.categorie}</p>
                <p className="product-description">{product.description?.substring(0, 80)}...</p>
                <div className="product-footer">
                  <span className="product-vues"><Eye size={14} /> {product.vues}</span>
                  <span className="product-date"><Calendar size={14} /> {new Date(product.created_at).toLocaleDateString()}</span>
                </div>
                <button className="delete-btn" onClick={() => handleDelete(product.id)}>
                  <Trash2 size={16} /> Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* mesProduits.css */
