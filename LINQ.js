Object.prototype.where = function(cb) {
    let res = {};
    for (let index in this) {
        if (typeof this[index] !== "function" && cb(this[index])) {
            res[index] = this[index];
        }
    }
    return res;
}
Object.prototype.select = function(cb) {
    let res = {};
    for (let index in this) {
        if (typeof this[index] !== "function") {
            res[index] = cb(this[index]);
        }
    }
    return res;
}
Object.prototype.convertToArray = function() {
    let res = [];
    let keys = this.getKeys();
    for (let i = 0; i < keys.length; i++) {
            res.push(this[keys[i]]);
    }
    return res;
}
Object.prototype.compare = function(target) {
    if (typeof target == "object") {
        let thisKeys = this.getKeys();
        let targetKeys = target.getKeys();
        if (thisKeys.compare(targetKeys)) {
            for (let i = 0; i < thisKeys.length; i++) {
                if (this[thisKeys[i]] instanceof Object && target[thisKeys[i]] instanceof Object) {
                    if (!this[thisKeys[i]].compare(target[thisKeys[i]])) {
                        return false;
                    }
                } else {
                    if (this[thisKeys[i]] != target[thisKeys[i]]) {
                        return false;
                    }
                }
            }
            return true;
        }
        return false;
    }
    return false;
}
Object.prototype.forEach = function(cb) {
    let keys = this.getKeys();
    for (let i = 0; i < keys.length; i++) {
        cb(this[keys[i]]);
    }
}
Object.prototype.getKeys = function() {
    return Object.keys(this);
}
Object.prototype.copy = function() {
    let copy = new Object();
    let keys = this.getKeys();
    for (let i = 0; i < keys.length; i++) {
        copy[keys[i]] = this[keys[i]];
    }
    return copy;
}
Object.prototype.orderby = function(cb) {
    let keys = this.getKeys();
    while(true) {
        let err = false;
        for (let i = 0; i < keys.length - 1; i++) {
            if (cb(this[keys[i]]) > cb(this[keys[i+1]])) {
                let tmp = keys[i];
                keys[i] = keys[i+1];
                keys[i + 1] = tmp;
                err = true;
            }
        }
        if (!err) break;
    }
    let res = new Object();
    for (let i = 0; i < keys.length; i++) {
        res[keys[i]] = this[keys[i]];
    }
    return res;
}
Object.prototype.orderByDescending = function() {
    let keys = this.getKeys();
    while(true) {
        let err = false;
        for (let i = 0; i < keys.length - 1; i++) {
            if (cb(this[keys[i]]) < cb(this[keys[i+1]])) {
                let tmp = keys[i];
                keys[i] = keys[i+1];
                keys[i + 1] = tmp;
                err = true;
            }
        }
        if (!err) break;
    }
    let res = new Object();
    for (let i = 0; i < keys.length; i++) {
        res[keys[i]] = this[keys[i]];
    }
    return res;
}
Object.prototype.reverse = function() {
    let keys = this.getKeys().reverse();
    let obj = new Object();
    keys.forEach(element => {
        obj[element] = this[element];
    });
    return obj;
}
Object.prototype.count = function(cb) {
    let res = 0;
    let keys = this.getKeys();
    for (let i = 0; i < this.keys.length; i++) {
        if (cb(this[keys[i]])) {
            res++;
        }
    }
    return res;
}
Object.prototype.contains = function(el) {
    let keys = this.getKeys();
    for (let i = 0; i < keys.length; i++) {
        if (this[keys[i]] == el) {
            return true;
        }
    }
    return false;
}
Object.prototype.distinct = function() {
    let keys = this.getKeys();
    let res = new Object();
    res[keys[0]] = this[keys[0]];
    for (let i = 1; i < keys.length; i++) {
        let breakTrigger = false;
        let resKeys = res.getKeys();
        for(let j = 0; j < resKeys.length; j++) {
            if (this[keys[i]].compare(res[resKeys[j]])) {
                breakTrigger = true;
                break;
            }
        }
        if (!breakTrigger) {
            res[keys[i]] = this[keys[i]];
        }
    }
    return res;
}
// Object.prototype.unwrap = function() {

// }

