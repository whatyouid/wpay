import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Jual from '../components/Jual'

// import Crypto from '../components/Crypto'

const JualCrypto = ({ paymentProcessor, usdt }) => {
  return (
    <>
      <Header />
      <div>
        
        <Jual paymentProcessor={paymentProcessor} usdt={usdt} />

      </div>
      <Footer />
    </>
  )
}

export default JualCrypto