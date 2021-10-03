import 'bootstrap/dist/css/bootstrap.min.css'
import type { AppProps } from 'next/app'
import { MetamaskStateProvider } from 'use-metamask'
import Link from 'next/link'
import { ContractProvider } from '../ethereum/useContract'
import SessionProfiler from '../components/SessionProfile'

function CodeshiStoreApp({ Component, pageProps }: AppProps) {
  return (
    <MetamaskStateProvider>
      <ContractProvider>
        <nav className="navbar navbar-dark bg-dark navbar-expand-sm">
          <div className="container">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link href="/">
                  <a className="nav-link">Sklep</a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/orders">
                  <a className="nav-link">Zakupy</a>
                </Link>
              </li>
            </ul>
            <SessionProfiler />
          </div>
        </nav>

        <div className="container">
          <Component {...pageProps} />
        </div>
      </ContractProvider>
    </MetamaskStateProvider>
  )
}

export default CodeshiStoreApp