import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import '../styles/CardContainer.css';

function CardContainer({ id, cardImage, children, cardData, isDragging, onDelete }) {
  // id가 없으면 임시 id 사용 (DragOverlay용)
  const sortableId = id || 'drag-overlay-card';
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ 
    id: sortableId,
    disabled: !id, // id가 없으면 비활성화
  });

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(id);
    }
  };

  // 표시값: 이름에 표시될 크기 (displaySize)
  // 실제 크기: 실제로 적용될 크기 (widthPx, heightPx)
  const displayName = cardData?.name || (id ? `컨텐츠 ${id.split('-')[1]}` : '컨텐츠');
  const displaySize = cardData?.displaySize || cardData?.size || '';
  
  // 1px = 1mm이므로 실제 크기 그대로 사용
  const cardStyle = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
    opacity: isSortableDragging || isDragging ? 0.5 : 1,
    width: cardData?.widthPx ? `${cardData.widthPx}px` : undefined,
    height: cardData?.heightPx ? `${cardData.heightPx}px` : undefined,
    maxWidth: '100%',
    justifySelf: 'start',
  };

  return (
    <div
      ref={setNodeRef}
      style={cardStyle}
      className={`card-container ${isSortableDragging || isDragging ? 'dragging' : ''}`}
    >
      <div className="card-inner">
        <div className="card-header">
          <button className="card-drag-handle" {...attributes} {...listeners}>
            ⋮⋮
          </button>
          {onDelete && (
            <button className="card-delete" onClick={handleDelete} title="컨텐츠 삭제">
              ×
            </button>
          )}
        </div>
        <div className="card-content">
          {cardImage && <img src={cardImage} alt="Card Image" className="card-image" />}
          {/* <div className="card-name">{displayName}</div>
          {displaySize && <div className="card-size">{displaySize}</div>}
          {children} */}
        </div>
      </div>
    </div>
  );
}

export default CardContainer;

