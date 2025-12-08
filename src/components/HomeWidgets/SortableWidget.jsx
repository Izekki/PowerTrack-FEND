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
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1, 
    zIndex: isDragging ? 999 : 'auto',
    position: 'relative',
    touchAction: 'none'
  };

  const gridSpanClass = widgetType.startsWith('kpi_') ? 'span-1' : 'span-full';

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className={`sortable-item ${gridSpanClass} ${isEditMode ? 'editable' : ''}`}
    >
      {children}
    </div>
  );
};

export default SortableWidget;