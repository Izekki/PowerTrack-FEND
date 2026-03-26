import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableWidget = ({ id, children, isEditMode, widgetType }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ 
        id,
        disabled: !isEditMode 
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
    zIndex: isDragging ? 999 : 'auto',
    position: 'relative',
    touchAction: 'none',
    height: '100%',
    boxShadow: isDragging 
      ? '0 15px 35px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 123, 255, 0.4)' 
      : 'none',
    scale: isDragging ? 1.05 : 1,
    filter: isDragging ? 'brightness(1.1)' : 'brightness(1)',
  };

  const gridSpanClass = widgetType.startsWith('kpi_') ? 'span-1' : 'span-full';

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className={`sortable-item ${gridSpanClass} ${isEditMode ? 'editable' : ''} ${isDragging ? 'dragging' : ''}`}
    >
      {children}
    </div>
  );
};

export default SortableWidget;