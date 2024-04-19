"use client";

import React, { useState } from "react";
import Dropzone from "react-dropzone";
import Box from '@mui/material/Box';
import Button from "./button";
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import { ArtworkConf, Artwork } from '@/contracts/Artwork'


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

import { CrowdfundingConf } from "@/contracts/Crowdfunding";
import { useAccount, useWriteContract, useChains } from 'wagmi'

const NFTCrowdfundModal = (artwork: Artwork) => {
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
    const [goal, setGoal] = useState("");
    const [deadline, setDeadline] = useState("");

    const handleDrop = (acceptedFiles: File[]) => {
        setFile(acceptedFiles[0]);
    };

    const { data: hash, writeContract } = useWriteContract() 

    let accepted={"image/*": ["jpg", "jpeg", "png", "gif"]}

    // @Keran: your submit button should call this function
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        writeContract({
            address: ArtworkConf.address,
            abi: ArtworkConf.abi,
            functionName: 'approve',
            args: [CrowdfundingConf.address, artwork.id],
        })

        // setUploading(true);
        console.log("tokenID:", artwork.id, "goal:", parseInt(goal), "deadline:", parseInt(deadline));
    
        //listItem -> interact with smart contract
        writeContract({ 
            address: CrowdfundingConf.address,
            abi: CrowdfundingConf.abi,
            functionName: 'createListing',
            args: [artwork.id, parseInt(goal), parseInt(deadline)], 
        })
    };

    return (
        <>
            <Button onClick={handleOpen} variant={"ghost"} width="full">Crowdfund Artwork</Button>
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
                        {/* split layout into two using table */}
                        <table style={{width: '100%', height: '520px'}}>
                            <tr>
                                <th style={{ width: '50%' }}></th>
                                <th style={{ width: '50%' }}></th>
                            </tr>
                            <tr style={{height: '15%'}}>
                                <td>
                                    <label htmlFor="goal">Goal:</label>
                                </td>
                            </tr>
                            <tr style={{height: '15%'}}>
                                <td>
                                    <input
                                            type="text"
                                            id="goal"
                                            placeholder="Crowdfund Target"
                                            style={{width: '95%', border: '1px solid #ccc', padding: '5px', marginTop: '10px', marginBottom: '20px', marginLeft: '0px'}}
                                            onChange={(e) => setGoal(e.target.value)}
                                            required
                                        />
                                </td>
                            </tr>
                            <tr style={{height: '0%'}}>
                                <td>
                                    <label htmlFor="deadline">Deadline:</label>
                                </td>
                            </tr>
                            <tr style={{height: '55%'}}>
                                <td>
                                    <input
                                            id="deadline"
                                            placeholder="Crowdfund! Until..."
                                            style={{width: '95%', border: '1px solid #ccc', padding: '5px', marginTop: '10px', marginBottom: '20px', marginLeft: '0px'}}
                                            onChange={(e) => setDeadline(e.target.value)}
                                            required
                                        />
                                </td>
                            </tr>
                        </table>
                        <Button type="submit" color="primary">Submit</Button>
                    </form>
                    </div>
                </Box>
            </Modal>
            
        </>
    );
}

export default NFTCrowdfundModal;