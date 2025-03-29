vec2 uv=FC/iResolution.xy;
vec3 col=0.5+0.5*cos(iTime+uv.xyx+vec3(0,2,4));
o=vec4(col,1.0);
