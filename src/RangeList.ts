import invariant from "tiny-invariant";
import { RangesRelation, Range } from "./types";

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
      for (const range of ranges) {
        this.add(range);
      }
    }
  }

  /**
   * Add a range to the list
   * @param range range to be added
   */
  add(range: Range) {
    let rangeToBeAdded: Range = range;
    const isRangeValid = this.isValidRange(rangeToBeAdded);
    if (!isRangeValid) {
      invariant(
        false,
        "parameter include invalid Range, range must be two length's number array which first element less or equal than second element"
      );
      return;
    } else if (this.isEmptyRange(rangeToBeAdded)) {
      return;
    }

    if (this._rangeList.length === 0) {
      this._rangeList.push(rangeToBeAdded);
    } else if (this._rangeList.length === 1) {
      this._rangeList = this.calcAddResultOfTwoRange(
        this._rangeList[0],
        rangeToBeAdded
      );
    } else {
      for (let i = this._rangeList.length - 1; i >= 0; i--) {
        const cur = this._rangeList[i];
        const relation = RangeList.getRangeRelation(rangeToBeAdded, cur);

        switch (relation) {
          case RangesRelation.Include:
            this._rangeList.splice(i, 1);
            continue;
          case RangesRelation.LeftCross:
            this._rangeList[i] = this.calcAddResultOfTwoRange(
              rangeToBeAdded,
              cur
            )[0];
            return;
          case RangesRelation.RightCross:
            this._rangeList.splice(i, 1);
            rangeToBeAdded = this.calcAddResultOfTwoRange(
              cur,
              rangeToBeAdded
            )[0];
            continue;
          case RangesRelation.Less:
          case RangesRelation.Unknown:
            continue;
          case RangesRelation.Greater:
            this._rangeList.splice(i + 1, 0, rangeToBeAdded);
            return;
          case RangesRelation.BeIncluded:
          case RangesRelation.Equal:
            return;
          default:
            invariant(false, "unexpected range relation");
        }
      }
    }
  }

  /**
   * Removes a range from the list
   * @param rangeToBeRemoved range to be removed
   */
  remove(rangeToBeRemoved: Range) {
    const isRangeValid = this.isValidRange(rangeToBeRemoved);
    if (!isRangeValid) {
      invariant(
        false,
        "parameter include invalid Range, range must be two length's number array which first element less or equal than second element"
      );
    } else if (
      this.isEmptyRange(rangeToBeRemoved) ||
      this._rangeList.length === 0
    ) {
      return;
    }

    for (let i = this._rangeList.length - 1; i >= 0; i--) {
      const cur = this._rangeList[i];
      const relation = RangeList.getRangeRelation(rangeToBeRemoved, cur);

      switch (relation) {
        case RangesRelation.Greater:
          return;
        case RangesRelation.Less:
        case RangesRelation.Unknown:
          continue;
        case RangesRelation.Equal:
          this._rangeList.splice(i, 1);
          return;
        case RangesRelation.LeftCross:
          this._rangeList[i] = this.calcMinusResultOfTwoRange(
            cur,
            rangeToBeRemoved
          )[0];
          return;
        case RangesRelation.RightCross:
          this._rangeList[i] = this.calcMinusResultOfTwoRange(
            cur,
            rangeToBeRemoved
          )[0];
          continue;
        case RangesRelation.BeIncluded:
          this._rangeList.splice(
            i,
            1,
            ...this.calcMinusResultOfTwoRange(cur, rangeToBeRemoved)
          );
          return;
        case RangesRelation.Include:
          this._rangeList.splice(i, 1);
          continue;
        default:
          invariant(false, "unexpected range relation");
      }
    }
  }

  /**
   * Prints out the list of ranges in the range list
   */
  print() {
    console.log(
      this._rangeList
        .reduce((msg, r) => {
          return msg + " " + this.formatRange(r);
        }, "")
        .trim()
    );
  }

  protected formatRange(range: Range): string {
    return `[${range[0]}, ${range[1]})`;
  }

  /**
   * judge is given range valid.
   * valid range must have this form: [a: Integer, b: Integer] and a <= b
   * @param range range to be checked
   * @returns boolean
   */
  private isValidRange(range: Range): boolean {
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

  private isEmptyRange(range: Range): boolean {
    return range[0] === range[1];
  }

  private calcAddResultOfTwoRange(r1: Range, r2: Range): Range[] {
    const relation = RangeList.getRangeRelation(r1, r2);

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
        //DO Nothing
        return [r2];
      default:
        invariant(false, "Unknown Range Relation");
    }
  }

  private calcMinusResultOfTwoRange(r1: Range, r2: Range): Range[] {
    const relation = RangeList.getRangeRelation(r1, r2);

    switch (relation) {
      case RangesRelation.Less:
        return [r1, r2];
      case RangesRelation.Greater:
        return [r2, r1];
      case RangesRelation.LeftCross:
        return ([[r2[1], r1[1]]] as Range[]).filter(
          (r) => !this.isEmptyRange(r)
        );
      case RangesRelation.RightCross:
        return ([[r1[0], r2[0]]] as Range[]).filter(
          (r) => !this.isEmptyRange(r)
        );
      case RangesRelation.Include:
        return (
          [
            [r1[0], r2[0]],
            [r2[1], r1[1]],
          ] as Range[]
        ).filter((r) => !this.isEmptyRange(r));
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
   * @returns RangeRelation
   */
  public static getRangeRelation(
    [r1L, r1R]: Range,
    [r2L, r2R]: Range
  ): RangesRelation {
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
    return RangesRelation.Unknown;
  }
}
