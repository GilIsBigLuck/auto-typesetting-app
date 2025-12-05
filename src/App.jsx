import { useRef } from 'react';
import Navigation from './components/Navigation';
import RightNavigation from './components/RightNavigation';
import Header from './components/Header';
import MainContainer from './components/MainContainer';
import Footer from './components/Footer';
import './styles/App.css';

function App() {
  const addGroupRef = useRef(null);
  const addCardRef = useRef(null);
  const addTextRef = useRef(null);
  const addDividerRef = useRef(null);

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

  const handleAddText = () => {
    if (addTextRef.current) {
      addTextRef.current();
    }
  };

  const handleAddDivider = () => {
    if (addDividerRef.current) {
      addDividerRef.current();
    }
  };

  return (
    <div className="app">
      <Header />
      <Navigation onAddGroup={handleAddGroup} onAddCard={handleAddCard} />
      <RightNavigation onAddText={handleAddText} onAddDivider={handleAddDivider} />
      <MainContainer 
        onAddGroup={addGroupRef} 
        onAddCard={addCardRef}
        onAddText={addTextRef}
        onAddDivider={addDividerRef}
      />
      <Footer />
    </div>
  );
}

export default App;

