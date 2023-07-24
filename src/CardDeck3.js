import { useState, useEffect, useRef } from "react";
import "./CardDeck.css";
import Card from "./Card";
import axios from "axios";

const CardDeck3 = () => {
  const [cardURL, setCardURL] = useState(
    "https://deckofcardsapi.com/static/img/back.png"
  );
  const [deckID, setDeckID] = useState("");
  const [numCards, setNumCards] = useState(52);
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawIntervalId, setDrawIntervalId] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    const getDeck = async () => {
      try {
        const response = await axios.get(
          "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
        );
        if (!isCancelled) {
          setDeckID(response.data.deck_id);
          console.log(response.data.deck_id);
        }
      } catch (error) {
        console.error("Error getting deck", error);
      }
    };

    getDeck();

    return () => {
      isCancelled = true;
    };
  }, []);

  const getCard = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`
      );
      setCardURL(response.data.cards[0].image);
      setNumCards(response.data.remaining);
      console.log(response.data.remaining, "cards remaining");
      if (response.data.remaining === 0) {
        // Stop drawing cards if there are none left
        stopDrawing();
      }
    } catch (error) {
      console.error("Error getting cards", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startDrawing = () => {
    setIsDrawing(true);
    const intervalID = setInterval(getCard, 1000);
    setDrawIntervalId(intervalID);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    clearInterval(drawIntervalId);
    setDrawIntervalId(null);
  };

  const toggleDrawing = () => {
    if (isDrawing) {
      stopDrawing();
    } else {
      startDrawing();
    }
  };

  if (numCards === 0) {
    return (
      <div>
        <h1>No cards remaining. You're done, bucko</h1>
      </div>
    );
  } else {
    return (
      <div>
        <div className="container">
          <button onClick={toggleDrawing} disabled={isLoading}>
            {isDrawing ? "Stop Drawing" : "Start Drawing!"}
          </button>
          <Card imageURL={cardURL} />
        </div>
      </div>
    );
  }
};

export default CardDeck3;
