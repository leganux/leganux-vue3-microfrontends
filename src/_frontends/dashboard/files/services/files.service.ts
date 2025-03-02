import { FileListResponse, FileUploadResponse, FileDeleteResponse, IFile } from '../interfaces/file.interface';

class FilesService {
    private readonly API_URL = `${import.meta.env.VITE_API_URL}`;

    private getAuthHeaders(isFormData: boolean = false): Headers {
        const token = localStorage.getItem('idToken');
        if (!token) {
            throw new Error('Authentication token not found');
        }
        const headers = new Headers({
            'Authorization': `Bearer ${token}`
        });
        if (!isFormData) {
            headers.append('Content-Type', 'application/json');
        }
        return headers;
    }

    async listFiles(): Promise<FileListResponse> {
        try {
            const response = await fetch(`${this.API_URL}/files/list`, {
                headers: this.getAuthHeaders()
            });
            return await response.json();
        } catch (error: any) {
            throw new Error(error.message || 'Failed to list files');
        }
    }

    async uploadFile(file: File): Promise<FileUploadResponse> {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${this.API_URL}/files/single`, {
                method: 'POST',
                headers: this.getAuthHeaders(true),
                body: formData
            });
            return await response.json();
        } catch (error: any) {
            throw new Error(error.message || 'Failed to upload file');
        }
    }

    async uploadMultipleFiles(files: File[]): Promise<FileUploadResponse> {
        try {
            const formData = new FormData();
            // Limit to 10 files
            const filesToUpload = files.slice(0, 10);
            filesToUpload.forEach(file => {
                formData.append('files', file);
            });

            const response = await fetch(`${this.API_URL}/files/multi`, {
                method: 'POST',
                headers: this.getAuthHeaders(true),
                body: formData
            });
            return await response.json();
        } catch (error: any) {
            throw new Error(error.message || 'Failed to upload files');
        }
    }

    async getFileDetails(id: string): Promise<{ data: IFile }> {
        try {
            const response = await fetch(`${this.API_URL}/files/${id}`, {
                headers: this.getAuthHeaders()
            });
            return await response.json();
        } catch (error: any) {
            throw new Error(error.message || 'Failed to get file details');
        }
    }

    async deleteFile(id: string): Promise<FileDeleteResponse> {
        try {
            const response = await fetch(`${this.API_URL}/files/${id}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });
            return await response.json();
        } catch (error: any) {
            throw new Error(error.message || 'Failed to delete file');
        }
    }

    getFileViewUrl(id: string): string {
        return `${this.API_URL}/files/view/${id}`;
    }

    getFileIconClass(file: IFile): string {
        const extension = file.extension.toLowerCase().replace('.', '');
        
        const iconMap: { [key: string]: string } = {
            // Images
            jpg: 'bi bi-file-image',
            jpeg: 'bi bi-file-image',
            png: 'bi bi-file-image',
            gif: 'bi bi-file-image',
            // PDFs
            pdf: 'bi bi-file-pdf',
            // Default
            default: 'bi bi-file-earmark'
        };

        return iconMap[extension] || iconMap.default;
    }

    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

export const filesService = new FilesService();
