# tracker
这是一个埋点SDK
This is a buried SDK

使用方法如下
The usage is as follows




```js
//接口上报
import Tracker from 'zmy-tracker'

const tr = new Tracker({
    requestUrl:"xxxxxx"
})

```
options 介绍
Options introduction
```ts

/**
 * @requestUrl 接口地址
 * @historyTracker history上报
 * @hashTracker hash上报
 * @domTracker 携带Tracker-key 点击事件上报
 * @historyTracker sdkVersion sdk版本
 * @historyTracker extra 透传字段
 * @jsError js 和 promise 报错异常上报
 */
export interface DefaultOptons {
    uuid: string | undefined,
    requestUrl: string | undefined,
    historyTracker: boolean,
    hashTracker: boolean,
    domTracker: boolean,
    sdkVersion: string | number,
    extra: Record<string, any> | undefined,
    jsError:boolean
}
```
Dom上报
DOM escalation
```js
//  <button target-key="埋点值">按钮</button>
//只要有target-key 就会自动上报
const tr = new Tracker({
    requestUrl:"http://localhost:3000/xxxx", //接口地址
    domTracker:true
})
```

用法
usage
```js
const tr = new Tracker({
    requestUrl:"http://localhost:3000/xxxx", //接口地址
    historyTracker:true,
    domTracker:true,
    jsError:true,
})
//添加用户id
tr.setUserId()

//自定义上报 必须要有 event 和 targetKey  两个字段
tr.sendTracker({xxx})
```

