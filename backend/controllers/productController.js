const Product = require('../models/productModel');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

exports.uploadProduct = [
  upload.fields([
    { name: 'front', maxCount: 1 },
    { name: 'back', maxCount: 1 },
    { name: 'f3', maxCount: 1 },
    { name: 'f4', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const { title, categories, description, price, sizes, colors, quantity, discount } = req.body;
      const frontImage = req.files['front'] ? req.files['front'][0].path : null;
      const backImage = req.files['back'] ? req.files['back'][0].path : null;
      const extraImage1 = req.files['f3'] ? req.files['f3'][0].path : null;
      const extraImage2 = req.files['f4'] ? req.files['f4'][0].path : null;

      const newProduct = new Product({
        title,
        categories,
        description,
        price,
        sizes: Array.isArray(sizes) ? sizes : sizes.split(','),
        colors: Array.isArray(colors) ? colors : colors.split(','),
        quantity,
        discount,
        frontImage,
        backImage,
        extraImage1,
        extraImage2
      });

      await newProduct.save();
      res.status(200).json({ message: 'Product uploaded successfully', product: newProduct });
    } catch (error) {
      console.error('Error saving product:', error);
      res.status(500).json({ message: 'Error saving product', error });
    }
  }
];

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

exports.updateProduct = [
  upload.fields([
    { name: 'front', maxCount: 1 },
    { name: 'back', maxCount: 1 },
    { name: 'f3', maxCount: 1 },
    { name: 'f4', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, categories, description, price, sizes, colors, quantity, discount } = req.body;

      const frontImage = req.files && req.files['front'] ? req.files['front'][0].path : req.body.existingFrontImage;
      const backImage = req.files && req.files['back'] ? req.files['back'][0].path : req.body.existingBackImage;
      const extraImage1 = req.files && req.files['f3'] ? req.files['f3'][0].path : req.body.existingExtraImage1;
      const extraImage2 = req.files && req.files['f4'] ? req.files['f4'][0].path : req.body.existingExtraImage2;

      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        {
          title,
          categories,
          description,
          price,
          sizes: Array.isArray(sizes) ? sizes : sizes.split(','),
          colors: Array.isArray(colors) ? colors : colors.split(','),
          quantity,
          discount,
          frontImage,
          backImage,
          extraImage1,
          extraImage2
        },
        { new: true } 
      );

      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ message: 'Error updating product', error });
    }
  }
];

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
