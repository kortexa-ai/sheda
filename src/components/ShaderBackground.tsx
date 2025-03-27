import { ShaderMaterial } from 'three';
// Don't use the hooks from @react-three/fiber/native !!!
import { extend, useFrame, useThree } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import { useRef } from 'react';

// Register ShaderMaterial with react-three-fiber
extend({ ShaderMaterial });

// Default vertex shader (simple pass-through)
const defaultVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Default fragment shader
const defaultFragmentShader = `
// three.js port of Star Nest by Pablo Roman Andrioli
// https://www.shadertoy.com/view/XlfGRj
// Pick parameters at https://galaxyshader.surge.sh/

uniform float time;
uniform vec2 resolution;
varying vec2 vUv;

#define iterations 17
#define formuparam 0.53

#define volsteps 20
#define stepsize 0.1

#define zoom   0.800
#define tile   0.850
#define speed  0.010

#define brightness 0.0015
#define darkmatter 0.300
#define distfading 0.730
#define saturation 0.850


void main() {
	//get coords and direction
	vec2 uv = vUv - 0.5;
	uv.y *= resolution.y/resolution.x;
	vec3 dir = vec3(uv*zoom,1.);
	float currentTime = time*speed+.25;

	float a1 = 0.5;
	float a2 = 0.8;
	mat2 rot1 = mat2(cos(a1),sin(a1),-sin(a1),cos(a1));
	mat2 rot2 = mat2(cos(a2),sin(a2),-sin(a2),cos(a2));
	dir.xz *= rot1;
	dir.xy *= rot2;
	vec3 from = vec3(1.,.5,0.5);
	from += vec3(currentTime*2.,currentTime,-2.);
	from.xz *= rot1;
	from.xy *= rot2;

	//volumetric rendering
	float s = 0.1, fade = 1.;
	vec3 v = vec3(0.);
	for (int r=0; r<volsteps; r++) {
		vec3 p = from+s*dir*.5;
		p = abs(vec3(tile)-mod(p,vec3(tile*2.))); // tiling fold
		float pa, a = pa = 0.;
		for (int i=0; i<iterations; i++) {
			p = abs(p)/dot(p,p)-formuparam; // the magic formula
			a += abs(length(p)-pa); // absolute sum of average change
			pa = length(p);
		}
		float dm = max(0.,darkmatter-a*a*.001); //dark matter
		a *= a*a; // add contrast
		if (r>6) fade *= 1.-dm; // dark matter, don't render near
		//v+=vec3(dm,dm*.5,0.);
		v += fade;
		v += vec3(s,s*s,s*s*s*s)*a*brightness*fade; // coloring based on distance
		fade *= distfading; // distance fading
		s += stepsize;
	}
	v = mix(vec3(length(v)),v,saturation); //color adjust
	gl_FragColor = vec4(v*.01,1.);
}`;

const BackgroundScene = ({
    width,
    height,
}: { width: number; height: number }) => {
    const shaderRef = useRef<ShaderMaterial>(null);

    // Update shader uniforms on each frame
    useFrame(({ clock }) => {
        if (shaderRef.current) {
            shaderRef.current.uniforms.time.value = clock.getElapsedTime();
        }
    });

    // Calculate the plane size to fill the viewport
    const aspect = width / height;
    const planeWidth = aspect > 1 ? 2 * aspect : 2;
    const planeHeight = aspect > 1 ? 2 : 2 / aspect;

    return (
        <>
            {/* Orthographic camera to ensure full-screen coverage */}
            <OrthographicCamera
                makeDefault
                position={[0, 0, 5]}
                near={0.1}
                far={1000}
                left={-planeWidth / 2}
                right={planeWidth / 2}
                top={planeHeight / 2}
                bottom={-planeHeight / 2}
            />

            {/* Full-screen plane with shader */}
            <mesh position={[0, 0, 0]}>
                <planeGeometry args={[planeWidth, planeHeight]} />
                <shaderMaterial
                    ref={shaderRef}
                    vertexShader={defaultVertexShader}
                    fragmentShader={defaultFragmentShader}
                    uniforms={{
                        time: { value: 0.0 },
                        resolution: { value: [width, height] },
                    }}
                />
            </mesh>
        </>
    );
};

export function ShaderBackground() {
    const { size } = useThree();
    console.log(size);
    return (
        <BackgroundScene
            width={size.width}
            height={size.height}
        />
    );
}