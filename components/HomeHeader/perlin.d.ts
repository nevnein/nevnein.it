declare module "perlin-noise-3d" {
  export default class PerlinNoise3d {
    constructor();
    get(x: number, y: number, z: number): number;
    noiseSeed(seed: number): void;
  }
}
