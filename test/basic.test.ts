// Basic TypeScript test to verify Jest configuration
describe('TypeScript Test', () => {
  it('should work with TypeScript', () => {
    const add = (a: number, b: number): number => a + b;
    expect(add(1, 2)).toBe(3);
  });
});
