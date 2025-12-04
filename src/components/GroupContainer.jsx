import { useState, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import '../styles/GroupContainer.css';

function GroupContainer({ id, children, groupData, isSelected, onSelect, onDelete, onUpdateGroupData, onExport }) {
  const [padding, setPadding] = useState(groupData?.padding ?? 4);
  const [gap, setGap] = useState(groupData?.gap ?? 4);
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

  // groupData가 변경되면 로컬 state 업데이트
  useEffect(() => {
    setPadding(groupData?.padding ?? 4);
    setGap(groupData?.gap ?? 4);
  }, [groupData]);

  const handlePaddingChange = (e) => {
    e.stopPropagation();
    const value = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 허용
    setPadding(value === '' ? '' : parseInt(value) || 0);
    if (onUpdateGroupData && value !== '') {
      onUpdateGroupData(id, { padding: parseInt(value) || 0 });
    }
  };

  const handleGapChange = (e) => {
    e.stopPropagation();
    const value = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 허용
    setGap(value === '' ? '' : parseInt(value) || 0);
    if (onUpdateGroupData && value !== '') {
      onUpdateGroupData(id, { gap: parseInt(value) || 0 });
    }
  };

  const handleExport = (e) => {
    e.stopPropagation();
    if (onExport) {
      onExport(id);
    }
  };

  const displayName = groupData?.name || `판형 ${id.split('-')[1]}`;
  const displaySize = groupData?.size || '';

  return (
    <div 
      className={`group-container ${isOver ? 'drag-over' : ''} ${isDragging ? 'dragging' : ''} ${isSelected ? 'selected' : ''}`} 
      ref={setNodeRef}
      style={style}
      onClick={handleSelect}
    >
      <div className="group-inner">
        <div className="group-header">
          <button 
            className="group-drag-handle" 
            title="판형 드래그"
            {...attributes}
            {...listeners}
          >
            ⋮⋮
          </button>
          <h3>
            {displayName}
            {displaySize && <span className="group-size"> ({displaySize})</span>}
          </h3>
          <div className="group-controls" onClick={(e) => e.stopPropagation()}>
            <label className="group-input-label">
              돈보:
              <input
                type="text"
                className="group-input"
                value={padding}
                onChange={handlePaddingChange}
                placeholder="4"
              />
            </label>
            <label className="group-input-label">
              간격:
              <input
                type="text"
                className="group-input"
                value={gap}
                onChange={handleGapChange}
                placeholder="4"
              />
            </label>
            <button className="group-export" onClick={handleExport} title="PDF 출력">
              PDF 출력
            </button>
            {onDelete && (
              <button className="group-delete" onClick={handleDelete} title="판형 삭제">
                ×
              </button>
            )}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

export default GroupContainer;

