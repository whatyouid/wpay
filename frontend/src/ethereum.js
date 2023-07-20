import {ethers, Contract} from 'ethers';
import PaymentProcessor from './contracts/PaymentProcessor.json';
import Usdt from './contracts/USDT.json';

const getBlockchain = () =>
    new Promise((resolve, reject) => {
        window.addEventListener('load', async () => {
            if(window.ethereum) {
                await window.ethereum.enable();
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();

                const paymentProcessor = new Contract(
                    PaymentProcessor.networks[window.ethereum.networkVersion].address,
                    PaymentProcessor.abi,
                    signer
                );

                const usdt = new Contract(
                    Usdt.networks[window.ethereum.networkVersion].address,
                    Usdt.abi,
                    signer
                );
                resolve({provider, paymentProcessor, usdt});
            }
            resolve ({provider: undefined, paymentProcessor: undefined, usdt: undefined});
        });
    });

export default getBlockchain;