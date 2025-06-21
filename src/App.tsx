import { Route, Routes } from 'react-router-dom';
import Background from './components/Background';
import Navbar from './components/Navbar';
import CreateTraits from './pages/CreateTraits';
import Community from './pages/Community';
import WatermarkTool from './pages/WatermarkTool';
import Home from './pages/Home';

function App() {
  return (
    <div className="h-screen text-foreground flex flex-col">
      <Background />
      <Navbar className="flex-shrink-0" />
      <main className="flex-1 min-h-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/community" element={<Community />} />
          <Route path="/create-traits" element={<CreateTraits />} />
          <Route path="/watermark" element={<WatermarkTool />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;