import { describe, expect, it } from 'vitest'
import { computeScore, parseLevels, serializeLevels } from './useDominanceState.ts'

describe('parseLevels', () => {
  it('maps a digit string to levels in order', () => {
    expect(parseLevels('5301', 4)).toEqual([5, 3, 0, 1])
  })
  it('pads missing trailing entries with 0', () => {
    expect(parseLevels('53', 4)).toEqual([5, 3, 0, 0])
  })
  it('treats null/empty as all zeros', () => {
    expect(parseLevels(null, 3)).toEqual([0, 0, 0])
    expect(parseLevels('', 3)).toEqual([0, 0, 0])
  })
  it('coerces out-of-range/invalid chars to 0', () => {
    expect(parseLevels('9a2', 3)).toEqual([0, 0, 2])
  })
})

describe('serializeLevels', () => {
  it('joins levels to a digit string', () => {
    expect(serializeLevels([5, 3, 0, 1])).toBe('5301')
  })
  it('round-trips with parseLevels', () => {
    expect(parseLevels(serializeLevels([1, 2, 3, 4, 5, 0]), 6)).toEqual([1, 2, 3, 4, 5, 0])
  })
})

describe('computeScore', () => {
  it('sums levels', () => {
    expect(computeScore([5, 3, 0, 1])).toBe(9)
  })
  it('is 0 for empty', () => {
    expect(computeScore([])).toBe(0)
  })
})
