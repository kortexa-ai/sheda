import { View, ViewProps, StyleSheet } from 'react-native';

export function Panel({ children, style, ...props }: ViewProps) {
    return (
        <View
            style={[
                styles.container,
                style,
            ]}
            {...props}
        >
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'stretch',
        justifyContent: 'space-evenly',
        gap: 16,
    },
});
