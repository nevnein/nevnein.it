import PerlinNoise3d from "perlin-noise-3d";

export type Dimensions = {
  lines: number;
  width: number;
};

const noise = new PerlinNoise3d();
noise.noiseSeed(0);

export { noise };
