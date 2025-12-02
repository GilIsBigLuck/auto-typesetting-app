import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { FRAME_SIZES, PRINT_SIZES } from '../data/printSizes';
import { mmToPxRounded } from '../utils/unitConverter';
import '../styles/MainContainer.css';
import GroupContainer from './GroupContainer';
import CardContainer from './CardContainer';

// createSnapModifier 함수 (예제 코드 방식)
function createSnapModifier(gridSize) {
  return ({ transform }) => {
    return {
      ...transform,
      x: Math.round(transform.x / gridSize) * gridSize,
      y: Math.round(transform.y / gridSize) * gridSize,
    };
  };
}

function MainContainer({ onAddGroup, onAddCard }) {
  const [groups, setGroups] = useState([]);
  const [items, setItems] = useState({});
  const [groupData, setGroupData] = useState({}); // 판형의 타입 정보 저장
  const [cardData, setCardData] = useState({}); // 컨텐츠의 타입 정보 저장

  const [activeId, setActiveId] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [nextGroupId, setNextGroupId] = useState(1);
  const [nextCardId, setNextCardId] = useState(1);
  const gridSizeMm = 100; // 그리드 크기 (mm)
  const gridSize = mmToPxRounded(gridSizeMm); // 그리드 크기 (픽셀)
  
  // Snap to Grid modifier 생성 (예제 코드 방식)
  const snapToGrid = useMemo(() => createSnapModifier(gridSize), [gridSize]);
  
  // 함수 참조를 위한 ref
  const handleAddGroupRef = useRef(null);
  const handleAddCardRef = useRef(null);
  
  // ID 추적을 위한 ref
  const nextGroupIdRef = useRef(1);
  const nextCardIdRef = useRef(1);
  const selectedGroupIdRef = useRef(null);
  
  // 중복 생성 방지 플래그
  const isAddingGroupRef = useRef(false);
  const isAddingCardRef = useRef(false);
  
  // ref와 state 동기화
  useEffect(() => {
    nextGroupIdRef.current = nextGroupId;
  }, [nextGroupId]);
  
  useEffect(() => {
    nextCardIdRef.current = nextCardId;
  }, [nextCardId]);
  
  useEffect(() => {
    selectedGroupIdRef.current = selectedGroupId;
  }, [selectedGroupId]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event) {
    setActiveId(event.active.id);
  }
  
  function handleGroupDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }
    
    setGroups((items) => {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  }

  function handleDragOver(event) {
    // handleDragOver는 시각적 피드백만 제공
    // 실제 이동은 handleDragEnd에서 처리
    // 상태 업데이트를 제거하여 중복 생성 방지
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) {
      setActiveId(null);
      return;
    }
    
    // 판형 드래그인지 확인
    const activeData = event.active.data.current;
    if (activeData?.type === 'group') {
      handleGroupDragEnd(event);
      setActiveId(null);
      return;
    }

    setItems((prev) => {
      const activeContainer = findContainer(active.id, prev);
      const overContainer = findContainer(over.id, prev);

      if (!activeContainer || !overContainer) {
        setActiveId(null);
        return prev;
      }

      const activeIndex = prev[activeContainer].indexOf(active.id);
      const overIndex = prev[overContainer].indexOf(over.id);

      if (activeContainer === overContainer) {
        if (activeIndex !== overIndex) {
          return {
            ...prev,
            [overContainer]: arrayMove(prev[overContainer], activeIndex, overIndex),
          };
        }
        return prev;
      }

      // 다른 컨테이너로 이동
      // 이미 activeContainer에서 제거되었는지 확인
      const filteredActive = prev[activeContainer].filter((item) => item !== active.id);
      const targetOver = prev[overContainer] || [];
      
      // 중복 방지: 이미 overContainer에 있는지 확인
      if (targetOver.includes(active.id)) {
        return prev;
      }
      
      return {
        ...prev,
        [activeContainer]: filteredActive,
        [overContainer]: [
          ...targetOver.slice(0, overIndex >= 0 ? overIndex : targetOver.length),
          active.id,
          ...targetOver.slice(overIndex >= 0 ? overIndex : targetOver.length),
        ],
      };
    });

    setActiveId(null);
  }

  function findContainer(id, itemsState = items) {
    if (id in itemsState) {
      return id;
    }
    return Object.keys(itemsState).find((key) => itemsState[key].includes(id));
  }

  const handleAddGroup = useCallback((type = 'korean8') => {
    // 중복 실행 방지
    if (isAddingGroupRef.current) {
      return;
    }
    isAddingGroupRef.current = true;
    
    const frameSize = FRAME_SIZES[type] || FRAME_SIZES.korean8;
    const currentId = nextGroupIdRef.current;
    const newGroupId = `group-${currentId}`;
    
    setGroups((prev) => {
      // 이미 존재하는지 확인
      if (prev.includes(newGroupId)) {
        isAddingGroupRef.current = false;
        return prev;
      }
      isAddingGroupRef.current = false;
      // 새로 생성된 판형을 선택
      setSelectedGroupId(newGroupId);
      return [...prev, newGroupId];
    });
    setItems((prevItems) => ({
      ...prevItems,
      [newGroupId]: [],
    }));
    setGroupData((prevData) => ({
      ...prevData,
      [newGroupId]: {
        type,
        ...frameSize,
      },
    }));
    setNextGroupId((prev) => {
      nextGroupIdRef.current = prev + 1;
      return prev + 1;
    });
  }, []);

  const handleAddCard = useCallback((type = 'businessCard1') => {
    // 중복 실행 방지
    if (isAddingCardRef.current) {
      return;
    }
    isAddingCardRef.current = true;
    
    const printSize = PRINT_SIZES[type] || PRINT_SIZES.businessCard1;
    
    setGroups((currentGroups) => {
      if (currentGroups.length === 0) {
        // 판형이 없으면 먼저 판형 생성
        const currentGroupId = nextGroupIdRef.current;
        const currentCardId = nextCardIdRef.current;
        const newGroupId = `group-${currentGroupId}`;
        const newCardId = `card-${currentCardId}`;
        
        setItems((prev) => ({
          ...prev,
          [newGroupId]: [newCardId],
        }));
        setGroupData((prev) => ({
          ...prev,
          [newGroupId]: {
            type: 'korean8',
            ...FRAME_SIZES.korean8,
          },
        }));
        setCardData((prev) => ({
          ...prev,
          [newCardId]: {
            type,
            ...printSize,
          },
        }));
        setNextGroupId((prev) => {
          nextGroupIdRef.current = prev + 1;
          return prev + 1;
        });
        setNextCardId((prev) => {
          nextCardIdRef.current = prev + 1;
          isAddingCardRef.current = false;
          return prev + 1;
        });
        // 새로 생성된 판형을 선택
        setSelectedGroupId(newGroupId);
        
        return [newGroupId];
      } else {
        // 선택된 판형 또는 첫 번째 판형에 컨텐츠 추가
        const currentSelectedGroupId = selectedGroupIdRef.current;
        const targetGroup = currentSelectedGroupId && currentGroups.includes(currentSelectedGroupId) 
          ? currentSelectedGroupId 
          : currentGroups[0];
        const currentCardId = nextCardIdRef.current;
        const newCardId = `card-${currentCardId}`;
        
        setItems((prev) => {
          // 이미 존재하는지 확인
          if (prev[targetGroup]?.includes(newCardId)) {
            isAddingCardRef.current = false;
            return prev;
          }
          isAddingCardRef.current = false;
          return {
            ...prev,
            [targetGroup]: [...(prev[targetGroup] || []), newCardId],
          };
        });
        setCardData((prev) => ({
          ...prev,
          [newCardId]: {
            type,
            ...printSize,
          },
        }));
        setNextCardId((prev) => {
          nextCardIdRef.current = prev + 1;
          return prev + 1;
        });
        
        return currentGroups;
      }
    });
  }, []);

  const handleSelectGroup = useCallback((groupId) => {
    setSelectedGroupId(groupId);
  }, []);

  const handleDeleteGroup = useCallback((groupId) => {
    setGroups((prev) => prev.filter((id) => id !== groupId));
    setItems((prev) => {
      const newItems = { ...prev };
      // 판형 내의 모든 컨텐츠 데이터도 삭제
      const cardIds = newItems[groupId] || [];
      setCardData((prevCardData) => {
        const newCardData = { ...prevCardData };
        cardIds.forEach((cardId) => {
          delete newCardData[cardId];
        });
        return newCardData;
      });
      delete newItems[groupId];
      return newItems;
    });
    setGroupData((prev) => {
      const newGroupData = { ...prev };
      delete newGroupData[groupId];
      return newGroupData;
    });
    // 삭제된 판형이 선택된 판형이면 선택 해제
    if (selectedGroupId === groupId) {
      setSelectedGroupId(null);
    }
  }, [selectedGroupId]);

  const handleDeleteCard = useCallback((cardId) => {
    setItems((prev) => {
      const newItems = { ...prev };
      Object.keys(newItems).forEach((groupId) => {
        newItems[groupId] = newItems[groupId].filter((id) => id !== cardId);
      });
      return newItems;
    });
    setCardData((prev) => {
      const newCardData = { ...prev };
      delete newCardData[cardId];
      return newCardData;
    });
  }, []);

  // ref에 함수 저장
  useEffect(() => {
    handleAddGroupRef.current = handleAddGroup;
  }, [handleAddGroup]);
  
  useEffect(() => {
    handleAddCardRef.current = handleAddCard;
  }, [handleAddCard]);
  
  // Navigation에 전달할 핸들러들을 부모 컴포넌트에 노출
  useEffect(() => {
    if (onAddGroup && typeof onAddGroup === 'object' && 'current' in onAddGroup) {
      onAddGroup.current = (type) => {
        if (handleAddGroupRef.current) {
          handleAddGroupRef.current(type);
        }
      };
    }
  }, [onAddGroup]);
  
  useEffect(() => {
    if (onAddCard && typeof onAddCard === 'object' && 'current' in onAddCard) {
      onAddCard.current = (type) => {
        if (handleAddCardRef.current) {
          handleAddCardRef.current(type);
        }
      };
    }
  }, [onAddCard]);

  return (
    <main className="main-container">
      <div 
        className="main-content"
        style={{
          backgroundSize: `${gridSize}px ${gridSize}px`,
        }}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[snapToGrid]}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={groups} strategy={rectSortingStrategy}>
            <div className="groups-wrapper">
              {groups.length === 0 ? (
                <div className="empty-state">
                  <p>판형을 생성해주세요</p>
                </div>
              ) : (
                groups.map((groupId) => (
                  <GroupContainer
                    key={groupId}
                    id={groupId}
                    items={items[groupId] || []}
                    groupData={groupData[groupId]}
                    isSelected={selectedGroupId === groupId}
                    onSelect={handleSelectGroup}
                    onDelete={handleDeleteGroup}
                  >
                    <SortableContext items={items[groupId] || []} strategy={rectSortingStrategy}>
                      <div 
                        className="cards-grid"
                        style={{
                          width: groupData[groupId]?.widthPx ? `${groupData[groupId].widthPx}px` : '100%',
                          height: groupData[groupId]?.heightPx ? `${groupData[groupId].heightPx}px` : 'auto',
                        }}
                      >
                        {(items[groupId] || []).map((cardId) => (
                          <CardContainer
                            key={cardId}
                            id={cardId}
                            cardData={cardData[cardId]}
                            onDelete={handleDeleteCard}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </GroupContainer>
                ))
              )}
            </div>
          </SortableContext>
          <DragOverlay>
            {activeId ? (
              groups.includes(activeId) ? (
                <GroupContainer 
                  key={activeId}
                  id={activeId} 
                  groupData={groupData[activeId]} 
                  items={items[activeId] || []}
                />
              ) : (
                <CardContainer key={activeId} id={activeId} cardData={cardData[activeId]} isDragging />
              )
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </main>
  );
}

export default MainContainer;

