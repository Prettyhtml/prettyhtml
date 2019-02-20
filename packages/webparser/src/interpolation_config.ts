import { assertInterpolationSymbols } from './assertions'

export class InterpolationConfig {
  static fromArray(markers: [string, string] | null): InterpolationConfig {
    if (!markers) {
      return DEFAULT_INTERPOLATION_CONFIG
    }

    assertInterpolationSymbols('interpolation', markers)
    return new InterpolationConfig(markers[0], markers[1])
  }

  constructor(public start: string, public end: string) {}
}

export const DEFAULT_INTERPOLATION_CONFIG: InterpolationConfig = new InterpolationConfig('{{', '}}')
