import '../styles/RightNavigation.css';

function RightNavigation({ onAddText, onAddDivider }) {
  return (
    <aside className="right-sidebar">
      <div className="text-section">
        <h3 className="section-title">텍스트 생성</h3>
        <button
          className="text-button"
          onClick={() => onAddText && onAddText()}
        >
          <span className="button-title">텍스트 박스</span>
        </button>
      </div>

      <div className="divider-section">
        <h3 className="section-title">구분선 생성</h3>
        <button
          className="divider-button"
          onClick={() => onAddDivider && onAddDivider()}
        >
          <span className="button-title">구분선</span>
        </button>
      </div>
    </aside>
  );
}

export default RightNavigation;



