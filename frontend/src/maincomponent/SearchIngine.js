import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
const SearchIngine = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${query.trim()}`);
    }
  };

  return (
      <form onSubmit={handleSearch}>
            <div className="searchproduct" style={{ display:'flex',  marginBottom: '10px', padding: '16px', height: '10px', width: '400px', marginTop: '-10px', borderRadius: '140px', backgroundColor: 'rgb(212,214,218)', outline: 'none', border: 'none',letterSpacing:'2px'}}>
          <input
            type="text"
            placeholder="Search for products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ marginBottom: '10px',marginLeft:'-10px', padding: '15px 15px 15px 17px', height: '8px', width: '90%', marginTop: '-14px', borderRadius: '120px 0 0 120px', backgroundColor: 'rgb(212,214,218)', outline: 'none', border: 'none',letterSpacing:'2px' }}
          />
          <button type="submit" style={{marginBottom: '10px',marginLeft:'-10px', padding: '15px 15px 15px 15px', height: '100%', width: '15%', marginTop: '-14px',backgroundColor: 'rgb(212,214,218)', borderRadius: '120px 0 0 120px', outline: 'none', border: 'none',letterSpacing:'2px',cursor:'pointer'}}><SearchIcon style={{color:'black',fontSize:'30px',marginTop:'-20px',padding:'10px',width:'100%',height:'30px'}}/></button>
    </div>
        </form>
  );
};

export default SearchIngine;
