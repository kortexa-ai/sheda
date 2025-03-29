// Source: https://www.shadertoy.com/view/3csSWB
/*
    "Singularity" by @XorDev

    A whirling blackhole.
    Feel free to code golf!

    FabriceNeyret2: -19
    dean_the_coder: -12
    iq: -4
*/
void mainImage(out vec4 O,in vec2 F)
{
    vec2 p=(F*2.-iResolution.xy)/(iResolution.y*.7),
    d=vec2(-1,1),
    c=p*mat2(1,1,d/(.1+5./dot(5.*p-d,5.*p-d))),
    v=c;
    v*=mat2(cos(log(length(v))+iTime*.2+vec4(0,33,11,0)))*5.;
    vec4 o=vec4(0);
    for(float i;i++<9.;o+=sin(v.xyyx)+1.)
    v+=.7*sin(v.yx*i+iTime)/i+.5;
    O=1.-exp(-exp(c.x*vec4(.6,-.4,-1,0))/o
    /(.1+.1*pow(length(sin(v/.3)*.2+c*vec2(1,2))-1.,2.))
    /(1.+7.*exp(.3*c.y-dot(c,c)))
    /(.03+abs(length(p)-.7))*.2);
}
