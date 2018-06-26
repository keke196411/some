/*
 * @Author: wupeiwen javapeiwen2010@gmail.com
 * @Date: 2018-04-20 11:49:46
 * @Last Modified by: wupeiwen javapeiwen2010@gmail.com
 * @Last Modified time: 2018-04-20 14:18:59
 */
// 数字的正则表达式
let isNum = (str) => {
  const reg = /^\d*$/
  return reg.test(str)
}

// 整数的正则表达式
let isInt = (str) => {
  const reg = /^0$|^[1-9]\d*$/
  return reg.test(str)
}

// 英文的正则表达式
let isEnglish = (str) => {
  const reg = /^[a-zA-Z]*$/
  return reg.test(str)
}

// 英文数字组合的正则表达式
let isEnglishNum = (str) => {
  const reg = /^[a-zA-Z0-9]*$/
  return reg.test(str)
}

// 中文的正则表达式
let isChinese = (str) => {
  const reg = /^[\u4e00-\u9fa5]{0,}$/
  return reg.test(str)
}

// 中文和符号的正则表达式
let isChineseSymbol = (str) => {
  const reg = /^[\u4e00-\u9fa5，。！、……《》（）【】：；“‘”’？￥,.?:;'"()]+$/
  return reg.test(str)
}

// 18位身份证的正则表达式
let isIDCard = (str) => {
  const reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
  return reg.test(str)
}

// 邮箱的正则表达式
let isMail = (str) => {
  const reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
  return reg.test(str)
}

// 11位手机号的正则表达式
let isPhone = (str) => {
  const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
  return reg.test(str)
}

// Url地址的正则表达式
let isUrl = (str) => {
  const reg = /^(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]$/
  return reg.test(str)
}

// 端口号的正则表达式
let isPort = (str) => {
  const reg = /^(1(02[4-9]|0[3-9][0-9]|[1-9][0-9]{2})|[2-9][0-9]{3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/
  return reg.test(str)
}

// IP地址的正则表达式
let isIP = (str) => {
  const reg = /^(?:(?:1[0-9][0-9]\.)|(?:2[0-4][0-9]\.)|(?:25[0-5]\.)|(?:[1-9][0-9]\.)|(?:[0-9]\.)){3}(?:(?:1[0-9][0-9])|(?:2[0-4][0-9])|(?:25[0-5])|(?:[1-9][0-9])|(?:[0-9]))$/
  return reg.test(str)
}

let isAllNull = str => {
  const reg = /^\s+$/
  return reg.test(str)
}

let isVersionFormat = str => {
  const reg = /^\d+(\.\d+)*$/
  return reg.test(str)
}

let ruleList = {
  isNum: isNum,
  isInt: isInt,
  isEnglish: isEnglish,
  isEnglishNum: isEnglishNum,
  isChinese: isChinese,
  isChineseSymbol: isChineseSymbol,
  isIDCard: isIDCard,
  isMail: isMail,
  isPhone: isPhone,
  isUrl: isUrl,
  isPort: isPort,
  isIP: isIP,
  isAllNull,
  isVersionFormat
}

let checkChinese = (rule, value, callback) => {
  if (!ruleList.isChinese(value)) {
    return callback(new Error('只能输入中文字符'))
  } else {
    callback()
  }
}
let checkChineseSymbol = (rule, value, callback) => {
  if (!ruleList.isChineseSymbol(value)) {
    return callback(new Error('只能输入中文和标点符号字符'))
  } else {
    callback()
  }
}
let checkEnglish = (rule, value, callback) => {
  if (!ruleList.isEnglish(value)) {
    return callback(new Error('只能输入英文字符'))
  } else {
    callback()
  }
}
let checkEnglishNum = (rule, value, callback) => {
  if (!ruleList.isEnglishNum(value)) {
    return callback(new Error('只能输入英文和数字字符'))
  } else {
    callback()
  }
}
let checkIDCard = (rule, value, callback) => {
  if (!ruleList.isIDCard(value)) {
    return callback(new Error('18位身份证号码格式不正确'))
  } else {
    callback()
  }
}
let checkMail = (rule, value, callback) => {
  if (!ruleList.isMail(value)) {
    return callback(new Error('邮箱格式不正确'))
  } else {
    callback()
  }
}

let checkPhone = (rule, value, callback) => {
  if (!ruleList.isPhone(value)) {
    return callback(new Error('11位手机号码格式不正确'))
  } else {
    callback()
  }
}
let checkIP = (rule, value, callback) => {
  if (!ruleList.isIP(value)) {
    return callback(new Error('IP地址格式不正确'))
  } else {
    callback()
  }
}
let checkPort = (rule, value, callback) => {
  if (!ruleList.isPort(value)) {
    return callback(new Error('端口号格式不正确, 1024-65535'))
  } else {
    callback()
  }
}
let checkUrl = (rule, value, callback) => {
  if (!ruleList.isUrl(value)) {
    return callback(new Error('Url地址格式不正确'))
  } else {
    callback()
  }
}

let checkAllNull = (rule, value, callback) => {
  if (ruleList.isAllNull(value)) {
    callback(new Error('请输入非空值'))
  } else callback()
}

let checkVersion = (rule, value, callback) => {
  if (!ruleList.isVersionFormat(value)) {
    callback(new Error('请输入正确的版本格式'))
  } else callback()
}

let checkReg = {
  checkChinese: checkChinese,
  checkChineseSymbol: checkChineseSymbol,
  checkEnglish: checkEnglish,
  checkEnglishNum: checkEnglishNum,
  checkIDCard: checkIDCard,
  checkMail: checkMail,
  checkPhone: checkPhone,
  checkIP: checkIP,
  checkPort: checkPort,
  checkUrl: checkUrl,
  checkAllNull,
  checkVersion
}

export default checkReg
