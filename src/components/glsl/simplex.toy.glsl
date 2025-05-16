/*
    "Simplex" by @XorDev

    I know this isn't a real simplex, but it reminded me
    of simplex grids anyway.
    https://x.com/XorDev/status/1920855494861672654
*/
// vec2 uv = FC / r * 2.0 - 1.0; // Normalized UV (-1 to 1)
// uv.x *= r.x / r.y; // Aspect correction
//Iterator, raymarch depth and step distance
float i = 0., z = 0., d = 0.;
//Clear frag color and raymarch 50 steps
for(o *= i;
i ++ < 50.;
) {
    //Compute raymarch point from raymarch distance and ray direction
vec3 p = z * normalize(vec3(FC + FC, 0) - r.xyy),
    //Temporary vector for sine waves
v = vec3(0.);
    //Scroll forward
p.z -= t;
    //Compute distance for sine pattern (and step forward)
z += d = 0.0001 + .5 * length(max(v = cos(p) - sin(p).yzx, v.yzx * .2));
    //Use position for coloring
o.rgb += (cos(p) + 1.2) / d;
}
//Tonemapping
o /= o + 1000.;
