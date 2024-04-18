/*String*/
str1 = "ABCDEFGHIJKL\"->\"MNOPQRSTUVWXYZ";
console.log("str1: " + str1); console.log("Len Of str1: " + str1.length);
str2 = new String(str1);
console.log("str2: " + str2); console.log("Len Of The Object str2: " + str2.length);
console.log("Compare str1 & str2 As Objects === " + (str1 === str2));
console.log("Compare The Two Strings str1 & str2 == " + (str1 == str2));