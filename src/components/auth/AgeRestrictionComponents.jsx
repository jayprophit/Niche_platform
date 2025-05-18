import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ResponsiveLayout } from '../../lib/responsive/ResponsiveLayout';

// Age Verification Modal Component
export const AgeVerificationModal = ({ isOpen, onClose, onVerify, requiredAge = 13, redirectPath = '/' }) => {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  
  useEffect(() => {
    // Reset error when modal opens
    if (isOpen) {
      setError('');
    }
  }, [isOpen]);
  
  const handleVerify = () => {
    // Validate inputs
    if (!day || !month || !year) {
      setError('Please enter your complete date of birth');
      return;
    }
    
    // Convert to numbers
    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);
    
    // Basic validation
    if (dayNum < 1 || dayNum > 31 || monthNum < 1 || monthNum > 12 || yearNum < 1900 || yearNum > new Date().getFullYear()) {
      setError('Please enter a valid date of birth');
      return;
    }
    
    // Calculate age
    const birthDate = new Date(yearNum, monthNum - 1, dayNum);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    // Check if user meets age requirement
    if (age >= requiredAge) {
      // Store verification in localStorage or cookies
      localStorage.setItem('ageVerified', 'true');
      localStorage.setItem('userAge', age.toString());
      
      // Call verification callback
      onVerify(age);
      onClose();
    } else {
      setError(`You must be at least ${requiredAge} years old to access this content`);
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push(redirectPath);
        onClose();
      }, 3000);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="age-verification-modal">
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Age Verification Required</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <p className="verification-message">
            You must be at least {requiredAge} years old to access this content.
            Please enter your date of birth to continue.
          </p>
          
          <div className="dob-inputs">
            <div className="input-group">
              <label htmlFor="day">Day</label>
              <input
                type="number"
                id="day"
                min="1"
                max="31"
                placeholder="DD"
                value={day}
                onChange={(e) => setDay(e.target.value)}
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="month">Month</label>
              <input
                type="number"
                id="month"
                min="1"
                max="12"
                placeholder="MM"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="year">Year</label>
              <input
                type="number"
                id="year"
                min="1900"
                max={new Date().getFullYear()}
                placeholder="YYYY"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
          </div>
          
          {error && <p className="error-message">{error}</p>}
          
          <div className="verification-notice">
            <p>
              By entering your date of birth and clicking "Verify Age", you confirm that you accept our{' '}
              <Link href="/terms-of-service">
                <a>Terms of Service</a>
              </Link>{' '}
              and{' '}
              <Link href="/privacy-policy">
                <a>Privacy Policy</a>
              </Link>.
            </p>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="verify-btn" onClick={handleVerify}>Verify Age</button>
        </div>
      </div>
    </div>
  );
};

