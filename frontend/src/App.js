import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { IconButton, InputBase, AppBar, Toolbar, Typography, Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Popover, Paper, Divider, Avatar } from '@mui/material';
import { GoogleOAuthProvider } from '@react-oauth/google';


import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import AddIcCallIcon from '@mui/icons-material/AddIcCall';
import SearchIcon from '@mui/icons-material/Search';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import './App.css';
import SalesPage from './maincomponent/pages/SalesPage';
import MensWearPage from './maincomponent/pages/MensWearPage';
import WomensWearPage from './maincomponent/pages/WomensWearPage';
import ContactPage from './maincomponent/pages/ContactPage';
import CompleteView from '../src/maincomponent/CompleteView';
import ShoppingCart from '../src/maincomponent/ShoppingCart';
import DisplayPage from './DisplayPage';


import ProductDetail from '../src/maincomponent/ProductDetail';

import Signup from './CreateAccount/Signup';
import CartItem from '../src/maincomponent/CartItem';
import Setup from './Admin/Setup';
import ProfileMenu from './maincomponent/ProfileMenu';


import slider1 from './maincomponent/images/sl2.webp';
import ZoomImageSlider from '../src/maincomponent/Slider';
import Payment from './maincomponent/Payment';
import Logout from './CreateAccount/Logout';

import Slider1 from './maincomponent/images/aa1.webp'

import ImageZoom from './ImageZoom';
import ShoppingCartView from './maincomponent/ShoppingCartView';
import LoginPage from './CreateAccount/LoginPage';

import Profile from './User/Profile';
import Logo from './images/logo.png';
import TextSlider from './maincomponent/TextSlider';
import Loginwithgoogle from './CreateAccount/Loginwithgoogle';
import UserProfile from './User/UserProfile';



const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [accountAnchor, setAccountAnchor] = useState(null);
  const [ shopAnchor, setShopAnchor ] = useState(null);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleSearch = () => setIsActive(!isActive);

  const [token, setToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);


  const handleAccountClick = (event) => {
    setAccountAnchor(event.currentTarget);
};

const handleAccountClose = () => {
    setAccountAnchor(null);
};


  const handleShopClick = (event) => {
    setShopAnchor(event.currentTarget);
};

