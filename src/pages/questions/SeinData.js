
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };
  

let Sein = { 
    
    help:[
[['ich'],['bin']],
[['du'],['bist']],
[['er,sie,es'],['ist']],
[['wir'],['sind']],
[['ihr'],['seid']],
[['Sie,sie'],['sind']],
// [["Wer"], ["Кто"]],
// [["Was"], ["Что"]],
// [["Wann"], ["Когда"]],
// [["Wo"], ["Где"]],
// [["Woher"], ["Откуда"]],
// [["Wohin"], ["Куда"]],
// [["Wie"], ["Как"]],
// [["Warum"], ["Почему"]],
// [["Wieso"], ["Почему"]],
// [["Weshalb"], ["Почему"]],
// [["Welcher"], ["Какой"]],
// [["Wozu"], ["Зачем"]],
// [["Wem"], ["Кому"]],
    ],

    questions:[
    {
    questionRus: "Где ты",
    questionGerm: "Wo _ du?",
    v1: "bin",
    v2: "ist",
    v3: "bist",
    v4: "sind",
    answer: "bist",
},

{
    questionRus: "где они",
    questionGerm: "Wo _ sie?",
    v1: "sind",
    v2: "seid",
    v3: "bist",
    v4: "sind",
    answer: "sind",
},

{
    questionRus: "где она",
    questionGerm: "Wo _ sie?",
    v1: "sind",
    v2: "ist",
    v3: "bist",
    v4: "sind",
    answer: "ist",
},

{
    questionRus: "где они",
    questionGerm: "Wo _ sie?",
    v1: "seid",
    v2: "ist",
    v3: "bist",
    v4: "sind",
    answer: "ist",
},

{
    questionRus: "где он",
    questionGerm: "Wo _ er?",
    v1: "seid",
    v2: "ist",
    v3: "bist",
    v4: "sind",
    answer: "ist",
},


{
    questionRus: "Откуда ты?",
    questionGerm: "Woher _ du??",
    v1: "kam",
    v2: "kommen",
    v3: "kommst",
    v4: "kommt",
    answer: "kommst",
},

{
    questionRus: "откуда она пришла",
    questionGerm: "Woher _ sie?",
    v1: "kam",
    v2: "kommen",
    v3: "kommst",
    v4: "kommt",
    answer: "kam",
},


{
    questionRus: "Вы упали с велосипеда",
    questionGerm: "Sie _ vom Fahrrad gefallen?",
    v1: "seid",
    v2: "ist",
    v3: "bist",
    v4: "sind",
    answer: "sind",
},

{
    questionRus: "Ты приехал на велосипеде.",
    questionGerm: "Du _ mit dem Fahrrad gefahren.",
    v1: "seid",
    v2: "ist",
    v3: "bist",
    v4: "sind",
    answer: "bist",
},

{
    questionRus: "Мы шли в класс.",
    questionGerm: "Wir _ zum Unterricht zu Fuß gegangen",
    v1: "seid",
    v2: "ist",
    v3: "bist",
    v4: "sind",
    answer: "sind",
},

{
    questionRus: "Вы сегодня встали в 7 часов.",
    questionGerm: "Ihr _ heute um 7 Uhr aufgestanden.",
    v1: "seid",
    v2: "ist",
    v3: "bist",
    v4: "sind",
    answer: "seid",
},

{
    questionRus: "Они родились в Киеве.",
    questionGerm: "Sie _ in Kiev geboren.",
    v1: "seid",
    v2: "ist",
    v3: "bist",
    v4: "sind",
    answer: "sind",
},



{
    questionRus: "Ты уже долго здесь?",
    questionGerm: "_ du schon lange hier?",
    v1: "seid",
    v2: "ist",
    v3: "bist",
    v4: "sind",
    answer: "bist",
},

]

}

shuffleArray(Sein.questions)
  
  export default Sein;