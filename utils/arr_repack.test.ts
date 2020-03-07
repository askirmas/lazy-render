import {powered} from './arr_repack'

describe(powered.name, () => {
  const launcher = (max :number) =>
    ([i, o]: [any[], any[]]) =>
      it(i.length.toString(), () => expect(powered(max, i)).toStrictEqual(o))
  
  describe('with preserve', () => {
    it("4 to 3", () => expect(powered(
      3,
      [0, 1, 2, 3],
      true
    )).toStrictEqual([
      0, [1, [3, undefined, undefined], undefined], [2, undefined, undefined]
    ]))
  })
  describe("max=2", () => [
    [
      [], []
    ], [
      [0],
      [0]
    ], [
      [0, 1],
      [0, [1]]
    ], [
      [0, 1, 2],
      [0, [1, [2]]]
    ], [
      [0, 1, 2, 3],
      [0, [1, [2, [3]]]]
    ]
  ].forEach(
    //@ts-ignore
    launcher(2)
  ))
  describe('max=3', () => [
    [
      [], []
    ], [
      [0],
      [0]
    ], [
      [0, 1],
      [0, [1]]
    ], [
      [0, 1, 2],
      [0, [1], [2]]
    ], [
      [0, 1, 2, 3],
      [0, [1, [3]], [2]]
    ], [
      [0, 1, 2, 3, 4],
      [0, [1, [3], [4]], [2]]
    ], [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
      [0, [1, [3, [7], [8]], [4, [9], [10]]], [2, [5, [11], [12]], [6, [13], [14]]]]
    ]
  ].forEach(
    //@ts-ignore
    launcher(3)
  ))
})