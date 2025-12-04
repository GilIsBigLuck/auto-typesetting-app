import { useSortable } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useRef } from 'react';
import '../styles/CardContainer.css';

function CardContainer({ id, cardData, onDelete, onDropImage }) {
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

  // 마지막으로 처리한 파일을 추적하여 중복 처리 방지
  const lastProcessedFileRef = useRef(null);
  const dragEnterTimeoutRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // 기존 타임아웃 클리어
    if (dragEnterTimeoutRef.current) {
      clearTimeout(dragEnterTimeoutRef.current);
    }
    
    // 드래그 중인 항목이 파일인지 확인
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      const item = e.dataTransfer.items[0];
      if (item.kind === 'file' && item.type.startsWith('image/')) {
        // 파일을 읽어서 처리 (약간의 지연을 두어 안정성 확보)
        dragEnterTimeoutRef.current = setTimeout(() => {
          const file = item.getAsFile();
          if (file && onDropImage) {
            // 같은 파일이면 처리하지 않음
            const fileKey = `${file.name}-${file.size}-${file.lastModified}`;
            if (lastProcessedFileRef.current !== fileKey) {
              lastProcessedFileRef.current = fileKey;
              onDropImage(id, file);
            }
          }
        }, 50);
      }
    }
  };

  const handleDragLeave = (e) => {
    // 타임아웃 클리어
    if (dragEnterTimeoutRef.current) {
      clearTimeout(dragEnterTimeoutRef.current);
      dragEnterTimeoutRef.current = null;
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // 드래그 오버에서는 파일 처리를 하지 않고, preventDefault만 수행
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0 && onDropImage) {
      // 첫 번째 이미지만 사용
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
    overflow: 'hidden',
  };

  return (
    <div
      ref={setNodeRef}
      style={cardStyle}
      className={`card-container ${isDragging ? 'dragging' : ''} ${isOver ? 'drop-over' : ''}`}
      {...attributes}
      {...listeners}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="card-inner">
        <div className="card-header">
          {onDelete && (
            <button className="card-delete" onClick={handleDelete} title="컨텐츠 삭제">
              ×
            </button>
          )}
        </div>
        <div className="card-content">
          {cardData?.imageUrl && (
            <img src={cardData.imageUrl} alt="Card Image" className="card-image" />
          )}
        </div>
      </div>
    </div>
  );
}

export default CardContainer;

