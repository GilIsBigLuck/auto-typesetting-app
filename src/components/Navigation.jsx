import { FRAME_SIZES, PRINT_SIZES } from '../data/printSizes';
import '../styles/Navigation.css';

function Navigation({ onAddGroup, onAddCard }) {
  const frameSizes = [
    { key: 'size2', size: FRAME_SIZES.size2 },
    { key: 'korean2', size: FRAME_SIZES.korean2 },
    { key: 'korean4', size: FRAME_SIZES.korean4 },
    { key: 'korean8', size: FRAME_SIZES.korean8 },
  ];

  const printSizes = [
    { key: 'businessCard1', size: PRINT_SIZES.businessCard1 },
    { key: 'businessCard2', size: PRINT_SIZES.businessCard2 },
    { key: 'giftCard', size: PRINT_SIZES.giftCard },
    { key: 'leaflet1', size: PRINT_SIZES.leaflet1 },
    { key: 'leaflet2', size: PRINT_SIZES.leaflet2 },
    { key: 'sticker', size: PRINT_SIZES.sticker },
  ];

  return (
    <aside className="sidebar">
      <div className="frame-section">
        <h3 className="section-title">판형 생성</h3>
        {frameSizes.map(({ key, size }) => (
          <button
            key={key}
            className={`frame-button frame-button-${key}`}
            onClick={() => onAddGroup(key)}
          >
            <span className="button-title">{size.name}</span>
            <span className="button-size">({size.size})</span>
          </button>
        ))}
      </div>

      <div className="print-section">
        <h3 className="section-title">컨텐츠 생성</h3>
        {printSizes.map(({ key, size }) => (
          <button
            key={key}
            className={`box-button box-button-${key}`}
            onClick={() => onAddCard(key)}
          >
            <span className="button-title">{size.name}</span>
            <span className="button-size">({size.displaySize || size.size})</span>
          </button>
        ))}
      </div>
    </aside>
  );
}

export default Navigation;

