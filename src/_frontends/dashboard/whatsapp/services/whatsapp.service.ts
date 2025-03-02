import axios from 'axios';
import type { WhatsAppQR, WhatsAppChat, SendMessagePayload, WhatsAppMessage, WhatsAppStatus } from '../interface/whatsapp.interface';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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
            const qrResponse = await axios.get(`${this.baseUrl}/qr`);
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

    async getConnectionStatus(): Promise<Boolean> {
        try {
            const response = await axios.get<WhatsAppStatus>(`${this.baseUrl}/status`);
            return response?.data.status == 'connected' ? true : false
        } catch (error) {
            console.error('Error getting connection status:', error);
            return false;
        }
    }

    async getChats(): Promise<WhatsAppChat[]> {
        try {
            const response = await axios.get<WhatsAppChat[]>(`${this.baseUrl}/chats`);
            return response.data;
        } catch (error) {
            console.error('Error getting chats:', error);
            return [];
        }
    }

    async getChatMessages(chatId: string): Promise<WhatsAppMessage[]> {
        try {
            const response = await axios.get<WhatsAppMessage[]>(`${this.baseUrl}/messages/${chatId}`);
            return response.data;
        } catch (error) {
            console.error('Error getting messages:', error);
            return [];
        }
    }

    async sendMessage(payload: SendMessagePayload): Promise<WhatsAppMessage> {
        const response = await axios.post<WhatsAppMessage>(`${this.baseUrl}/send`, {
            to: payload.to,
            content: payload.message,
            type: 'text'
        });
        return {
            ...response.data,
            from: 'me' // Mark as sent by me
        };
    }

    async updateChatName(jid: string, name: string): Promise<void> {
        await axios.put(`${this.baseUrl}/chat/${jid}/name`, { name });
    }

}
