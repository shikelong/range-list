import { RangeList } from "./RangeList";

describe("RangeList", () => {
  it("add and remove behavior should be correct", () => {
    const consoleLogMock = jest
      .spyOn(console, "log")
      .mockImplementationOnce(() => {});

    const r1 = new RangeList();

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

  it("add method should ignore invalid input", () => {});

  it("remove method should ignore invalid input", () => {});

  it("initialize should correct", () => {});
});
