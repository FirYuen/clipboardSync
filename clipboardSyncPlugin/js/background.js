var ba = chrome.browserAction
var bg = chrome.extension.getBackgroundPage()
var clipboard = new Clipboard()

let socket = io({
    autoConnect: false,
})

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        //持久化本地存储
        localStorage.setItem('roomID', request.roomID)
        localStorage.setItem('request', request.serverAddr)
        if (request.messageType === 'connect') {
            socket = io(`ws://${request.serverAddr}`, {
                reconnectionAttempts: 2 //定义重连次数
            })
            setTimeout(() => {
                if (socket.connected) { 
                    localStorage.setItem('messageType', 'connect') 
                    socket.emit('join', request.roomID) //加入指定room
                    //通过eventHub发布连接状态
                    window.eventHub.emit('connectedStatus', {
                        connected: true,
                        roomID: request.roomID
                    })
                    sendResponse(true) //返回连接成功状态
                } else {
                    sendResponse(false)
                }
            }, 3000);
        } else {
            localStorage.setItem('messageType', 'disconnect')
            socket.close() //client断开连接
            sendResponse(true)
            window.eventHub.emit('connectedStatus', {
                connected: false, 
                roomID: request.roomID
            })
        }
        return true //md 国内文档都没说异步时要直接return true 
    }); 

-function () {
    window.eventHub.on('connectedStatus', (status) => {
        if (status.connected) {
            clipboard.start() //开始剪切板的监控
            //将数据发布到soclket.io room中
            window.eventHub.on('dataChange', (newValue) => {
                socket.emit('message', {
                    roomID: status.roomID,
                    message: newValue
                })
            })
            socket.on('message', (data) => {
                if (data.trim()) {
                    clipboard.set(data) //设置数据到剪切板
                }
            })
        } else {
            clipboard.stop() //停止剪切板的监控
        }
    })
}() 
//看门狗 传递连接状态
-function watchDog() {
    setInterval(() => {
        chrome.runtime.sendMessage(socket.connected)
    }, 1500);
}() 
//启动器，不打开前端页面也能自动连接
-function booter() {
    let isConnect = localStorage.getItem('messageType')
    let serverAddr = localStorage.getItem('serverAddr')
    let roomID = localStorage.getItem('roomID')
    if (isConnect === 'connect') {
        console.log("need to auto connect")
        if (serverAddr && roomID) {
            socket = io(`ws://${serverAddr}`, {
                reconnectionAttempts: 2
            })
            setTimeout(() => {
                if (socket.connected) {
                    socket.emit('join', roomID)
                    window.eventHub.emit('connectedStatus', {
                        connected: true,
                        roomID: roomID
                    })
                }
            }, 1000);
        }
    } else {
        console.log("don't need to auto connect")
    }
}()