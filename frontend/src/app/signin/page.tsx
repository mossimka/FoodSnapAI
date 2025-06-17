'use client';

import React, { useState } from 'react';

import { signIn } from '@/services/authService';
import { useRouter } from 'next/navigation';
import Styles from './signin.module.css';
import { GoogleLoginButton } from '@/components/Auth/GoogleLogin/GoogleLogin'; 
import { PasswordInput } from '@/components/Auth/PasswordInput/PasswordInput';

const SigninPage = () => {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signIn(form);
      router.push('/');
    } catch (err: unknown) {
      let message = 'Sign in failed';
      if (err instanceof Error) message = err.message;
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={Styles.wrapper}>
      <div className={Styles.container}>
        <h1 className="gradientText2">Sign In</h1>
        <form className={Styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username or Email"
            value={form.username}
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
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p>or</p>
        
        <GoogleLoginButton />

        {error && <p className={Styles.error}>{error}</p>}
      </div>
    </div>
  );
};

export default SigninPage;
