import hasPerm from "@/directive/permission/hasPerm";
import hasRole from "@/directive/permission/hasRole";

export default function directive(aap:any){
    aap.directive("hasPerm",hasPerm)
    aap.directive("hasRole",hasRole)
    /*aap.directive("show1",{
        mounted(el:any,bingding:any){
            console.log("@@")
            el.focus()
        }
    })*/
}