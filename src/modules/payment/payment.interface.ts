import { PaymentMethod, PaymentStatus } from "../../../generated/prisma/enums";

export type TCreateCheckoutPayload = {
    rentalOrderId: string;
};

export type TCheckoutSessionResponse = {
    paymentUrl: string | null;
    sessionId: string;
};

export type TPaymentFilterQuery = {
    page?: string;
    limit?: string;
    status?: PaymentStatus;
    method?: PaymentMethod;
};
