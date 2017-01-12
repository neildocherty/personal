'use strict'

let scrambleTargets = document.querySelectorAll('.scramble')

// targets.forEach(function(target){
//   target.addEventListener('click', function(){
//     let index = Array.prototype.indexOf.call(targets, target);
//     target.classList.remove('scramble')
//     targets = document.querySelectorAll('.scramble')
//   })
// })

scrambleTargets.forEach(function(el){

  scramble( el );

})

function scramble(element , speed ){

  let height = element.clientHeight;
  element.style.height = height+"px";

  let originalContent = element.innerHTML;
  let originalString = element.innerText;
  let originalStringLength = originalString.length;
  let blockoutTimeout;
  let decodeTimeout;
  let block = "";

  element.innerHTML = '';

  var indexArray = [];

  for ( let i = 0 ; i < originalStringLength ; i++ ) {
    indexArray.push(i);
  }


  blockout();

  function blockout(){

    if ( element.innerHTML.length === originalStringLength ){
      window.clearTimeout(blockoutTimeout);
      decode();
      return;
    }

  // // █ ▓ ▒ ░ ×

    let y = random(8,0);
    switch (y) {
      case (0):
        block += "░";
        break;
      case (1):
        block += "░";
        break;
      case (2):
        block += "-";
        break;
      case (3):
        block += "-";
        break;
      case (4):
        block += " ";
        break;
      case (5):
        block += " ";
        break;
      case (6):
        block += "×";
        break;
      case (7):
        block += "·";
        break;
    }

    // switch (y) {
    //   case (0):
    //     block += "-";
    //     break;
    //   case (1):
    //     block += "-";
    //     break;
    //   case (2):
    //     block += '-'
    //     break;
    //   case (3):
    //     block += "·";
    //     break;
    //   case (4):
    //     block += "|";
    //     break;
    //   case (5):
    //     block += "/";
    //     break;
    //   case (6):
    //     block += " ";
    //     break;
    //   case (7):
    //     block += "×";
    //     break;
    // }


    // block += "-"



    element.innerHTML = block;
    blockoutTimeout = window.setTimeout(blockout,random(2,0))
    // blockout();
  }


  function decode(){

    if ( indexArray.length === 0) {
      window.clearTimeout(decodeTimeout);
      element.innerHTML = originalContent;
      element.classList.remove("scramble");
      element.classList.add("complete");
      element.style.height = "";
      return;
    }

    let randomIndex = random(indexArray.length,0); // 0
    let newChar = originalString.substr(indexArray[randomIndex], 1) // H
    block = block.replaceAt(indexArray[randomIndex], newChar)
    element.innerHTML = block;

    indexArray.splice(randomIndex,1)

    decodeTimeout = window.setTimeout(decode,random(8,0))
  }


}


function randomChar( ) {
    let ran = Math.random(), max, min
    switch(true) {
      case ran >= 0.75:  // A-Z
          max = 90
          min = 65
          break
      case ran >= 0.50:  // a-z
          max = 122
          min = 97
          break;
      case ran >= 0.25:  // 0-9
          max = 57
          min = 48
          break
      case ran >= 0.10:   // # $ % &
          max = 38
          min = 35
          break
      case ran < 0.10:   // # $ % &
          max = 32
          min = 32
          break
    }
  let result = String.fromCharCode(Math.round(Math.random()*(max-min))+min)
  return result
}




function random(max,min){
   return Math.floor(Math.random() * (max - min)) + min;
}


String.prototype.replaceAt=function(index, char) {
    return this.substr(0, index) + char + this.substr(index+char.length);
}
