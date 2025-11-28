import { useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import '../styles/GroupContainer.css';

function GroupContainer({ id, children, groupData, isSelected, onSelect, onDelete }) {
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id,
  });
  
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id,
    data: {
      type: 'group',
    },
  });
  
  // 두 ref를 결합
  const setNodeRef = (node) => {
    setDroppableRef(node);
    setSortableRef(node);
  };
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSelect = (e) => {
    e.stopPropagation();
    // 드래그 핸들을 클릭한 경우는 선택하지 않음
    if (e.target.closest('.group-drag-handle')) {
      return;
    }
    if (onSelect) {
      onSelect(id);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(id);
    }
  };

  const displayName = groupData?.name || `Group ${id.split('-')[1]}`;
  const displaySize = groupData?.size || '';
  
  // 비율을 유지하면서 적절한 크기로 스케일링 (0.3배)
  const scale = 0.3;
  const scaledWidth = groupData?.widthPx ? groupData.widthPx * scale : undefined;
  const scaledHeight = groupData?.heightPx ? groupData.heightPx * scale : undefined;
  
  const containerStyle = {
    width: scaledWidth ? `${scaledWidth}px` : undefined,
    minHeight: scaledHeight ? `${scaledHeight}px` : undefined,
  };

  return (
    <div 
      className={`group-container ${isOver ? 'drag-over' : ''} ${isDragging ? 'dragging' : ''} ${isSelected ? 'selected' : ''}`} 
      ref={setNodeRef}
      style={{ ...containerStyle, ...style }}
      onClick={handleSelect}
    >
      <div className="group-inner">
        <div className="group-header">
          <button 
            className="group-drag-handle" 
            title="그룹 드래그"
            {...attributes}
            {...listeners}
          >
            ⋮⋮
          </button>
          <h3>
            {displayName}
            {displaySize && <span className="group-size"> ({displaySize})</span>}
          </h3>
          {onDelete && (
            <button className="group-delete" onClick={handleDelete} title="그룹 삭제">
              ×
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}

export default GroupContainer;

