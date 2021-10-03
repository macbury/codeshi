import React, { useCallback } from 'react'
import Redis from 'ioredis'
import { ethers } from 'ethers'

import Title from '../../../components/Title'
import { useContract } from '../../../ethereum/useContract'
import { Product, products } from '../../../products'
import useMetamask from '../../../ethereum/useMetamask'

export interface IOrderPageProps {
  product: Product
  order: {
    productId: string
    nonce: number
    amount: number
    signature: string
  }
}

export default function OrderPage({ product, order } : IOrderPageProps) {
  const contract = useContract()
  const { metaState } = useMetamask()

  const orderNow = useCallback(async () => {
    const tx = await contract.order(order.amount, order.nonce, order.productId, order.signature, { gasLimit: 200000 })
    console.log('waiting for tx', tx)
    await tx.wait()
    console.log('Finished!')
  }, [order, metaState])

  return (
    <React.Fragment>
      <Title value="Nowy zakup" />
      <div className="row mt-5">
        <button className="btn btn-block btn-primary" onClick={orderNow}>Order now</button>
      </div>
    </React.Fragment>
  )
}

const wallet = new ethers.Wallet(process.env.ETH_NETWORK === 'localhost' ? '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80' : process.env.SIGNER_PRIVATE_KEY)
const redis = new Redis()

export async function getServerSideProps({ query: { productId, sender } }) {
  const product = products.find(({ id }) => id === productId)

  if (!product) {
    return {
      notFound: true
    }
  }

  const nonce = await redis.incr('signature:nonce')
  const amount = product.price
  const hash = ethers.utils.solidityKeccak256(['uint256', 'uint256', 'string', 'address'], [amount, nonce, productId, sender]);
  const signature = await wallet.signMessage(ethers.utils.arrayify(hash));

  return {
    props: {
      product,
      order: {
        productId,
        nonce,
        amount,
        signature
      } 
    } as IOrderPageProps
  }
}
