import React from 'react';
import { GoogleIcon, FacebookIcon, InstagramIcon } from './SocialIcons';

const SocialLogin = ({ onGoogleLogin }) => {
  return (
    <div className="social-login">
      <div className="divider">
        <span>Or continue with</span>
      </div>
      <div className="social-buttons">
        <button 
          className="social-button google" 
          onClick={onGoogleLogin}
          type="button"
          aria-label="Login with Google"
        >
          <GoogleIcon />
        </button>
        <button 
          className="social-button facebook" 
          type="button"
          aria-label="Login with Facebook"
        >
          <FacebookIcon />
        </button>
        <button 
          className="social-button instagram" 
          type="button"
          aria-label="Login with Instagram"
        >
          <InstagramIcon />
        </button>
      </div>
    </div>
  );
};

export default SocialLogin;
