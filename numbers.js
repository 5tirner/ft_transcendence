num = 45673465763498393475884375943957483590n;
console.log(num);
console.log(typeof num);
a = BigInt(9007199254740991 + (Math.pow(2, 53) - 1));
a++;
console.log(a);
console.log(typeof a);
a = 10.123;
console.log(a.toExponential(2)); // With Sientific
console.log(a.toExponential(3));
console.log(a.toFixed(2)); // With Specific Numbers Behind The Point;
console.log(a.toFixed(3));
console.log(a.toPrecision(4)); // With Length Of The Number
console.log(a.toPrecision(3));
a = (32 + 5).toString();
console.log(typeof a + " " + a);
a = (100 + 5).valueOf();
console.log(typeof a + " " + a);
console.log(parseInt("-10.a.33")); // Like Atoi
console.log(parseFloat("10")); // Behave Like Shit