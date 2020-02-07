let fs = require('fs');
let LIQN = require("./LINQ");
let JSDOM = require("jsdom").JSDOM;
let curl = require('curl');

function InspectURL(url, cb) {
    curl.get(url, null, (err, resp, body) => {
        if (!err) {
            if (resp.statusCode == 200) {
                parseData(body, cb);
            }
        }
    });
}

function parseData(html, cb) {
    const dom = new JSDOM(html);
    const $ = (require("jquery"))(dom.window);   
    cb($); 
}

function NormalizeUrl(url) {
    return url[url.length - 1] == "/" ? url : url + "/";
}
function Domain(url) {
    return url.split("/")[2]; 
}
function Main(url) {
    return "https://" + Domain(url) + "/";
}
let domainHundler = {};


let node = "";

function GetSite(url, depth) {
    url = NormalizeUrl(url);
    let domen = Domain(url);
    let main = Main(url);
    if (domen.length == 0) {
        return;
    }
    InspectURL(url, function($) {
        if (!domainHundler[main]) {
        domainHundler[main] = "";
        let keywords = $("meta").where(i => i.name == "keywords").convertToArray();
        let keywordsText = keywords.length > 0 ? keywords[0].content : "";
        let description = $("meta").where(i => i.name == "description").convertToArray();
        let descriptionText = description.length > 0 ? description[0].content : "";
        node+=`🃏${url}🎴${$("title").text()}🎴${keywordsText}🎴${descriptionText}`
        }
        if (depth > 0) {
            let a = $("a").select(i => i.href).convertToArray();
            for (let i = 0; i < a.length; i++) {
                if (a[i] !== undefined && a[i].indexOf("https://") == 0 && a[i].indexOf(domen) == -1) {
                    console.log(a[i], depth - 1);
                    GetSite(a[i], depth - 1);
                }
            }
        }
    });
}

// GetSite("https://stackoverflow.com/", 6);


// setInterval(function() {
//     fs.appendFileSync("DB/sites.txt", node);
//     node = "";
// }, 10000);



function ConverToJson() {
    let db = fs.readFileSync("DB/sites.txt", "utf8");

    db = db.split("🃏");
    let list = {};
    for (let i = 0; i < db.length; i++) {
        let k = db[i].split("🎴");4
        list[k[0]] = {
            url: k[0],
            title: k[1],
            keywords: k[2],
            description: k[3]
        }
    }
    list = list.distinct();
    fs.writeFileSync("DB/db.json", JSON.stringify(list));
    
}
ConverToJson();



// let siteDB = JSON.parse(fs.readFileSync(__dirname + "/DB/sites.json", "utf8"));

// function GrabSites(entryPoint = "https://www.google.com/", depth = 1) {
//     let domen = entryPoint.split("/")[2];    
//     let main = "https://" + domen + "/";
//     if (domen.length > 0 && entryPoint.length < 100) {
//         InspectURL(entryPoint, function($) {
//             let keywords = $("meta").where(i => i.name == "keywords").convertToArray();
//             let keywordsText = keywords.length > 0 ? keywords[0].content : "";
//             let description = $("meta").where(i => i.name == "description").convertToArray();
//             let descriptionText = description.length > 0 ? description[0].content : "";
//             if (siteDB[main]) {
//                 if (main == entryPoint) {
//                     siteDB[main].keywords = keywordsText;
//                     siteDB[main].description = descriptionText;
//                     siteDB[main].url = main;
//                     siteDB[main].title = $("title").text();
//                 } else {
//                     siteDB[main].inherits[entryPoint] = {};
//                     siteDB[main].inherits[entryPoint].url = entryPoint;
//                     siteDB[main].inherits[entryPoint].keywords = keywordsText;
//                     siteDB[main].inherits[entryPoint].description = descriptionText;
//                     siteDB[main].inherits[entryPoint].title = $("title").text();
//                 }
//             } else {
//                 siteDB[main] = {
//                     inherits: {}
//                 };
//                 setTimeout(function() {
//                     GrabSites(main, function() {
//                         siteDB[main].inherits[entryPoint] = {};
//                         siteDB[main].inherits[entryPoint].url = entryPoint;
//                         siteDB[main].inherits[entryPoint].keywords = keywordsText;
//                         siteDB[main].inherits[entryPoint].description = descriptionText;
//                         siteDB[main].inherits[entryPoint].title = $("title").text();
//                     }, 0);
//                 }, 1);
//             }
//             if (depth > 0) {
//                 let a = $("a").select(i => i.href).convertToArray();
//                 for (let i = 0; i < a.length; i++) {
//                     if (a[i] !== undefined && a[i].indexOf("https://") == 0 && siteDB[a[i]] == undefined && a[i].length < 100 && a[i].identity(domen) < 0.2) {
//                         setTimeout(function() {
//                             console.log("Start grabbing " + a[i].slice(0, 200));
//                             GrabSites(a[i], depth - 1);
//                         }, 1)
//                     }
//                 }
//             }
//             fs.writeFileSync(__dirname + "/DB/sites.json", JSON.stringify(siteDB));
//         });
//     }
// }
// GrabSites("https://www.nature.com/", 5);

