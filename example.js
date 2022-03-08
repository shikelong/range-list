const {RangeList} = require("./dist/index")

console.log("-".repeat(50) + "example output:" + "-".repeat(50))

const r1 = new RangeList([[2, 5]]);

r1.add([3, 15]);

r1.add([20, 28]);
r1.remove([12, 22])
r1.print()

//Now You can write test code here!