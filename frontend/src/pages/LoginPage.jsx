import React, { useState, useEffect } from 'react';
import './LoginPage.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [distance, setDistance] = useState(0);
  const [buttonRef, setButtonRef] = useState(null);

  useEffect(() => {
    if (buttonRef) {
      const updateButtonPosition = () => {
        const rect = buttonRef.getBoundingClientRect();
        setButtonPosition({
          x: rect.left + rect.width / 2,
          y: rect.top
        });
      };

      updateButtonPosition();
      window.addEventListener('resize', updateButtonPosition);
      return () => window.removeEventListener('resize', updateButtonPosition);
    }
  }, [buttonRef]);

  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
    
    if (buttonRef) {
      const dist = calculateDistance(e.clientX, e.clientY, buttonPosition.x, buttonPosition.y);
      setDistance(dist);
    }
  };

  const calculateDistance = (X, Y, x, y) => {
    return Math.ceil(Math.sqrt((X - x) ** 2 + (Y - y) ** 2));
  };

  const calculatePerspectiveFactor = (x, y) => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const distanceFromCenter = Math.sqrt((x - screenWidth / 2) ** 2 + (y - screenHeight / 2) ** 2);
    return 1 - distanceFromCenter / (Math.sqrt(screenWidth ** 2 + screenHeight ** 2) / 2);
  };

  const getButtonTransform = () => {
  // Only apply transform if either field is empty
  if (!email || !password) {
    if (distance < 100) {
      const displacementFactor = (100 - distance) * 0.1;
      const perspectiveFactor = calculatePerspectiveFactor(buttonPosition.x, buttonPosition.y);
      
      const translateX = -(mousePosition.x - buttonPosition.x) * displacementFactor * perspectiveFactor;
      const translateY = -(mousePosition.y - buttonPosition.y) * displacementFactor * perspectiveFactor;
      const perspective = `${9 - (10 - 4) * perspectiveFactor}cm`;
      const rotateX = -25 * perspectiveFactor;
      const rotateY = 10 * perspectiveFactor;
      const rotateZ = -5 * perspectiveFactor;
      
      return {
        transform: `translate(${translateX}px, ${translateY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
        perspective,
        transformStyle: 'preserve-3d'
      };
    }
  }
  return {
    transform: 'none',
    perspective: 'none',
    transformStyle: 'flat'
  };
};

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === "admin@gmail.com" && password === "admin") {
      alert("Sign in successful!");
    } else {
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="login-container" onMouseMove={handleMouseMove}>
      {/* Animated background elements */}
      <div className="bg-bubbles">
        {[...Array(10)].map((_, i) => (
          <li key={i}></li>
        ))}
      </div>
      
      <div className="inner-container">
        <div className="form-wrapper is-active">
          <span className="login-title">Welcome back ,to <span style={{color:'darkcyan'}}>AcadTrack</span></span>
          <form className="form form-login" onSubmit={handleSubmit}>
            <fieldset>
              <legend>Please, enter your email and password for login.</legend>
              <div className="input-block">
                <label htmlFor="login-email">E-mail</label>
                <input 
                  id="login-email" 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={email && email !== "admin@gmail.com" ? "invalid" : ""}
                />
              </div>
              <div className="input-block">
                <label htmlFor="login-password">Password</label>
                <input 
                  id="login-password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={password && password !== "admin" ? "invalid" : ""}
                />
              </div>
            </fieldset>
            <button 
              className="pushable" 
              type="submit"
              ref={(el) => setButtonRef(el)}
              style={getButtonTransform()}
            >
              <span className="shadow"></span>
              <span className="edge"></span>
              <span className="front">
                Submit
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;