/**
 * ShaderToyBackground Component
 *
 * A convenient wrapper that provides a Canvas for the ShaderToy component.
 */
import { Canvas, CanvasProps } from '@react-three/fiber/native';
import { ShaderToy, ShaderToyProps } from './ShaderToy';

// Props interface with added style property
export interface ShaderToyCanvasProps extends ShaderToyProps {
    style?: any;
    customProps?: Partial<CanvasProps>;
}

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

/**
 * ShaderToyCanvas Component
 *
 * Wraps the ShaderToy component with a Canvas, making it ready to use
 * without requiring a separate Canvas setup.
 */
export function ShaderToyCanvas({
    style = {},
    customProps = {},
    ...props
}: ShaderToyCanvasProps) {
    return (
        <Canvas
            orthographic={true}
            gl={{
                debug: {
                    checkShaderErrors: false,
                    onShaderError: null,
                },
                ...customProps.gl,
            }}
            style={{
                borderColor: 'black',
                shadowColor: 'black',
                width: '100%',
                height: '100%',
                ...style,
            }}
            {...customProps}
        >
            <ShaderToy {...props} />
        </Canvas>
    );
}

export default ShaderToyCanvas;