import { RangeList } from "../RangeList";

describe("RangeList", () => {
  it("empty list should be printed correctly", () => {
    const consoleLogMock = jest
      .spyOn(console, "log")
      .mockImplementationOnce(() => {});
    const rl = new RangeList();
    rl.print();
    expect(console.log).toHaveBeenLastCalledWith("");
  });

  //Note: this test case copy from homework'pdf
  it("add and remove behavior should be correct", () => {
    const consoleLogMock = jest
      .spyOn(console, "log")
      .mockImplementationOnce(() => {});
    const rl = new RangeList();
    rl.add([1, 5]);
    rl.print();
    expect(console.log).toHaveBeenLastCalledWith("[1, 5)");
    rl.add([10, 20]);
    rl.print();
    expect(console.log).toHaveBeenLastCalledWith("[1, 5) [10, 20)");
    rl.add([20, 20]);
    rl.print();
    expect(console.log).toHaveBeenLastCalledWith("[1, 5) [10, 20)");
    rl.add([20, 21]);
    rl.print();
    expect(console.log).toHaveBeenLastCalledWith("[1, 5) [10, 21)");
    rl.add([2, 4]);
    rl.print();
    expect(console.log).toHaveBeenLastCalledWith("[1, 5) [10, 21)");
    rl.add([3, 8]);
    rl.print();
    expect(console.log).toHaveBeenLastCalledWith("[1, 8) [10, 21)");
    rl.remove([10, 10]);
    rl.print();
    expect(console.log).toHaveBeenLastCalledWith("[1, 8) [10, 21)");
    rl.remove([10, 11]);
    rl.print();
    expect(console.log).toHaveBeenLastCalledWith("[1, 8) [11, 21)");
    rl.remove([15, 17]);
    rl.print();
    expect(console.log).toHaveBeenLastCalledWith("[1, 8) [11, 15) [17, 21)");
    rl.remove([3, 19]);
    rl.print();
    expect(console.log).toHaveBeenLastCalledWith("[1, 3) [19, 21)");
  });

  it("add method should ignore/throw invalid input", () => {
    const rl = new RangeList([]);

    rl.add([3, 3]);
    rl.add([-2, 4]);
    expect(() => rl.add([1.2, 3])).toThrow();
    expect(() => rl.add([20, 3])).toThrow();
    rl.print();
    expect(console.log).toHaveBeenLastCalledWith("[-2, 4)");
  });

  it("remove method should ignore/throw invalid input", () => {
    const rl = new RangeList([
      [1, 5],
      [10, 20],
      [22, 30],
      [52, 64],
    ]);
    rl.print();
    expect(console.log).toHaveBeenLastCalledWith(
      "[1, 5) [10, 20) [22, 30) [52, 64)"
    );
    expect(() => rl.remove([5, 1])).toThrow();
    rl.remove([3, 3]);

    rl.remove([100, 200]);
    rl.print();
    expect(console.log).toHaveBeenLastCalledWith(
      "[1, 5) [10, 20) [22, 30) [52, 64)"
    );
  });

  it("initialize should correct", () => {
    const consoleLogMock = jest
      .spyOn(console, "log")
      .mockImplementationOnce(() => {});

    const rl = new RangeList([
      [52, 64],
      [1, 5],
      [10, 20],
      [22, 30],
      [3, 3],
      [3, 15],
    ]);
    rl.print();
    expect(console.log).toHaveBeenLastCalledWith("[1, 20) [22, 30) [52, 64)");
  });

  it("add behavior should be ok", () => {
    const consoleLogMock = jest
      .spyOn(console, "log")
      .mockImplementationOnce(() => {});

    const rl = new RangeList();
    rl.print();
    expect(console.log).toHaveBeenLastCalledWith("");
    rl.add([1, 5]);
    rl.print();
    expect(console.log).toHaveBeenLastCalledWith("[1, 5)");
    rl.add([20, 20]);
    rl.print();
    expect(console.log).toHaveBeenLastCalledWith("[1, 5)");

    rl.add([18, 25]);
    rl.print();
    expect(console.log).toHaveBeenLastCalledWith("[1, 5) [18, 25)");

    rl.add([3, 15]);
    rl.print();
    expect(console.log).toHaveBeenLastCalledWith("[1, 15) [18, 25)");

    rl.add([-2, 100]);
    rl.print();
    expect(console.log).toHaveBeenLastCalledWith("[-2, 100)");
  });

  it("remove behavior should be ok", () => {
    const consoleLogMock = jest
      .spyOn(console, "log")
      .mockImplementationOnce(() => {});

    const rl = new RangeList([
      [1, 5],
      [10, 20],
      [22, 30],
      [52, 64],
    ]);
    rl.print();
    expect(console.log).toHaveBeenLastCalledWith(
      "[1, 5) [10, 20) [22, 30) [52, 64)"
    );
    rl.remove([1, 5]);
    rl.print();
    expect(console.log).toHaveBeenLastCalledWith("[10, 20) [22, 30) [52, 64)");
    rl.remove([20, 20]);
    rl.print();
    expect(console.log).toHaveBeenLastCalledWith("[10, 20) [22, 30) [52, 64)");

    rl.remove([18, 25]);
    rl.print();
    expect(console.log).toHaveBeenLastCalledWith("[10, 18) [25, 30) [52, 64)");

    rl.remove([0, 100]);
    rl.print();
    expect(console.log).toHaveBeenLastCalledWith("");
  });
});
