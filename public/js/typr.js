let targets = document.querySelectorAll('.typr');
// typr();
let head = document.querySelectorAll('.head');

typr(head[0],"",80)


targets.forEach(function(el){
  typr(el,">",200)
})


function typr(target,prefix,speed) {

  const TYPE_RANDOM_MAX = speed*1.5;
  const TYPE_RANDOM_MIN = speed*0.5;

  let originalString = target.innerHTML;
  let string = target.innerText;

  target.innerHTML = '';
  target.classList.remove("typr");

  // target.classList.add('visible');

  if( prefix ) {
  // add '>' element to the target
  let pre = document.createElement('div');
      pre.classList.add('pre','pre-anim');
      pre.innerHTML = prefix;
  target.appendChild(pre)
  }

  // add text element to the target
  let text = document.createElement('span');
      text.classList.add('text');
  target.appendChild(text)



  // add cursor element to the target
  let cursor = document.createElement('span');
      cursor.innerHTML = '&nbsp';
      cursor.classList.add('cursor');
  target.appendChild(cursor)

  let typeTimeout;

  type();


  function type(){

    if ( string.length === 0 ) {
      cursor.remove();
      text.innerHTML = originalString;
      target.firstChild.classList.remove('pre-anim');
      return;
    }

    text.innerHTML += string[0];

    string = string.slice(1);

    typeTimeout = window.setTimeout(type,(Math.random() * (TYPE_RANDOM_MAX - TYPE_RANDOM_MIN) + TYPE_RANDOM_MIN));

  };

}
