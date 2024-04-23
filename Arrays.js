arr = ["1", 2, "3", 14];
str = arr.toString();
console.log(typeof arr + ` ${arr}`);
console.log(typeof str + ` ${str}`);
lenOfArr = arr.length;
console.log(typeof lenOfArr + ` ${lenOfArr}`);
sortArr = arr.sort();
console.log(typeof sortArr + ` ${sortArr}`);
arr.push("Disorder");
console.log(typeof arr + ` ${arr}`);
arr = [];
arr["Person"] = "Zakaria";
console.log(typeof arr + ` ${arr["Person"]}`);
console.log(`All Array ${arr["Person"]}`);
arr = ["1", "2", "3"];
console.log(arr);
console.log(`Erasing The First Element ${arr.shift()}`);
console.log(arr);
console.log(`The New Length Of The arr Is ${arr.unshift(4)}`);
console.log(arr);
console.log(`Erasing The Last Element ${arr.pop()}`);
console.log(arr);
arr1 = ["10", "1"];
arr2 = ["20", "2"];
arr3 = ["30", "3"];
arr4 = ["40", "4"];
console.log(`Concate The Other Arrays With Arr1: ${arr1.concat(arr2, arr3, arr4).sort()}`);
fruits = ["Banana", "Orange", "Apple", "Mango"];
console.log(`Fruits: ${fruits}`);
fruits.copyWithin(2, 0, 1);
console.log(`Copy Banana To Index 2: ${fruits}`);
fruits.splice(1, 0, "Kiwi");
console.log("Add Kiwi To Index 1 Without Remove Any Elementt: " + fruits);
console.log("Test FortEach Function On Fruits.");
fruits.forEach(print);
function print(a, b, c)
{
    console.log(`Val: ${a}, Index: ${b}, Whole Fruits: ${c}`);
}
console.log("Test Map On Fruit To Create Greate Fruits.");
Greatfruits = fruits.map(printDouble);
Greatfruits.forEach(print);
function printDouble(a)
{
    return `Great ${a}`;
}
mixFruit = fruits.concat(Greatfruits);
console.log("Chose The Kiwi Form The MixFruit.");
kiwi = mixFruit.filter(getTheKiwi);
kiwi.forEach(print);
function getTheKiwi(v)
{
    return (v.search(/kiwi/i) != -1);
}
console.log("----------------------------");
names = [2, 1,3,4,34,234,323, 0,43];
all = names.reduce(conCat, 5);
function conCat(total, v, i, a){
    return (total + v);
}
console.log(all);
console.log("Check If Every Element In Names Greatre Than 0");
checker = names.every(GreatThanZero);
function GreatThanZero(v){
    return (v > 0);
}
console.log(checker);

bbbb = fff.from("ABCDEFGHIJKLMNOPURSTQVWXYZ");