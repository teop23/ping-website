import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ParticleBackground from './components/ParticleBackground';
import Home from './pages/Home';
import CreateTraits from './pages/CreateTraits';

function App() {
  const path = window.location.pathname;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ParticleBackground />
      <Navbar />
      <main className="flex-grow">
        {path === '/' && <Home />}
        {path === '/create-traits' && <CreateTraits />}
      </main>
      <Footer />
    </div>
  );
}

export default App;