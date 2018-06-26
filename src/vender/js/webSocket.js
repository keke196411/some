
let webSocket = {
  ws: null,
  timeOut: null
}

let initWebSocket = function (options) {
  let url = options.url
  webSocket.ws = new WebSocket(url)
  webSocket.ws.onopen = function () {
    console.log('连接开启')
    Reflect.apply(options.onopen, null, [this])
  }
  webSocket.ws.onmessage = function (message) {
    Reflect.apply(options.onmessage, null, [message.data])
  }
  webSocket.ws.onclose = function () {
    console.log('连接关闭')
    // webSocket.ws.timeout = setInterval(function () {
    //   initWebSocket()
    // }, 150)
  }
  return webSocket.ws
}
// 初始化webSocket
export default {
  initWebSocket
}
