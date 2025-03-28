import { ColorValue, StyleSheet, ViewStyle, ViewProps } from 'react-native';
import { BlurView, BlurTint } from 'expo-blur';
import { Panel } from './Panel';
import Color from 'color';

interface FrostedPanelProps extends ViewProps {
    blurStyle?: Omit<ViewStyle, 'backgroundColor' | 'overflow'>;
    tint?: BlurTint;
    tintColor?: ColorValue;
    tintOpacity?: number;
    intensity?: number;
}

export function FrostedPanel({
    children,
    style,
    blurStyle,
    tint = 'light',
    tintColor = 'transparent',
    tintOpacity = 0.0,
    intensity = 30,
    ...props
}: FrostedPanelProps) {
    // Convert tintColor and tintOpacity to rgba format
    const backgroundColor = Color(tintColor).alpha(tintOpacity).string();

    const frostedStyle: ViewStyle = {
        ...styles.frosted,
        ...blurStyle,
        backgroundColor,
    };

    return (
        <Panel
            style={style}
            {...props}
        >
            <BlurView intensity={intensity} tint={tint} style={frostedStyle}>
                {children}
            </BlurView>
        </Panel>
    );
}

const styles = StyleSheet.create({
    frosted: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        // Important! Do not remove, it's needed for rounded corners to work
        overflow: 'hidden',
    },
});
