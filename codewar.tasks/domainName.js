exports.domainName = function domainName(url) {
    let s = String(url).toLocaleLowerCase();
    s = s.replace("https", "");
    s = s.replace("http", "");
    s = s.replace("://", "");
    s = s.split(".");
    for (let i = 0; i < s.length; i++) {
        if (s[i] !== "www") return s[i];
    }
    return "no result, sorry :)";
}