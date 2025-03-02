export interface WhatsAppQR {
    qr: string;
    connected: boolean;
}


export interface WhatsAppMessage {
    messageId: string;
    from: string;
    to?: string;
    type: string;
    content: string;
    mediaUrl?: string;
    timestamp: number;
}

export interface WhatsAppChat {
    jid: string;
    name?: string;
    lastMessageTimestamp: number;
    unreadCount: number;
    messages?: WhatsAppMessage[];
}

export interface SendMessagePayload {
    to: string;
    message: string;
    type?: 'text' | 'image' | 'video' | 'audio';
    mediaPath?: string;
}
