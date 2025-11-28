import { FRAME_SIZES } from '../data/printSizes';
import '../styles/FrameTabs.css';

function FrameTabs({ frames, selectedFrameId, onSelectFrame, onRemoveFrame }) {
  if (frames.length === 0) {
    return null;
  }

  return (
    <div className="frame-tabs">
      {frames.map((frame) => (
        <div
          key={frame.id}
          className={`frame-tab ${selectedFrameId === frame.id ? 'active' : ''}`}
          onClick={() => onSelectFrame(frame.id)}
        >
          <span className="frame-tab-name">{frame.name}</span>
          <span className="frame-tab-size">{FRAME_SIZES[frame.size].size}</span>
          <button
            className="frame-tab-close"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveFrame(frame.id);
            }}
            title="프레임 삭제"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

export default FrameTabs;

