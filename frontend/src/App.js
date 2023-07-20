import React, {useState, useEffect} from 'react'
import './App.css'
import Store from './Store.js';
import getBlockchain from './ethereum.js';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './pages/Home.jsx';
import BeliCrypto from './pages/BeliCrypto';
import JualCrypto from './pages/JualCrypto';
import RiwayatTransaksi from './pages/RiwayatTransaksi';


const App= () => {
  const [paymentProcessor, setPaymentProcessor] = useState(undefined);
  const [usdt, setUsdt] = useState(undefined);

  useEffect(() => {
    const init = async() => {
      const { paymentProcessor, usdt} = await getBlockchain(); 
      setPaymentProcessor(paymentProcessor);
      setUsdt(usdt);
    }
    init();
  }, []);


  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/beliCrypto' element={<BeliCrypto paymentProcessor={paymentProcessor} usdt= {usdt} />}></Route>
          <Route path='/jualCrypto' element={<JualCrypto paymentProcessor={paymentProcessor} usdt= {usdt} />}></Route>
          <Route path='/riwayat' element={<RiwayatTransaksi />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
