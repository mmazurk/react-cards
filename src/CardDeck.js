import { useState, useEffect, useRef } from "react";
import "./CardDeck.css";
import Card from "./Card";
import axios from "axios";

const CardDeck = () => {
  const [cardURL, setCardURL] = useState(
    "https://deckofcardsapi.com/static/img/back.png"
  );
  const [deckID, setDeckID] = useState("");
  const [numCards, setNumCards] = useState(52);

  // get data when the component mounts
  useEffect(() => {
    const getDeck = async () => {
       
      try {
        const response = await axios.get(
            "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
          );
          setDeckID(response.data.deck_id);
          console.log(response.data.deck_id);
      } catch(error) {
        console.log("ERROR!", error)
      } 
        
    };
    getDeck();
  }, []);

  const getCard = async () => {
    try {
      const response = await axios.get(
        `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`
      );
      setCardURL(response.data.cards[0].image);
      setNumCards(response.data.remaining);
      console.log(response.data.remaining, "cards remaining");
    } catch (error) {
      console.error("Error getting cards", error);
    }
  };


  if (numCards === 0) {
    return (
      <div>
        <h1>No cards rekmaining. You're done, bucko</h1>
      </div>
    );
  } else {
    return (
      <div>
        <div className="container">
          <button onClick={getCard}>Gimme a Card!</button>
          <Card imageURL={cardURL} />
        </div>
      </div>
    );
  }
};

export default CardDeck;
