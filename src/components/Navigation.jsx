import { FRAME_SIZES, PRINT_SIZES } from '../data/printSizes';
import '../styles/Navigation.css';

function Navigation({ onAddGroup, onAddCard }) {
  const frameSizes = [
    { key: 'small', size: FRAME_SIZES.small },
    { key: 'medium', size: FRAME_SIZES.medium },
    { key: 'large', size: FRAME_SIZES.large },
  ];

  const printSizes = [
    { key: 'small', size: PRINT_SIZES.small },
    { key: 'medium', size: PRINT_SIZES.medium },
    { key: 'large', size: PRINT_SIZES.large },
  ];

  return (
    <aside className="sidebar">
      <div className="frame-section">
        <h3 className="section-title">그룹 생성</h3>
        {frameSizes.map(({ key, size }) => (
          <button
            key={key}
            className={`frame-button frame-button-${key}`}
            onClick={() => onAddGroup(key)}
          >
            {size.name} ({size.size})
          </button>
        ))}
      </div>

      <div className="print-section">
        <h3 className="section-title">카드 생성</h3>
        {printSizes.map(({ key, size }) => (
          <button
            key={key}
            className={`box-button box-button-${key}`}
            onClick={() => onAddCard(key)}
          >
            {size.name} ({size.size})
          </button>
        ))}
      </div>
    </aside>
  );
}

export default Navigation;

