'use client';

import { ListWithCards } from '@/type';
import { ListHeader } from './list-header';
import { FormInput } from '@/components/form/form-input';

interface ListItemProps {
  index: number;
  data: ListWithCards;
}

export const ListItem = ({ index, data }: ListItemProps) => {
  return (
    <li className="shrink-0 h-full w-[272px] select-none">
      <div className="w-full rounded-md bg-[#f1f1f2] shadow-md pb-2">
        <ListHeader data={data} />
      </div>
    </li>
  );
};
