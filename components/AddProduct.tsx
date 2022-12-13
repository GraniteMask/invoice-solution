import { ButtonGroup, FormControl, Grid, IconButton, InputBase, MenuItem, Select } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useEffect, useState } from "react";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
PaperProps: {
    style: {
    maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    width: 250,
    },
},
};

export default function AddProduct({productList, productNumber, lineTotalEach, eachProductName, eachQty, eachPrice, eachProductNames, eachProductPrice, eachProductTotal, eachProductQuantity} :{
    productList: any, productNumber: any, lineTotalEach: any, eachProductName: any, eachQty: any, eachPrice: any, eachProductNames: any, eachProductPrice: any, eachProductTotal: any, eachProductQuantity: any
}){
    const [selectedProduct, setSelectedProduct] = useState<any>()
    const [quantity, setQuantity] = useState<any>(eachProductQuantity != undefined ? eachProductQuantity : 0)
    const [first, setFirst] = useState(0)
    const [productName, setProductName] = useState([])
    const [lineTotal, setLineTotal] = useState<any>(0)

    const handleChange = (event: any) => {
        const {
          target: { value },
        } = event;
        setProductName(
          typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleIncrease = () => {
        setQuantity(quantity + 1)
    }

    const handleDecrease = () => {
        if(quantity != 0){
            setQuantity(quantity - 1)
        }
    }

    const handleSelection = (product: any) =>{
        setSelectedProduct(product)
        eachProductName(product.title)
        eachPrice(product.price)
        if(first == 0){
            setFirst(first+1)
            productNumber(1)
        }
        
    }

    useEffect(()=>{
        if(selectedProduct != undefined){
            setLineTotal((parseFloat(selectedProduct.price)*parseFloat(quantity)).toFixed(2))
            eachQty(quantity)
        }   
    },[quantity])

    useEffect(()=>{
        lineTotalEach(lineTotal)
    }, [lineTotal])

    return(
        <Grid container style={{marginLeft: "1.5rem", marginTop: "1rem", marginBottom: "1rem", alignItems: "center"}}>
            <Grid item md={6}>
            <FormControl sx={{  width: "90%" }}>
                <Select
                    
                    displayEmpty
                    value={productName}
                    onChange={handleChange}
                    input={<InputBase className="dropdown-box"/>}
                    renderValue={(selected: any) => {
                        if (selected.length === 0 && eachProductNames == undefined) {
                        return <>Add product</>;
                        }else if(eachProductNames != undefined){
                            return <>{eachProductNames}</>
                        }

                        return selected.title
                    }}
                    MenuProps={MenuProps}
                    inputProps={{ 'aria-label': 'Without label' }}
                    IconComponent={KeyboardArrowDownIcon}
                    
                    >
                    {productList.length != 0 && productList.map((product: any) => (
                        <MenuItem
                        key={product}
                        value={product}
                        onClick={()=>handleSelection(product)}
                        >
                            {product.title}
                        </MenuItem>
                    ))}
                    </Select>
            </FormControl>
            </Grid>
            <Grid item md={2}>
                {
                    selectedProduct != undefined ? (<p style={{fontWeight: "700"}}>${selectedProduct.price}</p>) : eachProductPrice != undefined ? (<p style={{fontWeight: "700"}}>${eachProductPrice}</p>) : ""
                }
            </Grid>
            <Grid item md={2}>
                {
                    selectedProduct != undefined ?
                    (
                        <div className="quantitySelector">
                            <Grid container>
                                <Grid item md={6} style={{marginTop: "0.9rem"}}>
                                    {quantity != undefined ? quantity : 0}
                                    
                                </Grid>
                                <Grid item md={6}>
                                <ButtonGroup
                                    orientation="vertical"
                                >
                                    <IconButton  style={{marginTop: "-0.5rem"}} onClick={()=>handleIncrease()}><KeyboardArrowUpIcon/></IconButton>
                                    <IconButton  style={{marginTop: "-1.2rem"}} onClick={()=>handleDecrease()}><KeyboardArrowDownIcon/></IconButton>
                                </ButtonGroup>
                                </Grid>
                            </Grid>
                        </div>
                    )
                    :
                    eachProductQuantity != undefined ?
                    (
                        <div className="quantitySelector">
                            <Grid container>
                                <Grid item md={6} style={{marginTop: "0.9rem"}}>
                                    {quantity}
                                </Grid>
                                <Grid item md={6}>
                                <ButtonGroup
                                    orientation="vertical"
                                >
                                    <IconButton style={{marginTop: "-0.5rem"}} onClick={()=>handleIncrease()}><KeyboardArrowUpIcon/></IconButton>
                                    <IconButton style={{marginTop: "-1.2rem"}} onClick={()=>handleDecrease()}><KeyboardArrowDownIcon/></IconButton>
                                </ButtonGroup>
                                </Grid>
                            </Grid>
                        </div>
                    )
                    : ""
                }
                
            </Grid>
            <Grid item md={2}>
                {
                    selectedProduct != undefined ? (<p style={{fontWeight: "700"}}>${lineTotal}</p>) : eachProductTotal != undefined ? (<p style={{fontWeight: "700"}}>${eachProductTotal}</p>) : ""
                }
            </Grid>
        </Grid>
    )
}