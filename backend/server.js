
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors'); 
const nodemailer = require('nodemailer');
const { Schema } = mongoose;
const Payment = require('./models/paymentModel');

const app = express();

app.use(cors());
app.use(express.json());

const mongoDbUrl = process.env.MONGO_DB_CONNECTION_MY_DATABASE;

mongoose.connect(mongoDbUrl)
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('Failed to connect to MongoDB', err);
});









// API endpoint to create a new payment
app.post('/api/payments', async (req, res) => {
  const { product, quantity, paymentMethod, price, cardNumber, expiryDate, cvv } = req.body;

  try {
    const newPayment = new Payment({
      product,
      quantity,
      paymentMethod,
      price,
      cardNumber,
      expiryDate,
      cvv,
    });    
    await newPayment.save();
    res.status(201).json({ message: 'Payment data stored successfully', payment: newPayment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error storing payment data', error });
  }
});


// API endpoint to fetch all payments
app.get('/api/payments', async (req, res) => {
  try {
    const payments = await Payment.find();
    res.status(200).json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching payment data', error });
  }
});

























const userSchema = new mongoose.Schema({
  firstname: { // Changed from username to firstname
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

// JWT Token Generation for 30 days
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, 'your_jwt_secret', { expiresIn: '30d' });
};

// Login Route
app.post('/login', async (req, res) => {
  const { firstname, password } = req.body;

  try {
    const user = await User.findOne({ firstname });

    if (user && await user.matchPassword(password)) {
      const token = generateToken(user._id, user.role);
      res.json({
        token,
        role: user.role
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});












































//product upload
const productSchema = new Schema({
  title: String,
  categories: String,
  description: String,
  price: Number,
  sizes: [String],
  colors: [String],
  quantity: Number,
  discount: Number,
  frontImage: String,
  backImage: String,
  extraImage1: String,
  extraImage2: String,
});



const Product = mongoose.model('Product', productSchema);


const upload = multer({ dest: 'uploads/' });

app.post('/api/products', upload.fields([
  { name: 'front', maxCount: 1 },
  { name: 'back', maxCount: 1 },
  { name: 'f3', maxCount: 1 },
  { name: 'f4', maxCount: 1 }
]), async (req, res) => {
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
});




// Add this to your existing Express app
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error });
  }
});





app.put('/api/products/:id', upload.fields([
  { name: 'front', maxCount: 1 },
  { name: 'back', maxCount: 1 },
  { name: 'f3', maxCount: 1 },
  { name: 'f4', maxCount: 1 }
]), async (req, res) => {
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
});





app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});


































































// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads/'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});






// Slider upload code*88888888888888888888
const slideSchema = new mongoose.Schema({
  images: [String],
}, { collection: 'Slide' }); 

const Slide = mongoose.model('Slide', slideSchema);


const upload1 = multer({ 
  storage,
  limits: { fileSize: 7 * 1024 * 1024 } 
});

app.post('/upload', upload1.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length > 5) {
      return res.status(400).json({ message: 'You can only upload up to 5 images' });
    }

    const images = req.files.map(file => file.path); 

    const newSlide = new Slide({ images });
    await newSlide.save();

    res.status(201).json({ message: 'Images uploaded successfully', images });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ message: 'Failed to upload images' });
  }
});

// you images all data 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));











// const client = new MongoClient(uri, { useUnifiedTopology: true });
//Product upload page
const signupSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  addressLine1: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
}, { collection: 'signup' }); 


const Signup = mongoose.model('Signup', signupSchema);


app.post('/checkout', async (req, res) => {
  const formData = req.body;
  try {
    const newSignup = new Signup(formData);
    await newSignup.save();
    res.status(200).send('Data inserted successfully');
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).send('Error inserting data');
  }
});

app.get('/api/signups', async (req, res) => {
  try {
    const signups = await Signup.find();
    res.status(200).json(signups);
  } catch (error) {
    console.error('Error fetching messages:', errorsignups);
    res.status(500).json({ message: 'Failed to fetch messages.' });
  }
});







// DELETE endpoint to delete a signup by ID
// DELETE endpoint to delete a signup by ID
app.delete('/api/signups/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Convert to ObjectId
    const objectId = new mongoose.Types.ObjectId(userId);

    // Delete the user
    const result = await Signup.deleteOne({ _id: objectId });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user.' });
  }
});





















const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String
});

const Message = mongoose.model('Message', messageSchema);

// API endpoint to handle form submission
app.post('/api/messages', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const newMessage = new Message({ name, email, message });
    await newMessage.save();
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error saving message:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Fetch messages from MongoDB
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find();
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error.message);
    res.status(500).json({ message: 'Failed to fetch messages.' });
  }
});



// Replace with your actual credentials
const EMAIL_USER = 'ggs699000@gmail.com';
const EMAIL_PASS = 'ggxe sjmy hqyn byjp'; 

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// API endpoint to handle reply email
app.post('/api/reply', async (req, res) => {
  const { email, message: replyMessage } = req.body;

  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: 'Reply to Your Message',
    text: replyMessage,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Reply sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error.message);
    res.status(500).json({ error: 'Failed to send reply.' });
  }
});



























app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Start server
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
