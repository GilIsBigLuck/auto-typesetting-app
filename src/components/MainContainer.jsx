import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useDraggable } from '@dnd-kit/core';
import { FRAME_SIZES, PRINT_SIZES } from '../data/printSizes';
import { mmToPxRounded, pxToMm } from '../utils/unitConverter';
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

// CardsGrid DropZone 컴포넌트
function CardsGridDropZone({ groupId, children }) {
  const { setNodeRef } = useDroppable({
    id: groupId,
    data: {
      type: 'cards-grid',
    },
  });

  return <div ref={setNodeRef}>{children}</div>;
}

function MainContainer({ onAddGroup, onAddCard, onAddText, onAddDivider }) {
  const [groups, setGroups] = useState([]);
  const [items, setItems] = useState({});
  const [groupData, setGroupData] = useState({}); // 판형의 타입 정보 저장
  const [cardData, setCardData] = useState({}); // 컨텐츠의 타입 정보 저장

  const [activeId, setActiveId] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [selectedCardIds, setSelectedCardIds] = useState(new Set());
  const [nextGroupId, setNextGroupId] = useState(1);
  const [nextCardId, setNextCardId] = useState(1);
  const gridSizeMm = 10; // 그리드 크기 (mm) - 10mm 단위로 이동
  const gridSize = mmToPxRounded(gridSizeMm); // 그리드 크기 (픽셀)
  
  // Snap to Grid modifier 생성
  const snapToGrid = useMemo(() => createSnapModifier(gridSize), [gridSize]);
  
  // 함수 참조를 위한 ref
  const handleAddGroupRef = useRef(null);
  const handleAddCardRef = useRef(null);
  const handleAddTextRef = useRef(null);
  const handleAddDividerRef = useRef(null);
  
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

  // Ctrl+A로 현재 판형 내부의 모든 컨텐츠 선택/해제
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+A 또는 Cmd+A (Mac)
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        
        // 현재 선택된 판형이 있으면
        if (selectedGroupId && items[selectedGroupId]) {
          const allCardIds = items[selectedGroupId];
          const allSelected = allCardIds.length > 0 && 
            allCardIds.every(cardId => selectedCardIds.has(cardId));
          
          // 이미 모두 선택되어 있으면 전체 해제, 아니면 전체 선택
          if (allSelected) {
            setSelectedCardIds(new Set());
          } else {
            setSelectedCardIds(new Set(allCardIds));
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedGroupId, items, selectedCardIds]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 500,
        tolerance: 5,
      },
    }),
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
    
    // 판형 드래그인지 확인
    const activeData = event.active.data.current;
    if (activeData?.type === 'group') {
      if (over) {
        handleGroupDragEnd(event);
      }
      setActiveId(null);
      return;
    }

    // 컨텐츠 드래그인 경우 - useSortable이 자동으로 처리
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeContainer = findContainer(active.id, items);
    const overContainer = over.id.startsWith('group-') ? over.id : findContainer(over.id, items);
    
    if (!activeContainer || !overContainer) {
      setActiveId(null);
      return;
    }

    // 같은 그룹 내에서 순서 변경 - useSortable이 자동으로 처리
    if (activeContainer === overContainer) {
      const activeIndex = items[activeContainer].indexOf(active.id);
      const overIndex = items[overContainer].indexOf(over.id);
      
      if (activeIndex !== overIndex) {
        setItems((prev) => ({
          ...prev,
          [activeContainer]: arrayMove(prev[activeContainer], activeIndex, overIndex),
        }));
      }
    } else {
      // 다른 그룹으로 이동
      setItems((prev) => ({
        ...prev,
        [activeContainer]: prev[activeContainer].filter((item) => item !== active.id),
        [overContainer]: [...(prev[overContainer] || []), active.id],
      }));
    }

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
        // 새 카드 추가 완료
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
        // 새 카드 추가 완료
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

  const handleCardClick = useCallback((cardId, e) => {
    // 이벤트 전파 중지 (백그라운드 클릭 핸들러가 실행되지 않도록)
    e.stopPropagation();
    
    // Ctrl 키가 눌려있으면 다중선택
    if (e.ctrlKey) {
      setSelectedCardIds((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(cardId)) {
          newSet.delete(cardId);
        } else {
          newSet.add(cardId);
        }
        return newSet;
      });
    } else {
      // Ctrl 키가 없으면 단일선택 (기존 선택 해제)
      setSelectedCardIds((prev) => {
        if (prev.has(cardId) && prev.size === 1) {
          return new Set(); // 같은 카드를 다시 클릭하면 선택 해제
        }
        return new Set([cardId]);
      });
    }
  }, []);

  const handleBackgroundClick = useCallback(() => {
    // 백그라운드 클릭 시 다중선택 초기화
    setSelectedCardIds(new Set());
  }, []);

  const handleDropImage = useCallback((cardId, file) => {
    if (!file) return;
    
    // 선택된 카드가 있으면 모두에 적용, 없으면 현재 카드에만 적용
    const targetCardIds = selectedCardIds.size > 0 ? Array.from(selectedCardIds) : [cardId];
    
    // FileReader를 사용하여 이미지를 base64로 변환
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target.result;
      
      // 선택된 모든 카드에 이미지 추가
      setCardData((prev) => {
        const newCardData = { ...prev };
        targetCardIds.forEach((id) => {
          newCardData[id] = {
            ...newCardData[id],
            imageUrl,
          };
        });
        return newCardData;
      });
    };
    reader.onerror = () => {
      console.error('이미지 파일을 읽는 중 오류가 발생했습니다.');
    };
    reader.readAsDataURL(file);
  }, [selectedCardIds]);

  const handleRotateCard = useCallback((cardId) => {
    // 회전 버튼을 누르면 해당 카드만 선택하고 회전
    setSelectedCardIds(new Set([cardId]));
    
    // 해당 카드만 회전
    setCardData((prev) => {
      const newCardData = { ...prev };
      const card = newCardData[cardId];
      if (card && card.widthPx && card.heightPx) {
        // widthPx와 heightPx를 swap
        newCardData[cardId] = {
          ...card,
          widthPx: card.heightPx,
          heightPx: card.widthPx,
        };
      }
      return newCardData;
    });
  }, []);

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

  const handleUpdateGroupData = useCallback((groupId, updates) => {
    setGroupData((prev) => ({
      ...prev,
      [groupId]: {
        ...prev[groupId],
        ...updates,
      },
    }));
  }, []);

  const handleUpdateCardData = useCallback((cardId, updates) => {
    setCardData((prev) => ({
      ...prev,
      [cardId]: {
        ...prev[cardId],
        ...updates,
      },
    }));
  }, []);

  const handleExport = useCallback(async (groupId) => {
    // Electron의 기본 인쇄 기능 사용
    const gridElement = document.getElementById(`cards-grid-${groupId}`);
    if (!gridElement) {
      alert('출력할 판형을 찾을 수 없습니다.');
      return;
    }

    // 판형 크기 가져오기 (mm 단위, 1px = 1mm)
    const widthMm = groupData[groupId]?.widthPx || 210; // 기본 A4 너비
    const heightMm = groupData[groupId]?.heightPx || 297; // 기본 A4 높이

    // Electron 환경 확인
    if (window.electron && window.electron.printToPDF) {
      try {
        // 임시 인쇄용 윈도우 생성
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
          alert('팝업이 차단되어 인쇄할 수 없습니다.');
          return;
        }

        // 인쇄용 HTML 생성 (스타일 포함)
        const styles = Array.from(document.styleSheets)
          .map(sheet => {
            try {
              return Array.from(sheet.cssRules)
                .map(rule => rule.cssText)
                .join('\n');
            } catch (e) {
              return '';
            }
          })
          .join('\n');

        // HTML 요소의 모든 px 값을 mm로 변환하기 위한 함수
        const convertPxToMm = (html) => {
          // px 값을 mm로 변환 (1px = 1mm)
          return html.replace(/(\d+(?:\.\d+)?)px/g, (match, value) => {
            return `${value}mm`;
          });
        };

        const convertedHtml = convertPxToMm(gridElement.outerHTML);

        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                ${styles}
                @page {
                  size: ${widthMm}mm ${heightMm}mm;
                  margin: 0;
                }
                * {
                  box-sizing: border-box;
                }
                body {
                  margin: 0;
                  padding: 0;
                  width: ${widthMm}mm;
                  height: ${heightMm}mm;
                  overflow: hidden;
                  background: white;
                }
                .cards-grid {
                  width: ${widthMm}mm !important;
                  height: auto !important;
                  min-height: ${heightMm}mm !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  background-image: none !important;
                  border: none !important;
                }
                .card-header,
                .card-header-buttons,
                .card-divider-controls {
                  display: none !important;
                }
                .card-container {
                  border: none !important;
                }
                .card-container.selected {
                  border: none !important;
                  box-shadow: none !important;
                  outline: none !important;
                }
              </style>
            </head>
            <body>
              ${convertedHtml}
            </body>
          </html>
        `);
        printWindow.document.close();

        // PDF로 저장
        await new Promise(resolve => setTimeout(resolve, 500)); // 렌더링 대기
        
        const pdfData = await window.electron.printToPDF({
          pageSize: {
            width: widthMm / 25.4, // mm를 인치로 변환
            height: heightMm / 25.4,
          },
          printBackground: true,
          margins: {
            marginType: 'none',
          },
        });

        // Blob으로 변환하여 다운로드
        const blob = new Blob([pdfData], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `판형-${groupId}-${new Date().getTime()}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        
        printWindow.close();
      } catch (error) {
        console.error('PDF 생성 오류:', error);
        alert('PDF 생성 중 오류가 발생했습니다.');
      }
    } else {
      // 브라우저 환경에서는 기본 인쇄 사용
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('팝업이 차단되어 인쇄할 수 없습니다.');
        return;
      }

      // 브라우저 인쇄용 스타일 가져오기
      const styles = Array.from(document.styleSheets)
        .map(sheet => {
          try {
            return Array.from(sheet.cssRules)
              .map(rule => rule.cssText)
              .join('\n');
          } catch (e) {
            return '';
          }
        })
        .join('\n');

      // HTML 요소의 모든 px 값을 mm로 변환하기 위한 함수
      const convertPxToMm = (html) => {
        // px 값을 mm로 변환 (1px = 1mm)
        return html.replace(/(\d+(?:\.\d+)?)px/g, (match, value) => {
          return `${value}mm`;
        });
      };

      const convertedHtml = convertPxToMm(gridElement.outerHTML);

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              ${styles}
              @page {
                size: ${widthMm}mm ${heightMm}mm;
                margin: 0;
              }
              * {
                box-sizing: border-box;
              }
              body {
                margin: 0;
                padding: 0;
                width: ${widthMm}mm;
                height: ${heightMm}mm;
                background: white;
              }
              .cards-grid {
                width: ${widthMm}mm !important;
                height: auto !important;
                min-height: ${heightMm}mm !important;
                background-image: none !important;
                border: none !important;
              }
              .card-header,
              .card-header-buttons,
              .card-divider-controls {
                display: none !important;
              }
              .card-container {
                border: none !important;
              }
              .card-container.selected {
                border: none !important;
                box-shadow: none !important;
                outline: none !important;
              }
            </style>
          </head>
          <body>${convertedHtml}</body>
        </html>
      `);
      printWindow.document.close();

      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  }, [groupData]);

  const handleAddText = useCallback(() => {
    const currentGroups = groups;
    if (currentGroups.length === 0) {
      return;
    }
    
    const currentSelectedGroupId = selectedGroupIdRef.current;
    const targetGroup = currentSelectedGroupId && currentGroups.includes(currentSelectedGroupId) 
      ? currentSelectedGroupId 
      : currentGroups[0];
    const currentCardId = nextCardIdRef.current;
    const newCardId = `card-${currentCardId}`;
    
    setItems((prev) => ({
      ...prev,
      [targetGroup]: [...(prev[targetGroup] || []), newCardId],
    }));
    setCardData((prev) => ({
      ...prev,
      [newCardId]: {
        type: 'text',
        widthPx: 200,
        heightPx: 50,
        text: '텍스트',
      },
    }));
    setNextCardId((prev) => {
      nextCardIdRef.current = prev + 1;
      return prev + 1;
    });
  }, [groups]);

  const handleAddDivider = useCallback(() => {
    const currentGroups = groups;
    if (currentGroups.length === 0) {
      return;
    }
    
    const currentSelectedGroupId = selectedGroupIdRef.current;
    const targetGroup = currentSelectedGroupId && currentGroups.includes(currentSelectedGroupId) 
      ? currentSelectedGroupId 
      : currentGroups[0];
    const currentCardId = nextCardIdRef.current;
    const newCardId = `card-${currentCardId}`;
    
    // 구분선은 cards-grid의 100%를 채우므로 width를 100%로 설정
    const groupWidth = groupData[targetGroup]?.widthPx || 800;
    
    setItems((prev) => ({
      ...prev,
      [targetGroup]: [...(prev[targetGroup] || []), newCardId],
    }));
    setCardData((prev) => ({
      ...prev,
      [newCardId]: {
        type: 'divider',
        widthPx: groupWidth,
        heightPx: 2,
        marginLeft: 0,
        marginRight: 0,
      },
    }));
    setNextCardId((prev) => {
      nextCardIdRef.current = prev + 1;
      return prev + 1;
    });
  }, [groups, groupData]);

  // ref에 함수 저장
  useEffect(() => {
    handleAddGroupRef.current = handleAddGroup;
  }, [handleAddGroup]);
  
  useEffect(() => {
    handleAddCardRef.current = handleAddCard;
  }, [handleAddCard]);

  useEffect(() => {
    handleAddTextRef.current = handleAddText;
  }, [handleAddText]);

  useEffect(() => {
    handleAddDividerRef.current = handleAddDivider;
  }, [handleAddDivider]);
  
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

  useEffect(() => {
    if (onAddText && typeof onAddText === 'object' && 'current' in onAddText) {
      onAddText.current = () => {
        if (handleAddTextRef.current) {
          handleAddTextRef.current();
        }
      };
    }
  }, [onAddText]);

  useEffect(() => {
    if (onAddDivider && typeof onAddDivider === 'object' && 'current' in onAddDivider) {
      onAddDivider.current = () => {
        if (handleAddDividerRef.current) {
          handleAddDividerRef.current();
        }
      };
    }
  }, [onAddDivider]);

  return (
    <main className="main-container">
      <div 
        className="main-content"
        style={{
          backgroundSize: `${gridSize}px ${gridSize}px`,
        }}
        onClick={handleBackgroundClick}
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
                    onUpdateGroupData={handleUpdateGroupData}
                    onExport={handleExport}
                  >
                    <CardsGridDropZone groupId={groupId}>
                      <SortableContext 
                        items={items[groupId] || []} 
                        strategy={rectSortingStrategy}
                      >
                        <div 
                          className="cards-grid"
                          id={`cards-grid-${groupId}`}
                          style={{
                            width: groupData[groupId]?.widthPx ? `${groupData[groupId].widthPx}px` : '100%',
                            height: groupData[groupId]?.heightPx ? `${groupData[groupId].heightPx}px` : 'auto',
                            gap: `${groupData[groupId]?.gap ?? 4}px`,
                          }}
                        >
                          {(items[groupId] || []).map((cardId) => (
                            <CardContainer
                              key={cardId}
                              id={cardId}
                              cardData={cardData[cardId]}
                              padding={groupData[groupId]?.padding ?? 4}
                              isSelected={selectedCardIds.has(cardId)}
                              onDelete={handleDeleteCard}
                              onClick={handleCardClick}
                              onRotate={handleRotateCard}
                              onUpdateCardData={handleUpdateCardData}
                              onDropImage={handleDropImage}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </CardsGridDropZone>
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
                <CardContainer 
                  key={activeId} 
                  id={activeId} 
                  cardData={cardData[activeId]} 
                />
              )
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </main>
  );
}

export default MainContainer;

