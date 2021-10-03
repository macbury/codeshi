import React, { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'
import { useCookies } from 'react-cookie'
import useMetamask from '../ethereum/useMetamask'
import { useContract } from '../ethereum/useContract'

function useCurrentBalance(account) {
  const CodeshiToken = useContract()
  const [codeshi, setCodeshi] = useState(0)

  const refreshBalance = useCallback(async () => {
    const balance = await CodeshiToken.balanceOf(account)
    setCodeshi(balance.toNumber())
    console.log('Refreshed balance', balance.toNumber())
  }, [setCodeshi, account, CodeshiToken])

  useEffect(() => {
    if (!account) {
      return
    }

    refreshBalance()

    CodeshiToken.on('Transfer', refreshBalance)

    return () => {
      CodeshiToken.removeListener('Transfer', refreshBalance)
    }
  }, [account, refreshBalance, CodeshiToken])

  return codeshi
}

export default function SessionProfiler() {
  const router = useRouter()
  const CodeshiToken = useContract()
  const { metaState: { isAvailable, isConnected, account }, connect } = useMetamask()
  const balance = useCurrentBalance(account && account[0])
  const [cookies, setCookie, removeCookie] = useCookies();
  
  const connectWallet = useCallback(async (e) => {
    e.preventDefault()
  
    try {
      await connect(ethers.providers.Web3Provider, "any")
      setCookie('signedIn', true)
      router.replace('/')
    } catch (e) {
      console.log(e)
      console.error('signin', e)
    }
  }, [connect, setCookie, router])
  
  if (isConnected) {
    return (
      <div className="d-flex">
        <span className="navbar-text">
          Posiadasz: <b>{balance}</b> CX (codeshi)
        </span>
      </div>
    )
  } else if (!isAvailable) {
    return (
      <div className="d-flex">
        <Link href="/metamask">
          <a className="btn btn-outline-warning">Skonfiguruj portfel</a>
        </Link>
      </div>
    )
  } else {
    return (
      <div className="d-flex">
        <a className="btn btn-outline-warning" onClick={(e) => connectWallet(e)}>Zaloguj się</a>
      </div>
    )
  }
}