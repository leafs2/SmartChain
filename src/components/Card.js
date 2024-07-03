import React, { useEffect, useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import AddToCartbtn from "./AddToCartbtn";
import Buybtn from "./Buybtn";
import axios from "axios";

const Card = ({ account, provider }) => {
  const [cards, setCards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [liked, setLiked] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState("Hourly Price");

  useEffect(() => {
    axios
      .get("/card.json") // 路徑指向public文件夾中的文件
      .then((response) => {
        setCards(response.data.cards);
      })
      .catch((error) => {
        console.error("Error fetching the JSON data", error);
      });
  }, []);

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCard(null);
  };

  const handleLike = (card) => {
    if (card.id === "chatgpt") {
      setLiked(!liked);
    }
  };

  const isLiked = (id) => {
    return id === "chatgpt" && liked;
  };

  const handlePriceChange = (event) => {
    setSelectedPrice(event.target.value);
  };

  const renderTable = (filteredCards) => (
    <table>
      <thead>
        <tr>
          <th>Ranking</th>
          <th>GEN-AI</th>
          <th>Volume</th>
        </tr>
      </thead>
      <tbody>
        {filteredCards.map((card) => (
          <tr key={card.id}>
            <td>
              <div className="card" onClick={() => handleCardClick(card)}>
                <div className="card-content">
                  <div className="ranking">{card.ranking}</div>
                  <div className="card-image-container">
                    <img
                      src={card.imageSrc}
                      alt={card.altText}
                      className="card-image"
                    />
                  </div>
                  <div className="card-info">
                    <h3 className="card-title">{card.title}</h3>
                    <ul className="card-list">
                      {card.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="card-price">
                  {card.attributes[0].value} {card.attributes[0].unit}
                </div>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const firstHalfCards = cards.filter(
    (card) => card.ranking >= 1 && card.ranking <= 5
  );
  const secondHalfCards = cards.filter(
    (card) => card.ranking >= 6 && card.ranking <= 10
  );

  return (
    <div className="cards-container">
      <div className="cards-table">{renderTable(firstHalfCards)}</div>
      <div className="cards-table">{renderTable(secondHalfCards)}</div>

      {showModal && selectedCard && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            <div className="modal-info">
              <div className="modal-text">
                <div className="modal-title">
                  <img
                    src={selectedCard.imageSrc}
                    alt="Logo"
                    className="modal-image"
                  />
                  <h2>{selectedCard.title}</h2>
                  <div
                    className="like-button"
                    onClick={() => handleLike(selectedCard)}
                  >
                    {isLiked(selectedCard.id) ? (
                      <FaHeart className="fa-heart" />
                    ) : (
                      <FaRegHeart />
                    )}
                  </div>
                </div>
                <div className="modal-list">
                  <p>{selectedCard.description}</p>
                </div>
              </div>
              <div className="price-selection">
                <label htmlFor="price-dropdown">Select Price:</label>
                <select
                  id="price-dropdown"
                  value={selectedPrice}
                  onChange={handlePriceChange}
                >
                  {selectedCard.attributes.map((attr) => (
                    <option key={attr.trait_type} value={attr.trait_type}>
                      {attr.trait_type}
                    </option>
                  ))}
                </select>
                <div className="selected-price">
                  {
                    selectedCard.attributes.find(
                      (attr) => attr.trait_type === selectedPrice
                    ).value
                  }{" "}
                  {
                    selectedCard.attributes.find(
                      (attr) => attr.trait_type === selectedPrice
                    ).unit
                  }
                </div>
              </div>
              <div className="btn-content">
                <AddToCartbtn />
                <Buybtn
                  account={account}
                  toolId={selectedCard.id}
                  rentalDuration={selectedPrice}
                  provider={provider}
                  airent={airent}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
