import useStore from "@/store/index";

export default{
    mounted(el:any, binding:any, vnode:any) {
        //某一个菜单可以有多个角色
        const { value } = binding
        const super_admin = "超级管理员";
        const{userStore} =useStore();
        const roleName = userStore.getRoleName

        if (value && value instanceof Array && value.length > 0) {
            const roleNameFlag = value
            //对数组进行检查是否满足条件,满足条件就返回true,并不继续执行
            const hasRoleName =()=>{
                return super_admin===roleName||roleNameFlag.includes(roleName)
            }
            if (!hasRoleName()) {
                el.parentNode && el.parentNode.removeChild(el)
            }
        } else {
            throw new Error(`请设置操作权限标签值`)
        }
    }
}