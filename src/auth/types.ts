// types.ts
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';

export const SUPPORTED_PROVIDERS = ['google', 'github', 'twitter', 'apple', 'email'] as const;
export type SupportedProviders = typeof SUPPORTED_PROVIDERS[number];

export const AuthProviders = new Map<SupportedProviders | 'email', FirebaseAuthTypes.AuthProvider | null>([
    ['google', null],
    ['github', null],
    ['twitter', null],
    ['apple', null],
    ['email', null]
]);

export type AuthMode = 'standalone';

export interface AuthState {
    currentUser: FirebaseAuthTypes.User | null;
    token: string;
    loading: boolean;
    mode: AuthMode;
}

/**
 * Props for the AuthProvider component
 */
export interface AuthProviderProps {
    children: React.ReactNode;
}

export interface AuthContextType extends Omit<AuthState, 'mode'> {
    loginWithSSO: () => Promise<void>;
    loginWithProvider: (provider: SupportedProviders) => Promise<void>;
    loginWithEmailAndPassword: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

export interface SSOResponse {
    token: string;
}
