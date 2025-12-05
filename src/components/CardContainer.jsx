import { useSortable } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useState, useEffect } from 'react';
import '../styles/CardContainer.css';

function CardContainer({ id, cardData, onDelete, onDropImage, isSelected, onClick, onRotate, onUpdateCardData }) {
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);
  const [marginLeft, setMarginLeft] = useState(cardData?.marginLeft ?? 0);
  const [marginRight, setMarginRight] = useState(cardData?.marginRight ?? 0);

  // Ctrl 키 상태 추적
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Control') {
        setIsCtrlPressed(true);
      }
    };
    const handleKeyUp = (e) => {
      if (e.key === 'Control') {
        setIsCtrlPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: id,
    data: {
      type: 'card',
    },
  });

  // Ctrl 키가 눌려있을 때는 드래그 리스너 비활성화
  const dragListeners = isCtrlPressed ? {} : listeners;

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `card-drop-${id}`,
    data: {
      type: 'card-drop',
    },
  });

  // 두 ref를 결합
  const setNodeRef = (node) => {
    setSortableRef(node);
    setDroppableRef(node);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(id);
    }
  };

  const handleRotate = (e) => {
    e.stopPropagation();
    if (onRotate) {
      onRotate(id);
    }
  };

  // 구분선 마진값 업데이트
  useEffect(() => {
    setMarginLeft(cardData?.marginLeft ?? 0);
    setMarginRight(cardData?.marginRight ?? 0);
  }, [cardData?.marginLeft, cardData?.marginRight]);

  const handleMarginLeftChange = (e) => {
    e.stopPropagation();
    const value = e.target.value.replace(/[^0-9-]/g, '');
    const numValue = value === '' ? 0 : parseInt(value) || 0;
    setMarginLeft(numValue);
    if (onUpdateCardData) {
      onUpdateCardData(id, { marginLeft: numValue });
    }
  };

  const handleMarginRightChange = (e) => {
    e.stopPropagation();
    const value = e.target.value.replace(/[^0-9-]/g, '');
    const numValue = value === '' ? 0 : parseInt(value) || 0;
    setMarginRight(numValue);
    if (onUpdateCardData) {
      onUpdateCardData(id, { marginRight: numValue });
    }
  };

  const handleClick = (e) => {
    // 드래그 리스너와 충돌하지 않도록 이벤트 전파 중지
    e.stopPropagation();
    if (onClick) {
      onClick(id, e);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0 && onDropImage) {
      onDropImage(id, imageFiles[0]);
    }
  };

  // 공식 문서 방식: position: relative + transform만 사용
  // flex-wrap으로 자동 줄바꿈 지원
  const cardStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    width: cardData?.widthPx ? `${cardData.widthPx}px` : undefined,
    height: cardData?.heightPx ? `${cardData.heightPx}px` : undefined,
    flexShrink: 0, // 크기 고정
    zIndex: isDragging ? 1000 : 1,
    boxSizing: 'border-box',
    overflow: 'visible', // 구분선 설정 UI가 보이도록
  };

  // 구분선이 가로인지 세로인지 판단
  const isHorizontal = cardData?.type === 'divider' && 
    cardData.widthPx && cardData.heightPx && 
    cardData.widthPx > cardData.heightPx;

  return (
    <div
      ref={setNodeRef}
      style={cardStyle}
      className={`card-container ${isDragging ? 'dragging' : ''} ${isOver ? 'drop-over' : ''} ${isSelected ? 'selected' : ''}`}
      {...attributes}
      {...dragListeners}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="card-inner" onClick={handleClick}>
        {cardData?.type === 'divider' && (
          <div 
            className={`card-divider-controls ${isHorizontal ? 'divider-horizontal' : 'divider-vertical'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <label className="card-margin-label">
              {isHorizontal ? '좌' : '상'}:
              <input
                type="text"
                className="card-margin-input"
                value={marginLeft}
                onChange={handleMarginLeftChange}
                placeholder="0"
              />
            </label>
            <label className="card-margin-label">
              {isHorizontal ? '우' : '하'}:
              <input
                type="text"
                className="card-margin-input"
                value={marginRight}
                onChange={handleMarginRightChange}
                placeholder="0"
              />
            </label>
            {onRotate && (
              <button className="card-rotate" onClick={handleRotate} title="가로/세로 회전">
                ↻
              </button>
            )}
            {onDelete && (
              <button className="card-delete" onClick={handleDelete} title="컨텐츠 삭제">
                ×
              </button>
            )}
          </div>
        )}
        {cardData?.type !== 'divider' && (
          <div className="card-header">
            <div className="card-header-buttons">
              {onRotate && (
                <button className="card-rotate" onClick={handleRotate} title="가로/세로 회전">
                  ↻
                </button>
              )}
              {onDelete && (
                <button className="card-delete" onClick={handleDelete} title="컨텐츠 삭제">
                  ×
                </button>
              )}
            </div>
          </div>
        )}
        <div className="card-content">
          {cardData?.type === 'text' && (
            <div className="card-text">
              {cardData.text || '텍스트'}
            </div>
          )}
          {cardData?.type === 'divider' && (
            <div 
              className="card-divider" 
              style={{
                marginLeft: `${cardData.marginLeft || 0}px`,
                marginRight: `${cardData.marginRight || 0}px`,
              }}
            />
          )}
          {cardData?.type !== 'text' && cardData?.type !== 'divider' && cardData?.imageUrl && (
            <img src={cardData.imageUrl} alt="Card Image" className="card-image" />
          )}
        </div>
      </div>
    </div>
  );
}

export default CardContainer;

