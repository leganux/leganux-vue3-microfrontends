import axios from 'axios';
import type { 
    WhatsAppQR, 
    WhatsAppChat, 
    SendMessagePayload, 
    SendMediaMessagePayload,
    WhatsAppMessage, 
    WhatsAppStatus,
    MediaMessage,
    WhatsAppFile
} from '../interface/whatsapp.interface';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface ApiResponse<T> {
    error: string | null;
    success: boolean;
    message: string;
    code: number;
    data: T;
}

export class WhatsAppService {
    private static instance: WhatsAppService;
    private baseUrl: string;

    private constructor() {
        this.baseUrl = `${API_URL}/whatsapp`;
    }

    public static getInstance(): WhatsAppService {
        if (!WhatsAppService.instance) {
            WhatsAppService.instance = new WhatsAppService();
        }
        return WhatsAppService.instance;
    }

    async getQRCode(): Promise<WhatsAppQR> {
        try {
            const qrResponse = await axios.get(`${this.baseUrl}/qr`, { responseType: 'text' });
            const qrMatch = qrResponse.data.match(/src="([^"]+)"/);
            if (qrMatch) {
                return { qr: qrMatch[1], connected: false };
            }
            return { qr: '', connected: false };
        } catch (error) {
            console.error('Error getting QR code:', error);
            return { qr: '', connected: false };
        }
    }

    async getConnectionStatus(): Promise<WhatsAppStatus> {
        try {
            const response = await axios.get<ApiResponse<WhatsAppStatus>>(`${this.baseUrl}/status`);
            return response.data.data;
        } catch (error) {
            console.error('Error getting connection status:', error);
            return {
                connected: false,
                state: 'disconnected',
                hasNewMessages: false
            };
        }
    }

    async getChats(): Promise<WhatsAppChat[]> {
        try {
            const response = await axios.get<ApiResponse<WhatsAppChat[]>>(`${this.baseUrl}/chats`);
            return response.data.data;
        } catch (error) {
            console.error('Error getting chats:', error);
            return [];
        }
    }

    async getChatMessages(chatId: string): Promise<WhatsAppMessage[]> {
        try {
            const response = await axios.get<ApiResponse<WhatsAppMessage[]>>(`${this.baseUrl}/messages/${chatId}`);
            return response.data.data;
        } catch (error) {
            console.error('Error getting messages:', error);
            return [];
        }
    }

    async sendMessage(payload: SendMessagePayload): Promise<WhatsAppMessage> {
        try {
            const response = await axios.post<ApiResponse<WhatsAppMessage>>(`${this.baseUrl}/send`, {
                to: payload.to,
                content: payload.message,
                type: payload.type || 'text',
                mediaPath: payload.mediaPath
            });

            // Get fresh status after sending to trigger updates
            await this.getConnectionStatus();
            
            return response.data.data;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }

    async sendMediaMessage(payload: SendMediaMessagePayload): Promise<MediaMessage> {
        try {
            const formData = new FormData();
            formData.append('file', payload.file.get('file') as File);
            formData.append('to', payload.to);
            formData.append('type', payload.type);
            if (payload.message) {
                formData.append('content', payload.message);
            }

            const response = await axios.post<ApiResponse<MediaMessage>>(`${this.baseUrl}/send-media`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Get fresh status after sending to trigger updates
            await this.getConnectionStatus();
            
            return response.data.data;
        } catch (error) {
            console.error('Error sending media message:', error);
            throw error;
        }
    }

    async updateChatName(jid: string, name: string): Promise<void> {
        await axios.put(`${this.baseUrl}/chat/${jid}/name`, { name });
    }

    getFileUrl(fileId: string): string {
        return `${this.baseUrl}/view/${fileId}`;
    }

    getMediaUrl(mediaPath: string): string {
        if (!mediaPath) return '';
        
        // If it's a file ID (MongoDB ObjectId format), use the view endpoint
        if (/^[0-9a-fA-F]{24}$/.test(mediaPath)) {
            return this.getFileUrl(mediaPath);
        }
        
        // Otherwise, it's a direct path
        return `${API_URL}/${mediaPath}`;
    }
}
