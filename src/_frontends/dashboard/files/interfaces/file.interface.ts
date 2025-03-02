export interface IFile {
    _id: string;
    originalName: string;
    fileName: string;
    extension: string;
    path: string;
    mimeType: string;
    size: number;
    createdAt: string;
    updatedAt: string;
}

export interface FileUploadResponse {
    error: null | string;
    success: boolean;
    message: string;
    code: number;
    data: {
        filepath: IFile;
    };
}

export interface FileListResponse {
    error: null | string;
    success: boolean;
    message: string;
    code: number;
    data: IFile[];
}

export interface FileDeleteResponse {
    error: null | string;
    success: boolean;
    message: string;
    code: number;
    data: Record<string, never>;
}

export interface FileIconMap {
    [key: string]: string;
    default: string;
    pdf: string;
    image: string;
}
