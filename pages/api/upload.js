function uploadImageToCloudinary(file, fileName = '') {
  return new Promise((resolve, reject) => {
    if (!(file instanceof File)) {
      return reject(new Error("Fichier image non valide"));
    }

    const timestamp = Date.now();
    const safeFileName = fileName || `product-${timestamp}`;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'produits'); // preset Cloudinary
    formData.append('public_id', `products/${safeFileName}`); // dossier facultatif "products"
    formData.append('tags', "produit,webp");

    fetch('https://api.cloudinary.com/v1_1/dryaemkif/image/upload', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        if (data.secure_url) {
          // Générer URL optimisée en WebP
          const webpUrl = data.secure_url
            .replace('/upload/', '/upload/f_webp,q_auto/')
            .replace(/\.(jpg|jpeg|png|gif|bmp|tiff)$/i, '.webp');

          resolve({
            url: webpUrl,
            public_id: data.public_id,
            original_filename: data.original_filename
          });
        } else {
          reject(new Error("L'upload a échoué: " + (data.error?.message || "Erreur inconnue")));
        }
      })
      .catch(err => {
        console.error("❌ Erreur Cloudinary:", err);
        reject(new Error("Échec de l’upload vers Cloudinary"));
      });
  });
}

export { uploadImageToCloudinary };
