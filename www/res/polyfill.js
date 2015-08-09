// JavaScript 1.8
if (!Array.prototype.forEach)
Array.prototype.forEach=function(a,b){var T,k,O,l,m;if(this==null){throw new TypeError('this is null or not defined')}O=Object(this);l=O.length>>>0;if(typeof a!=="function"){throw new TypeError(a+' is not a function')}if(arguments.length>1)T=b;k=0;while(k<l){if(k in O){m=O[k];a.call(T,m,k,O)}k++}};
if (!Array.prototype.indexOf)
Array.prototype.indexOf=function(a,b){if(this===undefined||this===null){throw new TypeError('"this" is null or not defined')}var length=this.length>>>0;b=+b||0;if(Math.abs(b)===Infinity){b=0}if(b<0){b+=length;if(b<0)b=0}for(;b<length;b++){if(this[b]===a)return b}return -1};
// Extend String.prototype.trim to PHP behavior to remove more than just white space
String.prototype.trim=function(chars){return this.replace(new RegExp('^['+(chars||'\\uffef\\ua0\\s')+']+|['+(chars||'\\uffef\\ua0\\s')+']+$','g'),'')}
// ECMAScript 6
Number.isInteger=Number.isInteger||function(a){return typeof a==='number'&&isFinite(a)&&Math.abs(a)<Math.pow(2,53)-1&&Math.floor(a)===a};
Number.parseFloat=Number.parseFloat||parseFloat;
Number.parseInt=Number.parseInt||parseInt;
Math.log10=Math.log10||function(x){return Math.log(x)/Math.log(10)};
Math.sign=Math.sign||function(x){x=+x;if(x===0||isNaN(x))return x;return x>0?1:-1};
