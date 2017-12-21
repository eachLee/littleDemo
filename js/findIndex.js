 var arr = [];
        var MaxNum = 251623;
        for (var i = 0; i < 251623; i++) {
            arr.push(i);
        };

        function getMax(arr) {
            // 推荐arr数据不超过20万时使用这个方法 大于20万时则用另外一个
            console.time();
            var arr2 = arr.slice();
            var max = Math.max.apply(Math, arr2);
            arr2.forEach(function (val, idx) {
                if (val === max) {
                    arr2[idx] = 0;
                }
            });
            var max2 = Math.max.apply(Math, arr2);
            console.log(arr.indexOf(max2));
            console.timeEnd();
        };

        function getMax2(arr) {
            console.time();
            var arr2 = arr.slice();
            arr2.sort(function (a, b) {
                return b - a;
            });
            var max;
            for (var i = 0; i < arr2.length; i++) {
                if (arr2[i] === arr2[i + 1]) {
                    continue
                } else {
                    console.log(arr.indexOf(arr2[i + 1]));
                    break
                }
            };
            console.timeEnd();
        };
        getMax(arr)