import { ReactNode } from "react";

interface DraggableItemProps {
  id: string;
  index: number;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
  children: ReactNode;
}

export function DraggableItem({
  id,
  index,
  onDragStart,
  onDragOver,
  onDragEnd,
  children,
}: DraggableItemProps) {
  return (
    <div
      id={id}
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(e, index);
      }}
      onDragEnd={onDragEnd}
      data-position={index}
      className="cursor-move"
    >
      {children}
    </div>
  );
}
