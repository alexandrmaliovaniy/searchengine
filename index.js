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

GetSite("https://stackoverflow.com/", 6);


setInterval(function() {
    fs.appendFileSync("DB/sites.txt", node);
    node = "";
}, 10000);



// function ConverToJson() {
//     let db = fs.readFileSync("DB/sites.txt", "utf8");

//     db = db.split("🃏");
//     let list = {};
//     for (let i = 0; i < db.length; i++) {
//         let k = db[i].split("🎴");4
//         list[k[0]] = {
//             url: k[0],
//             title: k[1],
//             keywords: k[2],
//             description: k[3]
//         }
//     }
//     list = list.distinct();
//     fs.writeFileSync("DB/db.json", JSON.stringify(list));
    
// }
// ConverToJson();
