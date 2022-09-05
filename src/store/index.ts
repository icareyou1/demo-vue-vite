import tab from "./tab";
import user from "./user"
import permission from "@/store/permission";

export default function useStore() {
    return {
        tabStore:tab(),
        userStore:user(),
        permissionStore:permission(),
    }
}
