import { onUnmounted } from "vue"
// 封装防抖函数
export function useDebounce(fn: Function, delay = 300) {
  let timeoutId: number | null

  const clear = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  onUnmounted(clear)

  return (...args: any) => {
    clear()
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}