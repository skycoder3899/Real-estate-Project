import { Router } from "express";
import {addProperty,deleteProperty,getPropertiesForSeller,updateProperty,} from "../controllers/seller.controller.js";
import { verifyJWT, verifySeller } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);
router.use(verifySeller);

router.route("/").get(getPropertiesForSeller); 
router.route("/add").post(addProperty); 
router.route("/:id").put(updateProperty).delete(deleteProperty);

export default router;
