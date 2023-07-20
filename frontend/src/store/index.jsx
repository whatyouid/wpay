import { createGlobalState } from 'react-hooks-global-state'

const { setGlobalState, useGlobalState, getGlobalState } = createGlobalState({
    connectedAccount: '',
    usdtPrice: null,
    busdPrice: '',
    usdcPrice: '',
    modalPulsa: 'hide',
    modalCrypto: 'hide'

})

export {
    useGlobalState,
    setGlobalState,
    getGlobalState,
}