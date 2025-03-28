import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';

export function FrostedPanel({ children }: { children?: React.ReactNode }) {
    return (
        <View style={styles.container}>
            <BlurView intensity={30} tint="light" style={styles.frosted}>
                {children}
            </BlurView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 16,
        width: '100%',
        height: '50%',
    },
    frosted: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        // Important! Do not remove, it's needed for colored tint
        backgroundColor: 'rgba(255, 197, 144, 0.3',
        // Important! Do not remove, it's needed for rounded corners to work
        overflow: 'hidden',
    },
});
