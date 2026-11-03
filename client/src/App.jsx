import { motion } from 'framer-motion';
import { firebaseReady } from './firebase';

const features = [
  'Profile management',
  'Real-time messaging',
  'Group chat rooms',
  'Media sharing',
  'Notifications',
  'Privacy controls',
];

const steps = [
  'Create a Firebase project',
  'Add your web app config to a .env file',
  'Enable Authentication and Firestore',
  'Build the features one by one',
];

export default function App() {
  return (
    <div className="app-shell">
      <motion.header
        className="hero"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="hero-copy">
          <span className="eyebrow">Rasely MVP</span>
          <h1>Build a social-messenger hybrid with Firebase.</h1>
          <p>
            This starter gives you a clean React app and Firebase wiring so you can
            focus on the actual product features.
          </p>
          <div className="status-pill">
            <span className={`status-dot ${firebaseReady ? 'ready' : 'pending'}`} />
            {firebaseReady ? 'Firebase config detected' : 'Waiting for Firebase config'}
          </div>
        </div>
      </motion.header>

      <main className="content-grid">
        <section className="panel">
          <h2>Current status</h2>
          <ul>
            <li>React app scaffold: ready</li>
            <li>Firebase integration: connected via env vars</li>
            <li>Project structure: ready for MVP features</li>
            <li>Authentication: not yet implemented</li>
          </ul>
        </section>

        <section className="panel">
          <h2>Planned core features</h2>
          <div className="feature-list">
            {features.map((feature) => (
              <span key={feature} className="feature-chip">{feature}</span>
            ))}
          </div>
        </section>

        <section className="panel wide-panel">
          <h2>Next steps</h2>
          <ol>
            {steps.map((step, index) => (
              <li key={step}>
                <strong>{index + 1}.</strong> {step}
              </li>
            ))}
          </ol>
        </section>
      </main>
    </div>
  );
}
