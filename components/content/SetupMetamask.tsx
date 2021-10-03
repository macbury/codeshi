import React from 'react'

export default function SetupMetaMask() {
  return (
    <div className="row justify-content-md-center mt-5">
      <div className="col-6 p-4 text-center">
        <p>
          Nie masz zainstalowanego portfela ethereum!
          <br />
          Proszę zainstaluj{" "}
        </p>
        <div className="d-grid gap-2">
          <a href="https://metamask.io/download.html" className="btn btn-block btn-lg btn-primary" target="_blank" rel="noopener noreferrer">
            MetaMask
          </a>
        </div>
      </div>
    </div>
  )
}