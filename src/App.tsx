import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Background from './components/Background';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Home from './pages/Home';

/**
 * Home stays eager: it is what almost everyone arriving from a launchpad
 * listing sees, and it should paint without waiting on a second request.
 *
 * Everything else is split off. The trait editor and the watermark tool pull in
 * fabric.js, which is the single heaviest dependency here and was previously
 * downloaded by every visitor to the landing page whether or not they ever
 * opened a tool.
 */
const Community = lazy(() => import('./pages/Community'));
const CreateTraits = lazy(() => import('./pages/CreateTraits'));
const WatermarkTool = lazy(() => import('./pages/WatermarkTool'));
const Docs = lazy(() => import('./pages/Docs'));

/** Quiet, and matching the builder's own loading state rather than a spinner. */
const RouteFallback: React.FC = () => (
  <div role="status" aria-live="polite" className="container flex min-h-[60vh] items-center">
    <span className="flex items-center gap-3 text-meta text-ink-muted">
      <span
        aria-hidden="true"
        className="size-1.5 rounded-pill bg-brand motion-safe:animate-pulse-live"
      />
      Loading
    </span>
  </div>
);

function App() {
  return (
    <>
      <Background />
      <Navbar className="flex-shrink-0" />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/community" element={<Community />} />
          <Route path="/create-traits" element={<CreateTraits />} />
          <Route path="/watermark" element={<WatermarkTool />} />
          <Route path="/docs" element={<Docs />} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  );
}

export default App;
