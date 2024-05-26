import { Router } from "express";
import {getPropertyById, likeProperty, getPropertyforBuyer } from "../controllers/buyer.controller.js";
import { verifyJWT,verifyBuyer } from "../middlewares/auth.middleware.js";


const router = Router();

router.route("/").get(getPropertyforBuyer);
router.route("/like/:propertyId").get(verifyJWT,verifyBuyer,likeProperty);
router.route("/:id").get(verifyJWT,verifyBuyer,getPropertyById);

export default router;