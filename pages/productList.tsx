import { Typography } from '@material-ui/core'
import React from 'react'
import Layout from '../components/Layout'
import { useAppSelector } from '../hooks'
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import Image from 'next/image';

function ProductList() {

  const [imageList, setImageList] = useState<any[]>([])

  const { data } = useQuery("productList", async()=> axios.get('https://fakestoreapi.com/products'))

  useEffect(()=>{
    if(data !== undefined){
        setImageList(data?.data)
    }
    
  },[data])

  return (
    <Layout title="Product List" description="description">
        <div className="customer-wrapper">
            <Typography variant="h6">Here are the list of our Products: </Typography>
        </div>
        {imageList.length !== 0 ? imageList.map((each,idx)=>{
            // console.log(customerList.length)
            return(
              <div key={idx} style={{display: "flex", justifyContent: "center", alignItems:"center"}}>
                <div style={{width: "500px", height: "500px", position: "relative"}}>
                  <Image src={each.image} key={idx} layout="fill" objectFit="contain"></Image>
                </div>
                <div style={{marginLeft: "2rem"}}>
                  <Typography variant='h4'>{each.title}</Typography>
                  <Typography variant='h6'>Rs.{each.price}</Typography>
                  <Typography variant='h6'>{each.category} category</Typography>
                  <Typography variant='body1'>{each.description}</Typography>
                </div>
                
              </div>
            )
        }) : 
        (<Typography style={{marginTop:"1rem"}}>Loading...</Typography>)
        }
    </Layout>
  )
}

export default ProductList