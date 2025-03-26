import {defineStore} from 'pinia'

import {ref} from 'vue'
export const useInfoStore = defineStore('talk',()=>{
  // talkList就是state
  const userName = ref('')

  
  return {userName}
})