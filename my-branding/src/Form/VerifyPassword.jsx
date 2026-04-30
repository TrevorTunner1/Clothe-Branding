import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { TextPlugin } from 'gsap/TextPlugin';
import styles from './VerifyPassword.module.css';
import { api, useAuthStore } from '../context/AuthContext';

gsap.registerPlugin(TextPlugin);

const VerifyEmail = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);      // ✅ was missing
  const [resendCountdown, setResendCountdown] = useState(0);

  const container = useRef();
  const textRef = useRef();
  const cursorRef = useRef();
  const navigate = useNavigate();

  const { verifyOtp } = useAuthStore();                   // ✅ removed unused 'verification'

  useGSAP(() => {
    gsap.from(`.${styles.formWrapper} > *`, {
      opacity: 0, y: 30, stagger: 0.1, duration: 1, ease: "expo.out"
    });

    let masterTl = gsap.timeline({ repeat: -1 });
    ["verify your access.", "authenticating identity.", "securing the infrastructure."].forEach((phrase) => {
      let tl = gsap.timeline({ repeat: 1, yoyo: true, repeatDelay: 2 });
      tl.to(textRef.current, {
        duration: phrase.length * 0.05,
        text: { value: phrase, delimiter: "" },
        ease: "none"
      });
      masterTl.add(tl);
    });

    gsap.to(cursorRef.current, { opacity: 0, ease: "steps(1)", repeat: -1, duration: 0.5 });
  }, { scope: container });

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    if (element.value !== "" && element.nextSibling) element.nextSibling.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.join("").length < 6) return alert("Enter the full 6-digit code.");

    setIsLoading(true);
    setError('');

    try {
      const result = await verifyOtp(otp.join(""));     // ✅ actually calls verifyOtp
      if (result.success) {
        navigate('/platform/shop');
      } else {
        setError(result.message || 'Verification failed.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {

    setIsLoading(true);
    setError('');
    try {
      await api.post('/api/v1/authentication/resend-otp');
      setResendCountdown(60);
      setError('New OTP sent! Check your email.');
    } catch (err) {
      setError('Failed to resend OTP. Try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  return (
    <div ref={container} className={styles.mainWrapper}>
      <div className={styles.formSection}>
        <div className={styles.formWrapper}>
          <h1 className={styles.title}>Identity Check</h1>
          <p className={styles.subtitle}>
            Enter the 6-digit code sent to your professional email.
          </p>
          <form className={styles.form} onSubmit={handleVerify}>
            <div className={styles.otpContainer}>
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  className={styles.otpInput}
                  value={data}
                  onChange={e => handleChange(e.target, index)}
                  onFocus={e => e.target.select()}
                />
              ))}
            </div>
            {error && <p className={styles.error}>{error}</p>}   {/* ✅ show errors */}
            <button type="submit" className={styles.submitBtn} disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify Access'}
            </button>
          </form>
        </div>
      </div>

      <div className={styles.resendSection}>
        <p>
          Didn't receive code?{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={resendCountdown > 0 || isLoading}
            className={styles.resendBtn}
          >
            Resend {resendCountdown > 0 ? `(${resendCountdown}s)` : ''}
          </button>
        </p>
      </div>

      <div className={styles.brandSection}>
        <div className={styles.typewriterBox}>
          <h2 className={styles.typewriterText}>
            <span ref={textRef}></span>
            <span ref={cursorRef}>|</span>
          </h2>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;