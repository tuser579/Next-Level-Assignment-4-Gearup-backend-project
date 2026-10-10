export type TRegisterPayload = {
    name: string;
    email: string;
    password: string;
    phone?: string;
    profileImage?: string;
    address?: string;
}

export type TLoginPayload = {
    email: string;
    password: string;
}

export type TUpdateProfilePayload = {
    name: string;
    phone: string;
    profileImage: string;
    address: string;
}

export type TChangePasswordPayload = {
    oldPassword: string;
    newPassword: string;
}