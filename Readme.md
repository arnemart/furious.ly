<http://furious.ly>

This thing uses a semi-genetic algorithm to generate and draw pixels.

There are sliders to change params. They can also be set in the url hash.

- `pixelsize`: The size of each pixel, in, uh, pixels. Default: 6
- `alpha`: Transparency of rendered pixels. Default: 0.1
- `colormutationrate`: How often color mutations should occur. Default: 0.1
- `colormutationanount`: Maximum size of color component mutation. Default: 90 (color components are 0-255)
- `positionmutationrate`: How often position mutations should occur. Default: 0.1
- `positionmutationamount`: Maximum size of position component mutation. Default: 30
- `bw`: Set to `true` to render all non-mutated pixels in black and white. Default: false

Examples:

- [#alpha:0.2;bw:true;colormutationamount:30](http://furious.ly/#alpha:0.2;bw:true;colormutationamount:30)
- [#pixelsize:20;alpha:1](http://furious.ly/#pixelsize:20;alpha:1)
- [#colormutationamount:0;alpha:0.02;positionmutationamount:100](http://furious.ly/#colormutationamount:0;alpha:0.02;positionmutationamount:100)
