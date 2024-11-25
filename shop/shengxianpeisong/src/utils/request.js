import axios from 'axios'
import { useUserStore } from '@/stores/user'
import router from '@/router/index'
import { showFailToast, showLoadingToast, closeToast } from 'vant'
import 'vant/es/toast/style'

let userStore = null

/*
 * 这里使用异步是因为 2-5行的文件还没有加载完就执行了，而这种情况就会导致
 * 20-23行的变量名未赋值先用的错误，这是不允许的，所以需要异步加载
 */
const userData = async () => {
  userStore = useUserStore()
}

const baseURL = 'http://127.0.0.1:3007'
// axios.defaults.headers.post['Content-Type'] =
//   'application/x-www-form-urlencoded; charset=UTF-8'

const instance = axios.create({
  baseURL,
  timeout: 5000
})

// 添加请求拦截器
instance.interceptors.request.use(
  async (config) => {
    // 在发送请求之前做些什么
    showLoadingToast({
      message: '加载中...',
      forbidClick: true,
      loadingType: 'spinner'
    })
    await userData()
    config.headers['Authorization'] = userStore.token || ''

    return config
  },
  (err) => {
    // 对请求错误做些什么
    Promise.reject(err)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  (res) => {
    if (res.data.status !== 200) {
      showFailToast(res.data.message)
      return Promise.reject(res)
    } else {
      // 清除加载效果
      closeToast()
    }
    return res
  },
  (err) => {
    if (err.response?.status === 401) {
      router.push('/')
    }

    console.log(err.response.data.message || '服务异常')
    return Promise.reject(err)
  }
)

export default instance
export { baseURL }
