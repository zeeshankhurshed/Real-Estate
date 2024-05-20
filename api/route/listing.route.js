import express from 'express'
import { createListing , deleteListing,updateListing,getListing,getListings} from '../controller/listing.controller.js';
import { verifyToken } from '../utiles/verifyUser.js';



const router=express.Router();

router.post('/create', verifyToken, createListing);
router.delete('/delete/:id', verifyToken, deleteListing);
router.post('/update/:id', verifyToken, updateListing);
router.get('/get/:id', getListing);
router.get('/get', getListings);

export default router;
// 7:16:32