// function SearchForNewSites(entryPoint = "https://www.google.com/", depth = 1) {
//     let domen = entryPoint.split("/")[2];    
//     let main = "https://" + domen + "/";
//     if (domen.length > 0 && entryPoint.length < 100) {
//         InspectURL(entryPoint, function($) {
//             let keywords = $("meta").where(i => i.name == "keywords").convertToArray();
//             let keywordsText = keywords.length > 0 ? keywords[0].content : "";
//             let description = $("meta").where(i => i.name == "description").convertToArray();
//             let descriptionText = description.length > 0 ? description[0].content : "";
//             if (siteDB[main]) {
//                 if (main == entryPoint) {
//                     siteDB[main].keywords = keywordsText;
//                     siteDB[main].description = descriptionText;
//                     siteDB[main].url = main;
//                     siteDB[main].title = $("title").text();
//                 } else {
//                     siteDB[main].inherits[entryPoint] = {};
//                     siteDB[main].inherits[entryPoint].url = entryPoint;
//                     siteDB[main].inherits[entryPoint].keywords = keywordsText;
//                     siteDB[main].inherits[entryPoint].description = descriptionText;
//                     siteDB[main].inherits[entryPoint].title = $("title").text();
//                 }
//                 if (depth > 0) {
//                     let a = $("a").select(i => i.href).convertToArray();
//                     for (let i = 0; i < a.length; i++) {
//                         if (a[i] !== undefined && a[i].indexOf("https://") == 0 && siteDB[a[i]] == undefined && a[i].length < 100 && a[i].identity(domen) == 0) {
//                             setTimeout(function() {
//                                 console.log("Start grabbing " + a[i].slice(0, 200));
//                                 SearchForNewSites(a[i], 1);
//                             }, 1);
//                         }
//                     }
//                 }
//                 // fs.writeFileSync(__dirname + "/DB/sites.json", JSON.stringify(siteDB));
//             } else {
//                 siteDB[main] = {
//                     inherits: {}
//                 };
//                 setTimeout(function() {
//                     GrabSites(main, function() {
//                         siteDB[main].inherits[entryPoint] = {};
//                         siteDB[main].inherits[entryPoint].url = entryPoint;
//                         siteDB[main].inherits[entryPoint].keywords = keywordsText;
//                         siteDB[main].inherits[entryPoint].description = descriptionText;
//                         siteDB[main].inherits[entryPoint].title = $("title").text();
//                     }, 0);
//                 }, 1);
//             }
//         });
//     }
// }

// setInterval(function() {
//     fs.writeFileSync(__dirname + "/DB/sites.json", JSON.stringify(siteDB));
// }, 30000);