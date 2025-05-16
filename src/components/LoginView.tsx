import { useState, type ReactNode, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LoginForm } from './LoginForm';
import { useAuthStore } from '../auth/store';
import type { SupportedProviders } from '../auth/types';

interface LoginViewProps {
    title: string;
    defaultProvider?: SupportedProviders;
    children: ReactNode;
}

interface LoginState {
    showForm: boolean;
    showError: boolean;
    errorMessage: string;
    isLoading: boolean;
}

/**
 * Handles authentication flow with an animated in-place login form
 * The white card background collapses/expands with the form using Tailwind Animate
 * Login button toggles form visibility with refined animations
 */
export function LoginView({
    title,
    defaultProvider,
    children,
}: LoginViewProps) {
    const [loginState, setLoginState] = useState<LoginState>({
        showForm: false,
        showError: false,
        errorMessage: '',
        isLoading: false,
    });

    const { currentUser, loginWithProvider } = useAuthStore();

    const onLoginClick = useCallback(async () => {
        if (!defaultProvider) {
            setLoginState((prev) => ({
                ...prev,
                showForm: !prev.showForm,
                showError: false, // Reset error on toggle
            }));
        } else {
            setLoginState((prev) => ({ ...prev, isLoading: true }));
            try {
                await loginWithProvider(defaultProvider);
            } catch (err) {
                setLoginState((prev) => ({
                    ...prev,
                    showError: true,
                    errorMessage: err instanceof Error ? err.message : 'Login failed',
                }));
            } finally {
                setLoginState((prev) => ({ ...prev, isLoading: false }));
            }
        }
    }, [defaultProvider, loginWithProvider]);

    const onLoginError = useCallback((error?: string) => {
        setLoginState((prev) => ({
            ...prev,
            showError: true,
            errorMessage: error ?? 'Login failed',
        }));
    }, []);

    if (currentUser) return <>{children}</>;

    return (
        <View style={styles.container}>
            <View style={styles.cardContainer}>
                <View style={[
                    styles.card,
                    loginState.showForm ? styles.cardExpanded : styles.cardCollapsed
                ]}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{title}</Text>
                        <TouchableOpacity
                            onPress={onLoginClick}
                            disabled={loginState.isLoading}
                            style={styles.toggleButton}
                        >
                            <MaterialIcons
                                name={loginState.showForm ? 'close' : 'login'}
                                size={24}
                                color="#374151" // gray-700
                            />
                        </TouchableOpacity>
                    </View>

                    {loginState.showForm && (
                        <View style={styles.formContainer}>
                            <LoginForm onLoginError={onLoginError} />
                            {loginState.showError && (
                                <View style={styles.errorContainer}>
                                    <Text style={styles.errorText}>
                                        <Text style={styles.errorBold}>Oops! </Text>
                                        {loginState.errorMessage || 'Failed to login. Please try again.'}
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    cardContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 16,
        width: '100%',
        maxWidth: 448, // max-w-md
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    cardExpanded: {
        padding: 24,
    },
    cardCollapsed: {
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontFamily: 'monospace',
        color: '#1f2937', // gray-800
        fontWeight: '600',
    },
    toggleButton: {
        padding: 8,
        borderRadius: 20,
    },
    formContainer: {
        width: '100%',
    },
    errorContainer: {
        marginTop: 12,
        padding: 8,
        backgroundColor: '#fef2f2', // red-50
        borderWidth: 1,
        borderColor: '#fecaca', // red-200
        borderRadius: 6,
    },
    errorText: {
        color: '#dc2626', // red-600
        fontSize: 14,
        textAlign: 'center',
    },
    errorBold: {
        fontWeight: '600',
    },
});