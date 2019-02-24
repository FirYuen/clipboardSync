$(function () {
    $("#serverAddr").val(localStorage.getItem('serverAddr')),
        $("#roomID").val(localStorage.getItem('roomID'))
})

function keyvalidator(key) {
    let reg = /^[A-Za-z0-9]{6,20}$/;
    if (reg.test(key)) {
        return true
    } else {
        return false
    }
}
$('#connect').on("click", () => {
    if (keyvalidator($("#roomID").val())) {
        $('#connectResult').text('')
        chrome.runtime.sendMessage({
            messageType: 'connect',
            serverAddr: $("#serverAddr").val(),
            roomID: $("#roomID").val(),
        }, function (response) {
            if (response) {
                $('#connectResult').text("连接成功").removeClass('failed').addClass('connected')
                localStorage.setItem('serverAddr', $("#serverAddr").val())
                localStorage.setItem('roomID', $("#roomID").val())
            } else {
                $('#connectResult').text("连接失败，请确认参数后重试").removeClass('connected').addClass('failed')
            }
            setTimeout(() => {
                $('#connectResult').text('')
            }, 2000);
        })
    } else {
        $('#connectResult').text("连接失败，请确认密钥参数后重试").removeClass('connected').addClass('failed')
    }
});
$('#disconnect').on("click", () => {
    chrome.runtime.sendMessage({
        messageType: 'disconnect',
        serverAddr: $("#serverAddr").val(),
        roomID: $("#roomID").val()
    }, function (response) {
        if (response) {
            $('#connectResult').text('登出成功').removeClass('failed').addClass('connected')
        }
    });
});
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request === true) {
            $('#status').text("已连接").removeClass('disconnected').addClass('connected')
            $('#disconnect').removeClass('disabled').siblings().addClass('disabled').parents().siblings().addClass('disabled')
        } else {
            $('#status').text("未连接").removeClass('connected').addClass('disconnected')
            $('#disconnect').addClass('disabled').siblings().removeClass('disabled').parents().siblings().removeClass('disabled')
        }
    })