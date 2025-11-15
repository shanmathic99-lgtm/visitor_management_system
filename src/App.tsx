import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import VisitorTypePage from './pages/VisitorTypePage';
import VisitorFormPage from './pages/VisitorFormPage';
import PassPage from './pages/PassPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <header className="header">
          <h1>Visitor Management System</h1>
        </header>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/category" element={<CategoryPage />} />
            <Route path="/visitor-type" element={<VisitorTypePage />} />
            <Route path="/visitor-form" element={<VisitorFormPage />} />
            <Route path="/pass" element={<PassPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
