import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth, firebaseReady, googleProvider } from './firebase';

function readableAuthError(error) {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'An account already exists for that email. Try signing in instead.';
    case 'auth/invalid-email':
      return 'Enter a valid email address.';
    case 'auth/weak-password':
      return 'Choose a password with at least 6 characters.';
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'That email and password combination was not recognized.';
    case 'auth/popup-closed-by-user':
      return 'The Google sign-in window was closed before finishing.';
    case 'auth/popup-blocked':
      return 'Your browser blocked the sign-in window. Allow pop-ups and try again.';
    case 'auth/unauthorized-domain':
      return 'Add this site’s domain to the authorized domains in Firebase Authentication settings.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled yet. Enable it in Firebase Authentication settings.';
    case 'auth/too-many-requests':
      return 'There have been too many attempts. Wait a little and try again.';
    default:
      return error.message || 'Something went wrong. Please try again.';
  }
}

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
    setAuthLoading(false);
  }), []);

  function clearFeedback() {
    setError('');
    setMessage('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    clearFeedback();
    setBusy(true);
    try {
      if (mode === 'signup') {
        const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        if (name.trim()) {
          await updateProfile(credential.user, { displayName: name.trim() });
          setUser({ ...credential.user, displayName: name.trim() });
        }
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
    } catch (authError) {
      setError(readableAuthError(authError));
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogleSignIn() {
    clearFeedback();
    setBusy(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (authError) {
      setError(readableAuthError(authError));
    } finally {
      setBusy(false);
    }
  }

  async function handlePasswordReset() {
    clearFeedback();
    if (!email.trim()) {
      setError('Enter your email address first, then choose “Forgot password?”.');
      return;
    }
    setBusy(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setMessage('If an account exists for that email, a password reset link is on its way.');
    } catch (authError) {
      setError(readableAuthError(authError));
    } finally {
      setBusy(false);
    }
  }

  async function handleSignOut() {
    clearFeedback();
    try {
      await signOut(auth);
    } catch (authError) {
      setError(readableAuthError(authError));
    }
  }

  if (authLoading) {
    return <main className="loading-screen" aria-live="polite">Loading Rasely…</main>;
  }

  if (user) {
    return (
      <main className="app-shell">
        <header className="topbar">
          <a className="brand" href="/" aria-label="Rasely home"><span className="brand-mark">R</span> rasely</a>
          <button className="button button-quiet" type="button" onClick={handleSignOut}>Sign out</button>
        </header>
        <motion.section className="welcome-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <span className="eyebrow">You’re signed in</span>
          <h1>Welcome{user.displayName ? `, ${user.displayName}` : ''}.</h1>
          <p>Your Rasely account is ready. Messaging and profile features are the next step.</p>
          <div className="account-row">
            {user.photoURL ? <img className="avatar" src={user.photoURL} alt="" /> : <span className="avatar avatar-fallback">{(user.displayName || user.email || 'R').charAt(0).toUpperCase()}</span>}
            <span><strong>{user.displayName || 'Rasely member'}</strong><small>{user.email}</small></span>
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
        </motion.section>
      </main>
    );
  }

  return (
    <main className="app-shell auth-layout">
      <motion.section className="auth-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <a className="brand auth-brand" href="/" aria-label="Rasely home"><span className="brand-mark">R</span> rasely</a>
        <span className="eyebrow">A little closer, every day</span>
        <h1>{mode === 'signup' ? 'Create your account' : 'Welcome back'}</h1>
        <p className="auth-intro">Connect with the people who make your day.</p>

        {!firebaseReady && <div className="setup-notice" role="status">Add your Firebase settings to <code>client/.env</code> and restart the dev server to enable sign-in.</div>}
        {error && <div className="form-error" role="alert">{error}</div>}
        {message && <div className="form-success" role="status">{message}</div>}

        <button className="button google-button" type="button" onClick={handleGoogleSignIn} disabled={busy || !firebaseReady}>
          <GoogleIcon /> Continue with Google
        </button>
        <div className="divider"><span>or continue with email</span></div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <label>
              Display name
              <input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" maxLength={60} />
            </label>
          )}
          <label>
            Email address
            <input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
          </label>
          <label>
            Password
            <input type="password" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" minLength={6} required />
          </label>
          {mode === 'signin' && <button className="text-button forgot-button" type="button" onClick={handlePasswordReset} disabled={busy}>Forgot password?</button>}
          <button className="button button-primary" type="submit" disabled={busy || !firebaseReady}>
            {busy ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <p className="mode-switch">
          {mode === 'signup' ? 'Already have an account?' : 'New to Rasely?'}{' '}
          <button className="text-button" type="button" onClick={() => { clearFeedback(); setMode(mode === 'signup' ? 'signin' : 'signup'); }}>
            {mode === 'signup' ? 'Sign in' : 'Create an account'}
          </button>
        </p>
        <p className="auth-footnote">By continuing, you agree to use Rasely respectfully and keep your account secure.</p>
      </motion.section>
    </main>
  );
}

function GoogleIcon() {
  return <svg className="google-icon" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.8 6.1-15Z"/><path fill="#FF3D00" d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.6-5.1c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8v5.3A20 20 0 0 0 24 44Z"/><path fill="#4CAF50" d="M12.6 27.6a12 12 0 0 1 0-7.2v-5.3H5.8a20 20 0 0 0 0 17.8l6.8-5.3Z"/><path fill="#1976D2" d="M24 12c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 6.1 29.5 4 24 4A20 20 0 0 0 5.8 15.1l6.8 5.3C14.2 15.6 18.7 12 24 12Z"/></svg>;
}
