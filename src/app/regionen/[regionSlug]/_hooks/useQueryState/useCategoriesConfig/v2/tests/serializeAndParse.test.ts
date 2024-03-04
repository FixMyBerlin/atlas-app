import { describe, expect, test } from 'vitest'
import { encodeBits, decodeBits } from '../lib'
import { testUrlConfig } from './testUrlConfig'
import { serialize } from '../serialize'
import { parse } from '../parse'

// used to generate the inputs for the test "test('array of booleans is the same..."
function randomBits() {
  let s = ''
  for (let i = 0; i < 4; i++) {
    s += Math.floor(Math.random() * 2 ** 32)
      .toString(2)
      .padStart(32, '0')
  }
  return s.slice(0, Math.floor(Math.random() * 64) + 64)
}

describe('Config param parser and serializer v2', () => {
  test('array of booleans is the same after encodeBits() and decodeBits()', () => {
    const bits = [
      '100000011110100010101100111011110101011111100111010110010001100110',
      '001010010011000000101110100000000101111000010010100001101111111000101111000000100',
      '000010111000101100100111100101111000011010000100110110011001011111111110100001100001101011100111001001110011010',
      '1101001100000000011011101001010111001000000111000110111101001011011011101100010000010',
      '01111100111011101011111101110000011000111010101010000000100101101100111101000111011110111010000001001101000',
      '11011000100001110001000001110100000010110011010101001010111110001101001010011110111000000000001010100000110',
      '0111011001110111001110101111001101001001011100100000101100100000100001101101100011000111011100110111111010011100',
      '010111001100000000001111110000101010010011101100100010000111011011000000110011100101010001110001000011001101011010110000110100',
    ]
    bits.forEach((b) => {
      const booleans = b.split('').map((v) => !!Number(v))
      const result = decodeBits(encodeBits(booleans))
      expect(result.slice(0, b.length)).toMatchObject(booleans)
    })
  })
  test('config is the same after serialize() and parse()', () => {
    const result = parse(serialize(testUrlConfig))
    expect(result).toMatchObject(testUrlConfig)
  })
})
