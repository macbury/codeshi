import React, { useMemo } from 'react'
import Link from 'next/link'
import Title from '../components/Title'
import { products } from '../products'
import useMetamaskWrapper from '../ethereum/useMetamask'

export default function IndexPage() {
  const { metaState: { account } } = useMetamaskWrapper()
  const currentAddress = useMemo(() => account ? account[0] : '0x0000000000000000000000000000000000000000', [account])
  
  const items = products.map((product) => (
    <div className="col-lg-4" key={product.id}>
      <div className="card shadow p-3 mb-5 bg-body rounde">
        <div className="card-body">
          <h5 className="card-title">{product.name}</h5>
          <h6 className="card-subtitle mb-2 text-muted">Działa {product.lifeTime} dni od zakupu</h6>
          <p className="card-text">{product.description}</p>
          <Link href={`/order/${currentAddress}/${product.id}`}>
            <a className="btn btn-primary">Kup za <b>{product.price}</b> codeshi</a>
          </Link>
        </div>
      </div>
    </div>
  ))

  return (
    <React.Fragment>
      <Title value="Strona główna" />
      <div className="row mt-5">
        {items}
      </div>
    </React.Fragment>
  )
}