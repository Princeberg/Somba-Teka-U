import { useState, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '@/components/Header4';
import { uploadImageToCloudinary } from '../api/upload';
import useAuth from '@/lib/Auth';

export default function AddProductPage() {
  const router = useRouter();
  const { user, loading } = useAuth(); // ✅ Correction ici
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
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

  if (loading) return <p>Chargement...</p>; // ✅ Affiche une attente

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
      const result = await uploadImageToCloudinary(file, index);
      setUploadedUrls((prev) => ({
        ...prev,
        [index]: result.url,
      }));
    } catch (uploadError) {
      console.error("Erreur d'upload Cloudinary :", uploadError);
      setError("Erreur lors de l'upload de l'image");
      e.target.value = '';
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
      setError(`Champs requis manquants ou invalides : ${missingFields.join(', ')}`);
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

      router.push('/boutique/confirm');
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
      
      <div className="container" style={{marginTop:'95px'}}>
        <div className="form-container">
            <h3>Ajout d&apos;un Nouveau Produit</h3>
            <p className="form-subtitle">Remplissez ce formulaire pour ajouter votre produit à notre plateforme</p>
          </div>
          
          {error && (
            <div className="alert alert-danger" role="alert">
              <i className="fas fa-exclamation-circle me-2"></i>
              {error}
            </div>
          )}

          <form id="productForm" onSubmit={handleSubmit} className="p-4">
            <div className="row g-4">
              {/* Catégorie et Ville */}
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="categorie" className="required-field">Catégorie du produit</label>
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
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="ville" className="required-field">Ville</label>
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
              </div>

              {/* Nom du produit */}
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="productName" className="required-field">Nom du Produit</label>
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
              </div>

              {/* Prix */}
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="price" className="required-field">Prix du produit (FCFA)</label>
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

              {/* Description du produit */}
              <div className="col-12">
                <div className="form-group">
                  <label htmlFor="description" className="required-field">Description du produit</label>
                  <textarea 
                    id="description" 
                    name="description"
                    className="form-control" 
                    rows="5" 
                    required
                    placeholder="Décrivez votre produit en détail..."
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Images upload */}
              {[1, 2, 3].map((index) => (
                <div className="col-md-4" key={index}>
                  <div className="form-group">
                    <label className="required-field block font-semibold mb-2">
                      {index === 1 ? 'Image principale' : `Image ${index}`}
                    </label>

                    <div className="file-input-container">
                      <label htmlFor={`productPicture${index}`} className="file-input-label">
                        <div className="upload-icon">
                          <i className="fas fa-cloud-upload-alt text-2xl mb-2"></i>
                        </div>
                        <div className="upload-text">
                          <span className="text-sm font-medium">
                            {index === 1 ? "Image principale" : `Image ${index}`}
                          </span>
                          <small className="form-text">
                            JPG/PNG, max 5MB
                          </small>
                        </div>
                      </label>

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
                    </div>

                    {previews[index] && (
                      <div className="file-preview mt-3">
                        <div className="preview-item">
                          <img
                            src={previews[index].url}
                            alt={`Preview ${index}`}
                            className="preview-image"
                          />
                          <button
                            type="button"
                            className="remove-btn"
                            onClick={() => removeImage(index)}
                            aria-label="Supprimer l'image"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Conditions */}
              <div className="col-12">
                <div className="form-check">
                  <input 
                    type="checkbox" 
                    className="form-check-input" 
                    id="termsCheck" 
                    required 
                  />
                  <label className="form-check-label" htmlFor="termsCheck">
                    J&apos;accepte les <a href="./terms" className="terms-link">conditions d&apos;utilisation</a>
                  </label>
                </div>
              </div>

              {/* Submit button */}
              <div className="col-12 text-center mt-4">
                <button 
                  type="submit" 
                  className="btn btn-submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span> 
                      <span className="btn-text">Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane me-2"></i> 
                      <span className="btn-text">Envoyer le produit </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

      <style jsx global>{`
        :root {
          --secondary-color: #2c3e50;
          --accent-color: #4CAF50;
          --light-color: #f8f9fa;
          --dark-color: #343a40;
          --border-radius: 10px;
          --box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
          --transition: all 0.3s ease;
          --input-focus: 0 0 0 3px rgba(76, 175, 80, 0.2);
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background-color: #f5f7fa;
          color: #333;
          line-height: 1.6;
        }

        .container {
       
          max-width: 950px;
          margin: 40px auto;
          padding: 0 20px;
           align-items: center;
        }

        .form-container {
          width: 100%;
          background-color: white;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
          overflow: hidden;
          margin-bottom: 40px;
           align-items: center;
        }

        .form-header {
          padding: 25px 30px;
          border-bottom: 1px solid #eee;
          background-color: #f9f9f9;
        }

        .form-subtitle {
          color: #666;
          font-size: 0.95rem;
          margin-top: 8px;
          text-align: center;
        }

        h3 {
          font-family: 'Cardo', serif;
          color: var(--secondary-color);
          margin: 0;
          font-weight: 400;
          text-align: center;
          font-size: 1.8rem;
          position: relative;
        }

        .form-group {
          margin-bottom: 1.5rem;
          max-width: 550px;
        }

        label {
          font-weight: 400;
          margin-bottom: 0.5rem;
          display: block;
          color: var(--secondary-color);
          font-size: 0.9rem;
        }

        .form-control {
          height: 48px;
          border: 1px solid #ddd;
          border-radius: var(--border-radius);
          transition: var(--transition);
          padding: 12px 15px;
          font-size: 0.95rem;
          width: 100%;
        }

        .form-control:focus {
          border-color: var(--accent-color);
          box-shadow: var(--input-focus);
          outline: none;
        }

        textarea.form-control {
          height: auto;
          min-height: 140px;
          resize: vertical;
        }

        select.form-control {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%232c3e50' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 15px center;
          background-size: 12px;
        }

        .btn-submit {
          background-color: white;
          border: 2px solid var(--accent-color);
          color: var(--accent-color);
          padding: 14px 30px;
          font-size: 1rem;
          font-weight: 600;
          border-radius: var(--border-radius);
          transition: var(--transition);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          cursor: pointer;
          width: auto;
          min-width: 220px;
        }

        .btn-submit:hover:not(:disabled) {
          background-color: var(--accent-color);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
        }

        .btn-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn-text {
          margin-left: 8px;
        }

        .file-input-container {
          position: relative;
          width: 100%;
        }

        .file-input-label {
          border: 2px dashed #ddd;
          border-radius: var(--border-radius);
          padding: 25px 15px;
          text-align: center;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: #f9f9f9;
          height: 120px;
        }

        .file-input-label:hover {
          border-color: var(--accent-color);
          background-color: rgba(76, 175, 80, 0.05);
        }

        .upload-icon {
          color: var(--accent-color);
          margin-bottom: 8px;
          font-size: 1.5rem;
        }

        .upload-text {
          display: flex;
          flex-direction: column;
        }

        .file-input-label span {
          font-size: 0.9rem;
          color: var(--secondary-color);
          font-weight: 500;
        }

        .file-input-label small {
          font-size: 0.8rem;
          color: #777;
          margin-top: 4px;
        }

        .file-preview {
          margin-top: 10px;
        }

        .preview-item {
          position: relative;
          width: 100%;
          height: 120px;
          border-radius: var(--border-radius);
          overflow: hidden;
          border: 1px solid #eee;
        }

        .preview-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .remove-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(0,0,0,0.7);
          color: white;
          border: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          cursor: pointer;
          transition: var(--transition);
        }

        .remove-btn:hover {
          background: rgba(220, 53, 69, 0.9);
        }

        .required-field::after {
          content: " *";
          color: var(--accent-color);
        }

        .form-text {
          font-size: 0.8rem;
          color: #6c757d;
          margin-top: 6px;
          display: block;
        }

        .alert-danger {
          color: #721c24;
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          padding: 12px 15px;
          border-radius: var(--border-radius);
          margin: 0 30px 20px;
          display: flex;
          align-items: center;
          font-size: 0.9rem;
        }

        .input-group {
          display: flex;
          align-items: stretch;
          width: 100%;
        }

        .input-group-text {
          background-color: #f1f1f1;
          border: 1px solid #ddd;
          padding: 0 15px;
          font-size: 0.9rem;
          color: #555;
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
        }

        .form-check-label {
          font-size: 0.9rem;
          color: #555;
        }

        .terms-link {
          color: var(--accent-color);
          text-decoration: none;
          font-weight: 500;
        }

        .terms-link:hover {
          text-decoration: underline;
        }

        .spinner {
          display: inline-block;
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .container {
            margin: 30px auto;
            padding: 0 15px;
          }
          
          .form-header {
            padding: 20px;
          }
          
          h3 {
            font-size: 1.5rem;
          }
          
          .form-group {
            margin-bottom: 1.2rem;
          }
          
          .btn-submit {
            width: 100%;
          }
        }

        @media (max-width: 576px) {
          .container {
            margin: 20px auto;
          }
          
          .form-container {
            padding: 0;
          }
          
          .form-header {
            padding: 15px;
          }
          
          .form-control {
            height: 44px;
            padding: 10px 12px;
          }
          
          textarea.form-control {
            min-height: 120px;
          }
          
          .file-input-label {
            padding: 20px 10px;
            height: 100px;
          }
        }
      `}</style>
    </>
  );
}