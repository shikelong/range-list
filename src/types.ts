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
  /**
   * Only for invalid range input
   */
  Unknown,
}
