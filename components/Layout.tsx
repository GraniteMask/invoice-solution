import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import {AppBar, Typography, Toolbar, Link, ThemeProvider, CssBaseline,  Box, } from '@material-ui/core'
import { createTheme } from '@material-ui/core/styles'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { invoiceAdd } from '../slices/invoiceSlice'
import { useAppDispatch } from '../hooks'

export default function Layout({title, description, children}:{children: React.ReactNode, description: string, title: string}) {

    const router = useRouter()
    const dispatch = useAppDispatch()
    
    const theme = createTheme({
        typography:{
            h1:{
                fontSize: '1.6rem',
                fontWeight: 400,
                margin: '1rem 0',
            },
            h2:{
                fontSize: '1.4rem',
                fontWeight: 400,
                margin: '1rem 0',
            },
            body1:{
                fontWeight: 'normal',
            },  
        },
        palette:{
            primary:{
                main: '#000000',
            },
            secondary:{
                main: "#604CC5",
            },
            background: {
                default: "#ffffff",
            },
        },
    })

    useEffect(()=>{
        const invoiceData = localStorage.getItem('invoices') !== null  ? JSON.parse(localStorage.getItem('invoices') || "") : []
        dispatch(invoiceAdd(invoiceData))
    },[])

    return (
        <div>
            <Head>
                <title>{title? title : 'The Invoice Solution'}</title>
                {description && <meta name="description" content={description}></meta>}
            </Head>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <AppBar position="static" className="navbar" >
                    <NextLink href={title === 'Edit Invoice' ? '/' : title === 'Customers' ? '/customers' : title === 'Product List' ? '/productList' : ""} passHref>
                        <Link style={{textDecoration: "none"}}>
                            <div style={{display: "flex", marginTop: "1rem"}}>
                                <Typography variant="h6" className="invoice-generator-navbar">{title !== 'Invoice Solution' && title}</Typography>  
                            </div>
                        </Link>
                    </NextLink>
                    
                </AppBar>
                <div className="children" >
                    {children}
                </div>
                <footer className="footer">
                    <Typography>
                        &copy; 2022 Ratnadeep Das Choudhury
                    </Typography>
                </footer>
            </ThemeProvider>
        </div>
    )
}


