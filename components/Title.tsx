import Head from 'next/head'
import React from 'react'

export interface ITitleProps {
  value: string
}

export default function Title({ value } : ITitleProps) {
  return (
    <Head>
      <title>{value} - Ryneczek Codestu</title>
    </Head>
  )
}