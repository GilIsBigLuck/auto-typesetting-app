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

  const displayName = cardData?.name || (id ? `Card ${id.split('-')[1]}` : 'Card');
  const displaySize = cardData?.size || '';
  
  // 비율을 유지하면서 적절한 크기로 스케일링 (0.3배)
  const scale = 0.3;
  const scaledWidth = cardData?.widthPx ? cardData.widthPx * scale : undefined;
  const scaledHeight = cardData?.heightPx ? cardData.heightPx * scale : undefined;
  
  const cardStyle = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
    opacity: isSortableDragging || isDragging ? 0.5 : 1,
    width: scaledWidth ? `${scaledWidth}px` : undefined,
    height: scaledHeight ? `${scaledHeight}px` : undefined,
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
            <button className="card-delete" onClick={handleDelete} title="카드 삭제">
              ×
            </button>
          )}
        </div>
        <div className="card-content">
          {cardImage && <img src={cardImage} alt="Card Image" className="card-image" />}
          <div className="card-name">{displayName}</div>
          {displaySize && <div className="card-size">{displaySize}</div>}
          {children}
        </div>
      </div>
    </div>
  );
}

export default CardContainer;

