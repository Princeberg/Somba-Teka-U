'use client';
import { useState } from 'react';

export default function PayementForm() {
  const [formData, setFormData] = useState({
    sellerContact: '',
    whatsapp: '',
    sellerName: '',
    sellerEmail: '',
    productName: '',
    productDescription: '',
    price: '',
    tarif: '',
    categorie: '',
    ville: '',
    images: [],
    paymentKey: generatePaymentKey(),
  });

  const [showModal, setShowModal] = useState(false);

  function generatePaymentKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length: 8 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join('');
  }

  const updateTarif = (price) => {
    const prix = parseFloat(price);
    if (!isNaN(prix) && prix > 0) {
      const tarif = prix * 0.5;
      setFormData((prev) => ({ ...prev, price, tarif: `${tarif.toFixed(2)} FCFA` }));
    } else {
      setFormData((prev) => ({ ...prev, price, tarif: '' }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      images: files,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'price') updateTarif(value);
  };

  const validateForm = () => {
    const {
      sellerContact,
      whatsapp,
      sellerName,
      sellerEmail,
      productName,
      productDescription,
      price,
      categorie,
      ville,
      images,
    } = formData;

    if (
      !sellerContact ||
      !whatsapp ||
      !sellerName ||
      !sellerEmail ||
      !productName ||
      !productDescription ||
      !price ||
      !categorie ||
      !ville
    ) {
      alert('Tous les champs sont obligatoires.');
      return false;
    }

    if (sellerContact.length < 9) {
      alert('Numéro de contact invalide');
      return false;
    }

    if (!whatsapp.startsWith('+242') || whatsapp.length !== 13) {
      alert('Numéro WhatsApp invalide');
      return false;
    }

    if (images.length < 3) {
      alert('Veuillez télécharger au moins 3 images du produit.');
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      sessionStorage.setItem('formData', JSON.stringify(formData));
      setShowModal(true);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copié !');
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-xl mx-auto">
        <input name="sellerContact" placeholder="Téléphone vendeur" required onChange={handleChange} />
        <input name="whatsapp" placeholder="WhatsApp" required onChange={handleChange} />
        <input name="sellerName" placeholder="Nom vendeur" required onChange={handleChange} />
        <input name="sellerEmail" placeholder="Email vendeur" required onChange={handleChange} />
        <input name="productName" placeholder="Nom du produit" required onChange={handleChange} />
        <textarea name="productDescription" placeholder="Description" required onChange={handleChange} />
        <input name="price" placeholder="Prix (FCFA)" type="number" required onChange={handleChange} />
        <input name="tarif" value={formData.tarif} disabled />
        <input name="categorie" placeholder="Catégorie" required onChange={handleChange} />
        <input name="ville" placeholder="Ville" required onChange={handleChange} />
        <input type="file" accept="image/*" multiple onChange={handleImageChange} required />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Valider</button>
      </form>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-center text-red-600 mb-4 text-lg font-bold">Instructions de Paiement</h3>
            <p className="mb-3">
              Veuillez effectuer un dépôt de <strong>{formData.tarif}</strong> aux numéros suivants :
            </p>
            <div className="bg-gray-100 p-3 rounded mb-4">
              <p>
                <strong>MTN Money:</strong> {process.env.NEXT_PUBLIC_MTN_NUMBER}{' '}
                <button
                  style={styles.copyButton}
                  onClick={(e) => handleCopy(process.env.NEXT_PUBLIC_MTN_NUMBER, e)}
                >
                  Copier
                </button>
              </p>
              <p>
                <strong>Airtel:</strong> {process.env.NEXT_PUBLIC_AIRTEL_NUMBER}{' '}
               <button
                  style={styles.copyButton}
                  onClick={(e) => handleCopy(process.env.NEXT_PUBLIC_AIRTEL_NUMBER, e)}
                >
                  Copier
                </button>
              </p>
            </div>
            <p className="mb-2">
              Clé de paiement: <strong>{formData.paymentKey}</strong>
              <button onClick={() => handleCopy(formData.paymentKey)} className="ml-2 text-sm bg-red-600 text-white px-2 rounded">Copier</button>
            </p>
            <p className="text-sm text-red-600 mb-4">Veuillez conserver cette clé pour tout problème lié au paiement.</p>
            <div className="flex justify-between mt-4">
              <button onClick={() => setShowModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Annuler</button>
              <button onClick={() => { alert('Paiement confirmé !'); setShowModal(false); }} className="bg-green-600 text-white px-4 py-2 rounded">Paiement Effectué</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
