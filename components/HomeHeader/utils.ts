import PerlinNoise3d from "perlin-noise-3d";

export const LINES = 5;
export const LINE_LENGTH = 60;

const noise = new PerlinNoise3d();
noise.noiseSeed(0);

export { noise };
