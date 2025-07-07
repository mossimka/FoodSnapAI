'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";

import { signUp, signIn } from '@/services/authService';
import Styles from './signup.module.css';
import { GoogleLoginButton } from '@/components/Auth/GoogleLogin/GoogleLogin';
import { PasswordInput } from '@/components/Auth/PasswordInput/PasswordInput';
import { CaptchaModal } from '@/components/Auth/CaptchaModal/CaptchaModal';
import { toast } from 'react-toastify';

const SignupPage = () => {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showCaptchaModal, setShowCaptchaModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if(form.username.length > 30) {
      toast.error("Username must be less than 30 characters long");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[0-9])(?=.*[^A-Za-z0-9]).{6,}$/;
    
    if (!emailRegex.test(form.email)) {
      toast.error("Incorrect email");
      return;
    }
  
    if (!passwordRegex.test(form.password)) {
      toast.error("Password must contain at least one digit and one special character");
      return;
    }

    setShowCaptchaModal(true);
  };

  const handleCaptchaSuccess = async (token: string) => {
    setShowCaptchaModal(false);
    setLoading(true);
    
    try {
      await signUp({ ...form, captcha_token: token });
      await signIn({ username: form.username, password: form.password });
      router.push('/');
    } catch (err: unknown) {
      let message = 'Sign up failed';
      if (err instanceof Error) message = err.message;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseCaptchaModal = () => {
    setShowCaptchaModal(false);
  };

  return (
    <div className={Styles.wrapper}>
      <div className={Styles.container}>
        <h2 className="gradientText2">Join FoodSnapAI!</h2>
        <form className={Styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            className={Styles.input}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className={Styles.input}
          />
          <PasswordInput
            name="password"
            value={form.password}
            onChange={handleChange}
            className={Styles.input}
          />

          <button type="submit" className="button" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
          
        <Link href="/signin" className={`${Styles.noUnderline} gradientText`}>
          <small>Already have an account? <b>Sign in</b></small>
        </Link>
          
        <p>or</p>
                  
        <GoogleLoginButton />
      </div>

      {showCaptchaModal && (
        <CaptchaModal
          onClose={handleCloseCaptchaModal}
          onSuccess={handleCaptchaSuccess}
        />
      )}
    </div>
  );
};

export default SignupPage;