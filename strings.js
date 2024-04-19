// str1 = "ABCDEFGHIJKL\"->\"MNOPQRSTUVWXYZ";
// console.log("str1: " + str1); console.log("Len Of str1: " + str1.length);
// str2 = new String(str1);
// console.log("str2: " + str2); console.log("Len Of The Object str2: " + str2.length);
// console.log("Compare str1 & str2 As Objects === " + (str1 === str2));
// console.log("Compare The Two Strings str1 & str2 == " + (str1 == str2));
// console.log("str1 CharAt Position 0: <" + str1.charAt(0) + ">")
// console.log("str1 CodeCharAt Position 0: <" + str1.charCodeAt(0) + ">")
// console.log("str2 CharAt Position 2: <" + str2.charAt(2) + ">")
// console.log("str1 CodeCharAt Position 2: <" + str2.charCodeAt(2) + ">")
// console.log("Slice str1 From Index 3 To Index 14: " + str1.slice(3, 14));
// console.log("Slice str2 From Index 4 To Index 15: " + str2.slice(4, 15));
// text = "         Zakaria Sabri Zakaria Sabri Zakaria Sabri Zakaria Sabri           ";
// console.log("Text: " + text);
// console.log("TEXT: " + text.toUpperCase());
// console.log("text: " + text.toLowerCase());
// console.log("Yassin Now: ", text.replace("Zakaria", "Yassin"));
// console.log("All Yassin Now: ", text.replace(/Zakaria/g, "Yassin"));
// console.log("Yassin Will Apper In Any Case: " + text.replace(/ZaKaRia/ig, "Yassin"));
// console.log("Remove Spaces From Begin And End Of Text: `" + text.trim() + '`');
// console.log("Remove Spaces From Begin Text: `" + text.trimStart() + '`');
// console.log("Remove Spaces From End Of Text: `" + text.trimEnd() + '`');
text = "         Zakaria Sabri Zakaria Sabri Zakaria Sabri Zakaria Sabri           ";
arr = text.trim().split(' ');
for (i in arr)
{
    console.log("arr[" + i + "] -> " + arr[i]);
    i++;
}
console.log("Find Index Of Yassin: " + text.trim().replace(/zakaria/ig, "Yassine").indexOf("Yassin"));
console.log("Find Index Of Last Yassin: " + text.trim().replace(/zakaria/ig, "Yassine").lastIndexOf("Yassine"));
console.log("Search For Sabri: "+ text.trim().search(/SAbri/i));
console.log("Mathc MyText With Zak:");
arr = text.match(/ZaKaRIa Sabri/ig);
for (i in arr)
{
    console.log(arr[i]);
    i++;
}