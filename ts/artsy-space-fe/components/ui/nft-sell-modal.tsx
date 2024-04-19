"use client";

import React, { useState } from "react";
import Dropzone from "react-dropzone";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';


// modal style 
const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1080,
    height: 720,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 3,
    p: 4,
  };


import { MarketplaceConf } from '@/contracts/Marketplace' 
import { useAccount, useWriteContract, useChains } from 'wagmi'
import { Artwork } from "@/contracts/Artwork";
import Button from "./button";

const NFTSellModal = (artwork: Artwork) => { 
    // file state
    const [file, setFile] = useState<File>();
    const [uploading, setUploading] = useState(false);

    // modal state
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setFile(undefined);
    }

    // form state
    const [tokenID, setTokenID] = useState("");
    const [price, setPrice] = useState("");

    const handleDrop = (acceptedFiles: File[]) => {
        setFile(acceptedFiles[0]);
    };

    let accepted={"image/*": ["jpg", "jpeg", "png", "gif"]}

    const { data: hash, writeContract } = useWriteContract() 

    // @Keran: your submit button should call this function
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        // listItem -> interact with smart contract
        console.log("transferring");
        writeContract({ 
            address: MarketplaceConf.address, // address of contract "MarketPlace.sol"
            abi: MarketplaceConf.abi, 
            functionName: 'createListing', 
            args: [artwork.id, parseInt(price)], // tokenID, price
        }) 
        
    }

    return (
        <>
            <Button onClick={handleOpen} width="full">Sell Artwork</Button>
            <Modal 
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                <Box sx={style}>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                        >
                        <CloseIcon />
                    </IconButton>
                    <Typography id="modal-modal-title" variant="h4" component="h2">
                        Sell Your Artwork!
                    </Typography>

                    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                        <label htmlFor="price" style={{ display: 'block', marginBottom: '5px' }}>Price:</label>
                            <input
                                type="number"
                                id="price"
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="Selling at ..."
                                style={{ width: '100%', padding: '10px', border: '1px solid #ccc' }}
                                required
                            />
                        </div>
                        {/* style={{ padding: '10px 20px', background: 'blue', color: 'white', border: 'none', cursor: 'pointer' }} */}
                        <Button type="submit"> Sell </Button>
                    </form>
                    </div>
                </Box>
            </Modal>
            
        </>
    );
}

export default NFTSellModal;