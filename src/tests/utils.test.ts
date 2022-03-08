import {
  RangesRelation,
  getRangeRelation,
  isEmptyRange,
  isValidRange,
  calcAddResultOfTwoRange,
  calcMinusResultOfTwoRange,
} from "../utils";

describe("utils", () => {
  it("getRangeRelation behavior should be ok", () => {
    expect(getRangeRelation([1, 4], [2, 5])).toBe(RangesRelation.RightCross);
    expect(getRangeRelation([1, 2], [4, 5])).toBe(RangesRelation.Less);
    expect(getRangeRelation([5, 8], [2, 3])).toBe(RangesRelation.Greater);
    expect(getRangeRelation([1, 3], [3, 5])).toBe(RangesRelation.RightCross);
    expect(getRangeRelation([3, 5], [1, 3])).toBe(RangesRelation.LeftCross);
    expect(getRangeRelation([1, 10], [2, 5])).toBe(RangesRelation.Include);
    expect(getRangeRelation([2, 5], [1, 10])).toBe(RangesRelation.BeIncluded);
    expect(getRangeRelation([2, 5], [1, 4])).toBe(RangesRelation.LeftCross);

    expect(getRangeRelation([5, 8], [5, 8])).toBe(RangesRelation.Equal);
  });

  it("getRangeRelation should throw if input invalid", () => {
    expect(() => getRangeRelation([1, 2.1], [4, 5])).toThrow();
  });

  it("isEmptyRange behavior should be ok", () => {
    expect(isEmptyRange([5, 5])).toBe(true);
    expect(isEmptyRange([5, 8])).toBe(false);
  });

  it("invalid range is not emptyRange ", () => {
    expect(isEmptyRange([1.2, 1.2])).toBe(false);
  });

  it("isValidRange behavior should be ok", () => {
    expect(isValidRange([2, -2])).toBe(false);
    expect(isValidRange([0, 2.3])).toBe(false);
    //@ts-ignore
    expect(isValidRange([0, 2, 4])).toBe(false);

    expect(isValidRange([0, 2])).toBe(true);
  });

  describe("Two Ranges calcuation should be ok", () => {
    it("add: Less", () => {
      expect(calcAddResultOfTwoRange([1, 2], [3, 4])).toEqual([
        [1, 2],
        [3, 4],
      ]);
    });

    it("add: Greater", () => {
      expect(calcAddResultOfTwoRange([3, 4], [1, 2])).toEqual([
        [1, 2],
        [3, 4],
      ]);
    });

    it("add: LeftCross", () => {
      expect(calcAddResultOfTwoRange([3, 6], [1, 3])).toEqual([[1, 6]]);

      expect(calcAddResultOfTwoRange([3, 6], [1, 4])).toEqual([[1, 6]]);
    });

    it("add: RightCross", () => {
      expect(calcAddResultOfTwoRange([1, 3], [3, 6])).toEqual([[1, 6]]);

      expect(calcAddResultOfTwoRange([1, 4], [3, 6])).toEqual([[1, 6]]);
    });

    it("add: Include", () => {
      expect(calcAddResultOfTwoRange([1, 6], [2, 4])).toEqual([[1, 6]]);
    });

    it("add: BeIncluded", () => {
      expect(calcAddResultOfTwoRange([2, 4], [1, 6])).toEqual([[1, 6]]);
    });

    it("add: Equal", () => {
      expect(calcAddResultOfTwoRange([1, 4], [1, 4])).toEqual([[1, 4]]);
    });

    it("add: invalid", () => {
      expect(() => calcAddResultOfTwoRange([1, 4.8], [2, 4])).toThrow();
    });

    it("minus: Less", () => {
      expect(calcAddResultOfTwoRange([1, 2], [5, 8])).toEqual([
        [1, 2],
        [5, 8],
      ]);
    });

    it("minus: Greater", () => {
      expect(calcAddResultOfTwoRange([5, 8], [1, 2])).toEqual([
        [1, 2],
        [5, 8],
      ]);
    });

    it("minus: LeftCross", () => {
      expect(calcMinusResultOfTwoRange([3, 6], [1, 3])).toEqual([[3, 6]]);

      expect(calcMinusResultOfTwoRange([3, 6], [1, 4])).toEqual([[4, 6]]);
    });

    it("minus: RightCross", () => {
      expect(calcMinusResultOfTwoRange([1, 3], [3, 6])).toEqual([[1, 3]]);

      expect(calcMinusResultOfTwoRange([1, 4], [3, 6])).toEqual([[1, 3]]);
    });

    it("minus: Include", () => {
      expect(calcMinusResultOfTwoRange([1, 6], [2, 4])).toEqual([
        [1, 2],
        [4, 6],
      ]);
    });

    it("minus: BeIncluded", () => {
      expect(calcMinusResultOfTwoRange([2, 4], [1, 6])).toEqual([]);
    });

    it("minus: Equal", () => {
      expect(calcMinusResultOfTwoRange([1, 4], [1, 4])).toEqual([]);
    });

    it("minus: invalid", () => {
      expect(() => calcMinusResultOfTwoRange([1, 4.8], [1, 4])).toThrow();
    });
  });
});
