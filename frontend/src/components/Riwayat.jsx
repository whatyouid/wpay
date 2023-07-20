import { useState, useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import { useGlobalState } from '../store/index'
import {connectWallet, getCurrentWalletConnected, addWalletListener, Price } from '../Blockchain'

const Riwayat = () => {

    const API_URL = 'http://localhost:4000';

    const [dataHistory, setDataHistory] = useState([])

    const getHistory = async () => {
        try {
            const accounts = await window.ethereum.request({method: "eth_accounts"});
            const address = accounts[0];
            const history = await axios.get(`${API_URL}/api/history/${address}`);
            console.log(history)
            setDataHistory(history.data);
        } catch {
            console.log("data tidak ditemukan");
        }
    }

    useEffect(() => {
        getHistory()
    }, []);

    function formatDate(date) {
            const options = { day: '2-digit', month: 'short', year: 'numeric' };
            const formattedDate = new Date(date).toLocaleDateString('id', options);

            // Split the formatted date into day, month, and year parts
            const [day, month, year] = formattedDate.split(' ');

            // Convert the month abbreviation to uppercase
            // const capitalizedMonth = month.toUpperCase();

            // Return the formatted date with uppercase month abbreviation and desired format
            return `${day} ${month} ${year}`;
        }



    const ListHistory = () => {
        return dataHistory.map((history, i) => {
            return (
                <tr key={i}>
                    <th>{history.id}</th>
                    {/* <th>{(new Date(history.tanggal)).toLocaleDateString('id')}</th> */}
                    <th>{formatDate(history.tanggal)}</th>
                    <th>{history.jumlah_rupiah}</th>
                    <th>{history.category}</th>
                    <th>{history.status}</th>
                </tr>
            )
        })
    }


    return (
        <section className='section'>
            <div className='container'>
                <div className='row'>
                    <div className='col text-center'>
                        <h3 className='main-heading'>Riwayat Transaksi</h3>
                        <div className="container">
                            <div className="table-responsive">
                                <table className="table table-hover is-striped is-fullwidth">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Trx ID</th>
                                            <th>Tanggal</th>
                                            <th>Jumlah tx</th>
                                            <th>Category</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="font-weight-100">
                                        <ListHistory />
                                    </tbody> 

                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    )
}

export default Riwayat