// Parental Consent Modal Component
export const ParentalConsentModal = ({ isOpen, onClose, onConsent, childName = '', childEmail = '' }) => {
  const [parentName, setParentName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [relationship, setRelationship] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [error, setError] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  
  useEffect(() => {
    // Reset state when modal opens
    if (isOpen) {
      setError('');
      setVerificationSent(false);
      setVerificationCode('');
      setEnteredCode('');
    }
  }, [isOpen]);
  
  const handleSendVerification = () => {
    // Validate inputs
    if (!parentName || !parentEmail || !relationship) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (!consentChecked) {
      setError('You must provide consent by checking the box');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(parentEmail)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Generate a random 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setVerificationCode(code);
    
    // In a real implementation, this would send an email to the parent
    // For this demo, we'll just show the code in the UI
    setVerificationSent(true);
    setError('');
    
    // In a real implementation, this would be:
    // sendVerificationEmail(parentEmail, code, childName);
  };
  
  const handleVerifyCode = () => {
    if (!enteredCode) {
      setError('Please enter the verification code');
      return;
    }
    
    if (enteredCode === verificationCode) {
      // Store consent in localStorage or cookies
      localStorage.setItem('parentalConsent', 'true');
      localStorage.setItem('parentName', parentName);
      localStorage.setItem('parentEmail', parentEmail);
      
      // Call consent callback
      onConsent({
        parentName,
        parentEmail,
        relationship,
        timestamp: new Date().toISOString()
      });
      
      onClose();
    } else {
      setError('Invalid verification code. Please try again.');
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="parental-consent-modal">
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Parental Consent Required</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          {!verificationSent ? (
            <>
              <p className="consent-message">
                As {childName || 'your child'} is under 13 years old, we require parental consent
                before they can use certain features of our platform.
              </p>
              
              <div className="consent-form">
                <div className="form-group">
                  <label htmlFor="parentName">Parent/Guardian Full Name *</label>
                  <input
                    type="text"
                    id="parentName"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="parentEmail">Parent/Guardian Email *</label>
                  <input
                    type="email"
                    id="parentEmail"
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="relationship">Relationship to Child *</label>
                  <select
                    id="relationship"
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    required
                  >
                    <option value="">Select relationship</option>
                    <option value="parent">Parent</option>
                    <option value="legal_guardian">Legal Guardian</option>
                    <option value="grandparent">Grandparent</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="consent-checkbox">
                  <input
                    type="checkbox"
                    id="consentCheck"
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                  />
                  <label htmlFor="consentCheck">
                    I confirm that I am the parent or legal guardian of {childName || 'this child'} and
                    I give consent for them to use this platform. I have read and agree to the{' '}
                    <Link href="/terms-of-service">
                      <a>Terms of Service</a>
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy-policy">
                      <a>Privacy Policy</a>
                    </Link>.
                  </label>
                </div>
              </div>
            </>
          ) : (
            <div className="verification-section">
              <p className="verification-message">
                A verification code has been sent to {parentEmail}.
                Please enter the code below to complete the consent process.
              </p>
              
              {/* In a real implementation, this would be hidden */}
              <div className="demo-code-display">
                <p>Demo Verification Code: <strong>{verificationCode}</strong></p>
                <p className="demo-note">(In a real implementation, this would be sent via email)</p>
              </div>
              
              <div className="form-group">
                <label htmlFor="verificationCode">Verification Code</label>
                <input
                  type="text"
                  id="verificationCode"
                  value={enteredCode}
                  onChange={(e) => setEnteredCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                />
              </div>
            </div>
          )}
          
          {error && <p className="error-message">{error}</p>}
        </div>
        
        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          {!verificationSent ? (
            <button 
              className="send-verification-btn" 
              onClick={handleSendVerification}
              disabled={!parentName || !parentEmail || !relationship || !consentChecked}
            >
              Send Verification
            </button>
          ) : (
            <button 
              className="verify-btn" 
              onClick={handleVerifyCode}
              disabled={!enteredCode}
            >
              Verify Code
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Purchase Consent Modal Component
export const PurchaseConsentModal = ({ isOpen, onClose, onConsent, productInfo, userAge }) => {
  const [parentName, setParentName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [relationship, setRelationship] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() => {
    // Reset state when modal opens
    if (isOpen) {
      setError('');
    }
  }, [isOpen]);
  
  const handleConsent = () => {
    // Validate inputs
    if (!parentName || !parentEmail || !relationship || !paymentMethod) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (!consentChecked) {
      setError('You must provide consent by checking the box');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(parentEmail)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Store consent in localStorage or cookies
    localStorage.setItem('purchaseConsent', 'true');
    localStorage.setItem('parentName', parentName);
    localStorage.setItem('parentEmail', parentEmail);
    
    // Call consent callback
    onConsent({
      parentName,
      parentEmail,
      relationship,
      paymentMethod,
      productInfo,
      timestamp: new Date().toISOString()
    });
    
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="purchase-consent-modal">
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Parental Consent for Purchase</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="product-summary">
            <h3>Purchase Summary</h3>
            <div className="product-info">
              <div className="product-image">
                {productInfo?.image && <img src={productInfo.image} alt={productInfo.name} />}
              </div>
              <div className="product-details">
                <h4>{productInfo?.name || 'Product Name'}</h4>
                <p className="product-price">${productInfo?.price?.toFixed(2) || '0.00'}</p>
                {productInfo?.description && <p className="product-description">{productInfo.description}</p>}
              </div>
            </div>
          </div>
          
          <p className="consent-message">
            As the user is under 18 years old (currently {userAge || 'minor'}), we require parental consent
            before completing this purchase.
          </p>
          
          <div className="consent-form">
            <div className="form-group">
              <label htmlFor="parentName">Parent/Guardian Full Name *</label>
              <input
                type="text"
                id="parentName"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="parentEmail">Parent/Guardian Email *</label>
              <input
                type="email"
                id="parentEmail"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                required
              />
            </div>
            
    <response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>