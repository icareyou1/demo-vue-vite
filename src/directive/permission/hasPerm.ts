import useStore from "@/store/index";

export default{
    mounted(el:any, binding:any, vnode:any) {
        const { value } = binding
        const all_permission = "*:*:*";
        const{userStore} =useStore();
        const permissions = userStore.permissions

        if (value && value instanceof Array && value.length > 0) {
            const permissionFlag = value
            //对数组进行检查是否满足条件,满足条件就返回true,并不继续执行
            const hasPermissions = permissions.some(permission => {
                //includes用来判断数组是否包含指定值
                return all_permission === permission || permissionFlag.includes(permission)
            })

            if (!hasPermissions) {
                el.parentNode && el.parentNode.removeChild(el)
            }
        } else {
            throw new Error(`请设置操作权限标签值`)
        }
    }
}