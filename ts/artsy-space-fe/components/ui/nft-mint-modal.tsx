'use client';

import React, { useState } from "react";
import Dropzone from "react-dropzone";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

// NFT
import { useAccount, useWriteContract } from 'wagmi'
import { Artwork } from '@/contracts/Artwork'


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


const NFTMintModal = () => {
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) {
            alert("Please upload a file");
            return;
        }

        setUploading(true);

        console.log("file.name: ", file.name);

        // 1. Upload NFT file to S3

        // 1.1. get pre-signed URL
        const response = await fetch(
            process.env.NEXT_PUBLIC_BASE_URL + '/api/upload',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ filename: file.name, contentType: file.type }),
            }
        )
        
        // 1.2. upload file to S3
        let fileObjectId;
        let URL;
        if (response.ok) {
            const { url, fields } = await response.json()
            URL = url;
            fileObjectId = fields.key;
            
    
            const formData = new FormData()
            Object.entries(fields).forEach(([key, value]) => {
                formData.append(key, value as string)
            })
            formData.append('file', file)
    
            const uploadResponse = await fetch(url, {
                method: 'POST',
                body: formData,
            })
    
            if (uploadResponse.ok) {
                console.log("Upload successful! File url: ", URL+fileObjectId)
            } else {
                console.error('S3 File Upload Error:', uploadResponse)
            }
        } else {
            console.error('Failed to get pre-signed URL.')
        }

        // 2. Upload NFT metadata to S3
        let metadata = {
            title: title,
            description: description,
            image_url: URL + fileObjectId,
        }
        const response2 = await fetch(
            process.env.NEXT_PUBLIC_BASE_URL + '/api/upload',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ filename: '', contentType: 'application/json' }),
            }
        )

        let tokenURI: string;
        if (response2.ok) {
            const { url, fields } = await response2.json()
            tokenURI = url + fields.key;
            
            const formData = new FormData()
            Object.entries(fields).forEach(([key, value]) => {
                formData.append(key, value as string)
            })
            formData.append('file', JSON.stringify(metadata))
    
            const uploadResponse = await fetch(url, {
                method: 'POST',
                body: formData,
            })
    
            if (uploadResponse.ok) {
                alert('Upload successful!')
                console.log("tokenURI: ", tokenURI)

                // 3. Mint NFT
                console.log("minting NFT");
                writeContract({ 
                    address: Artwork.address, 
                    abi: Artwork.abi, 
                    functionName: 'createArtwork', 
                    args: [ tokenURI ], 
                });
            } else {
                console.error('S3 Upload Error:', uploadResponse)
            }
        } else {
            alert('Failed to get pre-signed URL.')
        }

        setOpen(false);
    }

    return (
        <>
            <Button onClick={handleOpen} variant="contained">Mint NFT</Button>
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
                        Mint Your Artwork!
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

export default NFTMintModal;