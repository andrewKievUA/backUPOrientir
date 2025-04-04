function brakCalc(i1, i2) {
    let arr = heis(i1);
    arr = arr.concat(heis(i2));
    console.log("arrat", arr);

    console.log(findMostFrequent(arr));
    const stonesShtuk = [
        { size: 100, pcs: 180 },
        { size: 120, pcs: 150 },
        { size: 150, pcs: 120 },
        { size: 200, pcs: 90 },
        { size: 250, pcs: 70 },
        { size: 280, pcs: 60 },
        { size: 300, pcs: 60 },
        { size: 375, pcs: 40 },
        { size: 400, pcs: 40 },
        { size: 500, pcs: 30 },

    ]


  
    
    function findPcsBySize(stones, targetSize) {
        const stone = stones.find(stone => stone.size === targetSize);
        return stone ? stone.pcs : null; // Если найдено, вернуть pcs, иначе null
    }

    function findMostFrequent(arr) {
        const count = {}; // Объект для подсчета
        let mostFrequent = arr[0]; // Переменная для хранения самого частого числа
        let maxCount = 0; // Максимальное количество повторений
        // Подсчет вхождений каждого числа
        for (let num of arr) {
            count[num] = (count[num] || 0) + 1;
            // Если текущее число встречается чаще, обновляем результат
            if (count[num] > maxCount) {
                maxCount = count[num];
                mostFrequent = num;
            }
        }
        return mostFrequent;
    }





    function heis(i) {
        let h = i.averageHeight;
        let s = i.num_defects;
        let a = 0
        let b = 0;
        console.log(h, s);

        // Высота
        if (h > 80 && h <= 120) { a = 100; }
        if (h > 120 && h <= 140) { a = 120; }
        if (h > 140 && h <= 160) { a = 150; }
        if (h > 190 && h <= 230) { a = 200; }
        if (h > 230 && h <= 270) { a = 250; }
        if (h > 270 && h <= 285) { a = 280; }
        if (h > 290 && h <= 320) { a = 300; }
        if (h > 365 && h <= 390) { a = 375; }
        if (h > 390 && h <= 420) { a = 400; }
        if (h > 420 && h <= 550) { a = 500; }

        // Количество камней
        if (s > 150 && s <= 190) { b = 100; }
        if (s > 140 && s <= 170) { b = 120; }
        if (s > 120 && s <= 139) { b = 150; }
        if (s > 90 && s <= 120) { b = 200; }
        if (s > 70 && s <= 90) { b = 250; }
        if (s > 55 && s <= 68) { b = 280; }
        if (s > 55 && s <= 68) { b = 300; }
        if (s > 35 && s <= 45) { b = 375; }
        if (s > 35 && s <= 45) { b = 400; }
        if (s > 30 && s <= 35) { b = 500; }


        // Возвращаем массив [a, b]
        return [a, b];
    }

    let calc =findPcsBySize(stonesShtuk,findMostFrequent(arr))

    console.log("calc",calc);
    if(!calc){
        calc= 0
    }
    return calc
}

module.exports = brakCalc;
