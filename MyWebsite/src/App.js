import './App.css';
import Main from './components/Main';
import Header from './components/Header';
import Footer from './components/Footer';
import SpotifyCallback from './components/SpotifyCallback';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/callback" element={<SpotifyCallback />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
