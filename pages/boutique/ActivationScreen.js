import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import supabase from "@/lib/supabase";

export default function ActivationScreen() {
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentKey, setPaymentKey] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [productId, setProductId] = useState(null);
  const [boost, setBoost] = useState(null);
  const [tarif, setTarif] = useState(null);
  const [boostEnd, setBoostEnd] = useState(null);

  useEffect(() => {
    const id = sessionStorage.getItem("ProductId");
    const boostVal = sessionStorage.getItem("boost");
    const tarifVal = sessionStorage.getItem("tarif");
    const end = sessionStorage.getItem("BoostEnd");

    if (!id || !boostVal || !tarifVal || !end) {
      alert("Données de boost manquantes.");
      router.push("/boutique/view");
      return;
    }

    setProductId(id);
    setBoost(boostVal);
    setTarif(tarifVal);
    setBoostEnd(end);
    setPaymentAmount(tarifVal);
  }, []);

  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(to right, #f0f4f8, #ffffff)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
    },
    card: {
      backgroundColor: "#ffffff",
      borderRadius: "1rem",
      padding: "2rem",
      maxWidth: "28rem",
      width: "100%",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: 700,
      textAlign: "center",
      color: "#1f2937",
      marginBottom: "1.5rem",
    },
    label: {
      fontWeight: "600",
      display: "block",
      marginTop: "1rem",
    },
    input: {
      width: "100%",
      padding: "0.5rem",
      marginTop: "0.25rem",
      borderRadius: "0.5rem",
      border: "1px solid #d1d5db",
      outline: "none",
      fontSize: "1rem",
    },
    inputError: {
      borderColor: "#dc2626",
    },
    button: {
      backgroundColor: "#2563eb",
      color: "white",
      fontWeight: "600",
      padding: "0.5rem 1rem",
      width: "100%",
      borderRadius: "0.5rem",
      border: "none",
      cursor: "pointer",
      marginTop: "1.5rem",
      fontSize: "1rem",
    },
    errorText: {
      color: "#dc2626",
      fontSize: "0.875rem",
      marginTop: "0.25rem",
    },
    backButton: {
      backgroundColor: "#e5e7eb",
      color: "#374151",
      padding: "0.4rem 0.8rem",
      borderRadius: "0.5rem",
      border: "none",
      cursor: "pointer",
      fontSize: "0.9rem",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      marginBottom: "1rem",
    },
    modalOverlay: {
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 50,
    },
    modalBox: {
      backgroundColor: "white",
      borderRadius: "1rem",
      padding: "2rem",
      width: "100%",
      maxWidth: "28rem",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
    },
    modalTitle: {
      color: "#dc2626",
      textAlign: "center",
      fontSize: "1.25rem",
      fontWeight: 600,
    },
    paymentInstruction: {
      backgroundColor: "#f9fafb",
      padding: "1rem",
      borderRadius: "0.5rem",
      marginTop: "0.5rem",
    },
    copyButton: {
      marginLeft: "0.5rem",
      fontSize: "0.75rem",
      color: "#2563eb",
      textDecoration: "underline",
      cursor: "pointer",
      background: "none",
      border: "none",
      padding: 0,
      fontFamily: "inherit",
    },
    modalButtons: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "1.5rem",
    },
    cancelButton: {
      backgroundColor: "#e5e7eb",
      color: "#374151",
      padding: "0.5rem 1rem",
      borderRadius: "0.5rem",
      border: "none",
      cursor: "pointer",
    },
    confirmButton: {
      backgroundColor: "#16a34a",
      color: "white",
      padding: "0.5rem 1rem",
      borderRadius: "0.5rem",
      border: "none",
      cursor: "pointer",
    },
  };

  function validateForm() {
    const newErrors = {};
    if (!phoneNumber.trim()) newErrors.phoneNumber = "Numéro obligatoire";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function generatePaymentKey() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  function handleCopy(text, e) {
    navigator.clipboard.writeText(text).then(() => {
      const btn = e.target;
      const originalText = btn.textContent;
      btn.textContent = "Copié !";
      setTimeout(() => {
        btn.textContent = originalText;
      }, 2000);
    });
  }

  async function processPayment() {
    try {
      const { error } = await supabase
        .from("products")
        .update({
          PayementKey: paymentKey,
          NumeroPayement: phoneNumber,
          Booster: boost,
          Tarif: tarif,
          BoostEnd: boostEnd,
        })
        .eq("id", productId);

      if (error) {
        alert("Une erreur est survenue lors de l'activation. Veuillez réessayer plus tard.");
        return;
      }

      alert("Nous allons vérifier votre paiement. Merci de patienter !");
      router.push("/boutique/view");
    } catch {
      alert("Une erreur technique s'est produite. Veuillez vérifier votre connexion et réessayer.");
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (validateForm()) {
      const key = generatePaymentKey();
      setPaymentKey(key);
      setShowPaymentModal(true);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <button style={styles.backButton} onClick={() => router.back()}>
          <i className="fas fa-arrow-left"></i> Retour
        </button>
        <h2 style={styles.title}>Booster un produit</h2>
        <form onSubmit={handleSubmit}>
          <label style={styles.label} htmlFor="phoneNumber">
            Numéro de téléphone
          </label>
          <input
            type="text"
            id="phoneNumber"
            placeholder="Entrez le numéro de téléphone de la transaction"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            style={{
              ...styles.input,
              ...(errors.phoneNumber ? styles.inputError : {}),
            }}
          />
          {errors.phoneNumber && (
            <p style={styles.errorText}>{errors.phoneNumber}</p>
          )}

          <button type="submit" style={styles.button}>
            Booster le produit
          </button>
        </form>
      </div>

      {showPaymentModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h3 style={styles.modalTitle}>Instructions de Paiement</h3>
            <p>
              Veuillez effectuer un dépôt de{" "}
              <strong>{paymentAmount} FCFA</strong> à l&apos;un des numéros suivants :
            </p>
            <div style={styles.paymentInstruction}>
              <p>
                <strong>MTN Mobile Money:</strong> {process.env.NEXT_PUBLIC_MTN_NUMBER}{" "}
                <button
                  style={styles.copyButton}
                  onClick={(e) => handleCopy(process.env.NEXT_PUBLIC_MTN_NUMBER, e)}
                >
                  Copier
                </button>
              </p>
              <p>
                <strong>Airtel Money:</strong> {process.env.NEXT_PUBLIC_AIRTEL_NUMBER}{" "}
                <button
                  style={styles.copyButton}
                  onClick={(e) => handleCopy(process.env.NEXT_PUBLIC_AIRTEL_NUMBER, e)}
                >
                  Copier
                </button>
              </p>
            </div>
            <p>
              Clé de paiement unique : <strong>{paymentKey}</strong>{" "}
              <button
                style={styles.copyButton}
                onClick={(e) => handleCopy(paymentKey, e)}
              >
                Copier
              </button>
            </p>
            <p>
              Vous disposez de <strong>15 minutes</strong> pour effectuer le paiement.
              Après le paiement, cliquez sur "Paiement effectué".
            </p>

            <div style={styles.modalButtons}>
              <button
                style={styles.cancelButton}
                onClick={() => setShowPaymentModal(false)}
              >
                Annuler
              </button>
              <button
                style={styles.confirmButton}
                onClick={async () => {
                  await processPayment();
                  setShowPaymentModal(false);
                }}
              >
                Paiement effectué
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}