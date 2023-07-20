import React from 'react'

const Alert = () => {
    return (
        <div class="alert alert-success w-50 h-25 position-absolute" role="alert">
            <h5 class="alert-heading">Teransaksi berhasil diproses!</h5>
            <button className='btn btn-success'>Close</button>
        </div>
    )
}

export default Alert