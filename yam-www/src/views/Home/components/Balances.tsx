import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import numeral from 'numeral'
import { useWallet } from 'use-wallet'

import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import Label from '../../../components/Label'
import Spacer from '../../../components/Spacer'
import Value from '../../../components/Value'
import YamIcon from '../../../components/YamIcon'

import { yam as yamAddress, yamv2 as yamV2Address } from '../../../constants/tokenAddresses'

import useFarms from '../../../hooks/useFarms'
import useTokenBalance from '../../../hooks/useTokenBalance'
import useUnharvested from '../../../hooks/useUnharvested'
import useYam from '../../../hooks/useYam'

import { bnToDec } from '../../../utils'
import { getV2Supply } from '../../../yamUtils'

const Balances: React.FC = () => {
  return (
    <StyledWrapper>
      <Card>
        <CardContent>
          <StyledBalances>
            <StyledBalance>
              <YamIcon />
              <Spacer />
              <div style={{ flex: 1 }}>
                <Value value='2240%' />
                <Label text="APY" />
              </div>
              <Spacer />
              <div style={{ flex: 1 }}>
                <Value value='4.47%' />
                <Label text="daily ROI" />
              </div>
              <Spacer />
              <div style={{ flex: 1 }}>
                <Value value='0.43' />
                <Label text="SUSHI/hr/$1k" />
              </div>  
              <Spacer />
              <div style={{ flex: 1 }}>
                <Value value='15%' />
                <Label text="imperm. loss" />
              </div>
              <Spacer />
              <div style={{ flex: 1 }}>
                <Value value='98%' />
                <Label text="of Uniswap" />
              </div>
              
              
            </StyledBalance>
          </StyledBalances>
        </CardContent>
      </Card> 
    </StyledWrapper>
    
  )
}

const StyledWrapper = styled.div`
  align-items: center;
  display: flex;
  @media (max-width: 900px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: stretch;
  }
`

const StyledBalances = styled.div`
  display: flex;
`

const StyledBalance = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
`

export default Balances