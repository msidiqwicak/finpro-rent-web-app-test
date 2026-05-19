import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* TODO: Add more routes here for login, register, tenant, etc. */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
