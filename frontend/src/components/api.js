import axios from "axios"
import { setGlobalState, useGlobalState } from "../store/index"

const url = 'https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=idr'

async function getPrice() {
    const response = await axios.get(url);
    const data = await response.json();
    console.log(data)
}




// export const getPrice = async () => {
//     const price = await axios.get(url)
//     // console.log({priceList: price})
//     return price.data
// }

// parseInt(price) * 99 / 100)