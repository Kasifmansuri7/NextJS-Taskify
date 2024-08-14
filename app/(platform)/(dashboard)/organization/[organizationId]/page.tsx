import { Separator } from '@/components/ui/separator';
import { Info } from './_component/info';
import { BoardList } from './_component/board-list';

export default function OrganizationIdPage() {
  return (
    <div className="w-full mb-20">
      <Info />
      <Separator className="my-4" />
      <div className="px-2 md:px-4">
        <BoardList />
      </div>
    </div>
  );
}
