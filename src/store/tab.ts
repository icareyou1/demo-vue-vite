import {defineStore} from "pinia";
//1.定义并导出容器
//参数1:容器id必须唯一,会被pinia挂载到根容器
//参数2:选项对象
//返回值:一个函数,调用得到容器实例对象
export default defineStore("tab",{
    //a.必须是函数,为了服务端渲染的时候便面交叉请求导致的数据状态污染
    //b.必须是箭头函数,为了更好的ts类型推导
    state:()=>{
        return{
            isCollapse:false,
            tabsList:[
                {
                    name:"Index",
                    path:"/index",
                    meta:{
                        name:"首页",
                        icon:"user"
                    }
                }
            ],
            currentMenu:null
        }
    },
    //修改业务逻辑,修改state
    //注意:不能使用箭头函数定义,箭头函数绑定外部this.不然获取不到state
    actions:{
        //修改侧边栏折叠
        collapseMenu(){
            this.isCollapse=!this.isCollapse
        },
        //侧边栏路由跳转
        selectMenu(val:any){
            //如果选中的不是Index
            if (val.name!=="Index"){
                this.currentMenu=val
                const result=this.tabsList.findIndex((item:any)=>item.name===val.name)
                if (result ===-1){
                    this.tabsList.push(val)
                }
            }else {
                this.currentMenu=null
            }
        },
        //点击tag标签
        closeTag(val:any){
            const result=this.tabsList.findIndex((item:any)=>item.name===val.name)
            this.tabsList.splice(result,1)
        },
        //退出时初始化tab
        initMenu(){
            this.tabsList=[{
                name:"Index",
                path:"/index",
                meta:{
                    name:"首页",
                    icon:"user"
                }
            }];
            this.isCollapse=false;
            this.currentMenu=null;
        }
    },
    //类似组件的computed,用来封装计算属性,有缓存功能
    getters:{

    }
})
//2.使用容器中的state
//3.修改state
//4.容器中action的使用
