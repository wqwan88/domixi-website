/**
 * Console locale bootstrap: ?lng= from website, else geo from IP country, else keep user choice.
 * Used by console-nav-worker.js and mirrored in new-api/html-inject/nginx.conf.
 */
export function buildLocaleBootScript(country = "XX") {
  const safe = String(country).toUpperCase().replace(/[^A-Z]/g, "").slice(0, 2) || "XX";
  return `(function(){try{var params=new URLSearchParams(location.search);var raw=params.get("lng")||params.get("lang");var qmap={zh:"zhCN","zh-cn":"zhCN",zhcn:"zhCN","zh-hans":"zhCN","zh-tw":"zhTW",zhtw:"zhTW","zh-hant":"zhTW",en:"en","en-us":"en","en-gb":"en",fr:"fr","fr-fr":"fr",ru:"ru","ru-ru":"ru",ja:"ja","ja-jp":"ja",vi:"vi","vi-vn":"vi"};var geomap={CN:"zhCN",TW:"zhTW",HK:"zhTW",MO:"zhTW",JP:"ja",FR:"fr",RU:"ru",VN:"vi"};if(raw){var key=String(raw).replace(/_/g,"-").toLowerCase();var lng=qmap[key];if(lng){localStorage.setItem("i18nextLng",lng);return;}}if(localStorage.getItem("i18nextLng"))return;var lng=geomap["${safe}"]||"en";localStorage.setItem("i18nextLng",lng);}catch(e){}})();`;
}
