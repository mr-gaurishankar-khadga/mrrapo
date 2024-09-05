
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors'); 
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { Schema } = mongoose;
const crypto = require('crypto');
const Payment = require('./models/paymentModel');
const twilio = require('twilio'); 
const randomize = require('randomatic');







const app = express();


app.use(cors({
  origin: 'https://mylll.netlify.app', 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));



app.use(express.json());

const mongoDbUrl = process.env.MONGO_DB_CONNECTION_MY_DATABASE;

mongoose.connect(mongoDbUrl)
.then(() => {
  console.log('MongoDB connected');
})
.catch((err) => {
  console.error('Failed to connect to MongoDB', err);
});

let otpStore = {}; 

// Endpoint to send OTP
app.post('/send-otp-to-user', (req, res) => {
    const { mobileNumber } = req.body;
    const otp = randomize('0', 6); 

    otpStore[mobileNumber] = otp; 
    res.json({ message: 'OTP sent successfully' });
});

// Endpoint to verify OTP
app.post('/verify-otp-to-user', (req, res) => {
    const { mobileNumber, otp } = req.body;
    if (otpStore[mobileNumber] && otpStore[mobileNumber] === otp) {
        delete otpStore[mobileNumber];
        return res.json({ message: 'OTP verified successfully' });
    }
    return res.status(400).json({ message: 'Invalid OTP' });
});










// MongoDB User Schema
const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  likedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
});

const User = mongoose.model('User', UserSchema);


const generateRandomSecretKey = () => {
  return crypto.randomBytes(32).toString('hex'); 
};

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || generateRandomSecretKey(), 
  resave: false,
  saveUninitialized: false,
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_DB_CONNECTION_MY_DATABASE, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Configure Google Strategy **this is the method for localhost and production based product development**
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.NODE_ENV === 'production' 
  ? 'https://mrrapo.onrender.com/auth/google/callback' 
  : 'http://localhost:8000/auth/google/callback',
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const existingUser = await User.findOne({ googleId: profile.id });
    if (existingUser) {
      return done(null, existingUser);
    }
    const newUser = await User.create({
      googleId: profile.id,
      displayName: profile.displayName,
      email: profile.emails[0].value,
    });
    done(null, newUser);
  } catch (error) {
    console.error('Error in Google Strategy:', error);
    done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.error('Error during deserialization:', error);
    done(error, null);
  }
});

// Routes
app.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('https://mylll.netlify.app/profile');
  }
);

app.get('/profile', async (req, res) => {
  console.log('Profile route accessed');

  if (!req.isAuthenticated()) {
    console.log('User not authenticated');
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const user = req.user; 

  if (!user) {
    console.log('User not found in session');
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({
    displayName: user.displayName,
    email: user.email,
    googleId: user.googleId,
  });
});

// Logout route
app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.redirect('/');
    }
    res.redirect('/');
  });
});


// app.post('/api/likes', async (req, res) => {
//   if (!req.isAuthenticated()) {
//     return res.status(401).json({ message: 'User not authenticated' });
//   }

//   const { productId } = req.body;

//   try {
//     const user = await User.findById(req.user.id); 

//     // Check if the product is already liked
//     const isLiked = user.likedProducts.includes(productId);

//     if (isLiked) {
//       // If already liked, remove the product from likedProducts
//       user.likedProducts.pull(productId);
//       await user.save();
//       return res.status(200).json({ message: 'Product unliked successfully' });
//     } else {
//       // If not liked, add the product to likedProducts
//       user.likedProducts.push(productId);
//       await user.save();
//       return res.status(200).json({ message: 'Product liked successfully' });
//     }
//   } catch (error) {
//     console.error('Error handling likes:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// });




















