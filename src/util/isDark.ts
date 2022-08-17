export default () => {
    let ls = localStorage.getItem("theme");
    if (!ls) {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            localStorage.setItem("theme", "dark");
            return true;
        } else {
            localStorage.setItem("theme", "light");
            return false;
        }
    }
    return true//ls === "dark";
};