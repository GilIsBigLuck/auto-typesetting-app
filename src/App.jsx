import { useRef } from 'react';
import Navigation from './components/Navigation';
import Header from './components/Header';
import MainContainer from './components/MainContainer';
import Footer from './components/Footer';
import './styles/App.css';

function App() {
  const addGroupRef = useRef(null);
  const addCardRef = useRef(null);

  const handleAddGroup = (type) => {
    if (addGroupRef.current) {
      addGroupRef.current(type);
    }
  };

  const handleAddCard = (type) => {
    if (addCardRef.current) {
      addCardRef.current(type);
    }
  };

  return (
    <div className="app">
      <Header />
      <Navigation onAddGroup={handleAddGroup} onAddCard={handleAddCard} />
      <MainContainer onAddGroup={addGroupRef} onAddCard={addCardRef} />
      <Footer />
    </div>
  );
}

export default App;

