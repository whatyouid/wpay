import { useGlobalState, setGlobalState } from "../store/index"
import axios from "axios"
import getPrice from "./api"
import { useEffect } from "react"

const Pulsa = () => {
    const [usdtPrice] = useGlobalState('usdtPrice')

    const url = 'https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=idr'

    // const getPrice = async function () {
    //     await axios.get(url)
    //     .then(result =>{
    //         console.log('data API', result.data.tether.idr);
    //     })
    //     .catch(err => {
    //         console.log('error', err);
    //     })
    //         // setGlobalState('usdtPrice', response.data.tether.idr)
    // }

    useEffect(() => {
        let interval = setInterval(async () => {
            const res = await axios.get(url);
            setGlobalState('usdtPrice', Math.round((res.data.tether.idr) * 99.5 / 100))
            console.log(res.data.tether.idr)
        }, 30000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    // const url = 'https://api.coingecko.com/api/v3/simple/price?ids=tether%2Cbinance-usd%2Cusd-coin&vs_currencies=idr'
    // axios.get(url)
    //     .then(price => {
    //         setGlobalState('usdtPrice', parseInt(price.data.tether.idr) * 99 / 100)

    //     })
    // useEffect(() => {
    //     getPrice().then((result) => {
    //         setGlobalState('usdtPrice', result )
    //     })

    // //     setInterval(
    // //         getPrice(), 3000)
    // },[])

    return (

        <section className='section'>
            <div className='container'>
                <div className='row'>
                    <div className='col text-center'>
                        <h3 className='main-heading'>Beli Pulsa</h3>
                        <div className='underline mx-auto'></div>
                        <div className="container">
                            <div className="row align-items-start">
                                <div className="col-md">
                                    <form>

                                        <div className="mb-3 text-start">
                                            <label className="form-label item-start">Masukan No Handphone</label>
                                            <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />

                                        </div>

                                        <div className="mb-3 text-start">
                                            <label htmlFor="disabledSelect" className="form-label">Pilih Nominal Pulsa</label>
                                            <select id="disabledSelect" className="form-select">
                                                <option>5.000  - 6.500 IDR</option>
                                                <option>10.000 - 11.200 IDR</option>
                                                <option>15.000 - 16.000 IDR</option>
                                                <option>20.000 - 20.500 IDR</option>
                                                <option>25.000 - 25.000 IDR</option>
                                            </select>
                                        </div>

                                        <div className="row text-start">
                                            <label htmlFor="disabledSelect" className="col-12 mb-2">Pilih pembayaran</label>
                                            <div className="btn-group col-12 mb-2 " role="group" aria-label="Basic radio toggle button group">

                                                <input type="radio" className="btn-check" name="btnradio" id="btnradio2" autoComplete="off" />
                                                <label className="btn btn-outline-success mx-2 px-2 rounded-5" htmlFor="btnradio2">USDT</label>

                                                <input type="radio" className="btn-check" name="btnradio" id="btnradio1" autoComplete="off" />
                                                <label className="btn btn-outline-warning mx-2 px-2 rounded-5" htmlFor="btnradio1">BUSD</label>

                                                <input type="radio" className="btn-check" name="btnradio" id="btnradio3" autoComplete="off" />
                                                <label className="btn btn-outline-primary mx-2 px-2 rounded-5" htmlFor="btnradio3">USDC</label>
                                            </div>
                                            <span className="">Balance : 10.0 USDT</span>
                                        </div>

                                        <div className='d-grid mt-3'>
                                            <button type="button" className="btn btn-primary rounded-pill" data-bs-toggle="modal" data-bs-target="#exampleModal">Beli</button>
                                        </div>

                                    </form>
                                </div>
                                <div className="col-md">
                                    <div className="row p-3">
                                        <div className="col-6 text-start border-bottom py-2">Rate Harga</div>
                                        <div className="col-6 col-md-4 text-end border-bottom py-2">{usdtPrice} IDR</div>
                                        <div className="col-6 text-start border-bottom py-2">Total Transaksi </div>
                                        <div className="col-6 col-md-4 text-end border-bottom py-2">10 USDT</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Button trigger modal */}
            {/* <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
            </button> */}

            {/* Modal */}
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Konfirmasi Pembelian</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="container text-start">
                                <div className="row border-bottom py-2">
                                    <div className="col">No Handphone</div>
                                    <div className="col">: 0838-1413-3348</div>
                                </div>
                                <div className="row border-bottom py-2">
                                    <div className="col">Nominal Pulsa</div>
                                    <div className="col">: 5000 IDR</div>
                                </div>
                                <div className="row border-bottom py-2">
                                    <div className="col">Harga</div>
                                    <div className="col">: 5500 IDR</div>
                                </div>
                                <div className="row border-bottom py-2">
                                    <div className="col">Rate Harga</div>
                                    <div className="col">: 15000 IDR</div>
                                </div>
                                <div className="row border-bottom py-2">
                                    <div className="col">Total Transaksi</div>
                                    <div className="col">: 10 USDT</div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer ">
                            <button type="button" className="btn btn-primary rounded-pill col-12">Konfirmasi</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Pulsa