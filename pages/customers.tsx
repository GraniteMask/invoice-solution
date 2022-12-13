import { Typography } from '@material-ui/core'
import React from 'react'
import Layout from '../components/Layout'
import { useAppSelector } from '../hooks'
import { useEffect, useState } from "react";

function Customers() {

  const invoices = useAppSelector(state => state.invoice)
  const [customerList, setCustomerList] = useState<string[]>([])

  useEffect(()=>{
    let customerTemp = customerList
    for(let i=0; i<invoices.length; i++){
        if(!customerTemp.includes(invoices[i][0])){
            customerTemp.push(invoices[i][0])
        }
    }
    setCustomerList(customerTemp)
  },[invoices])

  return (
    <Layout title="Customers" description="description">
        <div className="customer-wrapper">
            <Typography variant="h6">Here are the list of customers of saved invoices: </Typography>
        </div>
        {customerList.length !== 0 ? customerList.map((each,idx)=>{
            // console.log(customerList.length)
            return(
                <Typography key={idx} style={{marginTop:"1rem"}}>{idx+1}. {each}</Typography>
            )
        }) : 
        (<Typography style={{marginTop:"1rem"}}>Please add invoices to see all your customers here.</Typography>)
        }
    </Layout>
  )
}

export default Customers