const handleShopClose = () => {
    setShopAnchor(null);
};


  return (
    <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID}> 
    <Router>
        <div className="logocontainer" style={{width:'',display:'flex',justifyContent:'center',backgroundColor:'black',color:'white',letterSpacing:'2px'}}>
          <TextSlider/>
        </div>

      <nav className="navbar">
        {/* Desktop View */}
        <div className="nav-desktop">
        <img src={Logo} alt="" className="" style={{ height: '150px', width: '300px', marginTop: '5px', marginLeft: '-20px' }} />
        <ul className="nav-links">
          <li><Link to="/ContactPage">Contact</Link></li>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/MensWearPage">MensWear</Link></li>
          <li><Link to="/WomensWearPage">WomensWear</Link></li>
          <li><Link to="/SalesPage">Sales</Link></li>
        </ul>
        

        <ul className="nav-icons">
          <li>
            <input type="text" className="s" placeholder="Search Product" style={{ marginBottom: '10px', padding: '15px', height: '10px', width: '400px', marginTop: '-10px', borderRadius: '120px', backgroundColor: 'rgb(212,214,218)', outline: 'none', border: 'none' }} />
          </li>
          <li>
            <PersonIcon style={{ color: 'black', cursor: 'pointer' }} onClick={handleAccountClick} />
          </li>

          <li onClick={handleShopClick}>
            <AddShoppingCartIcon titleAccess='ShoppingCart' style={{ cursor: 'pointer' }} />
          </li>
        </ul>
      </div>




                    <Popover open={Boolean(accountAnchor)} anchorEl={accountAnchor} onClose={handleAccountClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }} transformOrigin={{     vertical: 'top',     horizontal: 'right', }} >

                      <Paper style={{ maxWidth: 300, padding: 10, color:'white',backgroundColor:'rgb(15,15,15)' }}>
                          <Box display="flex" alignItems="center" mb={2}>
                              <Avatar alt="User Avatar" src={slider1} style={{border:'2px solid white'}}/> 
                              
                              <Box ml={2}>
                                  <Typography variant="h6">
                                      gshankar
                                  </Typography>
                                  <Typography variant="subtitle1">
                                      @MRGAURISHANKAR413
                                  </Typography>
                              </Box>
                          </Box>

                          <div className="divider"></div>

                          <List>
                            <ListItem button component={Link} to="/LoginPage">
                                <ListItemIcon style={{color:'white'}}>
                                    <LoginIcon />
                                </ListItemIcon>
                                <ListItemText primary="Login" />
                            </ListItem>

                            <ListItem button component={Link} to="/Logout">
                                <ListItemIcon style={{color:'white'}}>
                                    <ArrowCircleLeftIcon />
                                </ListItemIcon>
                                <ListItemText primary="Logout" />
                            </ListItem>

                            <ListItem button component={Link} to="/Profile">
                                <ListItemIcon style={{color:'white'}}>
                                    <PersonIcon />
                                </ListItemIcon>
                                <ListItemText primary="Profile" />
                            </ListItem>
                          </List>
                        </Paper>
                      </Popover>




                      <Popover open={Boolean(shopAnchor)} onClose={handleShopClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }} PaperProps={{ style: {color: 'white',maxHeight:'' } }} > 
                        <Paper style={{color: 'white',backgroundColor: '',overflowY: 'scroll',scrollbarWidth: 'none', }} >
                        <style>
                          {`
                            /* Hide scrollbar for WebKit browsers (Chrome, Safari) */
                            ::-webkit-scrollbar {
                              width: 0px;
                              background: transparent; /* Optional: just in case it's visible */
                              }
                              `}
                        </style>
                        
                      </Paper>
                        <ShoppingCart />
                    </Popover>























        {/* Mobile View */}
        <div className="nav-mobile" style={{width:'100%'}}>
          {!isActive && (
            <li style={{listStyleType:'none',fontSize:'30px'}}> <MenuIcon onClick={toggleSidebar} style={{color:'black'}}/>  WENLI !</li>
          )}

          <div className="rightside" style={{textAlign:'right',width:'100%'}}> 
            {isActive && ( 
              <input className={`search-input ${isActive ? 'active' : ''}`} placeholder="Search..." style={{ paddingLeft: '15px', height: '20px', padding: '7px', backgroundColor: 'rgb(212,214,218)', borderRadius: '12px', border: 'none', outline: 'none', transition: 'width 0.4s ease', width:'60%' }} /> 
            )}

          <IconButton className="more-button" onClick={handleSearch} style={{marginRight:'auto'}}>
            <SearchIcon className="search-icon" style={{color:'black'}}/>
          </IconButton>


          <IconButton className="more-button">
            <AddShoppingCartIcon style={{color:'black'}}/>
          </IconButton>
          </div>










          <Drawer anchor="left" open={sidebarOpen} onClose={toggleSidebar} variant="temporary" sx={{ '& .MuiDrawer-paper': { width: 250, boxSizing: 'border-box', }, }}>
            <div className="sidebar" style={{color:'black'}}>
              <List>
                <ListItem button component={Link} to="/" onClick={toggleSidebar}>
                  <ListItemIcon><HomeIcon style={{color:'black'}}/></ListItemIcon>
                  <ListItemText primary="Home" style={{color:'black'}}/>
                </ListItem>

                <ListItem button component={Link} to="/LoginPage" onClick={toggleSidebar} >
                  <ListItemIcon><LoginIcon style={{color:'black'}}/></ListItemIcon>
                  <ListItemText primary="Login" style={{color:'black'}}/>
                </ListItem>

                <ListItem button component={Link} to="/ContactPage" onClick={toggleSidebar}>
                  <ListItemIcon><AddIcCallIcon style={{color:'black'}}/></ListItemIcon>
                  <ListItemText primary="Contact" style={{color:'black'}}/>
                </ListItem>

                <ListItem button component={Link} to="/WomensWearPage" onClick={toggleSidebar}>
                  <ListItemIcon><SubscriptionsIcon style={{color:'black'}}/></ListItemIcon>
                  <ListItemText primary="WomensWear" style={{color:'black'}}/>
                </ListItem>

                <ListItem button component={Link} to="/MensWearPage" onClick={toggleSidebar}>
                  <ListItemIcon><SubscriptionsIcon style={{color:'black'}}/></ListItemIcon>
                  <ListItemText primary="MensWear" style={{color:'black'}}/>
                </ListItem>

                <ListItem button component={Link} to="/SalesPage" onClick={toggleSidebar}>
                  <ListItemIcon><SubscriptionsIcon style={{color:'black'}}/></ListItemIcon>
                  <ListItemText primary="Sales" style={{color:'black'}}/>
                </ListItem>

                <ListItem button component={Link} to="/Profile" onClick={toggleSidebar}>
                  <ListItemIcon><PersonIcon style={{color:'black'}}/></ListItemIcon>
                  <ListItemText primary="Profile" style={{color:'black'}}/>
                </ListItem>

              </List>
            </div>
          </Drawer>
        </div>
      </nav>

      <div className="maincontent" style={{height:'',backgroundColor:''}}>

        <Routes>
          <Route path="/" element={<ZoomImageSlider />} />
          <Route path="/ContactPage" element={<ContactPage />} />
          <Route path="/CompleteView" element={<CompleteView />} />
          <Route path="/ProductDetail" element={<ProductDetail />} />
          <Route path="/CartItem" element={<CartItem />} />
          <Route path="/Setup" element={<Setup />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/SalesPage" element={<SalesPage />} />
          <Route path="/MensWearPage" element={<MensWearPage />} />
          <Route path="/WomensWearPage" element={<WomensWearPage />} />
          <Route path="/DisplayPage" element={<DisplayPage />} />
          <Route path="/ShoppingCart" element={<ShoppingCart />} />
          <Route path="/ProfileMenu" element={<ProfileMenu />} />
          <Route path="/ShoppingCart" element={<ShoppingCart />} />
          <Route path="/Payment" element={<Payment />} />
          <Route path="/Logout" element={<Logout />} />
          <Route path="/ShoppingCartView" element={<ShoppingCartView />} />
          <Route path="/ImageZoom" element={<ImageZoom />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/UserProfile" element={<UserProfile />} />
          <Route path="/TextSlider" element={<TextSlider />} />
          <Route path="/Loginwithgoogle" element={<Loginwithgoogle />} />
          <Route path="/LoginPage" element={<LoginPage setToken={setToken} setIsAdmin={setIsAdmin}/>} />
        </Routes>
        
      </div>
    </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
