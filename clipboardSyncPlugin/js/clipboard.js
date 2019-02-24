- function () {
  function Clipboard() {
    var self = this;
    this.timer = null;
    this.textarea = document.createElement('textarea');
    $(function () {
      document.body.appendChild(self.textarea);
    });
  }
  window.Clipboard = Clipboard;

  Clipboard.prototype.get = function () {
    this.textarea.focus();
    this.textarea.value = '';
    if (!document.execCommand("paste")) {
      throw new Error('Clipboard paste failed');
    }
    //console.log(this.textarea.value)
    try {
      let encodeData = window.btoa(encodeURI(this.textarea.value.trim()))
      return encodeData
    } catch (error) {
      return window.btoa(encodeURI('一台设备复制了无法编码的字符，传输失败'))
    }
  };
  Clipboard.prototype.set = function (content) {
    try {
      this.textarea.value = decodeURI(window.atob(content.trim())); //base64 有时无法编码特殊字符
    } catch (error) {
      this.textarea.value = decodeURI(window.atob("一台设备复制了无法编码的字符，传输失败"))
    }
    this.textarea.select();
    var active = !!this.timer;
    if (active) {
      this.stop();
    }
    if (!document.execCommand("cut")) {
      throw new Error('Clipboard cut failed');
    }
    if (active) {
      this.start();
    }
    return true;
  };
  Clipboard.prototype.start = function () {
    var self = this;
    var oldValue = this.get();
    this.stop();
    this.timer = setInterval(function () {
      var newValue = self.get();
      if (newValue.trim().length && newValue !== oldValue) {
        window.eventHub.emit('dataChange', newValue)
        //console.log(newValue)
        oldValue = newValue;
      }
    }, 1000);
  };
  Clipboard.prototype.stop = function () {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  };
}();