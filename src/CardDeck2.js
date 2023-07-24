import { useState, useEffect, useRef } from "react";
import "./CardDeck.css";
import Card from "./Card";
import axios from "axios";

const CardDeck2 = () => {
  const [cardURL, setCardURL] = useState(
    "https://deckofcardsapi.com/static/img/back.png"
  );
  const [deckID, setDeckID] = useState("");
  const [numCards, setNumCards] = useState(52);
  const [isLoading, setIsLoading] = useState(false);

  // get data when the component mounts
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
    } catch (error) {
      console.error("Error getting cards", error);
    } finally {
      setIsLoading(false);
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
          <button onClick={getCard} disabled={isLoading}>
            Gimme a Card!
          </button>
          <Card imageURL={cardURL} />
        </div>
      </div>
    );
  }
};

export default CardDeck2;