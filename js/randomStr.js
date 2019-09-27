// len为生成字符串的长度默认为8，count为生成随机字符串的数量默认为1
// 返回一个包含随机字符串的数组
function randomFn(len, count) {
  len = len || 8
  count = count || 1
  var randomStr
  var randomStrArr
  var arr = [
    ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    [
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
      'j',
      'k',
      'l',
      'm',
      'n',
      'o',
      'p',
      'q',
      'r',
      's',
      't',
      'u',
      'v',
      'w',
      'x',
      'y',
      'z'
    ],
    [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z'
    ][('%', '_', '&', '#', '*')]
  ]
  let averageLen = Math.ceil(len / arr.length)
  let randomArr = []
  for (var n = 0; n < count; n++) {
    randomStrArr = []
    arr = arr.sort(function() {
      return Math.random() > 0.5
    })
    for (let i = 0; i < arr.length; i++) {
      const ele = arr[i]
      for (let n = 0; n < averageLen; n++) {
        randomStrArr.push(ele[Math.floor(Math.random() * ele.length)])
      }
    }
    randomStr = randomStrArr
      .sort(function() {
        return Math.random() > 0.5
      })
      .join('')
      .slice(0, len)
    randomArr.push(randomStr)
  }
  return randomArr
}
