import './App.css';
import Navbar from './components/navbar';
import Category from './components/category';
import Search from './components/Search';
import Card from './components/Card';
import { useEffect, useState } from 'react';
import AItoolABI from './abis/AItool.json';
import config from './config.json';
const ethers = require("ethers")

function App() {
  console.clear();

  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [airent, setAirent] = useState(null);

  const loadBlockchainData = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    setProvider(provider)
    const AIaddress = "0xEbC07f155D17E13Ef5b287ca5f78f9a9Af66eC16"
    const airent = new ethers.Contract(AIaddress, AItoolABI, provider);      
    
    setAirent(airent);
  }
  useEffect(() => {
    loadBlockchainData()
  }, [])

  console.log('Contract initialized:', airent);

  window.ethereum.on('accountsChanged', async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = ethers.getAddress(accounts[0])
    setAccount(account);
  })
  return (
    <div className="App">
      <Navbar account={account} setAccount={setAccount} />
      <Search />
      <div className="cate"><Category/></div>
      <Card account={account} provider={provider} airent={airent}/>
    </div>
  );
}

export default App;
