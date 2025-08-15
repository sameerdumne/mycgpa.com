import React, { useState, useRef, useEffect } from 'react';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFilled, setIsFilled] = useState(false);
  const buttonRef = useRef(null);
  const [isVibrating, setIsVibrating] = useState(false);

  useEffect(() => {
    const filled = email.trim() !== '' && password.trim() !== '';
    setIsFilled(filled);
    if (!filled) {
      startVibration();
    } else {
      stopVibration();
    }
  }, [email, password]);

  const startVibration = () => {
    if (isVibrating || !buttonRef.current) return;
    setIsVibrating(true);
    vibrateButton();
  };

  const stopVibration = () => {
    setIsVibrating(false);
    if (buttonRef.current) {
      buttonRef.current.style.transform = 'translate(0, 0)';
    }
  };

  const vibrateButton = () => {
    if (!isVibrating || !buttonRef.current) return;
    
    const button = buttonRef.current;
    // Extreme vibration effect
    const x = (Math.random() * 20 - 10) * 2; // -20 to 20
    const y = (Math.random() * 20 - 10) * 2; // -20 to 20
    const rotate = Math.random() * 10 - 5; // -5 to 5 degrees
    
    button.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`;
    
    // Continue vibration until stopped
    requestAnimationFrame(vibrateButton);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFilled) return;
    alert(`Login attempted with email: ${email}`);
  };

  return (
    <div className="login-container">
      <div className="background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>
      <form onSubmit={handleSubmit} className="login-form">
        <h3>Login Here</h3>

        <label htmlFor="email">Email</label>
        <input
          type="email"
          placeholder="Email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          placeholder="Password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          ref={buttonRef}
          type="submit"
          className={`submit-btn ${isFilled ? 'filled' : 'vibrating'}`}
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default LoginPage;