// API end * this is end point of payment getway forr the user
app.post('/api/payments', async (req, res) => {
  const { product, quantity, paymentMethod, price, cardNumber,mobileNumber,address, expiryDate, cvv } = req.body;

  try {
    const newPayment = new Payment({
      product,
      quantity,
      paymentMethod,
      price,
      cardNumber,
      expiryDate,
      mobileNumber,
      address,
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










// Login Route
app.post('/login', async (req, res) => {
  const { firstname, password } = req.body;

  try {
    const user = await Signup.findOne({ firstname });

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



// ***Search api ****
app.get('/api/products/search', async (req, res) => {
  const query = req.query.query;
  try {
    const products = await Product.find({
      $or: [
        { title: { $regex: query, $options: 'i' } }, 
        { description: { $regex: query, $options: 'i' } } 
      ]
    });
    res.json(products);
  } catch (error) {
    res.status(500).send('Server Error');
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

// images all data store in this **upload file**
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));










const EMAIL_USER = 'ggs699000@gmail.com';
const EMAIL_PASS = 'ggxe sjmy hqyn byjp'; 

// Create a transporter using SMTP
const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});





// MongoDB schema
const signupSchema = new mongoose.Schema({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  phoneNumber: String,
  addressLine: String,
  city: String,
  state: String,
  otp: String,
});

const Signup = mongoose.model('Signup', signupSchema);

// Hardcoded JWT secret key for the user *
const JWT_SECRET = crypto.randomBytes(64).toString('hex');
console.log(`Generated JWT Secret Key: ${JWT_SECRET}`);

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'ggs699000@gmail.com',
      pass: 'ggxe sjmy hqyn byjp', 
  },
});




// Signup Route
app.post('/api/signup', async (req, res) => {
  const { email, password, firstName, lastName, phoneNumber, addressLine, city, state } = req.body;

  try {
      const userExists = await Signup.findOne({ email });
      if (userExists) {
          return res.status(400).json({ message: 'User already exists' });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      const newUser = new Signup({ email, password, firstName, lastName, phoneNumber, addressLine, city, state, otp });
      await newUser.save();

      // Send OTP
      await transporter.sendMail({
          to: email,
          subject: 'OTP Verification',
          text: `Your OTP is ${otp}`,
      });

      res.status(200).json({ message: 'User created. Check your email for OTP.' });
  } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ message: 'An error occurred during signup. Please try again.' });
  }
});






// Verify OTP Route
app.post('/api/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
      const user = await Signup.findOne({ email });
      if (!user) {
          return res.status(400).json({ message: 'User not found' });
      }

      if (user.otp !== otp) {
          return res.status(400).json({ message: 'Invalid OTP' });
      }

      user.otp = null;
      await user.save();

      // Generate a JWT token to provide for varify
      const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '30d' });

      res.status(200).json({ message: 'OTP verified successfully', token });
  } catch (error) {
      console.error('Verify OTP error:', error);
      res.status(500).json({ message: 'An error occurred during OTP verification. Please try again.' });
  }
});





// Middleware to verify token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; 
  if (!token) return res.sendStatus(401); 

  jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
          console.error('Token verification error:', err);
          return res.sendStatus(403); 
      }
      req.user = user; 
      next(); 
  });
};

// Profile Route
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
      const user = await Signup.findOne({ email: req.user.email });
      if (!user) return res.status(404).json({ message: 'User not found' });

      const { password, otp, ...userData } = user.toObject();
      res.status(200).json({ message: 'Welcome to your profile!', user: userData });
  } catch (error) {
      console.error('Profile fetch error:', error);
      res.status(500).json({ message: 'An error occurred while fetching profile data.' });
  }
});











const users = {};

// Setup transporter for Nodemailer
const transporterr = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ggs699000@gmail.com',
        pass: 'ggxe sjmy hqyn byjp', 
    },
});

// Send OTP to the user's email
app.post('/api/send-otp', (req, res) => {
    const { email } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000);
    users[email] = otp; 

    const mailOptionss = {
        from: 'ggs699000@gmail.com',
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`,
    };

    transporterr.sendMail(mailOptionss, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send('Error sending OTP. Please try again.');
        }
        console.log('OTP sent to:', email);
        res.status(200).send('OTP sent successfully!');
    });
});

// Verify the OTP
app.post('/api/verify-otp1', (req, res) => {
    const { email, otp } = req.body;

    // Check if the OTP is valid
    if (users[email] && users[email] == otp) {
        delete users[email]; 
        return res.status(200).send('OTP verified successfully!');
    } else {
        return res.status(400).send('Invalid OTP. Please try again.');
    }
});












// GET endpoint to fetch all signups
app.get('/api/signups', async (req, res) => {
  try {
    const signups = await Signup.find();
    res.status(200).json(signups);
  } catch (error) {
    console.error('Error fetching signups:', error);
    res.status(500).json({ message: 'Failed to fetch signups.' });
  }
});


// DELETE endpoint to delete a signup by ID
app.delete('/api/signups/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if the ID is valid ** in this api check the user is valid user **
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Delete the user
    const result = await Signup.deleteOne({ _id: userId });

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




app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find();
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error.message);
    res.status(500).json({ message: 'Failed to fetch messages.' });
  }
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
    await transport.sendMail(mailOptions);
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
