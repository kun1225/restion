/// <reference types="jest" />
/// <reference types="node" />

import 'jest';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeWithinRange(floor: number, ceiling: number): R;
    }
  }
}

export {};
