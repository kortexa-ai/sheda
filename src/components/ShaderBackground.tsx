import { SceneCanvas } from './SceneCanvas';
import { Shadertoy } from '@kortexa-ai/react-shadertoy';

type ShaderBackgroundProps = {
    width?: number;
    height?: number;
    vertexShader?: string;
    fragmentShader?: string;
};

export function ShaderBackground({
    width,
    height,
    vertexShader,
    fragmentShader,
}: ShaderBackgroundProps) {
    return (
        <SceneCanvas
            orthographic={true}
            style={{
                // Important! Do not remove, or the canvas will not render
                position: 'absolute',
                zIndex: 0,
            }}
        >
            <Shadertoy
                width={width}
                height={height}
                vs={vertexShader}
                fs={fragmentShader}
            />
        </SceneCanvas>
    );
}