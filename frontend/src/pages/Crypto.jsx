import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Beli from '../components/Beli'
import Jual from '../components/Jual'
import { useState, useEffect } from "react"
import { FaSellcast } from 'react-icons/fa'

// import Crypto from '../components/Crypto'

const Crypto = () => {
    const [category, setCategory] = useState("Beli");

    const display = () => {
        if (category === "Beli") {
            return (
                <Beli />
            )
        } else {
            return (
                <Jual />
            )
        }
    };
    return (
        <>
            <Header />
            <section className='section'>
                <div className='container'>
                    <div className='row'>
                        <div className='col text-center'>
                            <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                                <input type="radio" className="btn-check" name="btnradio" id="beli" autoComplete="off" defaultChecked />
                                <label className="btn btn-outline-success px-5 mb-3" htmlFor="beli" onClick={() => setCategory("Beli")}>Beli</label>

                                <input type="radio" className="btn-check" name="btnradio" id="jual" autoComplete="off" />
                                <label className="btn btn-outline-danger px-5 mb-3" htmlFor="jual" onClick={() => setCategory("Sell")}>Jual</label>

                            </div>
                        </div>
                        {display}
                    </div>
                </div>
            </section>
            <Footer />
        </>
    )
}

export default Crypto