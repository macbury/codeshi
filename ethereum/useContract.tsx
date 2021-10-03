import React, { useMemo, useEffect } from 'react'
import { ethers } from "ethers"
import CodeshiTokenAbi from '../artifacts/contracts/CodeshiToken.sol/CodeshiToken.json'
import { CodeshiToken } from '../typechain/CodeshiToken'
import useMetamask from './useMetamask'
import { useCookies } from 'react-cookie'

export const ContractContext = React.createContext<CodeshiToken | null>(null);
const contractAddr = process.env.Token

type NETWORK = 'ropsten' | 'localhost'
const network : NETWORK = process.env.ETH_NETWORK as any

/**
 * Use different provider depending what env is runner
 */
export function useProvider() {
  const isWebBrowser = typeof window !== "undefined"

  return useMemo(() => {
    if (isWebBrowser) {
      const ethereum = (window as any).ethereum

      if (ethereum) {
        console.log('Using metamask provider')
        return new ethers.providers.Web3Provider(ethereum).getSigner(0)
      } else if (network === 'ropsten') {
        console.log('Using public infura ropsten node')
        return new ethers.providers.InfuraProvider(network)
      } else {
        console.log('Using local hardhat node')
        return new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/')
      }
    } else if (network === 'ropsten') {
      console.log('Using private infura ropsten node')
      return new ethers.providers.InfuraProvider(network, process.env.INFURA_API_KEY)
    } else {
      console.log('Using local hardhat node')
      return new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/')
    }
  }, [])
}

export interface IContractProviderProps {
  children : React.ReactNode | any
}

/**
 * Initialize contract and connect to provider
 * @param 
 */
export function ContractProvider({ children } : IContractProviderProps) {
  const [cookies] = useCookies(['signedIn']);
  const provider = useProvider()
  const { metaState, connect } = useMetamask()

  useEffect(() => {
    if (metaState.isAvailable && !metaState.isConnected && cookies.signedIn) {
      connect(ethers.providers.Web3Provider, "any")
    }
  }, [metaState.isAvailable, metaState.isConnected, cookies.signedIn]);

  const contract = useMemo(() => {
    console.log('Using contract with addr', contractAddr)
    const codeshiToken = new ethers.Contract(
      contractAddr,
      CodeshiTokenAbi.abi,
      provider
    );

    return codeshiToken as CodeshiToken
  }, [provider])

  return (
    <ContractContext.Provider value={contract}>
      {children}
    </ContractContext.Provider>
  )
}

export function useContract() {
  return React.useContext(ContractContext)
}