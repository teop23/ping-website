import { Route, Routes } from 'react-router-dom';
import Background from './components/Background';
import Navbar from './components/Navbar';
import CreateTraits from './pages/CreateTraits';
import Community from './pages/Community';
import WatermarkTool from './pages/WatermarkTool';
import Docs from './pages/Docs';
import Home from './pages/Home';

function App() {
  return (
    <>
      <Background />
      <Navbar className="flex-shrink-0" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/community" element={<Community />} />
        <Route path="/create-traits" element={<CreateTraits />} />
        <Route path="/watermark" element={<WatermarkTool />} />
        <Route path="/docs" element={<Docs />} />
      </Routes>
    </>
  );
}

export default App;