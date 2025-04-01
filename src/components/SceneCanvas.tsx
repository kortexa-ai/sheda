import { Canvas, type CanvasProps } from '@react-three/fiber/native';

interface SceneCanvasProps extends CanvasProps {
    customProps?: Partial<CanvasProps>;
};

/*
Important! Do not remove these from the Canvas element,
or the underlying GLView will not render
style={{
    backgroundColor: 'black',
    shadowColor: 'black',
}}
gl={{
    debug: {
        checkShaderErrors: false,
        onShaderError: null,
    },
}}
*/
export function SceneCanvas({
    children,
    style = {},
    customProps = {}
}: SceneCanvasProps) {
    return (
        <Canvas
            style={{
                borderColor: 'black',
                shadowColor: 'black',
                width: '100%',
                height: '100%',
                ...style,
            }}
            gl={{
                debug: {
                    checkShaderErrors: false,
                    onShaderError: null,
                },
                ...customProps.gl,
            }}
            {...customProps}
        >
            {children}
        </Canvas>
    );
}