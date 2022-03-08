import invariant from "tiny-invariant";
import {
  RangesRelation,
  Range,
  isEmptyRange,
  isValidRange,
  calcAddResultOfTwoRange,
  calcMinusResultOfTwoRange,
  getRangeRelation,
} from "./utils";

/**
 * Range List Class implement Add / Remove / Print operations.
 */
export class RangeList {
  private _rangeList: Range[] = [];

  constructor(ranges?: Range[]) {
    if (ranges === undefined) {
      return;
    }

    const isRangesValid = ranges.every((r) => isValidRange(r));
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
    const isRangeValid = isValidRange(rangeToBeAdded);
    if (!isRangeValid) {
      invariant(
        false,
        "parameter include invalid Range, range must be two length's number array which first element less or equal than second element"
      );
      return;
    } else if (isEmptyRange(rangeToBeAdded)) {
      return;
    }

    if (this._rangeList.length === 0) {
      this._rangeList.push(rangeToBeAdded);
    } else if (this._rangeList.length === 1) {
      this._rangeList = calcAddResultOfTwoRange(
        this._rangeList[0],
        rangeToBeAdded
      );
    } else {
      let lastRelation: RangesRelation | undefined = undefined;
      for (let i = this._rangeList.length - 1; i >= 0; i--) {
        const cur = this._rangeList[i];
        const relation = getRangeRelation(rangeToBeAdded, cur);
        lastRelation = relation;

        switch (relation) {
          case RangesRelation.Include:
            this._rangeList.splice(i, 1);
            continue;
          case RangesRelation.LeftCross:
            this._rangeList[i] = calcAddResultOfTwoRange(
              rangeToBeAdded,
              cur
            )[0];
            return;
          case RangesRelation.RightCross:
            this._rangeList.splice(i, 1);
            rangeToBeAdded = calcAddResultOfTwoRange(cur, rangeToBeAdded)[0];
            continue;
          case RangesRelation.Less:
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

      //this case is for the rangeToBeAdded include all ranges.
      if (
        lastRelation === RangesRelation.Include &&
        this._rangeList.length === 0
      ) {
        this._rangeList = [rangeToBeAdded];
      }
    }
  }

  /**
   * Removes a range from the list
   * @param rangeToBeRemoved range to be removed
   */
  remove(rangeToBeRemoved: Range) {
    const isRangeValid = isValidRange(rangeToBeRemoved);
    if (!isRangeValid) {
      invariant(
        false,
        "parameter include invalid Range, range must be two length's number array which first element less or equal than second element"
      );
    } else if (isEmptyRange(rangeToBeRemoved) || this._rangeList.length === 0) {
      return;
    }

    for (let i = this._rangeList.length - 1; i >= 0; i--) {
      const cur = this._rangeList[i];
      const relation = getRangeRelation(rangeToBeRemoved, cur);

      switch (relation) {
        case RangesRelation.Greater:
          return;
        case RangesRelation.Less:
          continue;
        case RangesRelation.Equal:
          this._rangeList.splice(i, 1);
          return;
        case RangesRelation.LeftCross:
          this._rangeList[i] = calcMinusResultOfTwoRange(
            cur,
            rangeToBeRemoved
          )[0];
          return;
        case RangesRelation.RightCross:
          this._rangeList[i] = calcMinusResultOfTwoRange(
            cur,
            rangeToBeRemoved
          )[0];
          continue;
        case RangesRelation.BeIncluded:
          this._rangeList.splice(
            i,
            1,
            ...calcMinusResultOfTwoRange(cur, rangeToBeRemoved)
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
}
