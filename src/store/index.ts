import tab from "./tab";
import user from "./user"

export default function useStore() {
    return {
        tabStore:tab(),
        userStore:user()
    }
}
