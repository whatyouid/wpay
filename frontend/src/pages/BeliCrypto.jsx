import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Beli from '../components/Beli'
// import Crypto from '../components/Crypto'

const BeliCrypto = ({ paymentProcessor, usdt }) => {
    return (
        <>
            <Header />
            <div>
                <Beli paymentProcessor={paymentProcessor} usdt={usdt} />
            </div>
            <Footer />
        </>
    )
}

export default BeliCrypto