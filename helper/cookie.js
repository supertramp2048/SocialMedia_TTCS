import Cookies from "js-cookie";
export const cookie = {
    get(name) {
        return Cookies.get(name)
    },
    set(name, value, days = 7){
        Cookies.set(name, value, {expires: days, path: "/"})
    },
    remove(name) {
        Cookies.remove(name)
    }
}