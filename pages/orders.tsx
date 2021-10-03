import React, { useEffect, useCallback, useState } from 'react'
import Title from '../components/Title'
import { useContract } from '../ethereum/useContract'

function useOrders() {
  const CodeshiToken = useContract()
  const [orders, setOrders] = useState([])

  const refreshOrders = useCallback(async () => {
    setOrders(await CodeshiToken.getMyOrders())
  }, [CodeshiToken, setOrders])

  useEffect(() => {
    refreshOrders()
  }, [CodeshiToken])

  return orders
}

export default function OrdersPage() {
  const orders = useOrders()

  return (
    <React.Fragment>
      <Title value="Twoje zakupy" />
      
    </React.Fragment>
  )
}