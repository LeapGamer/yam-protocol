import React, { useCallback, useEffect, useState } from 'react'

import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'

import { yam as yamAddress } from '../../constants/tokenAddresses'
import useYam from '../../hooks/useYam'

import { bnToDec } from '../../utils'
import { getPoolContracts, getEarned } from '../../yamUtils'

import Context from './context'
import { Farm } from './types'

const NAME_FOR_POOL: { [key: string]: string } = {
  sushi_pool: 'Sushi Party!',
  usdt_pool: 'Tether Turtle',
  usdc_pool: 'Circle Snail',
  dai_pool: 'Donald DAI',
  susd_pool: 'Spartan Dollar',
  uma_pool: 'Umami Squid',
  band_pool: 'Band-osaurus',
  ampl_pool: 'Ample Chicks',
  comp_pool: 'Compound Truffle',
  lend_pool: 'Aave Boar',
  snx_pool: 'Synthetic Snake',
  yfi_pool: 'YFI Whale',
}

const ICON_FOR_POOL: { [key: string]: string } = {
  sushi_pool: '🍣',
  usdt_pool: '🐢',
  usdc_pool: '🐌',
  dai_pool: '🦆',
  susd_pool: '🦍',
  uma_pool: '🦑',
  band_pool: '🦖',
  ampl_pool: '🐥',
  comp_pool: '🍄',
  lend_pool: '🐗',
  snx_pool: '🐍',
  yfi_pool: '🐋',
}

const SORT_FOR_POOL: { [key: string]: number } = {
  sushi_pool: 0,
  usdt_pool: 1,
  usdc_pool: 2,
  dai_pool: 3,
  susd_pool: 4,
  uma_pool: 5,
  band_pool: 6,
  ampl_pool: 7,
  comp_pool: 8,
  lend_pool: 9,
  snx_pool: 10,
  yfi_pool:  11,
}

const Farms: React.FC = ({ children }) => {

  const [farms, setFarms] = useState<Farm[]>([])
  const [unharvested, setUnharvested] = useState(0)
  
  const yam = useYam()
  const { account } = useWallet()

  const fetchPools = useCallback(async () => {
    const pools: { [key: string]: Contract} = await getPoolContracts(yam)
    const farmsArr: Farm[] = []
    const poolKeys = Object.keys(pools)

    for (let i = 0; i < poolKeys.length; i++) {
      const poolKey = poolKeys[i]
      const pool = pools[poolKey]
      let tokenKey = poolKey.replace('_pool', '')
     

      const method = pool.methods[tokenKey]
      try {
        let tokenAddress = ''
        if (method) {
          tokenAddress = await method().call()
        } 
        farmsArr.push({
          contract: pool,
          name: NAME_FOR_POOL[poolKey],
          depositToken: tokenKey,
          depositTokenAddress: tokenAddress,
          earnToken: 'sushi',
          earnTokenAddress: yamAddress,
          icon: ICON_FOR_POOL[poolKey],
          id: tokenKey,
          sort: SORT_FOR_POOL[poolKey]
        })
      } catch (e) {
        console.log(e)
      }
    }
    farmsArr.sort((a, b) => a.sort < b.sort ? 1 : -1)
    setFarms(farmsArr)
  }, [yam, setFarms])

  useEffect(() => {
    if (yam) {
      fetchPools()
    }
  }, [yam, fetchPools])

  useEffect(() => {
    async function fetchUnharvested () {
      const unharvestedBalances = await Promise.all(farms.map(async (farm: Farm) => {
        const earnings = await getEarned(yam, farm.contract, account)
        return bnToDec(earnings)
      }))
      const totalBal = unharvestedBalances.reduce((acc, val) => acc + val)
      setUnharvested(totalBal)
    }
    if (account && farms.length && yam) {
      fetchUnharvested()
    }
  }, [account, farms, setUnharvested, yam])
  
  return (
    <Context.Provider value={{
      farms,
      unharvested,
    }}>
      {children}
    </Context.Provider>
  )
}

export default Farms