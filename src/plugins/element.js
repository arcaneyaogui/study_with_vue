import Vue from 'vue'
import { 
    Button,
    Form, 
    FormItem,
    Input,
    Message
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

/**
 * $message , $后面的名称自取，见名知意即可。
 * 等号后的 Message 不可变动。
 * 只要是全局运用到的，需要挂在到Vue原型上。
 */
Vue.prototype.$message = Message;