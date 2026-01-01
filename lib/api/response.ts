import { NextResponse } from "next/server";

export interface ApiSuccessResponse<T = any> {
    success: true;
    data: T;
    message: string;
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
    };
}

export interface ApiErrorResponse {
    success: false;
    error: {
        message: string;
        details?: any;
    };
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

export function successResponse<T = any>(data: T, message: string = "OK", status: number = 200, meta?: ApiSuccessResponse["meta"]) {
    const response: ApiSuccessResponse<T> = {
        success: true,
        data,
        message,
        ...(meta && { meta }),
    };

    return NextResponse.json(response, { status });
}

export function errorResponse(message: string, status: number = 500, details?: any, error?: any) {
    if (error) {
        console.error(`[API Error - ${status}]`, message, error);
    }

    const response: ApiErrorResponse = {
        success: false,
        error: {
            message,
            ...(details && { details }),
        },
    };

    return NextResponse.json(response, { status });
}

export function badRequestResponse(message: string = "The request could not be understood or was missing required parameters", details?: any) {
    return errorResponse(message, 400, details);
}

export function unauthorizedResponse(message: string = "Authentication is required to access this resource", details?: any) {
    return errorResponse(message, 401, details);
}

export function forbiddenResponse(message: string = "You do not have permission to access this resource", details?: any) {
    return errorResponse(message, 403, details);
}

export function notFoundResponse(message: string = "The requested resource was not found", details?: any) {
    return errorResponse(message, 404, details);
}

export function conflictResponse(message: string = "The request could not be completed due to a conflict with the current state", details?: any) {
    return errorResponse(message, 409, details);
}

export function validationErrorResponse(message: string = "The provided data failed validation", details?: any) {
    return errorResponse(message, 422, details);
}

export function serverErrorResponse(message: string = "An unexpected error occurred while processing your request", error?: any) {
    return errorResponse(message, 500, undefined, error);
}

export function createdResponse<T = any>(data: T, message?: string) {
    return successResponse(data, message || "Resource created successfully", 201);
}

export function noContentResponse() {
    return new NextResponse(null, { status: 204 });
}

export function paginatedResponse<T = any>(data: T[], page: number, limit: number, total: number, message?: string) {
    return successResponse(data, message, 200, {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    });
}
