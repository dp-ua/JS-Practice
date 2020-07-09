const testAPI = require('./test');
const test = testAPI.testAssert;

const matchString = "[a-zA-Z]";

const shiftChar  = (e, shift) => {
  var ch = e.charCodeAt(0);
  var result = ch + (shift % 25);
  result = (result < 97  && result>122) || (result<65 && result>90) ?
            result - 25 : result ;
  return String.fromCharCode(result);
} 
const checkCharsOneRange = (ch0, ch1) => {
    if ((ch0>=65 || ch0<=90) && (ch1>=65 || ch1<=90)) return true;
    if ((ch0>=97 || ch0<=122) && (ch1>=97 || ch1<=122)) return true;
    return false;
}

const getShiftFromPrefix = (codeString) => {
  if (codeString[0].match(matchString)===null || codeString[1].match(matchString)===null)  throw new "Wrong String. Cant get prefix";
  var ch1 = codeString.charCodeAt(1);
  var ch0 = codeString.charCodeAt(0);
  if  (!checkCharsOneRange(ch0,ch1)) throw new "Wrong String. Cant get prefix";
  var tempshift = ch1-ch0;
    return tempshift > 0 ? 
            tempshift : 25 - tempshift;
}

const splitString = (s) => {
  var partsLen = 0;
  var less = 0;
  var len = s.length;
    if (len % 5 === 0) {
      partsLen= len / 5;
      less=0;
    } else {
      parts=parseInt(len / 4);
      less = len - partsLen * 4;
    }
  var result = [];
  for (var i = 0; i< len/partsLen; i++){
    result.push(s.slice(partsLen * i, partsLen * (i+1)) );
  }
    if (less!==0) result.push(s.slice(len-less-1));
    
    return result;
}

const shiftStr = (s,shift) => {
  return s.split('').map(e => {
    if (e.match(matchString)!==null) {
      return shiftChar(e,shift);
    }
    else {
      return e;
    }
  }).join('');
}

function encodeStr(s, shift) {
  var codeString = shiftStr(s,shift);

  var prefix = s[0].toLowerCase() + shiftChar(s[0].toLowerCase(),shift);
  var result = prefix + codeString;
  
  return splitString(result);
}

function decode(arr) {
  var workString = arr.join('');
  var shift = - getShiftFromPrefix(workString);
  return shiftStr(workString.slice(2),shift);
  // your code
}

test(shiftChar('o',1),'p');

test(getShiftFromPrefix('opP DBQUBJ,O!'),1);

u = "I should have known that you would have a perfect answer for me!!!"
v = ["ijJ tipvme ibw", "f lopxo uibu z", "pv xpvme ibwf ", "b qfsgfdu botx", "fs gps nf!!!"]
test(decode(v), u)

u = "O CAPTAIN! my Captain! our fearful trip is done;"
v = ["opP DBQUBJ", "O! nz Dbqu", "bjo! pvs g", "fbsgvm usj", "q jt epof;"]
test(encodeStr(u, 1), v)


