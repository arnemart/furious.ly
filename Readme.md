<http://furious.ly>

This thing uses a semi-genetic algorithm to generate and draw pixels.

If you want, you can set some params in the url hash to change the output.

- `pixelsize`: The size of each pixel, in, uh, pixels. Default: 6
- `alpha`: Transparency of rendered pixels. Default: 0.1
- `bw`: Set to `true` to render all non-mutated pixels in black and white. Default: false
- `colormutationfactor`: How often color mutations should occur. Default: 0.1
- `colormutation`: Maximum size of color component mutation. Default: 90 (color components are 0-255)
- `positionmutationfactor`: How often position mutations should occur. Default: 0.1
- `positionmutation`: Maximum size of position component mutation. Default: 30

Examples:

[#alpha:0.2;bw:true;colormutation:30](http://furious.ly/#alpha:0.2;bw:true;colormutation:30)
[#pixelsize:20;alpha:1](http://furious.ly/#pixelsize:20;alpha:1)
[#colormutation:0;alpha:0.02;positionmutation:100](http://furious.ly/#colormutation:0;alpha:0.02;positionmutation:100)
