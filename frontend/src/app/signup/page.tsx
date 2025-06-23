  'use client';

  import React, { useState } from 'react';
  import { useRouter } from 'next/navigation';
  import Link from "next/link";

  import { signUp, signIn } from '@/services/authService';
  import Styles from './signup.module.css';
  import { GoogleLoginButton } from '@/components/Auth/GoogleLogin/GoogleLogin';
  import { PasswordInput } from '@/components/Auth/PasswordInput/PasswordInput';

  const SignupPage = () => {
    const router = useRouter();
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
    
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const passwordRegex = /^(?=.*[0-9])(?=.*[^A-Za-z0-9]).{6,}$/;
    
      if (!emailRegex.test(form.email)) {
        setError("Incorrect email");
        setLoading(false);
        return;
      }
    
      if (!passwordRegex.test(form.password)) {
        setError("Password must contain at least one digit and one special character");
        setLoading(false);
        return;
      }
    
      try {
        await signUp(form);
        await signIn({ username: form.username, password: form.password });
        router.push('/');
      } catch (err: unknown) {
        let message = 'Sign up failed';
        if (err instanceof Error) message = err.message;
        setError(message);
      } finally {
        setLoading(false);
      }
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
          
          <Link href="/signin" className={`${Styles.noUnderline} gradientText`}><small>Already have an account? <b>Sign in</b></small></Link>
          
          <p>or</p>
                  
          <GoogleLoginButton />
          
          {error && <div className={Styles.errorWrapper}><p className={Styles.error}>{error}</p></div>}
        </div>
      </div>
    );
  };

  export default SignupPage;