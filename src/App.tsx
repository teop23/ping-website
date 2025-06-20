import { Route, Routes } from 'react-router-dom';
import Background from './components/Background';
import Navbar from './components/Navbar';
import CreateTraits from './pages/CreateTraits';
import Community from './pages/Community';
import WatermarkTool from './pages/WatermarkTool';
import Home from './pages/Home';

function App() {
  return (
    <div className="relative h-screen text-foreground flex flex-col ">
      <Background />
      <Navbar className="h-16" />
      <main className="flex flex-col flex-grow">
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