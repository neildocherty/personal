window.onscroll = function(){
  if ( window.scrollY > 40 ){
    document.querySelectorAll('.navbar')[0].classList.add('border')
  }
  else {
    document.querySelectorAll('.navbar')[0].classList.remove('border')
  }
}

function jailbreak() {
  let input = pre_string.innerHTML + cursor.innerHTML + pos_string.innerHTML;
  input_display.innerHTML = input;
  displayResponse(`Well, it was mentioned in the national media... It involved a casino, a luxury yacht, the Spanish Navy, A CASTLE(!) and roughly half-million in currency. It was pretty sweet. Drop me an email if you want to know more.  neilmdocherty@gmail.com`);
  newPrompt();
}



document.getElementById('terminalButton').addEventListener('click',function(){
  let consoleWrapper = document.getElementById('consoleWrapper');
  consoleWrapper.classList.toggle('visible');
  document.getElementById('mainWrapper').classList.toggle('hidden');
  if (!consoleWrapper.classList.contains("running")){
    printLoading();
  }
  else if(consoleWrapper.classList.contains("visible")) {
    focusOnInput();
    initTyping();
  }

})
//


/*
————————————
Project List
————————————
List all projects with links,
add a numerical index before each item,

*/
let listOfProjects = document.getElementById('projectList').children;

countr()

function countr() {

  const TYPE_RANDOM_MAX = 100;
  const TYPE_RANDOM_MIN = 10;

  for (let i = 0 ; i < listOfProjects.length ; i++){

    let project = listOfProjects[i];
    let content = project.innerHTML;

    project.innerHTML = '';


    project.classList.add('visible');



    // if ( i <= 9 ) {
    //   var x = "00"+i;
    // }

    // add cursor element to the target
    let index = document.createElement('span');
        index.innerHTML = "000";
        index.classList.add('index');
    project.appendChild(index)




    let counterTimeout;
    let j = Math.floor(Math.random() * (20 - 10)) + 10;

    count();


    function count(){

      if ( j < 10 ) {
        var x = "00"+j;
      }
      else if ( j < 100 ) {
        var x = "0"+j;
      }


      // if ( i <= 9 ) {
      //   var x = "00"+j;
      // }

      index.innerHTML = x;

      if ( j === i ) {
        let text = document.createElement('span');
        text.innerHTML = content;
        text.classList.add('text');
        project.appendChild(text)

        let underline = document.createElement('span');
        underline.innerHTML = '';
        underline.classList.add('underline');
        project.appendChild(underline)

        typr(text,'',40)
        return;
      }
      j--;

      counterTimeout = window.setTimeout(count,(Math.random() * (TYPE_RANDOM_MAX - TYPE_RANDOM_MIN) + TYPE_RANDOM_MIN));

    };

  }
}
