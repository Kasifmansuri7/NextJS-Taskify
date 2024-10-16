'use client';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useCardModal } from '@/hooks/use-card-modal';
import { useQuery } from '@tanstack/react-query';
import { CardWithList } from '@/type';
import { fetcher } from '@/lib/fetcher';
import { Header } from './header';
import { Description } from './description';
import { Actions } from './actions';

export const CardModal = () => {
  const { id, isOpen, onClose } = useCardModal();

  const { data: cardData, isLoading } = useQuery<CardWithList>({
    queryKey: ['card', id],
    queryFn: () => fetcher(`/api/cards/${id}`),
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>
          {!cardData ? <Header.Skeleton /> : <Header data={cardData} />}
        </DialogTitle>
        <DialogDescription>
          <div className="grid grid-cols-1 md:grid-cols-4 md:gap-x-4">
            <div className="col-span-3">
              <div className="w-full space-y-6">
                {!cardData ? (
                  <Description.Skeleton />
                ) : (
                  <Description data={cardData} />
                )}
              </div>
            </div>
            {!cardData ? <Actions.Skeleton /> : <Actions data={cardData} />}
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
