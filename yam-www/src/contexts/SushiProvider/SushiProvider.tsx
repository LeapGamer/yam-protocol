import React, { createContext, useEffect, useState } from 'react'

import { useWallet } from 'use-wallet'

import { sushi } from '../../yam'

export interface sushiContext {
  sushi?: typeof sushi
}

export const Context = createContext<sushiContext>({
  sushi: undefined,
})

declare global {
  interface Window {
    sushisauce: any
  }
}

const sushiProvider: React.FC = ({ children }) => {
  const { ethereum } = useWallet()
  const [sushi, setsushi] = useState<any>()

  useEffect(() => {
    if (ethereum) {
      const sushiLib = new sushi(
        ethereum,
        "1",
        false, {
          defaultAccount: "",
          defaultConfirmations: 1,
          autoGasMultiplier: 1.5,
          testing: false,
          defaultGas: "6000000",
          defaultGasPrice: "1000000000000",
          accounts: [],
          ethereumNodeTimeout: 10000
        }
      )
      setsushi(sushiLib)
      window.sushisauce = sushiLib
    }
  }, [ethereum])

  return (
    <Context.Provider value={{ sushi }}>
      {children}
    </Context.Provider>
  )
}

export default sushiProvider
