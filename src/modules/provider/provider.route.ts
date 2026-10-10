import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { gearController } from "../gear/gear.controller";
import { rentalController } from "../rental/rental.controller";

const router = Router();

// Provider Gear Inventory Management
router.post("/gear", auth(Role.PROVIDER), gearController.addGearByProvider);
router.put("/gear/:id", auth(Role.PROVIDER), gearController.updateGearByProvider);
router.delete("/gear/:id", auth(Role.PROVIDER), gearController.deleteGearByProvider);
router.get("/my-gear", auth(Role.PROVIDER), gearController.getProviderGear);

// Provider Rental Orders Management
router.get("/orders", auth(Role.PROVIDER), rentalController.getProviderIncomingOrders);
router.patch("/orders/:id", auth(Role.PROVIDER), rentalController.updateOrderStatusByProvider);

export const providerRoutes = router;
