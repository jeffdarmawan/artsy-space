"use client";

import React, { useState } from "react";
import Dropzone from "react-dropzone";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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


import abi from '@/contracts/abi/MyToken_abi.json' 
import { useAccount, useWriteContract, useChains } from 'wagmi'

const NFTCrowdfundModal = () => {
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
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleDrop = (acceptedFiles: File[]) => {
        setFile(acceptedFiles[0]);
    };

    const { data: hash, writeContract } = useWriteContract() 

    let accepted={"image/*": ["jpg", "jpeg", "png", "gif"]}

    // @Keran: your submit button should call this function
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) {
            alert("Please upload a file");
            return;
        }

        setUploading(true);
    
        // TODO: listItem -> interact with smart contract
        
        // example: this transfers MyToken we did in the gmeet
        const handleTransfer = () => {
            console.log("transferring");
            writeContract({ 
            address: '0x18Bd9dC4F31f2Fbd7Fa2C7524a076DB877c5C239', 
            abi: abi, 
            functionName: 'transfer', 
            args: ['0x475b87f5C780E7F425B64fd041b4de3ca328658f', 2000], 
            }) 
        };
    }

    return (
        <>
            <Button onClick={handleOpen} variant="contained">Crowdfund NFT</Button>
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
                        Crowdfund Your Artwork!
                    </Typography>

                    <div style={{marginTop: '20px'}}>
                    <form onSubmit={handleSubmit}>
                        <input
                                    type="text"
                                    id="tokenId"
                                    placeholder="Put tokenId here"
                                    style={{width: '95%', border: '1px solid #ccc', padding: '5px', marginTop: '10px', marginBottom: '20px', marginLeft: '0px'}}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                        {/* split layout into two using table */}
                        <table style={{width: '100%', height: '520px'}}>
                            <tr>
                                <th style={{ width: '50%' }}></th>
                                <th style={{ width: '50%' }}></th>
                            </tr>
                            <tr style={{height: '15%'}}>
                                <td>
                                    <label htmlFor="title">Title:</label>
                                </td>
                                <td rowSpan={4}>
                                    {file && <img src={URL.createObjectURL(file)} alt="uploaded" />}
                                    {!file &&
                                        <Dropzone onDrop={handleDrop} accept={accepted} minSize={1024} maxSize={307200}>
                                            {({ getRootProps, getInputProps }) => (
                                                <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center"
                                                    style={{height: '100%'}}>
                                                    <input {...getInputProps()} />
                                                    <p>Drag n' drop some files here, or click to select files</p>
                                                </div>
                                            )}
                                        </Dropzone>
                                    }   
                                </td>
                            </tr>
                            <tr style={{height: '15%'}}>
                                <td>
                                    <input
                                            type="text"
                                            id="title"
                                            placeholder="Add Artwork Title"
                                            style={{width: '95%', border: '1px solid #ccc', padding: '5px', marginTop: '10px', marginBottom: '20px', marginLeft: '0px'}}
                                            onChange={(e) => setTitle(e.target.value)}
                                            required
                                        />
                                </td>
                            </tr>
                            <tr style={{height: '15%'}}>
                                <td>
                                    <label htmlFor="description">Description:</label>
                                </td>
                            </tr>
                            <tr style={{height: '55%'}}>
                                <td>
                                    <textarea
                                            id="description"
                                            placeholder="Add Artwork Description"
                                            style={{width: '95%', height: '100%', border: '1px solid #ccc', padding: '5px', marginTop: '10px', marginBottom: '20px', marginLeft: '0px'}}
                                            onChange={(e) => setDescription(e.target.value)}
                                            required
                                        />
                                </td>
                            </tr>
                        </table>
                        <Button type="submit" variant="contained" color="primary">Submit</Button>
                    </form>
                    </div>
                </Box>
            </Modal>
            
        </>
    );
}

export default NFTCrowdfundModal;