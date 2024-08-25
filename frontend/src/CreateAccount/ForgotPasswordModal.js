import React from 'react';
import './ForgotPasswordModal.css';
import Logo from './images/logo.png';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <img src={Logo} alt="Logo" className="modal-logo" />
                <h2 className="modal-title" style={{fontFamily:'Twentieth Century sans-serif'}}>Forgot Password</h2>
                <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="modal-input" 
                />
                <div className="modal-buttons">
                    <button className="modal-button close-button" onClick={onClose} style={{fontFamily:'Twentieth Century sans-serif'}}>
                        Close
                    </button>
                    <button className="modal-button submit-button" onClick={onClose} style={{fontFamily:'Twentieth Century sans-serif'}}>
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordModal;
