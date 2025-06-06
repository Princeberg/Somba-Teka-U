import { useState, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '@/components/Header4';
import { uploadImageToCloudinary } from '../api/upload';
import useAuth from '@/lib/Auth';

export default function AddProductPage() {
  const router = useRouter();
  const { user, loading } = useAuth(); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [previews, setPreviews] = useState({});
  const [uploadedUrls, setUploadedUrls] = useState({});
  const [formData, setFormData] = useState({
    categorie: '',
    ville: '',
    productName: '',
    price: '',
    description: '',
  });

  const fileInputsRef = useRef([]);

  if (loading) return (
    <div className="loading-overlay">
      <div className="loading-spinner"></div>
      <p>Chargement de votre session...</p>
    </div>
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = async (e, index) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const fileName = file.name;

    if (Object.values(previews).some((preview) => preview.name === fileName)) {
      setError(`L'image ${fileName} a déjà été sélectionnée`);
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("L'image dépasse la taille maximale de 5MB");
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviews((prev) => ({
        ...prev,
        [index]: {
          url: event.target.result,
          name: fileName,
        },
      }));
      setError(null);
    };
    reader.readAsDataURL(file);

    try {
      setIsSubmitting(true);
      const result = await uploadImageToCloudinary(file, index);
      setUploadedUrls((prev) => ({
        ...prev,
        [index]: result.url,
      }));
      setSuccess(`Image ${index} téléchargée avec succès`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (uploadError) {
      console.error("Erreur d'upload Cloudinary :", uploadError);
      setError("Erreur lors de l'upload de l'image");
      e.target.value = '';
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = (index) => {
    setPreviews((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[index];
      return newPreviews;
    });
    setUploadedUrls((prev) => {
      const newUrls = { ...prev };
      delete newUrls[index];
      return newUrls;
    });
    if (fileInputsRef.current[index]) {
      fileInputsRef.current[index].value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!user || !user.id) {
      setError("Vous devez être connecté pour ajouter un produit");
      setIsSubmitting(false);
      return;
    }

    const missingFields = [];
    if (!formData.categorie) missingFields.push('Catégorie');
    if (!formData.productName) missingFields.push('Nom du produit');
    if (!formData.price) missingFields.push('Prix');
    if (!formData.ville) missingFields.push('Ville');
    if (Object.keys(uploadedUrls).length < 3) missingFields.push('Au moins 3 images');

    if (missingFields.length > 0) {
      setError(`Champs requis manquants : ${missingFields.join(', ')}`);
      setIsSubmitting(false);
      return;
    }

    const orderedUrls = Object.entries(uploadedUrls)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      .map((entry) => entry[1]);

    const payload = {
      ...formData,
      id_user: user.id,
      productPicture1: orderedUrls[0] || null,
      productPicture2: orderedUrls[1] || null,
      productPicture3: orderedUrls[2] || null,
    };

    try {
      const response = await fetch('../api/demande', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 422 && result.errors) {
          console.error("Validation Errors:", result.errors);
          setError(result.errors.join(', '));
        } else {
          setError(result.message || "Une erreur inconnue est survenue");
        }
        return;
      }

      // Show success message before redirect
      setSuccess('Produit ajouté avec succès! Redirection en cours...');
      setTimeout(() => {
        router.push('/boutique/confirm');
      }, 2000);
    } catch (err) {
      setError(err.message || "Une erreur s'est produite lors de la soumission");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Ajouter un Produit | SOMBA TEKA</title>
        <meta name="description" content="Ajoutez votre produit à notre marché en ligne" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      </Head>

      <Header/>
      
      <div className="form-page-container">
        <div className="form-header">
          <div className="form-header-content">
            <h1 className="form-title">
              <i className="fas fa-plus-circle"></i> Ajouter un Nouveau Produit
            </h1>
            <p className="form-subtitle">
              Remplissez ce formulaire pour partager votre produit avec notre communauté
            </p>
          </div>
        </div>
        
        <div className="form-progress">
          <div className="progress-bar" style={{ width: `${Object.keys(uploadedUrls).length * 33.33}%` }}></div>
          <div className="progress-text">
            Étape {Math.min(2, Math.floor(Object.keys(uploadedUrls).length / 2)) + 1} sur 2 • 
            {Object.keys(uploadedUrls).length}/3 images téléchargées
          </div>
        </div>

        <div className="form-container">
          {error && (
            <div className="alert alert-danger" role="alert">
              <i className="fas fa-exclamation-circle me-2"></i>
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success" role="alert">
              <i className="fas fa-check-circle me-2"></i>
              {success}
            </div>
          )}

          <form id="productForm" onSubmit={handleSubmit} className="product-form">
            <div className="form-section">
              <h2 className="section-title">
                <i className="fas fa-info-circle"></i> Informations de base
              </h2>
              
              <div className="form-grid">
                {/* Catégorie */}
                <div className="form-group">
                  <label htmlFor="categorie" className="required-field">
                    <i className="fas fa-tag"></i> Catégorie
                  </label>
                  <select 
                    id="categorie" 
                    name="categorie" 
                    className="form-control" 
                    required
                    value={formData.categorie}
                    onChange={handleInputChange}
                  >
                    <option value="">Sélectionner une catégorie</option>
                    <option value="Véhicule">Véhicule</option>
                    <option value="Parcelle">Parcelle</option>
                    <option value="Appartement">Appartement</option>
                    <option value="Maison">Maison</option>
                    <option value="Appareil Electronique">Appareil Electronique</option>
                    <option value="Mode">Mode</option>
                    <option value="Construction">Construction</option>
                    <option value="Produits Alimentaires">Produits Alimentaires</option>
                    <option value="Décoration intérieure">Décoration intérieure</option>
                    <option value="Offre de Service">Offre de Service</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                {/* Ville */}
                <div className="form-group">
                  <label htmlFor="ville" className="required-field">
                    <i className="fas fa-map-marker-alt"></i> Ville
                  </label>
                  <select 
                    id="ville" 
                    name="ville" 
                    className="form-control" 
                    required
                    value={formData.ville}
                    onChange={handleInputChange}
                  >
                    <option value="">Sélectionner une ville</option>
                    <option value="Brazzaville">Brazzaville</option>
                    <option value="Pointe-Noire">Pointe-Noire</option>
                    <option value="Dolisie">Dolisie</option>
                    <option value="Ouesso">Ouesso</option>
                    <option value="Madingou">Madingou</option>
                    <option value="Oyo">Oyo</option>
                    <option value="Ewo">Ewo</option>
                    <option value="Nkayi">Nkayi</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                {/* Nom du produit */}
                <div className="form-group">
                  <label htmlFor="productName" className="required-field">
                    <i className="fas fa-cube"></i> Nom du Produit
                  </label>
                  <input 
                    type="text" 
                    id="productName" 
                    name="productName"
                    className="form-control" 
                    required
                    placeholder="Ex: iPhone 12 Pro Max 256Go"
                    value={formData.productName}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Prix */}
                <div className="form-group">
                  <label htmlFor="price" className="required-field">
                    <i className="fas fa-money-bill-wave"></i> Prix (FCFA)
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">FCFA</span>
                    <input 
                      type="number" 
                      id="price" 
                      name="price"
                      className="form-control" 
                      required 
                      placeholder="Ex: 450000"
                      value={formData.price}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2 className="section-title">
                <i className="fas fa-align-left"></i> Description
              </h2>
              <div className="form-group">
                <label htmlFor="description" className="required-field">
                  Décrivez votre produit en détail
                </label>
                <textarea 
                  id="description" 
                  name="description"
                  className="form-control" 
                  rows="5" 
                  required
                  placeholder="Incluez les caractéristiques, l'état, les spécifications techniques, etc."
                  value={formData.description}
                  onChange={handleInputChange}
                />
                <div className="char-count">
                  {formData.description.length}/500 caractères
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2 className="section-title">
                <i className="fas fa-images"></i> Images du produit
              </h2>
              <p className="section-subtitle">
                Ajoutez au moins 3 photos de haute qualité (max 5MB chacune)
              </p>
              
              <div className="image-upload-grid">
                {[1, 2, 3].map((index) => (
                  <div className="image-upload-card" key={index}>
                    <div className="upload-label">
                      {index === 1 ? 'Image principale' : `Image ${index}`}
                      {index === 1 && <span className="required-badge">Requis</span>}
                    </div>
                    
                    {previews[index] ? (
                      <div className="image-preview-container">
                        <img
                          src={previews[index].url}
                          alt={`Preview ${index}`}
                          className="image-preview"
                        />
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() => removeImage(index)}
                          aria-label="Supprimer l'image"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                        <div className="image-name">{previews[index].name}</div>
                      </div>
                    ) : (
                      <div className="upload-area">
                        <input
                          type="file"
                          id={`productPicture${index}`}
                          name={`productPicture${index}`}
                          className="hidden"
                          accept="image/*"
                          required={index === 1}
                          onChange={(e) => handleImageChange(e, index)}
                          ref={(el) => (fileInputsRef.current[index] = el)}
                        />
                        <label htmlFor={`productPicture${index}`} className="upload-label-button">
                          <div className="upload-icon">
                            <i className="fas fa-cloud-upload-alt"></i>
                          </div>
                          <div className="upload-text">Cliquez pour télécharger</div>
                          <div className="upload-hint">JPG/PNG, max 5MB</div>
                        </label>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="form-section">
              <div className="form-check">
                <input 
                  type="checkbox" 
                  className="form-check-input" 
                  id="termsCheck" 
                  required 
                />
                <label className="form-check-label" htmlFor="termsCheck">
                  J'accepte les <a href="./terms" className="terms-link">conditions d'utilisation</a> 
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="submit-button" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span> 
                    <span className="btn-text">Publication en cours...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane me-2"></i> 
                    <span className="btn-text">Publier le produit</span>
                  </>
                )}
              </button>
              
              <button 
                type="button" 
                className="cancel-button"
                onClick={() => router.back()}
              >
                <i className="fas fa-times"></i> Annuler
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx global>{`
        :root {
          --primary-color: #2c3e50;
          --secondary-color: #34495e;
          --accent-color: #27ae60;
          --light-accent: #2ecc71;
          --danger-color: #e74c3c;
          --light-gray: #ecf0f1;
          --medium-gray: #bdc3c7;
          --dark-gray: #7f8c8d;
          --border-radius: 8px;
          --box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          --transition: all 0.3s ease;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255,255,255,0.9);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 5px solid var(--light-gray);
          border-top-color: var(--accent-color);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .form-page-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
        }

        .form-header {
          background: linear-gradient(135deg, var(--accent-color), var(--light-accent));
          color: white;
          padding: 30px;
          border-radius: var(--border-radius);
          margin-bottom: 30px;
          box-shadow: var(--box-shadow);
        }

        .form-header-content {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }

        .form-title {
          font-size: 2.2rem;
          margin-bottom: 10px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .form-title i {
          margin-right: 15px;
        }

        .form-subtitle {
          font-size: 1.1rem;
          opacity: 0.9;
        }

        .form-progress {
          background-color: white;
          border-radius: var(--border-radius);
          padding: 15px 20px;
          margin-bottom: 30px;
          box-shadow: var(--box-shadow);
          position: relative;
          overflow: hidden;
        }

        .progress-bar {
          position: absolute;
          top: 0;
          left: 0;
          height: 4px;
          background-color: var(--accent-color);
          transition: var(--transition);
        }

        .progress-text {
          font-size: 0.9rem;
          color: var(--secondary-color);
          font-weight: 500;
        }

        .form-container {
          background-color: white;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
          overflow: hidden;
          margin-bottom: 40px;
        }

        .product-form {
          padding: 30px;
        }

        .form-section {
          margin-bottom: 40px;
          padding-bottom: 30px;
          border-bottom: 1px solid var(--light-gray);
        }

        .form-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .section-title {
          font-size: 1.4rem;
          margin-bottom: 20px;
          color: var(--secondary-color);
          display: flex;
          align-items: center;
        }

        .section-title i {
          margin-right: 10px;
          color: var(--accent-color);
        }

        .section-subtitle {
          color: var(--dark-gray);
          margin-bottom: 20px;
          font-size: 0.95rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        label {
          font-weight: 500;
          margin-bottom: 8px;
          display: block;
          color: var(--secondary-color);
          font-size: 0.95rem;
          display: flex;
          align-items: center;
        }

        label i {
          margin-right: 8px;
          width: 20px;
          text-align: center;
        }

        .form-control {
          height: 50px;
          border: 1px solid var(--medium-gray);
          border-radius: var(--border-radius);
          transition: var(--transition);
          padding: 12px 15px;
          font-size: 1rem;
          width: 100%;
          background-color: white;
        }

        .form-control:focus {
          border-color: var(--accent-color);
          box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.2);
          outline: none;
        }

        textarea.form-control {
          height: auto;
          min-height: 150px;
          resize: vertical;
        }

        select.form-control {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%232c3e50' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 15px center;
          background-size: 12px;
        }

        .char-count {
          text-align: right;
          font-size: 0.8rem;
          color: var(--dark-gray);
          margin-top: 5px;
        }

        .input-group {
          display: flex;
          align-items: stretch;
          width: 100%;
        }

        .input-group-text {
          background-color: var(--light-gray);
          border: 1px solid var(--medium-gray);
          padding: 0 15px;
          font-size: 0.95rem;
          color: var(--secondary-color);
          display: flex;
          align-items: center;
          justify-content: center;
          border-right: none;
          border-radius: var(--border-radius) 0 0 var(--border-radius);
        }

        .input-group .form-control {
          border-radius: 0 var(--border-radius) var(--border-radius) 0;
          border-left: none;
        }

        .image-upload-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }

        .image-upload-card {
          border: 1px dashed var(--medium-gray);
          border-radius: var(--border-radius);
          padding: 15px;
          transition: var(--transition);
        }

        .image-upload-card:hover {
          border-color: var(--accent-color);
        }

        .upload-label {
          font-weight: 500;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .required-badge {
          background-color: var(--accent-color);
          color: white;
          padding: 3px 8px;
          border-radius: 12px;
          font-size: 0.7rem;
          font-weight: 600;
        }

        .upload-area {
          position: relative;
          height: 180px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          background-color: var(--light-gray);
          border-radius: var(--border-radius);
          transition: var(--transition);
        }

        .upload-area:hover {
          background-color: #e0e0e0;
        }

        .upload-label-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          width: 100%;
          height: 100%;
          justify-content: center;
        }

        .upload-icon {
          font-size: 2rem;
          color: var(--accent-color);
          margin-bottom: 10px;
        }

        .upload-text {
          font-weight: 500;
          margin-bottom: 5px;
        }

        .upload-hint {
          font-size: 0.8rem;
          color: var(--dark-gray);
        }

        .hidden {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }

        .image-preview-container {
          position: relative;
          height: 180px;
          border-radius: var(--border-radius);
          overflow: hidden;
          border: 1px solid var(--light-gray);
        }

        .image-preview {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .remove-image-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background-color: rgba(231, 76, 60, 0.9);
          color: white;
          border: none;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition);
        }

        .remove-image-btn:hover {
          background-color: var(--danger-color);
          transform: scale(1.1);
        }

        .image-name {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0,0,0,0.7);
          color: white;
          padding: 5px 10px;
          font-size: 0.8rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .form-check {
          display: flex;
          align-items: center;
          margin-top: 1rem;
        }

        .form-check-input {
          margin-right: 10px;
          width: 18px;
          height: 18px;
          cursor: pointer;
          accent-color: var(--accent-color);
        }

        .form-check-label {
          font-size: 0.95rem;
          color: var(--secondary-color);
        }

        .terms-link {
          color: var(--accent-color);
          text-decoration: none;
          font-weight: 500;
          transition: var(--transition);
        }

        .terms-link:hover {
          text-decoration: underline;
          color: var(--light-accent);
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 15px;
          margin-top: 30px;
          flex-wrap: wrap;
        }

        .submit-button {
          background-color: var(--accent-color);
          color: white;
          border: none;
          padding: 14px 30px;
          font-size: 1rem;
          font-weight: 600;
          border-radius: var(--border-radius);
          transition: var(--transition);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 6px rgba(39, 174, 96, 0.2);
        }

        .submit-button:hover:not(:disabled) {
          background-color: var(--light-accent);
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(39, 174, 96, 0.3);
        }

        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .cancel-button {
          background-color: white;
          color: var(--danger-color);
          border: 1px solid var(--danger-color);
          padding: 14px 25px;
          font-size: 1rem;
          font-weight: 600;
          border-radius: var(--border-radius);
          transition: var(--transition);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .cancel-button:hover {
          background-color: var(--danger-color);
          color: white;
        }

        .btn-text {
          margin-left: 8px;
        }

        .spinner {
          display: inline-block;
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
          margin-right: 8px;
        }

        .alert {
          padding: 15px;
          border-radius: var(--border-radius);
          margin-bottom: 25px;
          display: flex;
          align-items: center;
          font-size: 0.95rem;
        }

        .alert-danger {
          color: #721c24;
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
        }

        .alert-success {
          color: #155724;
          background-color: #d4edda;
          border: 1px solid #c3e6cb;
        }

        .alert i {
          margin-right: 10px;
          font-size: 1.2rem;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .form-page-container {
            padding: 15px;
          }
          
          .form-header {
            padding: 20px;
          }
          
          .form-title {
            font-size: 1.8rem;
          }
          
          .product-form {
            padding: 20px;
          }
          
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .image-upload-grid {
            grid-template-columns: 1fr;
          }
          
          .form-actions {
            flex-direction: column;
            gap: 10px;
          }
          
          .submit-button, .cancel-button {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .form-header {
            padding: 15px;
          }
          
          .form-title {
            font-size: 1.5rem;
          }
          
          .form-subtitle {
            font-size: 0.95rem;
          }
          
          .product-form {
            padding: 15px;
          }
          
          .section-title {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </>
  );
}