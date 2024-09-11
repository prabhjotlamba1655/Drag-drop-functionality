import React, { useEffect, useRef, useState } from "react";
import { Card } from "./component/card";
import { thumbnails } from "./constants/constants";
import { DocumentCard } from "./LayoutPropTypes";
import { compareCardOrder } from "./utils/commonUtils";
import { fetchDocuments, saveDocuments } from "./utils/apiUtils";

export const Layout: React.FC = () => {
  const [cards, setCards] = useState<DocumentCard[]>([]); // Track the cards
  const [loadingState, setLoadingState] = useState<boolean>(true); // Track loading state for each card
  const [draggedCardIndex, setDraggedCardIndex] = useState<number | null>(null); // Track the index of the dragged card
  const [overlayImage, setOverlayImage] = useState<string | null>(null); // Track the overlay image

  const lastCardOrderRef = useRef<string[]>([]); // Track the last card order
  const cardRef = useRef<any>(cards); // Track the last card order

  useEffect(() => {
    cardRef.current = [...cards];
  }, [cards]);


  // added useEffect to fetch the documents and set the cards state
  useEffect(() => {
    const fetchData = async () => {
      try {
        const documents = await fetchDocuments();
        setCards(documents);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingState(false);
      }
    };

    // added setTimeout to delay the fetchData function so that the loading spinner can be displayed
    setTimeout(() => {
      fetchData();
    }, 2000);
  }, []);

  // added useEffect to handle the escape key press event to close the overlay image
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOverlayImage(null);
      }
    };

    window.addEventListener("keydown", handleEscapeKey);

    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
    };
  });

  // added useEffect to save the documents every 5 seconds if the order of the cards has changed
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedOrder = compareCardOrder(cardRef.current, lastCardOrderRef.current);
      
      if (updatedOrder) {
        lastCardOrderRef.current = updatedOrder;
        saveDocuments(cardRef.current); // Use saveDocuments function here
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);


  

  /**
   *
   * @param index of the dragged card
   */
  const handleDragStart = (index: number) => {
    setDraggedCardIndex(index);
  };

  /**
   * This function is triggered when the dragged card is dropped onto another card.
   * It swaps the positions of the dragged card and the card it was dropped onto.
   * @param event
   * @param index
   */
  const handleDrop = (event: React.DragEvent<HTMLDivElement>, newIndex: number) => {
    if (draggedCardIndex !== null && draggedCardIndex !== newIndex) {
      setCards((prevCards) => {
        const updatedCards = [...prevCards];
        const draggedCard = updatedCards[draggedCardIndex];
  
        // Remove the dragged card from its original position
        updatedCards.splice(draggedCardIndex, 1);
  
        // Insert the dragged card at the new index and displace others
        updatedCards.splice(newIndex, 0, draggedCard);
  
        return updatedCards;
      });
    }
    setDraggedCardIndex(null);
  };

  /**
   *
   * @param event
   * @returns prevent the default behavior of the event
   */
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event?.preventDefault();
    return;
  };

  return (
    <>
      {loadingState ? (
        <div className="spinner-container">
          <div className="spinner"></div>
          <p className="loading-text">Loading...</p>
        </div>
      ) : (
        <div className="container">
          {cards?.map((card, index) => (
            <Card
              key={card?.position}
              card={card}
              index={index}
              handleDragStart={handleDragStart}
              handleDrop={handleDrop}
              handleDragOver={handleDragOver}
              onClick={() => setOverlayImage(thumbnails[card?.type])}
              thumbnails={thumbnails}
            />
          ))}

          {overlayImage && (
            <div className="overlay" onClick={() => setOverlayImage(null)}>
              <img src={overlayImage} alt="Document" />
            </div>
          )}
        </div>
      )}
    </>
  );
};
