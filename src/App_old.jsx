import { useState, useRef } from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import Navigation from './components/Navigation';
import FrameTabs from './components/FrameTabs';
import { GRID_COLS, GRID_ROW_HEIGHT, BOX_SIZES, FRAME_SIZES, HORIZONTAL_SPACING_PX, VERTICAL_SPACING_PX } from './data/printSizes';
import './App.css';

function App() {
  const [frames, setFrames] = useState([]); // 프레임 배열
  const [selectedFrameId, setSelectedFrameId] = useState(null); // 선택된 프레임 ID
  const frameCounter = useRef(0);
  const widgetCounter = useRef(0);

  // 현재 선택된 프레임의 레이아웃과 위젯 가져오기
  const currentFrame = frames.find(f => f.id === selectedFrameId);
  const layout = currentFrame?.layout || [];
  const widgets = currentFrame?.widgets || [];

  const handleLayoutChange = (newLayout) => {
    if (!selectedFrameId) return;
    setFrames(frames.map(frame => 
      frame.id === selectedFrameId 
        ? { ...frame, layout: newLayout }
        : frame
    ));
  };

  // 프레임 생성
  const addFrame = (frameSize) => {
    const id = `frame-${++frameCounter.current}`;
    const sizeConfig = FRAME_SIZES[frameSize];
    
    const newFrame = {
      id,
      size: frameSize,
      name: `${sizeConfig.name} ${frameCounter.current}`,
      width: sizeConfig.w,
      height: sizeConfig.h,
      layout: [],
      widgets: [],
    };
    
    setFrames([...frames, newFrame]);
    setSelectedFrameId(id); // 새 프레임을 자동으로 선택
  };

  // 프레임 삭제
  const removeFrame = (frameId) => {
    const newFrames = frames.filter(f => f.id !== frameId);
    setFrames(newFrames);
    
    // 삭제된 프레임이 선택되어 있었다면 선택 해제
    if (selectedFrameId === frameId) {
      setSelectedFrameId(newFrames.length > 0 ? newFrames[0].id : null);
    }
  };

  const addWidget = (size) => {
    // 선택된 프레임이 없으면 alert 표시
    if (!selectedFrameId) {
      alert('프레임을 먼저 생성하고 선택해주세요.');
      return;
    }
    const id = `widget-${++widgetCounter.current}`;
    const sizeConfig = BOX_SIZES[size];
    const currentFrame = frames.find(f => f.id === selectedFrameId);
    const frameLayout = currentFrame?.layout || [];
    const frameWidgets = currentFrame?.widgets || [];
    const frameWidth = currentFrame?.width || GRID_COLS;
    
    // 요소가 없으면 좌측 상단(0, 0)에 배치
    if (frameLayout.length === 0) {
      const newLayoutItem = {
        i: id,
        x: 0,
        y: 0,
        ...sizeConfig,
      };
      
      setFrames(frames.map(frame =>
        frame.id === selectedFrameId
          ? {
              ...frame,
              layout: [newLayoutItem],
              widgets: [{
                id,
                size,
                title: BOX_SIZES[size].name,
              }],
            }
          : frame
      ));
      return;
    }

    // 새 아이템을 좌측 상단에 배치
    const newLayoutItem = {
      i: id,
      x: 0,
      y: 0,
      ...sizeConfig,
    };
    
    setFrames(frames.map(frame =>
      frame.id === selectedFrameId
        ? {
            ...frame,
            layout: [...frameLayout, newLayoutItem],
            widgets: [
              ...frameWidgets,
              {
                id,
                size,
                title: BOX_SIZES[size].name,
              },
            ],
          }
        : frame
    ));
  };

  const removeWidget = (id) => {
    if (!selectedFrameId) return;
    
    const currentFrame = frames.find(f => f.id === selectedFrameId);
    if (!currentFrame) return;
    
    const newLayout = currentFrame.layout.filter(item => item.i !== id);
    const newWidgets = currentFrame.widgets.filter(widget => widget.id !== id);
    
    setFrames(frames.map(frame =>
      frame.id === selectedFrameId
        ? {
            ...frame,
            layout: newLayout,
            widgets: newWidgets,
          }
        : frame
    ));
  };

  const currentFrameWidth = currentFrame?.width || GRID_COLS;
  const currentFrameHeight = currentFrame?.height || Math.round(FRAME_SIZES.medium.heightPx);

  return (
    <div className="app">
      <header className="header">
        <FrameTabs
          frames={frames}
          selectedFrameId={selectedFrameId}
          onSelectFrame={setSelectedFrameId}
          onRemoveFrame={removeFrame}
        />
      </header>
      <main className="app-main">
        <Navigation 
          onAddWidget={addWidget}
          onAddFrame={addFrame}
        />
        <div className="grid-container">
          {selectedFrameId ? (
            <div 
              className="frame-wrapper"
              style={{
                width: `${currentFrameWidth}px`,
                height: `${currentFrameHeight}px`,
                ['--horizontal-spacing']: `${HORIZONTAL_SPACING_PX.default}px`,
                ['--vertical-spacing']: `${VERTICAL_SPACING_PX.default}px`,
              }}
            >
              <GridLayout
                className="layout"
                layout={layout}
                verticalCompact={true}
                onLayoutChange={handleLayoutChange}
                cols={currentFrameWidth}
                rowHeight={GRID_ROW_HEIGHT}
                width={currentFrameWidth}
                margin={[0, 0]}
                containerPadding={[0, 0]}
                isDraggable={true}
                isResizable={false}
              >
                {widgets.map((widget) => (
                  <div key={widget.id} className="widget">
                    <div className="drag-handle">
                      {widget.title}
                      <button 
                        className="widget-close"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeWidget(widget.id);
                        }}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                        }}
                        title="삭제"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </GridLayout>
            </div>
          ) : (
            <div className="no-frame-message">
              <p>프레임을 생성하고 선택해주세요.</p>
            </div>
          )}
        </div>

        <footer className="footer">
          <div className="copyright">
            <p>© 2025 Created with passion by Good Gil. ☕</p>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;

