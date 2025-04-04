
  let timeNaw  = (e) => {
  e =   new Date()
    const stringTime =
    e.getHours() +
      ":" +
      e.getMinutes() 

     // console.log(stringTime)
    return stringTime;
  };


module.exports = timeNaw