Array.prototype.where = function(cb) {
    let res = [];
    for (let i = 0; i < this.length; i++) {
        if (cb(this[i])) {
            res.push(this[i]);
        }
    }
    return res;
}
Array.prototype.compare = function(arr) {
    if (arr instanceof Array && this.length == arr.length) {
        for (let i = 0; i < this.length; i++) {
            if (this[i] !== arr[i]) {
                return false;
            }
        }
        return true;
    }
    return false;
}
Array.prototype.copy = function() {
    let res = [];
    for (let i = 0; i < this.length; i++) {
        res.push(this[i]);
    }
    return res;
}
Array.prototype.orderby = function(cb) {
    let res = this.copy();
    while(true) {
        let err = false;
        for (let i = 0; i < res.length - 1; i++) {
            if (cb(res[i]) > cb(res[i+1])) {
                let tmp = res[i];
                res[i] = res[i+1];
                res[i+1] = tmp;
                err = true;
            }
        }
        if (!err) break;
    }
    return res;
}
Array.prototype.distinct = function() {
    let res = [this[0]];
    for (let i = 1; i < this.length; i++) {
        let breakTrigger = false;
        for(let j = 0; j < res.length; j++) {
            if (this[i] == res[j]) {
                breakTrigger = true;
                break;
            }
        }
        if (!breakTrigger) {
            res.push(this[i]);
        }
    }
    return res;
}
Array.prototype.reverse = function() {
    let res = [];
    for (let i = this.length - 1; i >= 0; i--) {
        res.push(this[i]);
    }
    return res;
}
Array.prototype.all = function(cb) {
    for (let i = 0; i < this.length; i++) {
        if (!cb(this[i])) {
            return false;
        }
    }
    return true;
}
Array.prototype.any = function(cb) {
    for (let i = 0; i < this.length; i++) {
        if (cb(this[i])) {
            return true;
        }
    }
    return false;
}
Array.prototype.contains = function(compare) {
    for (let i = 0; i < this.length; i++) {
        if (this[i] === compare) {
            return true;
        }
    }
    return false;
}
Array.prototype.intersect = function(collection) {
    if (this.length == 0 || collection.length == 0) {
        return [];
    }
    let res = [];
    for (let i = 0; i < this.length; i++) {
        for (let j = 0; j < collection.length; j++) {
            if (this[i] == collection[j]) {
                res.push(this[i]);
            }
        }
    }
    return res.distinct();
}
Array.prototype.count = function(cb) {
    let res = 0;
    for (let i = 0; i < this.length; i++) {
        if (cb(this[i])) {
            res++;
        }
    }
    return res;
}
Array.prototype.sum = function() {
    let sum = 0;
    for (let i = 0; i < this.length; i++) {
        if (typeof this[i] == "number") {
            sum+=this[i];
        }
    }
    return sum;
}
Array.prototype.avarage = function() {
    return this.sum() / this.count(i => typeof i == "number");
}
Array.prototype.take = function(indexIncluded) {
    return this.slice(0, index + 1);
}
Array.prototype.takeWhile = function(cb) {
    let i = 0;
    let res = [];
    while(cb(this[i])) {
        res = this.take(i);
        i++;
        if (i > this.length - 1) {
            break;
        }
    }
    return res;
}
Array.prototype.skip = function(indexIncluded) {
    return this.slice(index, this.length);
}
Array.prototype.skipWhile = function(cb) {
    let i = 0;
    let res = [];
    while(cb(this[i])) {
        res = this.skip(i);
        i++;
        if (i > this.length - 1) {
            break;
        }
    }
    return res;
}
Array.prototype.max = function() {
    let max = this[0];
    for (let i = 1; i < this.length; i++) {
        if (this[i] > max) {
            max = this[i];
        }
    }
    return max;
}
Array.prototype.min = function() {
    let min = this[0];
    for (let i = 1; i < this.length; i++) {
        if (this[i] < min) {
            min = this[i];
        }
    }
    return min;
}
Array.prototype.deleteElements = function() {
    let res = [];
    for (let i = 0; i < this.length; i++) {
        if (!arguments.contains(this[i])) {
            res.push(this[i]);
        }
    }
    return res;
}
String.prototype.startsWith = function(string = "", ignoreCase = false) {
    if (ignoreCase) {
        if (this.toString().toLowerCase().indexOf(string.toLowerCase()) == 0) {
            return true;
        }
    } else {
        if (this.toString().indexOf(string) == 0) {
            return true;
        }
    }
    return false;
}
String.prototype.identity = function(example) {
    if (this.length == 0 || example.length == 0) {
        return 0;
    }
    if (example.length <= this.length) {
        let pers = [];
        for(let i = 0; i < this.length - example.length; i++) {
            let ident = 0;
            for (let j = 0; j < example.length; j++) {
                if (this[i + j] == example[j]) {
                    ident++;
                } else {
                    break;
                }
            }
            pers.push(ident / example.length);
        }
        return pers.max();
    } else {
        return example.identity(this);
    }
}
String.prototype.arrange = function(e) {
    return this.split(e).deleteElements("");
}