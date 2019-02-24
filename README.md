## 仓库说明

因为现在有几台电脑一同协作，主要的工作机设置了文件夹的共享，可以互相访问文件，但是mac与windows之间想要互相之间访问剪切板大多需要打开一个第三方软件，感觉不够优雅，所以花两天学习，自己写了一个共享剪切板的chrome插件，第三方的服务器肯定是不放心的，所以还是利用`socket.io`使用自己写了很简单的后端。

* `clipboardSyncPlugin`：插件的源码；
* `clipboardSyncServer`：服务器的源码，可以放到局域网或者公网云上使用(默认端口3000，公网云上使用请加3000端口为白名单或者修改为其他端口)；

## 使用方法
1.  Server端 

``` shell
node clipboardSyncServer/index.js 
```

2.  插件端

chorme 右上角菜单->更多工具->扩展程序可以进入 插件管理页面 or 地址栏输入 `chrome://extensions`  
`勾选开发者模式`后点击`加载已解压的拓展程序`选择`clipboardSyncPlugin` 文件夹 
然后打开插件插件，填写正确的参数后连接
在所有终端上重复插件端的操作，`enjoy`。

#服务端在结束服务重新上线时 需要chrome重新设置连接或者重新打开chrome