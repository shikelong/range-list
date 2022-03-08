import invariant from "tiny-invariant";

/**
 * Two integers specify beginning and end of range.
 */
export type Range = [Number, Number];

/**
 * Enum specify the relation between two ranges.
 */
export enum RangesRelation {
  /**
   * @example [1, 2] and [4, 5]
   */
  Less,
  /**
   * @example [5, 8] and [2, 3]
   */
  Greater,
  /**
   * @example [1, 10] and [2, 5]
   */
  Include,
  /**
   * @example [2, 5] and [1, 10]
   */
  BeIncluded,
  /**
   * @example [2, 5] and [1, 4] / [3, 5] and [1, 3]
   */
  LeftCross,
  /**
   * @example [1, 4] and [2, 5] / [1, 3] and [3, 5]
   */
  RightCross,
  /**
   * @example [5, 8] and [5, 8]
   */
  Equal,
}

/**
 * judge is given range valid.
 * valid range must have this form: [a: Integer, b: Integer] and a <= b
 * @param range range to be checked
 * @returns boolean
 */
export function isValidRange(range: Range): boolean {
  if (
    !Array.isArray(range) ||
    range.length !== 2 ||
    range.some((v) => !Number.isInteger(v)) ||
    //[20, 20] is valid. but will be ignored in add/remove operation.
    range[0] > range[1]
  ) {
    return false;
  }
  return true;
}

/**
 * judge is given range empty, a empty range is valid (not throw) but will be ignore in add/remove operation.
 * @param range
 * @returns boolean
 */
export function isEmptyRange(range: Range): boolean {
  if (!isValidRange(range)) {
    return false;
  }
  return range[0] === range[1];
}

/**
 * perform add operation on two ranges.
 * @param r1
 * @param r2
 * @returns a new range which represent r1 + r2
 */
export function calcAddResultOfTwoRange(r1: Range, r2: Range): Range[] {
  const relation = getRangeRelation(r1, r2);

  switch (relation) {
    case RangesRelation.Less:
      return [r1, r2];
    case RangesRelation.Greater:
      return [r2, r1];
    case RangesRelation.LeftCross:
      return [[r2[0], r1[1]]];
    case RangesRelation.RightCross:
      return [[r1[0], r2[1]]];
    case RangesRelation.Include:
      return [r1];
    case RangesRelation.BeIncluded:
    case RangesRelation.Equal:
      return [r2];
    default:
      invariant(false, "Unknown Range Relation");
  }
}

/**
 * perform minus operation (r1 - r2) on two ranges.
 * @param r1
 * @param r2
 * @returns a new range which represent r1 - r2
 */
export function calcMinusResultOfTwoRange(r1: Range, r2: Range): Range[] {
  const relation = getRangeRelation(r1, r2);

  switch (relation) {
    case RangesRelation.Less:
      return [r1, r2];
    case RangesRelation.Greater:
      return [r2, r1];
    case RangesRelation.LeftCross:
      return ([[r2[1], r1[1]]] as Range[]).filter((r) => !isEmptyRange(r));
    case RangesRelation.RightCross:
      return ([[r1[0], r2[0]]] as Range[]).filter((r) => !isEmptyRange(r));
    case RangesRelation.Include:
      return (
        [
          [r1[0], r2[0]],
          [r2[1], r1[1]],
        ] as Range[]
      ).filter((r) => !isEmptyRange(r));
    case RangesRelation.BeIncluded:
    case RangesRelation.Equal:
      return [];
    default:
      invariant(false, "Unknown Range Relation");
  }
}

/**
 * get the relation between two ranges
 * @param Range1
 * @param Range2
 * @returns RangeRelation?
 */
export function getRangeRelation(
  range1: Range,
  range2: Range
): RangesRelation | undefined {
  if (!isValidRange(range1) || !isValidRange(range2)) {
    invariant(false, "exist invalid Range");
  }

  const [r1L, r1R] = range1,
    [r2L, r2R] = range2;

  if (r1L > r2R) {
    return RangesRelation.Greater;
  } else if (r1R < r2L) {
    return RangesRelation.Less;
  } else if (r1L === r2L && r1R === r2R) {
    return RangesRelation.Equal;
  } else if (r1L <= r2L && r1R >= r2R) {
    return RangesRelation.Include;
  } else if (r2L <= r1L && r2R >= r1R) {
    return RangesRelation.BeIncluded;
  } else if ((r1L < r2L && r2R > r1R && r1R > r2L) || r1R === r2L) {
    return RangesRelation.RightCross;
  } else if ((r1L > r2L && r1R > r2R && r1L < r2R) || r1L === r2R) {
    return RangesRelation.LeftCross;
  }
}
