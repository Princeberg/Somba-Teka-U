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
  ville,
  productPicture1,
  productPicture2,
  productPicture3,
  id_user,
} = req.body;

    const productData = {
      categorie: categorie.trim(),
      productName: productName.trim(),
      price: price,
      description: description ? description.trim() : null,
      ville: ville.trim(),
      id_seller: id_user,
      productPicture1:  productPicture1 || null,
      productPicture2: productPicture2 || null,
      productPicture3: productPicture3 || null,
      created_at: new Date().toISOString(),
    };

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