import invariant from "tiny-invariant";

/**
 * Two integers specify beginning and end of range.
 */
type Range = [Number, Number];

enum RangesRelation {
  Include, //A include B => [A]
  WasInclude, // B include A => [B]
  Separate, // => [A, B]
  Cross, // => [A[0], B[1]] | [A[1], B[0]]
}

const RangesOperations: {
  [key in RangesRelation]: (a: Range, b: Range) => Range[];
} = {
  [RangesRelation.Include]: (a: Range, b: Range): Range[] => [a],
  [RangesRelation.WasInclude]: (a: Range, b: Range): Range[] => [b],
  [RangesRelation.Separate]: (a: Range, b: Range): Range[] =>
    a[0] < b[0] ? [a, b] : [b, a],
  [RangesRelation.Cross]: (a: Range, b: Range): Range[] =>
    a[0] < b[0] ? [[a[0], b[1]]] : [[b[0], a[1]]],
};

/**
 * Range List Class implement Add / Remove / Print operations.
 */
export class RangeList {
  private _rangeList: Range[] = [];

  constructor(ranges?: Range[]) {
    if (ranges === undefined) {
      return;
    }

    const isRangesValid = ranges.every((r) => this.isValidRange(r));
    invariant(
      isRangesValid,
      "parameter include invalid Range, range must be two length's number array which first element less or equal than second element"
    );

    if (isRangesValid) {
      this._rangeList = ranges;
    }
  }

  /**
   * Add a range to the list
   * @param range range to be added
   */
  add(range: Range) {
    const isRangeValid = this.isValidRange(range);
    if (!isRangeValid) {
      invariant(
        false,
        "parameter include invalid Range, range must be two length's number array which first element less or equal than second element"
      );
    } else if (this._rangeList.length === 0) {
      this._rangeList.push(range);
    } else if (this._rangeList.length === 1) {
      const relation = this.getRangeRelation(this._rangeList[0], range);
      this._rangeList = RangesOperations[relation](this._rangeList[0], range);
    } else {
      for (let i = 0; i < this._rangeList.length - 2; i++) {
        const j = i + 1;
        const relation = this.getRangeRelation(range, this._rangeList[i]);

        if (relation === RangesRelation.Separate) {
          this._rangeList = RangesOperations[relation](
            this._rangeList[i],
            this._rangeList[j]
          );
        }
      }
    }
  }

  /**
   * Removes a range from the list
   * @param range range to be removed
   */
  remove(range: Range) {
    const isRangeValid = this.isValidRange(range);
    if (!isRangeValid) {
      invariant(
        false,
        "parameter include invalid Range, range must be two length's number array which first element less or equal than second element"
      );
    } else {
      //TODO
    }
  }

  /**
   * Prints out the list of ranges in the range list
   */
  print() {}

  private isValidRange(range: Range): boolean {
    if (
      !Array.isArray(range) ||
      range.length !== 2 ||
      range.some((v) => !Number.isInteger(v)) ||
      range[0] > range[1]
    ) {
      return false;
    }
    return true;
  }

  private getRangeRelation(
    [r1L, r1R]: Range,
    [r2L, r2R]: Range
  ): RangesRelation {
    if (r1L > r2R || r2L > r1R) {
      return RangesRelation.Separate;
    } else if (r1L <= r2L && r1R >= r2R) {
      return RangesRelation.Include;
    } else if (r2L <= r1L && r2R >= r1R) {
      return RangesRelation.WasInclude;
    } else {
      return RangesRelation.Cross;
    }
  }
}
