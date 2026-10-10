import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { authServices } from "./auth.service";
import { config } from "../../config";

const register = catchAsync(async (req: Request, res: Response) => {
    const result = await authServices.registerUser(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "User registered successfully",
        data: result,
    });
});

const login = catchAsync(async (req: Request, res: Response) => {
    const result = await authServices.loginUser(req.body);

    const isProduction = config.node_env === "production";

    res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 day
    });

    res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 day
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Login successful",
        data: { accessToken: result.accessToken, user: result.user },
    });
});

const refreshToken = catchAsync(async(req:Request, res:Response) =>{

    const {refreshToken} = req.cookies;
    
    const { accessToken } = await authServices.refreshToken(refreshToken);

    const isProduction = config.node_env === "production";

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 day
    })

    sendResponse(res, { 
        statusCode: httpStatus.OK,
        success: true,
        message: "Token Refreshed successfully", 
        data: { accessToken }
    });
})

const getMe = catchAsync(async (req: Request, res: Response) => {
    const result = await authServices.getMe(req.user!.id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Profile retrieved successfully",
        data: result,
    });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
    const result = await authServices.updateProfile(req.user!.id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Profile updated successfully",
        data: result,
    });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
    const result = await authServices.changePassword(req.user!.id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: result.message,
        data: null,
    });
});

export const authController = { register, login, refreshToken, getMe, updateProfile, changePassword };