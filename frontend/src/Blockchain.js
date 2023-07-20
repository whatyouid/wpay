import {ethers, Contract} from 'ethers';
import PaymentProcessor from './contracts/PaymentProcessor.json';
import Usdt from './contracts/USDT.json';
import { setGlobalState, useGlobalState } from './store/index';



const connectWallet = async () => {
  if(typeof window != 'undefined' && typeof window.ethereum != 'undefined') {
    try{
      const accounts = await window.ethereum.request({method: "eth_requestAccounts"});
      setGlobalState('connectedAccount',accounts[0])
    } catch(err){
      console.error(err.message);
    }
  } else{
    console.log("please install Metamask")
  }
}

const getCurrentWalletConnected = async () => {
  if(typeof window != 'undefined' && typeof window.ethereum != 'undefined') {
    try{
      const accounts = await window.ethereum.request({method: "eth_accounts"});
      if(accounts.length > 0){
        setGlobalState('connectedAccount',accounts[0])
      } else{
        console.log("Connect to Metamask using the connect buttom")
      }
      
    } catch(err){
      console.error(err.message);
    }
  } else{
    console.log("please install Metamask")
  }
}

const addWalletListener = async () => {
  if(typeof window != 'undefined' && typeof window.ethereum != 'undefined') {
    window.ethereum.on("accountsChanged", (accounts) => {
      setGlobalState('connectedAccount',accounts[0])
    })
  } else{
    setGlobalState('connectedAccount',"")
    console.log("please install Metamask")
  }

}

export {
  connectWallet,
  getCurrentWalletConnected,
  addWalletListener,
}