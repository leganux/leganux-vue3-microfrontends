export interface EmailResponse {
    success: boolean;
    message?: string;
    error?: string;
    code?: number;
    data?: any;
}

export interface EmailRequest {
    to: string;
    subject: string;
    content: string;
}

class EmailService {
    private readonly API_URL = import.meta.env.VITE_API_URL;

    async sendEmail(emailData: EmailRequest): Promise<EmailResponse> {
        try {
            const token = localStorage.getItem('idToken');
            if (!token) {
                throw new Error('Authentication token not found');
            }

            const response = await fetch(`${this.API_URL}/email/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(emailData)
            });

            const data = await response.json();
            return data;
        } catch (error: any) {
            throw new Error(error.message || 'Failed to send email');
        }
    }
}

export const emailService = new EmailService();
