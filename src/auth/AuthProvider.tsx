import { useCallback, useEffect, useMemo, useState } from 'react';
import auth from '@react-native-firebase/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import type { AuthProviderProps, AuthState, AuthContextType } from './types';
import { AuthContext } from './AuthContext';
import { updateAuthStore } from './store';
import { LoginView } from '../components/LoginView';

// Configure Google Sign-In
GoogleSignin.configure({
    webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com', // Replace with your web client ID
});

/**
 * Authentication provider for React Native apps using Firebase Auth
 * Handles authentication flows:
 * - Email/Password
 * - Google Sign-In
 */
export function AuthProvider({ children }: AuthProviderProps) {
    /**
     * Auth state containing current user, token, and loading state
     */
    const [state, setState] = useState<AuthState>({
        currentUser: null,
        token: "",
        loading: true,
        mode: 'standalone',
    });

    /**
     * Handles Google Sign-In
     */
    const loginWithProvider = useCallback(async (provider: 'google' | 'github' | 'twitter' | 'apple' | 'email') => {
        if (provider !== 'google') {
            throw new Error(`Provider ${provider} is not supported`);
        }

        try {
            // Check if your device supports Google Play
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

            // Sign in and get the user info
            await GoogleSignin.signIn();

            // Get the ID token
            const { idToken } = await GoogleSignin.getTokens();

            if (!idToken) {
                throw new Error('No ID token received from Google Sign-In');
            }

            // Create a Google credential with the token
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);

            // Sign-in the user with the credential
            await auth().signInWithCredential(googleCredential);
        } catch (error: unknown) {
            const err = error as { code?: string; message?: string };
            if (err.code === statusCodes.SIGN_IN_CANCELLED) {
                console.log('User cancelled the login flow');
            } else if (err.code === statusCodes.IN_PROGRESS) {
                console.log('Sign in in progress');
            } else if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                console.log('Play services not available or outdated');
            } else {
                console.error('Google Sign-In Error:', err);
                throw new Error(err.message || 'Google Sign-In failed');
            }
        }
    }, []);

    /**
     * Handles Email/Password Sign In
     */
    const loginWithEmailAndPassword = useCallback(async (email: string, password: string) => {
        try {
            await auth().signInWithEmailAndPassword(email, password);
        } catch (error) {
            console.error('Email/Password Sign-In Error:', error);
            throw error;
        }
    }, []);

    /**
     * Handles user logout
     */
    const logout = useCallback(async () => {
        try {
            await auth().signOut();
        } catch (error) {
            console.error('Sign Out Error:', error);
            throw error;
        }
    }, []);

    // Handle auth state changes
    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(async (firebaseUser) => {
            setState(prev => ({ ...prev, loading: true }));

            if (firebaseUser) {
                // Get the ID token
                const token = await firebaseUser.getIdToken();
                setState({
                    currentUser: firebaseUser,
                    token,
                    loading: false,
                    mode: 'standalone',
                });
            } else {
                setState({
                    currentUser: null,
                    token: '',
                    loading: false,
                    mode: 'standalone',
                });
            }
        });

        // Unsubscribe on unmount
        return () => subscriber();
    }, []);

    // Create the context value
    const contextValue = useMemo<AuthContextType>(() => ({
        currentUser: state.currentUser,
        token: state.token,
        loading: state.loading,
        loginWithSSO: async () => {
            console.warn('SSO login not implemented for React Native');
        },
        loginWithProvider,
        loginWithEmailAndPassword,
        logout,
    }), [state, loginWithProvider, loginWithEmailAndPassword, logout]);

    // Update zustand store when context value changes
    useEffect(() => {
        updateAuthStore(contextValue);
        console.log('Auth store updated:', contextValue);
    }, [contextValue]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

// Add the Login component as a static property
AuthProvider.Login = LoginView;