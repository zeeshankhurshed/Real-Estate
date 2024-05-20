import express from 'express'
import { deleteUser, test, updatedUser,getUserListings,getUser } from '../controller/user.controller.js';
import { verifyToken } from '../utiles/verifyUser.js';

const router=express.Router();

router.get('/test', test);
router.post('/update/:id',verifyToken, updatedUser)
router.delete('/delete/:id', verifyToken, deleteUser);
router.get('/listings/:id', verifyToken, getUserListings)
router.get('/:id', verifyToken, getUser)

export default router;