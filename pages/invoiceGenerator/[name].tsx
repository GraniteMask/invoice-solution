import { Button,  Card, Divider,  Grid, List,  Tab, Tabs, TextField, Typography, IconButton } from "@mui/material"
import Layout from "../../components/Layout"
import { useEffect, useState } from "react";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import axios from "axios";
import { ListItem } from "@material-ui/core";
import { styled } from "@mui/system";
import AddProduct from "../../components/AddProduct";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useSnackbar } from 'notistack'
import { useRouter } from 'next/router'
import moment from "moment";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { GetServerSideProps } from 'next'
import { useAppDispatch } from "../../hooks";
import { invoiceAdd } from "../../slices/invoiceSlice";
import { useQuery } from "react-query";

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
 

function InvoiceGenerator({params, userInfo} : {params : {name: string}, userInfo: any}) {
    const dispatch = useAppDispatch()
    const name = params.name
    const address = userInfo
    const [invoiceName, setInvoiceName] = useState('Invoice1')
    const [transactionName, setTransactionName] = useState('Transaction1')
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [edit, setEdit] = useState(false)
    const [changed, setChanged] = useState(false)
    const [option, setOption] = useState(1)
    const [total, setTotal] = useState(0)
    const [invoiceRecord, setInvoiceRecord] = useState<any[]>([])
    const [productList, setProductList] = useState<any[]>([])
    const [eachProductTotal, setEachProductTotal] = useState<any[]>([])
    const [eachProductNames, setEachProductNames] = useState<string[]>([])
    const [eachProductQuantity, setEachProductQuantity] = useState<any[]>([])
    const [eachProductPrice, setEachProductPrice] = useState<any[]>([])
    const [productIteration, setProductIteration] = useState([0])
    const router = useRouter()

    const { data } = useQuery("productList", async()=> axios.get('https://fakestoreapi.com/products'))

    var today = new Date();
    var invoiceDate = moment(today).format("DD/MM/YYYY");
    
    const handleOptions = (event: any, option: any) =>{
        setOption(option)
    }

    const productNumber = (number: any) =>{
        let lastElement = productIteration[productIteration.length - 1]
        var newNumber = lastElement + number
        setProductIteration(array => [...array, newNumber])
    }

    useEffect(()=>{
        setInvoiceRecord(localStorage.getItem('invoices') != undefined ? JSON.parse(localStorage.getItem('invoices') || '') : [])
    },[])

    useEffect(()=>{
        var tempTotal = eachProductTotal.reduce((a: any, b) => parseFloat(a) + parseFloat(b), 0)
        setTotal(tempTotal.toFixed(2))
        
    },[eachProductTotal])


    useEffect(()=>{
        if(data !== undefined){
            setProductList(data?.data)
        }
    },[data])

    const handleChanges = () =>{
        closeSnackbar()
        if(transactionName == 'Transaction1'){
            enqueueSnackbar("Please edit transaction name", {variant: 'error'})    
        }
        else if(invoiceName == 'Invoice1'){
            enqueueSnackbar("Please edit invoice name", {variant: 'error'})    
        }
        else{    

            var invoiceData = [name, address, invoiceName, transactionName, total, eachProductTotal, eachProductNames, eachProductQuantity, eachProductPrice, productIteration, invoiceDate]
            setInvoiceRecord(array=>[...array, invoiceData])
            setOption(0)
            setChanged(true)

        }
    }

    const handleSave = () =>{
        closeSnackbar()
        if(transactionName == 'Transaction1'){
            enqueueSnackbar("Please enter transaction name", {variant: 'error'})    
        }
        else if(invoiceName == 'Invoice1'){
            enqueueSnackbar("Please edit invoice name", {variant: 'error'})    
        }
        else{
                if(changed == true){
                  localStorage.setItem('invoices', JSON.stringify(invoiceRecord))
                  const invoiceData = JSON.parse(localStorage.getItem('invoices') || "")
                  dispatch(invoiceAdd(invoiceData))
                    router.push('/')  
                }else{
                    enqueueSnackbar("Please save changes first", {variant: 'error'}) 
                }

        }
    }

    return(
      <Layout title="Edit Invoice" description="description">
        <div className="invoice-generator-options">
            
            {
                edit ?
                (<div style={{marginRight: "-10.6rem"}}><DefTextField style={{width: "50%"}} variant="outlined" placeholder="Enter Name" onChange={(e)=>setInvoiceName(e.target.value)} /><IconButton onClick={()=>setEdit(false)} style={{marginTop: "10px"}}><CheckCircleOutlineIcon /></IconButton></div>)
                :
                (<div><Typography variant="h6" style={{fontWeight: "700"}}>{invoiceName}<span><IconButton><EditOutlinedIcon onClick={()=>setEdit(true)}/></IconButton></span></Typography></div>)
            }
            <div>
                <Tabs value={option} onChange={handleOptions} style={{color: "#604CC5"}} className="invoice-generator-tabs" >
                    <Tab label="Preview" style={{textTransform: "none"}}  icon={<RemoveRedEyeIcon />} iconPosition="start" 
                    sx={{
                    '&.MuiTab-root:hover':{
                        color: '#7161C5'
                    }
                    }} /> 
                    <Tab label="Edit" style={{textTransform: "none"}}  icon={<EditOutlinedIcon />} iconPosition="start"
                    sx={{
                    '&.MuiTab-root:hover':{
                        color: '#7161C5'
                    }
                    }}/>
                </Tabs>
            </div>
            <div>
                {
                    eachProductNames.length != 0 && total != 0 && option != 0 &&
                    (
                        <Button variant="contained" className="save-changes" onClick={handleChanges}>Save Changes</Button> 
                    )
                }
                <Button variant="contained" className="save-invoice" onClick={handleSave}>Save Invoice</Button>
            </div>
        </div>

        {
            option == 0 ?
            (
                <Card className="invoice-card">
                    <div className="invoice-card-content-wrapper">
                        <div style={{display: "flex", marginTop: "1rem"}}>
                            <img src="https://res.cloudinary.com/rd1/image/upload/v1652425039/logo_pqj32g.png" height="20" style={{marginLeft: "18px"}}/>
                            <Typography variant="body1" style={{color: "#7161C5", fontWeight: "700", fontSize: "1rem", marginLeft: "1rem"}}>Invoice Solution</Typography>  
                        </div>
                        <div style={{marginRight: "18px"}}>
                            <List >
                                <ListItem>
                                    <div className="grow"></div>
                                    <Typography variant="body1" style={{fontWeight: "600"}}>{name}</Typography>
                                </ListItem>
                                <ListItem style={{marginTop: "-1rem"}}>
                                    <div className="grow"></div>
                                    <Typography variant="body1"  style={{fontWeight: "600"}}>{address.address.street}</Typography>
                                </ListItem>
                                <ListItem style={{marginTop: "-1rem"}}>
                                    <div className="grow"></div>
                                    <Typography variant="body1"  style={{fontWeight: "600"}}>{address.address.city}</Typography>
                                </ListItem>
                                <ListItem style={{marginTop: "-1rem"}}>
                                    <div className="grow"></div>
                                    <Typography variant="body1"  style={{fontWeight: "600"}}>{address.address.number}</Typography>
                                </ListItem>
                                <ListItem style={{marginTop: "-1rem"}}>
                                    <div className="grow"></div>
                                    <Typography variant="body1"  style={{fontWeight: "600"}}>{address.address.zipcode}</Typography>
                                </ListItem>
                            </List>          
                        </div>
                    </div>
                    <div className="invoice-card-content-wrapper">
                        <div>
                            <List>
                                <ListItem>
                                    <Typography variant="h6" style={{fontWeight: "700"}}>{transactionName}</Typography>
                                </ListItem>
                                <ListItem style={{marginTop: "-1rem"}}> 
                                    <Typography variant="caption" >Paid on {invoiceDate}</Typography>
                                </ListItem>
                            </List>
                            
                        </div>
                        <div>
                            <List >
                                <ListItem>
                                    <Typography variant="body1" style={{fontWeight: "600"}}>Amount Paid</Typography>
                                </ListItem>
                                <ListItem style={{marginTop: "-1rem"}}>
                                    <Typography variant="h6" style={{fontWeight: "600", color: "#7161C5"}}>${total}</Typography>
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
                            {
                                eachProductNames.length == 0 && <p style={{fontWeight: "500", marginRight: "7rem", marginTop: "1rem"}}>No item was selected.</p>
                            }
                            {productIteration.map((row) => (<>
                            {
                                eachProductTotal[row] != 0 &&
                                (
                                    <TableRow
                                        key={row}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row" >
                                                {eachProductNames[row]}
                                                
                                            </TableCell>
                                            <TableCell align="right">{eachProductPrice[row]}</TableCell>
                                            <TableCell align="right">{eachProductQuantity[row]}</TableCell>
                                            {
                                                eachProductTotal[row] != 0 ? <TableCell align="right">{eachProductTotal[row]}</TableCell> : ""
                                            }
                                            
                                    </TableRow>
                                )
                            }
                                
                                </>))}
                            </TableBody>
                        </Table>
                        
                    </div>
                    {
                        total != 0 &&
                        (
                            <div style={{display: "flex", marginBottom: "5rem"}}>
                                <div className="grow"></div>
                                <div style={{borderTop: "1.06368px solid #DFDCF3", marginRight: "3rem"}}>
                                    <span style={{fontWeight: "500", marginRight: "7rem"}}>Total</span>
                                    <span style={{fontWeight: "500", marginRight: "4rem"}}>${total}</span>
                                </div>
                            </div>
                        )
                    }
                    
                </Card>
            )
            :
            (
                <Card className="invoice-card">
                    <div className="invoice-card-content-wrapper">
                        <div style={{display: "flex", marginTop: "1rem"}}>
                            <img src="https://res.cloudinary.com/rd1/image/upload/v1652425039/logo_pqj32g.png" height="20" style={{marginLeft: "18px"}}/>
                            <Typography variant="body1" style={{color: "#7161C5", fontWeight: "700", fontSize: "1rem", marginLeft: "1rem"}}>Invoice Solution</Typography>  
                        </div>
                        <div style={{marginRight: "18px"}}>
                            <List >
                                <ListItem>
                                    <div className="grow"></div>
                                    <Typography variant="body1" style={{fontWeight: "600"}}>{name}</Typography>
                                </ListItem>
                                <ListItem style={{marginTop: "-1rem"}}>
                                    <div className="grow"></div>
                                    <Typography variant="body1"  style={{fontWeight: "600"}}>{address.address.street}</Typography>
                                </ListItem>
                                <ListItem style={{marginTop: "-1rem"}}>
                                    <div className="grow"></div>
                                    <Typography variant="body1"  style={{fontWeight: "600"}}>{address.address.city}</Typography>
                                </ListItem>
                                <ListItem style={{marginTop: "-1rem"}}>
                                    <div className="grow"></div>
                                    <Typography variant="body1"  style={{fontWeight: "600"}}>{address.address.number}</Typography>
                                </ListItem>
                                <ListItem style={{marginTop: "-1rem"}}>
                                    <div className="grow"></div>
                                    <Typography variant="body1"  style={{fontWeight: "600"}}>{address.address.zipcode}</Typography>
                                </ListItem>
                            </List>          
                        </div>
                    </div>
                    <div className="invoice-card-content-wrapper">
                        <div>
                            <List>
                                <ListItem>
                                    <DefTextField variant="outlined" placeholder="Enter Transaction Name" fullWidth style={{width: '400px'}} onChange={(e)=>setTransactionName(e.target.value)} value={transactionName ? transactionName : ''}/>
                                </ListItem>
                                <ListItem style={{marginTop: "-1rem", marginLeft: "1rem"}}> 
                                    <Typography variant="caption" >Paid on {invoiceDate}</Typography>
                                </ListItem>
                            </List>
                            
                        </div>
                        <div>
                            <List >
                                <ListItem>
                                    <Typography variant="body1" style={{fontWeight: "600"}}>Amount Paid</Typography>
                                </ListItem>
                                <ListItem style={{marginTop: "-1rem"}}>
                                    <Typography variant="h6" style={{fontWeight: "600", color: "#7161C5"}}>${total}</Typography>
                                </ListItem>
                            </List>               
                        </div>
                    </div>
                    <div className="product-box">
                        <Grid container style={{marginLeft: "1.5rem", marginTop: "2rem"}}>
                            <Grid item md={6}>
                                <Typography variant="body1" style={{fontWeight: "bold", color: "#7161C5"}}>Description</Typography>
                            </Grid>
                            <Grid item md={2}>
                                <Typography variant="body1" style={{fontWeight: "bold", color: "#7161C5"}}>Rate</Typography>
                            </Grid>
                            <Grid item md={2}>
                                <Typography variant="body1" style={{fontWeight: "bold", color: "#7161C5"}}>Qty</Typography>
                            </Grid>
                            <Grid item md={2}>
                                <Typography variant="body1" style={{fontWeight: "bold", color: "#7161C5"}}>Line Total</Typography>
                            </Grid>
                        </Grid>
                        <Divider style={{marginLeft: '18px', marginRight:"18px"}}/>
                        
                        {
                            [...Array(productIteration.length)].map((e, i) => {
                                const lineTotalEach = (eachTotal: any) =>{
                                    if(typeof eachProductTotal[i] == undefined){
                                        setEachProductTotal(array=>[...array, eachTotal])
                                    }else{
                                        const tempArray = [...eachProductTotal]
                                        tempArray[i] = eachTotal
                                        setEachProductTotal(tempArray)
                                    }
                                }

                                const eachProductName = (eachName: string) =>{
                                    if(typeof eachProductNames[i] == undefined){
                                        setEachProductNames(array=>[...array, eachName])
                                    }else{
                                        const tempArray = [...eachProductNames]
                                        tempArray[i] = eachName
                                        setEachProductNames(tempArray)
                                    }
                                }

                                const eachQty = (each: any) =>{
                                    if(typeof eachProductQuantity[i] == undefined){
                                        setEachProductQuantity(array=>[...array, each])
                                    }else{
                                        const tempArray = [...eachProductQuantity]
                                        tempArray[i] = each
                                        setEachProductQuantity(tempArray)
                                    }
                                }

                                const eachPrice = (ePrice: any) =>{
                                    if(typeof eachProductPrice[i] == undefined){
                                        setEachProductPrice(array=>[...array, ePrice])
                                    }else{
                                        const tempArray = [...eachProductPrice]
                                        tempArray[i] = ePrice
                                        setEachProductPrice(tempArray)
                                    }
                                }

                                return (<AddProduct productList={productList} productNumber={productNumber} lineTotalEach={lineTotalEach} eachProductName={eachProductName} eachQty={eachQty} eachPrice={eachPrice} eachProductNames = {eachProductNames[i]} eachProductPrice={eachProductPrice[i]} eachProductTotal={eachProductTotal[i]} eachProductQuantity={eachProductQuantity[i]} key={i}/>)})     
                        }  
                    </div>
                    {
                        total != 0 &&
                        (
                            <div style={{display: "flex", marginBottom: "5rem"}}>
                                <div className="grow"></div>
                                <div style={{borderTop: "1.06368px solid #DFDCF3", marginRight: "3rem"}}>
                                    <span style={{fontWeight: "500", marginRight: "7rem"}}>Total</span>
                                    <span style={{fontWeight: "500", marginRight: "4rem"}}>${total}</span>
                                </div>
                            </div>
                        )
                    }
                    
                </Card>
            )
        }


        
      </Layout>  
    )
    
}

export const getServerSideProps: GetServerSideProps = async ({params}) =>{
    const {data} = await axios.get('https://fakestoreapi.com/users/1')
    return{
        props:{
            params,
            userInfo: data,
        }
    }
}

export default InvoiceGenerator