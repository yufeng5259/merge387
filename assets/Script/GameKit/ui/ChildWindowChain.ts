
//子窗口链
//用于连续打开多个子窗口

export default class ChildWindowChain {
    constructor() {
        this.data = []
    }

    add(windowName, checkFunc, params) {
        this.data.push({windowName:windowName, checkFunc:checkFunc, params:params})
    }

    start() {
        this.index = 0
        this.execute(this.index)
    }

    execute(index) {
        if (index >= this.data.length) {
            this.finish()
            return
        }

        let data = this.data[index]
        if (data.checkFunc == null || data.checkFunc()) {
            let params = data.params || {}
            let cb = params.showCallback
            params.showCallback = (window) => {
                window.addOnCloseFunc(() => {
                    this.index++
                    this.execute(this.index)
                })
                window.childWindowChain = this
                if (cb) cb()
            }
            GameKit.SoundManager.playSound("se_open")
            UIRoot.instance.openChildWindow(data.windowName, params)
        } else {
            this.index++
            this.execute(this.index)
        }
    }

    end() {
        this.index = this.data.length
        if (this.completeFunc) this.completeFunc()
    }

    finish() {
        this.index = this.data.length
        if (this.completeFunc) this.completeFunc()
        if (this.finishFunc) this.finishFunc()
    }

    setFinishFunc(c) {
        this.finishFunc = c
    }
    setCompleteFunc(c) {
        this.completeFunc = c
    }
}