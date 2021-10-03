import React from 'react'

import SetupMetaMask from '../components/content/SetupMetamask'
import Title from '../components/Title'

export default function MetaMaskPage() {
  return (
    <React.Fragment>
      <Title value="Zainstaluj metamask" />
      <SetupMetaMask />
    </React.Fragment>
  )
}