import supabase from '@/lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed',
      allowedMethods: ['POST']
    });
  }

  // Validate Content-Type
  const contentType = req.headers['content-type'];
  if (!contentType || !contentType.includes('application/json')) {
    return res.status(415).json({ 
      success: false, 
      message: 'Unsupported Media Type: Expected application/json' 
    });
  }

  try {
   const {
  categorie,
  productName,
  price,
  description,
  sellerContact,
  sellerName,
  WhatsappURL, 
  ville,
  productPicture1,
  productPicture2,
  productPicture3,
  email
} = req.body;

// Validation
// const errors = [];
// if (!categorie) errors.push('La catégorie est requise');
// if (!productName) errors.push('Le nom du produit est requis');
// if (!price) errors.push('Le prix est requis');
// if (!productPicture1) errors.push('Au moins une image est requise');
// if (!ville) errors.push('La ville est requise');
// if (!email) errors.push('L\'email est requis');

// if (price && isNaN(parseFloat(price))) {
//   errors.push('Le prix doit être un nombre valide');
// }

// if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//   errors.push('L\'email n\'est pas valide');
// }

// if (WhatsappURL && !/^\+?\d+$/.test(WhatsappURL)) {
//   errors.push('Le numéro WhatsApp n\'est pas valide');
// }

// if (errors.length > 0) {
//   return res.status(422).json({
//     success: false,
//     message: 'Validation failed',
//     errors
//   });
// }

    const productData = {
      categorie: categorie.trim(),
      productName: productName.trim(),
      price: parseFloat(price),
      description: description ? description.trim() : null,
      sellerContact: sellerContact ? sellerContact.toString().trim() : null,
      sellerName: sellerName ? sellerName.trim() : null,
      WhatsappURL: WhatsappURL ? WhatsappURL.trim() : null,
      ville: ville.trim(),
      SellerEmail: email.trim(),
      productPicture1:  productPicture1 || null,
      productPicture2: productPicture2 || null,
      productPicture3: productPicture3 || null,
      created_at: new Date().toISOString(),
    };

    // Insert into database
    const { data, error } = await supabase
      .from('requests')
      .insert([productData])
      .select();

    if (error) {
      console.error('❌ Supabase insert error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Database error',
        details: error.message 
      });
    }

    if (!data || data.length === 0) {
      return res.status(500).json({ 
        success: false, 
        message: 'No data returned from insert operation' 
      });
    }

    return res.status(201).json({ 
      success: true, 
      product: data[0],
      message: 'Product submission successful'
    });

  } catch (error) {
    console.error('❌ API submit error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message || 'Erreur inconnue'
    });
  }
}