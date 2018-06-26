function drawProcessCircle (drawingElem, percent, forecolor, bgcolor, txtcolor) {
  /*
            @drawingElem: 绘制对象
            @percent：绘制圆环百分比, 范围[0, 100]
            @forecolor: 绘制圆环的前景色，颜色代码
            @bgcolor: 绘制圆环的背景色，颜色代码
        */
  let context = drawingElem.getContext('2d')
  let center_x = drawingElem.width / 2
  let center_y = drawingElem.height / 2
  let rad = Math.PI * 2 / 100
  let speed = 0

  // 绘制背景圆圈
  function backgroundCircle () {
    context.save()
    context.beginPath()
    context.lineWidth = 4 // 设置线宽
    let radius = center_x - context.lineWidth
    context.lineCap = 'butt'
    context.strokeStyle = bgcolor
    context.arc(center_x, center_y, radius, 0, Math.PI * 2, true)
    context.stroke()
    context.closePath()
    context.restore()
  }

  // 绘制运动圆环
  function foregroundCircle (n) {
    context.save()
    context.strokeStyle = forecolor
    context.lineWidth = 4
    context.lineCap = 'round'
    let radius = center_x - context.lineWidth
    context.beginPath()
    context.arc(center_x, center_y, radius, 3 * Math.PI / 2, 3 * Math.PI / 2 - n * rad, true) // 用于绘制圆弧context.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)
    context.stroke()
    context.closePath()
    context.restore()
  }

  // 绘制文字
  function text (n) {
    context.save() // save和restore可以保证样式属性只运用于该段canvas元素
    context.fillStyle = txtcolor || forecolor
    let font_size = 12
    context.font = font_size + 'px Microsoft YaHei'
    let text_width = context.measureText(n.toFixed(2) + '%').width
    context.fillText(n.toFixed(2) + '%', center_x - text_width / 2, center_y + font_size / 2)
    context.restore()
  }

  // 执行动画
  (function drawFrame () {
    context.clearRect(0, 0, drawingElem.width, drawingElem.height)
    backgroundCircle()
    if (speed >= percent) {
      text(percent)
      if (percent !== 0) foregroundCircle(percent)
      return
    } else {
      text(speed)
      foregroundCircle(speed)
      speed += 1
    }
    window.requestAnimationFrame(drawFrame)
  })()
}

// 格式化时间
let formatDate = function formatDate (date, format) {
  var o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S': date.getMilliseconds()
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    }
  }
  return format
}
// long转时间
let formatDateFromLong = (timestamp, format) => {
  let date = null
  if (timestamp === null) {
    return '无'
  }
  try {
    date = formatDate(new Date(timestamp), format)
  } catch (e) {
    return '无'
  }
  return date
}

let ifRepeat = (single, list) => Array.prototype.includes ? (single, list) => list.includes(single) : (single, list) => list.some((v) => v === single)

let matcher = {
  continuousMatch (source, toComp) {
    let reg = new RegExp(toComp, 'i')
    return source.math(reg)
  }
}

export default {
  drawProcessCircle,
  formatDateFromLong,
  ifRepeat,
  matcher
}
