import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import styled from "styled-components";
// import { Wrapper } from "@/components/styles/general";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Wrapper } from "@/components/styles/general";
import { colors } from "@/constants/colors";

const inter = Inter({ subsets: ["latin"] });

const data = [
  {
    id: "123232323",
    name: "yet to buy",
    items: [
      { id: "0aeuyiwq", name: "curry" },
      { id: "sdfr1", name: "pepper" },
      { id: "2werew4", name: "stock fish" },
      { id: "3dfsardwe", name: "rice" },
    ],
  },
  {
    id: "672323",
    name: "ready to buy",
    items: [
      { id: "fsfdwe0", name: "right curry" },
      { id: "edewffsdf1", name: "right pepper" },
      { id: "dsfgsd2", name: "right stock fish" },
      { id: "3wer4rfes", name: "right rice" },
    ],
  },
  {
    id: "67232323323",
    name: "bought",
    items: [
      { id: "fsfdwsade0", name: "right curry" },
      { id: "edassdewffsdf1", name: "right pepper" },
      { id: "dsaaSfgsd2", name: "right stock fish" },
      { id: "3weDWr4rfes", name: "right rice" },
    ],
  },
];

export default function Home() {
  const [currentData, setCurrentData] = useState(data);
  const handleDragEnd = (event) => {
    console.log({ event });
    const { destination, source, type } = event;
    const sameDroppable =
      destination?.index !== source?.index &&
      destination?.droppableId === source?.droppableId;
    const diffDroppable = destination?.droppableId !== source?.droppableId;
    let rebel = null;
    if (!destination) return;
    if (
      destination?.index === source?.index &&
      destination?.droppableId === source?.droppableId
    )
      return;
    if (sameDroppable && type === "group") {
      console.log({ res: event });
      const newStoreArray = [...currentData];
      const [removed] = newStoreArray.splice(source?.index, 1);
      newStoreArray.splice(destination?.index, 0, removed);
      return setCurrentData(newStoreArray);
    }

    if (sameDroppable && type === "smaller") {
      const newArray = [...currentData];
      const updatedArray = newArray.map((item) => {
        if (item?.id === source?.droppableId) {
          const [removed] = item?.items?.splice(source?.index, 1);
          item.items = [...item.items]; // Create a new array to ensure a reference change
          item?.items?.splice(destination?.index, 0, { ...removed }); // Clone the item being added
          console.log({ removed, item });
        }
        return { ...item };
      });
      return setCurrentData(updatedArray);
      // return;
    }

    if (diffDroppable && type === "smaller") {
      const storeSourceIndex = currentData?.findIndex(
        (store) => store.id === source?.droppableId
      );
      const storeDestinationIndex = currentData?.findIndex(
        (store) => store.id === destination?.droppableId
      );
      console.log({ currentData });

      console.log({ storeSourceIndex, storeDestinationIndex });
      const newSourceItems = [...currentData?.[storeSourceIndex].items];
      const newDestinationItems = diffDroppable
        ? [...currentData?.[storeDestinationIndex].items]
        : newSourceItems;

      const [deletedItem] = newSourceItems.splice(source?.index, 1);
      newDestinationItems.splice(destination?.index, 0, deletedItem);

      const newStores = [...currentData];
      newStores[storeSourceIndex] = {
        ...currentData[storeSourceIndex],
        items: newSourceItems,
      };
      newStores[storeDestinationIndex] = {
        ...currentData[storeDestinationIndex],
        items: newDestinationItems,
      };

      return setCurrentData(newStores);
    }
  };
  return (
    <>
      <Head>
        <title>Task Manager</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Wrapper>
        <button onClick={() => console.log("button clicked")}>add new</button>
        <PageContainer>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable
              droppableId={"djkdfkdf"}
              type="group"
              direction="horizontal"
            >
              {(provided) => (
                <div
                  className="task_group"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {currentData?.map((datum, index) => (
                    <Draggable
                      draggableId={datum?.id}
                      key={datum?.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          className="overall"
                          {...provided.dragHandleProps}
                          {...provided.draggableProps}
                          ref={provided.innerRef}
                        >
                          <Rack data={datum} />
                          {provided.placeholder}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  <div className="placeholder">{provided.placeholder}</div>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </PageContainer>
      </Wrapper>
    </>
  );
}

const Rack = ({ data }) => {
  return (
    <Droppable droppableId={data?.id} type="smaller">
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="rack"
        >
          <h5>{data?.name}</h5>
          {data?.items?.map((item, indx) => (
            <Draggable draggableId={item?.id} index={indx} key={item?.id}>
              {(providede) => (
                <div
                  className="task_card"
                  {...providede.draggableProps}
                  {...providede.dragHandleProps}
                  ref={providede.innerRef}
                >
                  {item?.name}
                </div>
              )}
            </Draggable>
          ))}
          <div className="placeholder">{provided.placeholder}</div>
        </div>
      )}
    </Droppable>
  );
};

const PageContainer = styled.div`
  display: flex;
  .task_group {
    display: flex;
    min-height: 300px;
    gap: 1rem;
    width: 100%;
    background-color: ${colors.gray300};
    padding: 1.5rem 1rem;
    /* margin: 0 1rem; */
    overflow: scroll;
  }
  .task_card {
    width: 100%;
    height: 70px;
    padding: 0.5rem;
    background-color: ${colors.gray200};
    margin: 0.5rem 0;
    border-radius: 8px;
  }
  .overall {
    display: flex;
    background-color: pink;
    width: 300px;
    min-height: 150px;
    height: fit-content;
  }
  .drop {
    background-color: red;
  }
  .rack {
    display: flex;
    flex-direction: column;
    /* height: fit-content; */
    background-color: orange;
    width: 300px;
    padding: 1rem;
  }
  .placeholder {
    background-color: rgba(0, 50, 0, 0.2);
  }
`;
