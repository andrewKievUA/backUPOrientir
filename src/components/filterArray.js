const filterArray = (el)=>{
   let   num = 0
const shufle =

 el.map((e=>{
    
        let arr = []
        for (let i = 0; i < 5; i++) {
          let temp =Math.round(Math.random(0,el.length)*10)
          arr.push(temp)
        }

      // console.log("arr",arr);
        let unique = [...new Set(arr)];

          unique = [...new Set(arr)]
          if(unique.length===2){
            let b = Math.round(Math.random(0,el.length)*10)
            unique.push(b)}
          if(unique.length===3){
            let a = Math.round(Math.random(0,el.length)*10)
            unique.push(a)}

            if(unique.length===4){
                let a = Math.round(Math.random(0,el.length)*10)
                unique.push(a)}

            unique = [...new Set(arr)]
            if(unique.length===2){
              let b = Math.round(Math.random(0,el.length)*10)
              unique.push(b)}
            if(unique.length===3){
              let a = Math.round(Math.random(0,el.length)*10)
               unique.push(a)}      
            if(unique.length===4){
                let a = Math.round(Math.random(0,el.length)*10)
                unique.push(a)}
        num++
  //    console.log(e[0],e[1],e[2])
   //  console.log( el[unique[0]][2])
        return(
          {
            num:num-1,
            germ:e[0] ,
            trans:e[1]  ,
            rus:e[2]  ,
            correct: false,
            ansRU:[
              e[2],
              el[unique[0]][2] ,
       //       el[unique[1]][2],
        //      el[unique[2]][2],
        //      el[unique[3]][2],
              // el[unique[4]][2],
            ],
          }
        )}  
      )
    )

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      }
      
      for (let i = 0; i < shufle.length; i++) {
        shufle[i].ansRU = shuffleArray(shufle[i].ansRU);
        }
    return shufle
}

   


   

export default filterArray