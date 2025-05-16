import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { SupportedProviders } from '../auth/types';
import { useAuthStore } from '../auth/store';

interface LoginFormProps {
    onLoginError: (error?: string) => void;
}

export function LoginForm({ onLoginError }: LoginFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { loginWithProvider, loginWithEmailAndPassword } = useAuthStore();

    const handleSubmit = async () => {
        try {
            await loginWithEmailAndPassword(email, password);
        } catch (err) {
            onLoginError((err as Error).message);
        }
    };

    const handleLogin = async (provider: SupportedProviders) => {
        try {
            await loginWithProvider(provider);
        } catch (err) {
            onLoginError((err as Error).message);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.formGroup}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#9ca3af"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                    textContentType="emailAddress"
                />
            </View>
            <View style={styles.formGroup}>
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#9ca3af"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoComplete="password"
                    textContentType="password"
                />
            </View>
            <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
            >
                <Text style={styles.submitButtonText}>Log In</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Or continue with</Text>
                <View style={styles.dividerLine} />
            </View>

            {/* Social Buttons */}
            <View style={styles.socialButtonsContainer}>
                <TouchableOpacity
                    style={styles.socialButton}
                    onPress={() => handleLogin('google')}
                >
                    <MaterialCommunityIcons name="google" size={20} color="#DB4437" />
                    <Text style={styles.socialButtonText}>Google</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.socialButton}
                    onPress={() => handleLogin('github')}
                >
                    <MaterialCommunityIcons name="github" size={20} color="#333" />
                    <Text style={styles.socialButtonText}>GitHub</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    formGroup: {
        marginBottom: 16,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#1f2937',
    },
    submitButton: {
        backgroundColor: '#3b82f6',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#e5e7eb',
    },
    dividerText: {
        marginHorizontal: 12,
        color: '#6b7280',
        fontSize: 14,
    },
    socialButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
    },
    socialButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#d1d5db',
        backgroundColor: '#fff',
        gap: 8,
    },
    socialButtonText: {
        color: '#374151',
        fontWeight: '500',
    },
});