'use client';

import { ListWithCards } from '@/type';
import { ListHeader } from './list-header';
import { FormInput } from '@/components/form/form-input';
import { ElementRef, useRef, useState } from 'react';
import { CardForm } from './card-form';

interface ListItemProps {
  index: number;
  data: ListWithCards;
}

export const ListItem = ({ index, data }: ListItemProps) => {
  const textareaRef = useRef<ElementRef<'textarea'>>(null);
  const [isEditing, setIsEditing] = useState(false);

  const disableEditing = () => {
    setIsEditing(false);
  };

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    });
  };

  return (
    <li className="shrink-0 h-full w-[272px] select-none">
      <div className="w-full rounded-md bg-[#f1f1f2] shadow-md pb-2">
        <ListHeader data={data} onAddCard={enableEditing} />
        <CardForm
          listId={data.id}
          boardId={data.boardId}
          ref={textareaRef}
          isEditing={isEditing}
          enableEditing={enableEditing}
          disableEditing={disableEditing}
        />
      </div>
    </li>
  );
};
