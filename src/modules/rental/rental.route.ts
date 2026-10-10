import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { rentalController } from "./rental.controller";

const router = Router();

router.post("/", auth(Role.CUSTOMER), rentalController.createRentalOrder);
router.get("/", auth(Role.CUSTOMER), rentalController.getCustomerRentals);
router.get("/:id", auth(Role.CUSTOMER, Role.PROVIDER, Role.ADMIN), rentalController.getRentalById);
router.patch("/:id/cancel", auth(Role.CUSTOMER, Role.ADMIN), rentalController.cancelRentalOrder);

export const rentalRoutes = router;
