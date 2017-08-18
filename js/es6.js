var arr = [1, 2, 3, 4, 5, 6, 7];
var str = 'hello world';
var obj = {
    a: '12',
    b: '2',
    c: '3'
};
for (let key in obj) {
    // console.log(key +':'+ obj[key]);
}
arr.forEach(function (value, index, arr) {
    // console.log(index +':'+value);
});

function* gen(x) {
    try {
        var y = yield x * 10;
    } catch (error) {
        console.log(error);
    }

    return y;
}
var g = gen(10);
// console.log(g.next());
// console.log(g.next());

async function timeout(ms) {
    // await setTimeout(function() {  //错误写法
    //     console.log('into timeout');
    // }, ms);
    await new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function wait(value, ms) {
    await timeout(ms);
    console.log(value);
}

wait('hello async', 2000);

// async function timeout(ms){
//     await new Promise((resolve)=>{
//         setTimeout(resolve, ms);
//     })
// }

// async function wait(value,ms){
//     await timeout(ms);
//     console.log(value);

// }
// wait('hello async',2000)

async function w() {
    // throw new Error('出错了');
    await new Promise((v, e) => {
        throw new Error('出错了2');
    }).catch((error) => {
        // console.log(error);
        // 此处添加一个catch捕获一下错误 否则async会结束执行 后面的代码不会执行
    });
    try {
        await new Promise((v, e) => {
            throw new Error('出错了');
        });
    } catch (error) {
        // console.log(error); // error
    }
    return 'hello world';
}

w().then(v => console.log(v), e => console.log(e)).catch(e => console.log(e));

async function getTitle(url) {
    var repost = await fetch(url);
    var html = await repost.text();
    return html.match(/<title>([\s\S]+)<\/title>/i)[1];
}
getTitle('https://tc39.github.io/ecma262/').then(console.log);

// function point(x,y){// es5写法
//     this.x = x;
//     this.y = y;
// }

// point.prototype.toString = function (){
//     return '('+this.x+','+this.y+')';
// };
// var p =new point(1,2);
// console.log(p.toString());

class point { //es6 class不会存在的变量提升
    constructor(x, y) {
        // console.log(new.target);//返回当前类 继承之后返回子类
        this.x = x;
        this.y = y;
    }
    Multiply() {
        return this.x * this.y;
    }
}
Object.assign(point.prototype, {
    add() {
        return this.x + this.y;
    },
    toString() {
        return '(' + this.x + ',' + this.y + ')';
    }
});
var p = new point(1000, 111);
console.log(p.Multiply());
console.log(p.add());
console.log(p.toString());
p.__proto__.subtraction = function () { // 在原型上添加属性的另一种方法
    return this.x - this.y;
};
console.log(p.subtraction());
var person = new class {
    constructor(name) {
        this.name = name;
    }
    getName() {
        return this.name;
    }
}('lisi');
console.log(person.getName());
console.log(person.hasOwnProperty('name'));

class point2 extends point {
    constructor(x, y) {
        super(x, y); // 调用父类的 constructor方法
    }
    print() {
        return 'point2';
    }
}
var p2 = new point2(100, 200);
console.log(p2.add());
console.log(p2.print());
console.log(Object.getPrototypeOf(point2) === point);

var obj2 = {
    toString() {
        return 'myObject: ' + super.toString();
    }
};
console.log(obj2.toString());

