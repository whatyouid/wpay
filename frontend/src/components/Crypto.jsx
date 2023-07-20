import { useGlobalState, setGlobalState } from "../store/index"
import { useState, useEffect } from "react"
import axios from "axios"
import { ethers } from 'ethers';


const Pulsa = ({ paymentProcessor, dai }) => {
    const url = 'https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=idr'
    const [usdtPrice] = useGlobalState('usdtPrice')
    const [jmlCrypto, setJmlcrypto] = useState('')
    const jmlTrx = Math.floor((usdtPrice * jmlCrypto));
    const biayaTrx = - 5000
    const TotalJual = jmlTrx + biayaTrx
    const API_URL = 'http://localhost:4000'

    // const ITEMS = [
    //     {
    //         id: 1,
    //         price: ethers.utils.parseEther(jmlCrypto)
    //     }, 
    //     {
    //         id: 2,
    //         price: ethers.utils.parseEther('200')
    //     }
    //   ];

    useEffect(() => {
        async function getPrice() {
            const price = await axios.get(url);
            setGlobalState('usdtPrice', Math.round((price.data.tether.idr) * 99.5 / 100))
            console.log(price.data.tether.idr)
        }

        let interval = setInterval(async () => {
            const res = await axios.get(url);
            setGlobalState('usdtPrice', Math.round((res.data.tether.idr) * 99.5 / 100))
            console.log(res.data.tether.idr)
        }, 30000);
        return () => {
            getPrice();
            clearInterval(interval);
        };
    }, []);

    const [bankCode, setBankcode] = useState("014");
    const [bankName, setBankname] = useState("Bank Central Asia (BCA)");
    const [account, setAccount] = useState("");
    const [accountName, setAccountname] = useState("....");

    //Bank name




    const checkAccount = async (e) => {
        try {
            // console.log({"account_number":account, "bank_code": bankCode})
            // const data = JSON.stringify({"bank_code": bankCode,"account_number":account})
            // console.log(data);
            const response = await axios.post('http://localhost:4000/api/account-inquiry', {
                "bank_code": bankCode,
                "account_number": account

            });
            console.log(response)
            if (response.data.bank_code === "014") {
                setBankname("Bank BCA")
            } else if (response.data.bank_code === "002") {
                setBankname("Bank BRI")
            } else {
                setBankname("Bank Tidak Valid")
            }
            setAccountname(response.data.account_name);


        } catch (error) {
            console.log(error);
        }
    };

    const jual = async (e) => {
        const response1 = await axios.get(`${API_URL}/api/getPaymentId/1`);
        console.log(response1);

        const tx1 = await dai.approve(paymentProcessor.address, ethers.utils.parseEther(jmlCrypto));
        await tx1.wait();


        const tx2 = await paymentProcessor.pay(ethers.utils.parseEther(jmlCrypto), response1.data.paymentId);
        const receipt = await tx2.wait();
        console.log(response1.data.paymentId);

        await new Promise(resolve => setTimeout(resolve, 5000))
        const responseJual = await axios.post(`${API_URL}/api/remit/${response1.data.paymentId}`, {
            "recipient_bank": bankCode,
            "recipient_account": account,
            "amount": TotalJual,
            "partner_trx_id": response1.data.paymentId
        });
        console.log(responseJual)
    }

    return (
        <section className='section'>
            <div className='container'>
                <div className='row'>
                    <div className='col text-center'>
                        <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                            <input type="radio" className="btn-check" name="btnradio" id="beli" autoComplete="off" defaultChecked />
                            <label className="btn btn-outline-success px-5 mb-3" htmlFor="beli">Beli</label>

                            <input type="radio" className="btn-check" name="btnradio" id="jual" autoComplete="off" />
                            <label className="btn btn-outline-danger px-5 mb-3" htmlFor="jual">Jual</label>

                        </div>
                        {/* <h3 className='main-heading'>Jual Crypto</h3> */}
                        {/* <div className='underline mx-auto'></div> */}
                        <div className="container">
                            <div className="row align-items-start">
                                <div className="col-md">
                                    <form>
                                        <div className="row text-start">
                                            <label htmlFor="disabledSelect" className="col-12 mb-2">Pilih Crypto</label>
                                            <div className="btn-group col-4 mb-2 " role="group" aria-label="Basic radio toggle button group">

                                                <input type="radio" className="btn-check" name="btnradio" id="btnradio2" autoComplete="off" />
                                                <label className="btn btn-outline-success mx-2 px-2 rounded-5" htmlFor="btnradio2">USDT</label>

                                                {/* <input type="radio" className="btn-check" name="btnradio" id="btnradio1" autoComplete="off" />
                                                <label className="btn btn-outline-warning mx-2 px-2 rounded-5" htmlFor="btnradio1">BUSD</label>

                                                <input type="radio" className="btn-check" name="btnradio" id="btnradio3" autoComplete="off" />
                                                <label className="btn btn-outline-primary mx-2 px-2 rounded-5" htmlFor="btnradio3">USDC</label> */}
                                            </div>
                                            <span className="text-secondary mb-2">Balance : 10.0 USDT</span>
                                        </div>

                                        <div className="mb-2 text-start">
                                            <label className="form-label item-start">Masukan Jumlah Crypto</label>
                                            <input
                                                type="text"
                                                value={jmlCrypto}
                                                onChange={(e) => setJmlcrypto(e.target.value)}
                                                name="jumlahCrypto"
                                                className="form-control"
                                            />

                                        </div>

                                        <div className="mb-2 text-start">
                                            <label htmlFor="disabledSelect" className="form-label">Pilih Bank / E-wallet</label>
                                            <select
                                                className="form-select"
                                                value={bankCode}
                                                onChange={(e) => setBankcode(e.target.value)}
                                            >
                                                <option value="014">Bank BCA</option>
                                                <option value="002">Bank BRI</option>
                                                <option value="009">Bank BNI</option>
                                                <option value="008">Bank Mandiri</option>
                                                <option value="011">Bank Danamon</option>
                                            </select>
                                        </div>

                                        <div className=" col mb-3 text-start">
                                            <label className="col-12 form-label item-start">Masukan No Rekening / No HP</label>

                                            <input
                                                type="text"
                                                className="mb-2 form-control"
                                                value={account}
                                                onChange={(e) => setAccount(e.target.value)}
                                            />
                                            {/* <button 
                                                type="button" 
                                                className="btn btn-primary"
                                                onClick={() => checkAccount()}
                                            >
                                                Check
                                            </button>
                                            <span className="mx-2 text-secondary">Nama :{accountName} </span> */}

                                        </div>




                                        <div className='d-grid mt-3'>
                                            <button type="button" className="btn btn-primary rounded-pill" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => checkAccount()}>Jual</button>
                                            {/* <button 
                                                type="button" 
                                                className="btn btn-primary rounded-pill"
                                                onClick={() => jual()}
                                            >
                                                Jual
                                            </button> */}
                                        </div>

                                    </form>
                                </div>
                                <div className="col-md">
                                    <div className="row p-3">
                                        <div className="col-6 text-start border-bottom py-2">Rate Harga</div>
                                        <div className="col-6 col-md-4 text-end border-bottom py-2">{usdtPrice} IDR</div>
                                        <div className="col-6 text-start border-bottom py-2">Jumlah Crypto </div>
                                        <div className="col-6 col-md-4 text-end border-bottom py-2">{jmlCrypto} USDT</div>
                                        <div className="col-6 text-start border-bottom py-2">Jumlah Transaksi </div>
                                        <div className="col-6 col-md-4 text-end border-bottom py-2">{jmlTrx} IDR</div>
                                        <div className="col-6 text-start border-bottom py-2">Biaya Transaksi </div>
                                        <div className="col-6 col-md-4 text-end border-bottom py-2">{biayaTrx} IDR</div>
                                        <div className="col-6 text-start border-bottom py-2">Jumlah diterima </div>
                                        <div className="col-6 col-md-4 text-end border-bottom py-2">{TotalJual} IDR</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal */}
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Konfirmasi Transaksi</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="container text-start">
                                <div className="row border-bottom py-2">
                                    <div className="col">Crypto</div>
                                    <div className="col">: USDT</div>
                                </div>
                                <div className="row border-bottom py-2">
                                    <div className="col">Jumlah Crypto</div>
                                    <div className="col">: {jmlCrypto} USDT</div>
                                </div>
                                <div className="row border-bottom py-2">
                                    <div className="col">Bank/E-wallet</div>
                                    <div className="col">: {bankName}</div>
                                </div>
                                <div className="row border-bottom py-2">
                                    <div className="col">Nomer Akun Bank/E-Wallet</div>
                                    <div className="col">: {account}</div>
                                </div>
                                <div className="row border-bottom py-2">
                                    <div className="col">Nama Akun</div>
                                    <div className="col">: {accountName}</div>
                                </div>
                                <div className="row border-bottom py-2">
                                    <div className="col">Jumlah diterima</div>
                                    <div className="col">: {TotalJual} IDR</div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer ">
                            <button
                                type="button"
                                className="btn btn-primary rounded-pill col-12"
                                onClick={() => jual()}
                            >
                                Konfirmasi
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Pulsa