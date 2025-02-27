import { initializeApp } from 'firebase/app';
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    Auth,
    UserCredential
} from 'firebase/auth';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const AUTH_URL = import.meta.env.VITE_AUTH_URL;

export interface AuthResponse {
    success: boolean;
    data?: {
        user: any;
        token: string;
    };
    message?: string;
}

class AuthService {
    private auth: Auth;

    constructor() {
        this.auth = auth;
    }

    private async loginWithBackend(idToken: string, userData?: { firstName?: string; lastName?: string }): Promise<AuthResponse> {
        try {
            const response = await fetch(`${AUTH_URL}/api/v1/auth/login-with-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    idToken,
                    ...userData
                })
            });

            const data = await response.json();

      if (data.success) {
        localStorage.setItem('customToken', data.data.token);
        localStorage.setItem('idToken', idToken);
        localStorage.setItem('user', JSON.stringify(data.data.user));
      }

            return data;
        } catch (error) {
            throw new Error('Backend authentication failed');
        }
    }

    async loginWithEmail(email: string, password: string): Promise<AuthResponse> {
        try {
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
            const idToken = await userCredential.user.getIdToken();
            return await this.loginWithBackend(idToken);
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async registerWithEmail(email: string, password: string, name: string): Promise<AuthResponse> {
        try {
            const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
            const idToken = await userCredential.user.getIdToken();
            return await this.loginWithBackend(idToken, { firstName: name });
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async loginWithGoogle(): Promise<AuthResponse> {
        try {
            const result = await signInWithPopup(this.auth, googleProvider);
            const idToken = await result.user.getIdToken();
            const names = result.user.displayName?.split(' ') || [];

            return await this.loginWithBackend(idToken, {
                firstName: names[0],
                lastName: names.slice(1).join(' ')
            });
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async resetPassword(email: string): Promise<void> {
        try {
            await sendPasswordResetEmail(this.auth, email);
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

  logout(): void {
    localStorage.removeItem('customToken');
    localStorage.removeItem('idToken');
    localStorage.removeItem('user');
    this.auth.signOut();
  }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('customToken');
    }
}

export const authService = new AuthService();
