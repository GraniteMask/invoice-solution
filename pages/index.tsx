import type { NextPage } from 'next'
import { Accordion, AccordionDetails, AccordionSummary, Button, Card, Grid, IconButton, List, ListItem, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { styled } from '@mui/material/styles';
import Layout from "../components/Layout";
import { useRouter } from 'next/router'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import DeleteIcon from '@mui/icons-material/Delete';
import { invoiceAdd } from '../slices/invoiceSlice';
import { useAppDispatch } from '../hooks';
import NextLink from 'next/link'
import { Link } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from 'next/image';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';


const DefTextField = styled(TextField)({
 
  '& .MuiOutlinedInput-root': {
    '& fieldset':{
      borderRadius: "14.86px",
    },
    '&.Mui-focused fieldset': {
      borderColor: '#0B0705',
    },
  },
});

const Home: NextPage = () => {
  const [name, setName] = useState('')
  const [invoices, setInvoices] = useState<any[]>([])
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const customSlider = useRef<Slider>(null);

  useEffect(()=>{
    setInvoices(localStorage.getItem('invoices') !== null ? JSON.parse(localStorage.getItem('invoices') || "") : [])
    const invoiceData = localStorage.getItem('invoices') !== null  ? JSON.parse(localStorage.getItem('invoices') || "") : []
    dispatch(invoiceAdd(invoiceData))
  },[])

  const handleDelete = (name: string) =>{
    if(invoices != null){
      for(var i=0; i<invoices.length; i++){
        if(invoices[i][2] == name){
          var tempInvoice = invoices
          tempInvoice.splice(i, 1)
          setInvoices(tempInvoice)
          localStorage.setItem('invoices', JSON.stringify(invoices))
          const invoiceData = JSON.parse(localStorage.getItem('invoices') || "")
          dispatch(invoiceAdd(invoiceData))
          router.push('/')
        }
      }
    }
    
  }


  const handleSubmit = () =>{
    closeSnackbar()
    if(name !== ''){
      router.push(`/invoiceGenerator/${name}`)
    }else{
      enqueueSnackbar("Please enter customer's name to proceed", {variant: 'error'})    
    }
    
  }

  function NextArrow(props:any) {
    const { className, style, onClick } = props;
    return (
      <ChevronRightRoundedIcon onClick={onClick} style={{...style, display: "block", color: '#7161C5'}} className={className} />
    );
  }
  
  function PrevArrow(props:any) {
    const { className, style, onClick } = props;
    return (
      <ChevronLeftRoundedIcon onClick={onClick} style={{...style, display: "block", color: '#7161C5'}} className={className}/>
    );
  }

  const settings = {
      className: "center",
      centerMode: true,
      infinite: true,
      centerPadding: "60px",
      slidesToShow: 3,
      speed: 500,
      dots: true,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />
  };

  return(
    <Layout title="Invoice Solution" description="description">
      <Typography variant="h1" className="invoice-generator">Invoice Solution</Typography>
      <Grid container>
        <Grid item xs={8} md={8}>
          <Grid container>
            <Grid item xs={12} md={9}>
              <DefTextField variant="outlined" placeholder="Enter Customer's Name" onChange={(e)=>setName(e.target.value)} fullWidth/>
            </Grid>
            <Grid item xs={12} md={3} style={{margin: "auto", paddingLeft: "15px"}}>
              <Button variant="contained" className="button-text-transform button-style" onClick={handleSubmit}>Generate Invoice</Button>
            </Grid>
            <div style={{display: "flex", marginTop: "2rem", alignItems: "center"}}>
              <Typography variant="body1">See list of all customers: </Typography>
              <NextLink href="/customers" passHref>
                <Link style={{color: "#7161C5", marginLeft: "0.5rem", fontWeight: "700"}}>
                  Click Here
                </Link>
              </NextLink>
            </div>
          </Grid>
          <div style={{display: "flex", alignItems: "center"}}>
            <Typography variant="body1">See our product list: </Typography>
            <NextLink href="/productList" passHref>
                <Link style={{color: "#7161C5", marginLeft: "0.5rem", fontWeight: "700"}}>
                  Click Here
                </Link>
            </NextLink>
          </div>
          
        </Grid>
        
      </Grid>

      <div style={{marginTop: "3rem"}}>
        <Slider ref={customSlider} {...settings}>
          <div>
            <Image src="https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg" width={250} height={250}></Image>
          </div>
          <div>
            <Image src="https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg" width={250} height={250}></Image>
          </div>
          <div>
            <Image src="https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg" width={250} height={250}></Image>
          </div>
          <div>
            <Image src="https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg" width={250} height={250}></Image>
          </div>
          <div>
            <Image src="https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg" width={250} height={250}></Image>
          </div>
          <div>
            <Image src="https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_.jpg" width={250} height={250}></Image>
          </div>
        </Slider>
      </div>
          
      
      <Typography variant="h6" style={{fontWeight: "700", marginBottom: "3rem", marginTop: "7rem"}}>Saved Invoices</Typography>
      {
        invoices != null && invoices.length != 0 ?
        invoices.map((invoice)=>(
          <div style={{display: "flex"}} key={Math.random()}>
            <Accordion className="view-invoice" >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon style={{color: "#7161C5"}}/>}
                style={{paddingRight: "2rem"}}
                sx={{
                  minHeight: 100
                }}
              >
                <div>
                  <Typography style={{fontWeight: "700", marginLeft: "1rem"}}>{invoice[2]}</Typography>
                  <Typography variant="caption"  style={{ marginLeft: "1rem"}}>{invoice[10]}</Typography>
                </div>
                
                <div className="grow"></div>
                <Typography style={{color: "#7161C5", margin:"auto"}}>View Invoice</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Card className="invoice-card-front-page" style={{marginBottom: "2rem"}}>
                    <div className="invoice-card-content-wrapper">
                        <div style={{display: "flex", marginTop: "1rem"}}>
                            <Typography variant="body1" style={{color: "#7161C5", fontWeight: "700", fontSize: "1rem", marginLeft: "1rem"}}>Invoice Solution</Typography>  
                        </div>
                        <div style={{marginRight: "18px"}}>
                            <List>
                                <ListItem>
                                    <div className="grow"></div>
                                    <Typography variant="body1" style={{fontWeight: "600"}}>{invoice[0]}</Typography>
                                </ListItem>
                                <ListItem style={{marginTop: "-1rem"}}>
                                    <div className="grow"></div>
                                    <Typography variant="body1"  style={{fontWeight: "600"}}>{invoice[1].address.street}</Typography>
                                </ListItem>
                                <ListItem style={{marginTop: "-1rem"}}>
                                    <div className="grow"></div>
                                    <Typography variant="body1"  style={{fontWeight: "600"}}>{invoice[1].address.city}</Typography>
                                </ListItem>
                                <ListItem style={{marginTop: "-1rem"}}>
                                    <div className="grow"></div>
                                    <Typography variant="body1"  style={{fontWeight: "600"}}>{invoice[1].address.number}</Typography>
                                </ListItem>
                                <ListItem style={{marginTop: "-1rem"}}>
                                    <div className="grow"></div>
                                    <Typography variant="body1"  style={{fontWeight: "600"}}>{invoice[1].address.zipcode}</Typography>
                                </ListItem>
                            </List>          
                        </div>
                    </div>
                    <div className="invoice-card-content-wrapper">
                        <div>
                            <List>
                                <ListItem>
                                    <Typography variant="h6" style={{fontWeight: "700"}}>{invoice[3]}</Typography>
                                </ListItem>
                                <ListItem style={{marginTop: "-1rem"}}> 
                                    <Typography variant="caption" >Paid on {invoice[10]}</Typography>
                                </ListItem>
                            </List>
                            
                        </div>
                        <div>
                            <List >
                                <ListItem>
                                    <Typography variant="body1" style={{fontWeight: "600"}}>Amount Paid</Typography>
                                </ListItem>
                                <ListItem style={{marginTop: "-1rem"}}>
                                    <Typography variant="h6" style={{fontWeight: "600", color: "#7161C5"}}>${invoice[4]}</Typography>
                                </ListItem>
                            </List>               
                        </div>
                    </div>
                    <div className="product-box">
                        <Table style={{marginTop: "2rem", paddingRight: "1.5rem", width: "95%", margin: "0 auto"}} >
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{fontWeight: "bold", color: "#7161C5"}}>Description</TableCell>
                                    <TableCell align="right" style={{fontWeight: "bold", color: "#7161C5"}}>Rate</TableCell>
                                    <TableCell align="right"  style={{fontWeight: "bold", color: "#7161C5"}}>Qty</TableCell>
                                    <TableCell align="right" style={{fontWeight: "bold", color: "#7161C5"}}>Line Total</TableCell>
                                </TableRow>
                                
                            </TableHead>

                            <TableBody>
                            {invoice[9].map((row: any) => (<>
                            {
                               invoice[5][row] != 0 &&
                               (
                                <TableRow
                                key={row}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row" >
                                        {invoice[6][row]}
                                        
                                    </TableCell>
                                    <TableCell align="right">{invoice[8][row]}</TableCell>
                                    <TableCell align="right">{invoice[7][row]}</TableCell>
                                    {
                                      invoice[5][row] != 0 && <TableCell align="right">{invoice[5][row]}</TableCell>
                                    }
                                    
                                </TableRow>
                               )
                            }
                            </>))}
                            </TableBody>
                        </Table>
                        
                    </div>
                    {
                        invoice[4] != 0 &&
                        (
                            <div style={{display: "flex", marginBottom: "5rem"}}>
                                <div className="grow"></div>
                                <div style={{borderTop: "1.06368px solid #DFDCF3", marginRight: "3rem"}}>
                                    <span style={{fontWeight: "500", marginRight: "7rem"}}>Total</span>
                                    <span style={{fontWeight: "500", marginRight: "4rem"}}>${invoice[4]}</span>
                                </div>
                            </div>
                        )
                    }
                    
                </Card>
              </AccordionDetails>
            </Accordion>
            <IconButton onClick={()=>handleDelete(invoice[2])}><DeleteIcon/></IconButton>
          </div>
        )):
        (
          <Typography variant="h6">No Saved Invoices. Please Generate Invoice.</Typography>
        )
      }
    </Layout>
  )
}

export default Home

