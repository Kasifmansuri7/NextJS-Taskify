'use client';

import { ListWithCards } from '@/type';
import { List } from '@prisma/client';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { ListForm } from './list-form';
import { useEffect, useState } from 'react';
import { ListItem } from './list-item';
import { useAction } from '@/hooks/use-action';
import { updateListOrder } from '@/actions/list/update-list-order';
import { updateCardReorder } from '@/actions/card/update-card-order';
import { toast } from 'sonner';

interface ListContainerProps {
  boardId: string;
  data: ListWithCards[];
}
// Generic reorder function
function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
  const result = Array.from(list);

  // extract repositioned element
  const [removed] = result.splice(startIndex, 1);

  // put it at the right place
  result.splice(endIndex, 0, removed);
  return result;
}

export const ListContainer = ({ boardId, data }: ListContainerProps) => {
  const [orderedData, setOrderedData] = useState(data);
  // List reorder server action
  const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
    onSuccess: () => {
      toast.success('List reordered.');
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const { execute: executeUpdateCardReorder } = useAction(updateCardReorder, {
    onSuccess: () => {
      toast.success('Card reordered.');
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  const onDrageEnd = (result: any) => {
    const { destination, source, type } = result;

    if (!destination) {
      return;
    }

    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // User moves a list
    if (type === 'list') {
      const items = reorder(orderedData, source.index, destination.index).map(
        (item: any, index: number) => ({ ...item, order: index })
      );
      executeUpdateListOrder({ items, boardId });
      setOrderedData(items);
    } else if (type === 'card') {
      let newOrderedData = [...orderedData];

      // Source and destination list
      const sourceList = newOrderedData.find(
        (list) => list.id === source.droppableId
      );

      const destinationList = newOrderedData.find(
        (list) => list.id === destination.droppableId
      );
      if (!sourceList || !destinationList) {
        return;
      }

      // Check if the cards exist on source list
      if (!sourceList.cards) {
        sourceList.cards = [];
      }

      // Check if the cards exist on destination list
      if (!destinationList.cards) {
        destinationList.cards = [];
      }

      // User moved card in the same list
      if (source.droppableId === destination.droppableId) {
        const reOrderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        ).map((item: any, index: number) => ({ ...item, order: index }));

        // Find the list and change the cards with new order
        const newOrderdata = orderedData.map((list) =>
          list.id === source.droppableId
            ? { ...list, cards: reOrderedCards }
            : list
        );
        setOrderedData(newOrderdata);

        // Trigger the server action
        executeUpdateCardReorder({
          items: reOrderedCards,
        });
      } else {
        // User moves the card to another list
        // Remove card from the source list
        const [removedFromSource] = sourceList.cards.splice(source.index, 1);

        // Add card the destination list at the right place
        destinationList.cards.splice(destination.index, 0, removedFromSource);

        sourceList.cards.forEach((card, index) => {
          card.order = index;
        });

        destinationList.cards.forEach((card, index) => {
          card.order = index;
          card.listId = destination.droppableId;
        });

        setOrderedData((prev) =>
          prev.map((list) => {
            // Update the source list
            if (list.id === source.droppableId) {
              return { ...list, cards: sourceList.cards };
            }
            if (list.id === destination.droppableId) {
              // Update destination list
              return { ...list, cards: destinationList.cards };
            }
            return list;
          })
        );

        executeUpdateCardReorder({
          items: destinationList.cards,
        });
      }
    }
  };
  return (
    <DragDropContext onDragEnd={onDrageEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-x-3 gap-y-4 flex-wrap"
          >
            {orderedData.map((list, index) => (
              <ListItem key={list.id} index={index} data={list} />
            ))}
            {provided.placeholder}
            <ListForm />
            <div className="flex-shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};
