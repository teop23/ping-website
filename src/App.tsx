import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Background from './components/Background';
import Home from './pages/Home';
import CreateTraits from './pages/CreateTraits';

function App() {
  return (
    <div className="relative size-screen text-foreground flex flex-col">
      <Background />
      <Navbar className="h-16" />
      <main className="flex flex-col flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-traits" element={<CreateTraits />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;