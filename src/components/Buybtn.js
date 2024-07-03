import React from 'react';

const Buybtn = ({ account, toolId, rentalDuration, provider, airent }) => {
  const handleBuy = async () => {
    

    try {
      const signer = await provider.getSigner()
      let tx = await airent.rentAITool(toolId, rentalDuration);
      await tx.wait();
      alert('Tool rented successfully');
    } catch (error) {
      console.error('Error renting tool:', error);
      alert('Failed to rent tool');
    }
  };

  return <button onClick={handleBuy} disabled={!account}>Buy</button>;
};

export default Buybtn;
