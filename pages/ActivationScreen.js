import React, { useState } from "react";
import supabase from '../lib/supabase';

export default function ActivationScreen() {
  const [abonnementType, setAbonnementType] = useState("basic");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentKey, setPaymentKey] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");

  // Styles JS
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
      transition: "border-color 0.2s",
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
      transition: "background-color 0.2s",
    },
    buttonHover: {
      backgroundColor: "#1e40af",
    },
    errorText: {
      color: "#dc2626",
      fontSize: "0.875rem",
      marginTop: "0.25rem",
    },
    // Modal styles
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
    confirmButtonHover: {
      backgroundColor: "#15803d",
    },
  };

  // Validation simple
  function validateForm() {
    const newErrors = {};
    if (!phoneNumber.trim()) newErrors.phoneNumber = "Numéro obligatoire";
    if (!abonnementType) newErrors.abonnementType = "Choisir un abonnement";
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

  function getPaymentAmount(type) {
    switch (type) {
      case "basic":
        return "1000";
      case "premium":
        return "2000";
      case "ultimate":
        return "5000";
      default:
        return "0";
    }
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
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        alert("Utilisateur non authentifié !");
        return;
      }

      const { error } = await supabase
        .from("sellers")
        .update({
          TypeAbonnement: abonnementType,
          DernierPayement: new Date(),
          payment_key: paymentKey,
          payment_status: "pending",
          montant: paymentAmount,
          payement_telephone: phoneNumber,
        })
        .eq("id_user", user.id);

      if (error) {
         console.error("Supabase update error:", error);
        alert("Erreur d'activation");
        return;
      }

      alert("Nous allons vérifier votre paiement. Merci de patienter !");
      window.location.href = "seller.html";
    } catch (err) {
      alert("Une erreur s'est produite pendant le traitement.");
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (validateForm()) {
      setPaymentKey(generatePaymentKey());
      setPaymentAmount(getPaymentAmount(abonnementType));
      setShowPaymentModal(true);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Activation de votre compte</h2>

        <form onSubmit={handleSubmit}>
          <label style={styles.label} htmlFor="abonnementType">
            Choisir l'abonnement
          </label>
          <select
            id="abonnementType"
            value={abonnementType}
            onChange={(e) => setAbonnementType(e.target.value)}
            style={styles.input}
          >
            <option value="basic">
              Abonnement de base - 2 ajouts par mois
            </option>
            <option value="premium">
              Abonnement Premium - 5 ajouts par mois
            </option>
            <option value="ultimate">
              Abonnement Ultime - 10 ajouts par mois
            </option>
          </select>
          {errors.abonnementType && (
            <p style={styles.errorText}>{errors.abonnementType}</p>
          )}

          <label style={styles.label} htmlFor="phoneNumber">
            Numéro de téléphone
          </label>
          <input
            type="text"
            id="phoneNumber"
            placeholder="Entrez votre numéro de téléphone"
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
            Activer mon compte
          </button>
        </form>
      </div>

      {/* Modal */}
      {showPaymentModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h3 style={styles.modalTitle}>Instructions de Paiement</h3>
            <p>
              Veuillez effectuer un dépôt de{" "}
              <strong>{paymentAmount} FCFA</strong> à l'un des numéros suivants
              :
            </p>
            <div style={styles.paymentInstruction}>
              <p>
                <strong>MTN Mobile Money:</strong>{process.env.NEXT_PUBLIC_MTN_NUMBER}{' '}
                <button
                  style={styles.copyButton}
                  onClick={(e) => handleCopy(process.env.NEXT_PUBLIC_MTN_NUMBER, e)}
                >
                  Copier
                </button>
              </p>
              <p>
                <strong>Airtel Money:</strong>{process.env.NEXT_PUBLIC_AIRTEL_NUMBER}{' '}
                <button
                  style={styles.copyButton}
                  onClick={(e) => handleCopy(process.env.NEXT_PUBLIC_AIRTEL_NUMBER, e)}
                >
                  Copier
                </button>
              </p>
            </div>
            <p>
              Clé de paiement unique: <strong>{paymentKey}</strong>{" "}
              <button
                style={styles.copyButton}
                onClick={(e) => handleCopy(paymentKey, e)}
              >
                Copier
              </button>
            </p>
            <p>
              Vous disposez <strong> 15 minutes</strong> pour effectuer le paiement.
              Après le paiement, cliquez sur "Paiement Effectué ".
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
                Paiement Effectué
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
