export interface WhatsAppQR {
    qr: string;
    connected: boolean;
}

export interface WhatsAppStatus {
    connected: boolean;
    state: string;
    hasNewMessages: boolean;
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

export interface SendMediaMessagePayload {
    to: string;
    file: FormData;
    type: 'image' | 'video' | 'audio';
    message?: string;
}

export interface WhatsAppFile {
    originalName: string;
    path: string;
    mimeType: string;
    size: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface MediaMessage {
    messageId: string;
    from: string;
    to?: string;
    type: string;
    content?: string;
    mediaUrl: string;
    timestamp: number;
    file?: WhatsAppFile;
}
