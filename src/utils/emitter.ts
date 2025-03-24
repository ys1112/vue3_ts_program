// 实现任意组件间通信
// 1.引入
import mitt from 'mitt'
// 2.调用
const emitter = mitt()
// 3.暴露出去
export default emitter