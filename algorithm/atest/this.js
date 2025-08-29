var count = 100;

const obj = {
    count:999,

    getCount1: function(){
        return this.count;
    },
    getCount2: () => {
        return this.count;
    },
    getCount3: () => {
        console.log(this.count);
    },
    getCount4: function(){
        setTimeout(() => {
            console.log(this.count)
        },0)
    },
    getCount5: function (){
        setTimeout(() => {
            console.log(this.count)
        },0)
    }
}

//res1
console.log(obj.getCount1());
//res2
console.log(obj.getCount2());

let Fn = obj.getCount3;
//res3
Fn();

//res4 
obj.getCount4();

//res5
obj.getCount5.call({count:666});


