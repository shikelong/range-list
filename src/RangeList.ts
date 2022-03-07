/**
 * Two integers specify beginning and end of range.
 */
type Range = [Number, Number];

/**
 * Range List Class implement Add / Remove / Print operations.
 */
export class RangeList {
  private _rangeList: Range[] = [];

  constructor(ranges?: Range[]) {
    this._rangeList = ranges ?? [];
  }

  /**
   * Add a range to the list
   * @param range range to be added
   */
  add(range: Range) {}

  /**
   * Removes a range from the list
   * @param range range to be removed
   */
  remove(range: Range) {}

  /**
   * Prints out the list of ranges in the range list
   */
  print() {}
}
