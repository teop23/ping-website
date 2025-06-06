import React from 'react';
import Navbar from './components/Navbar';
import Background from './components/Background';
import Home from './pages/Home';
import CreateTraits from './pages/CreateTraits';

function App() {
  const path = window.location.pathname;

  return (
    <div className="h-screen bg-gradient-to-br from-white to-white text-foreground flex flex-col">
      <Background />
      <Navbar className="h-16" />
      <main className="flex-grow">
        {path === '/' && <Home />}
        {path === '/create-traits' && <CreateTraits />}
      </main>
    </div>
  );
}

export default App;