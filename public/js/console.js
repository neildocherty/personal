let cursor,
    input,
    input_display,
    pre_string,
    pos_string,
    blinker,
    commandsList,
    command,
    curr_dir = 'usr/home'

let helpUtil = [
  'command    details',
  '-------    -------',
  'cd         change directory, eg cd <directory>',
  'clear      clear the screen',
  'echo       print text to screen, eg echo <text>',
  'help       display this message',
  'ls         list directory contents',
  'read       print file contents, eg read <file>',
  'reload     reload window',
  'version    display version'
]

let directory = [] // contains all files and folders that mock a file system


// Splice method to insert cursor into string
String.prototype.splice = function(index, remove, string) {
    return this.slice(0, index) + string + this.slice(index + Math.abs(remove));
};

// Keep scroll to bottom of the page
function updateScroll(){
    let el = document.getElementById("consoleContent");
    el.scrollTop = el.scrollHeight - el.clientHeight;
}

// ==================================
// Doubly-linked list implementation
//

function Node(value) {
    this.data = value;
    this.previous = null;
    this.next = null;
}

function doubleLinkList() {
    this._length = 0;
    this.head = null;
    this.tail = null;
}

doubleLinkList.prototype.add = function(value) {
    var node = new Node(value);
    if (this._length) {
        this.tail.next = node;
        node.previous = this.tail;
        this.tail = node;
    } else {
        this.head = node;
        this.tail = node;
    }
    this._length++;
    return node;
};


// ==================================

// printLoading()

function printLoading(){

  document.getElementById('consoleWrapper').classList.add('running')

  let pre = document.createElement('pre');
  let loader = document.createElement('span');
  loader.id = 'console--loader';
  pre.appendChild(loader);
  pre.className = 'console--pre';
  document.getElementById('consoleContent').appendChild(pre);

  let pc = 0, loadTimer;

  load();

  function load(){
      pc += Math.floor(Math.random() * (15 - 5)) + 5;
      pc = (pc>=100) ? 100 : pc;
      bar = '';
      for ( var i = 0 ; i < Math.floor(pc/5); i+=1) { bar += '▓' };
      for ( var i = 0 ; i < 20-Math.floor(pc/5); i+=1) { bar += '░' };

      let txt = 'loading: '+bar+' '+pc+'%'
      document.getElementById('console--loader').innerHTML = txt
      if (pc < 100){
        loadTimer = setTimeout( load , Math.floor(Math.random() * (250 - 100)) + 100 ) // prod
        // loadTimer = setTimeout( load , Math.floor(Math.random() * (10 - 0)) + 0 ) // dev
      }
      else {
        document.getElementById('console--loader').innerHTML = 'logged in as "guest"'
        clearTimeout(loadTimer)
        printWelcome()
        commandsList = new doubleLinkList;
        newPrompt()
        initInput()
      }

  }
}

function initInput(){
    prompt        = document.getElementsByTagName('prompt')[document.getElementsByTagName('prompt').length-1],
    cursor        = document.getElementsByTagName('cursor')[document.getElementsByTagName('cursor').length-1],
    input         = document.getElementsByTagName('input')[document.getElementsByTagName('input').length-1],
    input_display = document.getElementsByTagName('inputdisplay')[document.getElementsByTagName('inputdisplay').length-1],
    pre_string    = document.getElementsByTagName('prestring')[document.getElementsByTagName('prestring').length-1],
    pos_string    = document.getElementsByTagName('poststring')[document.getElementsByTagName('poststring').length-1]

    focusOnInput()
    initTyping()

    prompt.onclick   =  function(){ input.focus() }
    // prompt.onkeydown =  function(){ input.focus() }
    input.onblur     =  function(){ blinkOff() }
    input.onfocus    =  function(){
      blinkOff()
      blink()
    }
}



function blink(){
  ( cursor.classList.contains('on') ) ? cursor.classList.remove('on') : cursor.classList.add('on')
  blinker = setTimeout( blink , 740 )
}

function blinkOff(){
    cursor.classList.remove('on')
    clearTimeout(blinker)
}



function removeCursor(){
  blinkOff()
  cursor.remove()
}

function focusOnInput(){
  blinkOff()
  blink()
  input.focus()
}


function initTyping(){
    document.getElementsByTagName('input')[0].onkeydown = function typing(evt){

    cursor.classList.add('on')
    switch (evt.key) {

      case "Control":
      case "Shift":
      case "Alt":
      case "Meta":
      case "CapsLock":
      case "Dead":
        break

      case "Escape":
        document.getElementById('terminalButton').click();
        cursor.blur();
        break

      // Need to implememnt Autocomplete function
      case "Tab":
        evt.preventDefault();
        input = pre_string.innerHTML + cursor.innerHTML + pos_string.innerHTML;
        console.log(input.trim());



        // Auto-complete functionality

        break
      case "ArrowUp":

        if ( command ) {
          command = (command.previous === null) ? command : command.previous;
          pre_string.innerHTML = command.data;
          cursor.innerHTML = ' ';
          pos_string.innerHTML = '';
        }
        else {
          command = commandsList.tail;
          pre_string.innerHTML = command.data;
          cursor.innerHTML = ' ';
          pos_string.innerHTML = '';
        }

        break

      case "ArrowDown":

        if ( command ) {
          command = (command.next === null) ? '' : command.next;
          pre_string.innerHTML = (command.data === undefined) ? '' : command.data ;
          cursor.innerHTML = ' ';
          pos_string.innerHTML = '';
        }

        break

      case "Backspace":
        if ( pre_string.innerHTML != '' ) {
          pre_string.innerHTML = pre_string.innerHTML.slice(0, pre_string.innerHTML.length-1)
        }
        break

      case "Delete":
        if ( cursor.innerHTML != '' && pos_string.innerHTML != '' ) {
          cursor.innerHTML = pos_string.innerHTML.slice( 0 , 1)
          pos_string.innerHTML = pos_string.innerHTML.slice(1,pos_string.innerHTML.length)

        }
        break

      case "Enter":
        input = pre_string.innerHTML + cursor.innerHTML + pos_string.innerHTML;
        commandsList.add(input.trim());
        command = null;
        executeCommand(input.trim());
        break

      case "ArrowLeft":
        if ( pre_string.innerHTML ) {
            pos_string.innerHTML = cursor.innerHTML + pos_string.innerHTML
            cursor.innerHTML = pre_string.innerHTML.slice( pre_string.innerHTML.length-1  , pre_string.innerHTML.length )
            pre_string.innerHTML = pre_string.innerHTML.slice( 0 , pre_string.innerHTML.length-1 )
        }
        break

      case "ArrowRight":
        if ( pos_string.innerHTML ) {
            pre_string.innerHTML = pre_string.innerHTML + cursor.innerHTML
            cursor.innerHTML = pos_string.innerHTML.slice( 0 , 1)
            pos_string.innerHTML = pos_string.innerHTML.slice(1,pos_string.innerHTML.length)
        }
        break

      default:
        pre_string.innerHTML += evt.key
    }
  }

}







function processInput(input){
  var input = input.replace(/(\\ )/g,'<space>')
  let input_array = input.split(' ')
  let msg = ''
  switch (input_array[0]) {

    case "":
      displayResponse('')
      break

    case "echo":
      input_array.shift()
      input_array.forEach(function(el) {
          msg += el + ' ';
        });
      displayResponse(msg)
      break

    case "cd":

      input_array.shift()

      if( input_array.length ) {
        cd(curr_dir+'/'+input_array[0])
      }
      else {
        displayResponse('cd: access denied')
      }
      break

    case "read":

      input_array.shift()

      if( input_array.length ) {
        console.log(curr_dir+'/'+input_array[0]);
        read(curr_dir+'/'+input_array[0])
      }
      else {
        displayResponse('read: no file')
      }
      break

    case "rm":
        displayResponse('rm: permission denied')
      break

    case "sudo":
        displayResponse('sudo: permission denied')
      break

    case "mkdir":
        displayResponse('mkdir: permission denied')
      break

    case "touch":
        displayResponse('touch: permission denied')
      break


    case "ls":

      input_array.shift()

      if( input_array.length ) {
        ls(curr_dir+'/'+input_array[0])
      }
      else {
        ls(curr_dir)
      }
      break

    case "clear":
      document.getElementById('consoleContent').innerHTML = ''
      break

    case "date":
      let date = new Date()
      displayResponse(date.toString())
      break

    case "pwd":
      displayResponse('/' + curr_dir)
      break

    case "reload":
      input_array.shift()
      if(input_array[0] === 'hard') {
        document.location.reload(true)
        displayResponse('reloading...')

      }
      else {
        document.location.reload(false)
        displayResponse('reloading...')
      }

      break

    case "help":
    case "--help":
    case "--h":
      helpUtil.forEach(function(el){
        displayResponse(el)
      })
      break

    case "version":
    case "--version":
    case "--v":
      displayResponse('version: 0.2.0')
      break

    default:
      displayResponse('command not found: ' + input_array[0])
  }

}


function executeCommand(input){
  input_display.innerHTML = input
  processInput(input)
  newPrompt()
}

function displayResponse(res){

  if (typeof res === 'string'){
      let pre = document.createElement('pre')
      let text = document.createTextNode(res)
      pre.appendChild(text)
      pre.className = 'console--pre'
      document.getElementById('consoleContent').appendChild(pre)
      scrollToBottom(document.getElementById('consoleContent'))
  }
  else if (Array.isArray(res)){
      listResponse(res)
    }

}

function typeResponse(res){

  if (typeof res !== 'string'){
    console.log('error: not a string')
  }



}

function listResponse(array){
  let ul = document.createElement('ul')
  ul.className = 'console--ul'
  array.forEach(function(e){
    let li = document.createElement('li')
    let tx = document.createTextNode(e)
    li.appendChild(tx)
    ul.appendChild(li)
  })
  document.getElementById('consoleContent').appendChild(ul)
}

function displaySudo(array){
  let pre = document.createElement('pre')
  pre.className = 'console--pre'
  let pass = document.createElement('input')
  pass.setAttribute("type", "password")
  pass.className = 'console--sudo'
  pre.appendChild(pass)
  document.getElementById('consoleContent').appendChild(pre)
}




function newPrompt( ){
  let path = ''

  // curr_dir.forEach(function(e){
  //   path += "/"+e
  // })

  path = curr_dir.split('/')

  let prompt = document.createElement('prompt')
  let prompttext = document.createElement('prompttext')
  let path_el = document.createElement('path')
  let text_node = document.createTextNode('$guest~ '+path[path.length-1]+' ')
  path_el.appendChild(text_node)
  // let usr = document.createElement('usr')
  // text_node = document.createTextNode('guest')
  // usr.appendChild(text_node)
  let dol = document.createElement('dol')
  text_node = document.createTextNode('>\u00A0')
  dol.appendChild(text_node)

  prompttext.appendChild(path_el)
  // prompttext.appendChild(usr)
  prompttext.appendChild(dol)

  let inputdisplay = document.createElement('inputdisplay')
  let prestring = document.createElement('prestring')
  let cursor = document.createElement('cursor')
  text_node = document.createTextNode(' ')
  cursor.appendChild(text_node)
  let poststring = document.createElement('poststring')
  let input = document.createElement('input')

  inputdisplay.appendChild(prestring)
  inputdisplay.appendChild(cursor)
  inputdisplay.appendChild(poststring)
  inputdisplay.appendChild(input)

  prompt.appendChild(prompttext)
  prompt.appendChild(inputdisplay)

  document.getElementById('consoleContent').appendChild(prompt)

  initInput()
}



function printWelcome(){
  let txt = 'For a list of commands, type \'help\'.'
  displayResponse(txt)
}

class File{
  constructor(name, type, path, content){
    this.name = name
    this.type = type || 'txt'
    this.path = path
    this.content = content || ''
  }
}

class Folder{
  constructor(name,path){
    this.name = name
    this.path = path
  }
}


directory.push(new Folder('home','usr'))
    directory.push(new Folder('files','usr/home'))
    directory.push(new File(
      'about',
      '',
      'usr/home',
`I've created this terminal-like interface to provide an alternative way of exploring content.

You can navigate the folders using the "cd" command. For example, "cd files/misc" or "cd ..".

There are additional functions available. To view them, type "help".`
))
    directory.push(new File(
      'one',
      '',
      `usr/home`,
      `Curabitur aliquet quam id dui posuere blandit. Nulla porttitor accumsan tincidunt. Donec sollicitudin molestie malesuada. Quisque velit nisi, pretium ut lacinia in, elementum id enim. Curabitur aliquet quam id dui posuere blandit. Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus. Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus. Curabitur aliquet quam id dui posuere blandit. Cras ultricies ligula sed magna dictum porta. Nulla quis lorem ut libero malesuada feugiat.

Cras ultricies ligula sed magna dictum porta. Praesent sapien massa, convallis a pellentesque nec, egestas non nisi. Vivamus suscipit tortor eget felis porttitor volutpat. Praesent sapien massa, convallis a pellentesque nec, egestas non nisi. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Donec rutrum congue leo eget malesuada. Praesent sapien massa, convallis a pellentesque nec, egestas non nisi. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus.`))
    directory.push(new File('two','','usr/home'))

    directory.push(new Folder('misc','usr/home'))
        directory.push(new Folder('A','usr/home/misc'))
        directory.push(new Folder('B','usr/home/misc'))
        directory.push(new File('file_three','','usr/home/misc'))

let filteredArray =[]


function cd(path){


  path = path.split('/')
  let name = path.pop()
  path = path.join('/')
  let result = directory.filter(hasName(name))

  if (name == '..' && curr_dir !== 'usr'){
    curr_dir = curr_dir.split('/')
    curr_dir.pop()
    curr_dir = curr_dir.join('/')
    displayResponse('')
    return
  }
  else if (name == '..' && curr_dir == 'usr'){
    displayResponse('cd: error: access denied')
    return
  }

  if (result.length) {
    result = result.filter(hasPath(path))
    result = result.filter(isFolder)
    if (result.length){
      curr_dir = path+'/'+name
      displayResponse('')
    }
    else{
      displayResponse('ls: '+path+'/'+name+': No such directory')
    }
  }
  else {
      displayResponse('ls: '+path+'/'+name+': No such directory')
  }

}
//


function ls(path){
  let result = []
  filteredArray = directory.filter(hasPath(path))

  if ( filteredArray.length === 0 ) {
    path = path.split('/')  // Split the path string into an array
    name = path.pop()       // Pop the last item off the array and assign to 'name' - this is the name of the folder we are looking for
    path = path.join('/')   // Recombine the path (without the last item)
    result = directory.filter(hasPath(path)) // Find the items
    result = result.filter(hasName(name)) // Check that there is a folder that matches
    if (result.length){
        displayResponse('')
      return
    }
    else {
      displayResponse('ls: '+path+'/'+name+': No such directory')
      return
    }
  }

  filteredArray.sort().forEach(function(el){
    type = (el.type) ? ('.'+el.type) : ''
    // displayResponse(el.name + type)
    result.push(el.name + type)
  })

  displayResponse(result)
}

let test

function read(path){ // takes a string (eg. 'usr/home/files/about.txt')
  let result = []
  let file_type
  let file_name
  path = path.split('/')  // split the path into an array of '/' seperated values
  let file = path.pop().split('.') // last item in array is the file, split at '.' and make an array of this

  if ( file.length > 1 ) {
    file_type = file.pop() // get the last item of the file array - this is the file type (eg. 'txt')
    file_name = file.join('.') // concat the file array (minus the file type) back into a string - this is the file name (eg. 'about')
    file = file_name+'.'+file_type
  }
  else {
    file_name = file.join('.') // concat the file array (minus the file type) back into a string - this is the file name (eg. 'about')
  }

  path = path.join('/') // concat the path back into a string

  filteredArray = directory.filter(hasPath(path)) // filter the directory to find items with the same path

  if ( filteredArray.length ) {  // if the filteredArray is populated with at least one item

    filteredArray = filteredArray.filter(hasName(file_name))

    if ( filteredArray.length ){  // does the filteredArray have a file matching the name?
      if ( file_type ) {
        console.log(file_type);
        filteredArray = filteredArray.filter(hasType(file_type))
        if ( filteredArray.length ){
          displayResponse(filteredArray[0].content)
        }
        else {
          displayResponse('read: '+path+'/'+file+': No such file')
        }
      }
      else {
          displayResponse(filteredArray[0].content)
      }
    }
    else {
      displayResponse('read: '+path+'/'+file+': No such file')
    }

  }
  else {
    displayResponse('read: '+path+'/'+file+': No such file')
  }


}

function scrollToBottom(elem){
  elem.scrollTop = elem.scrollHeight;
}





function hasPath(path) {
  return function(object) {
    if ( object.path === path ){
      return object.path === path
    }
  }
}
function hasName(name) {
  return function(object) {
    if ( object.name === name ){
      return object.name === name
    }
  }
}
function hasType(type) {
  return function(object) {
    if ( object.type === type ){
      return object.type === type
    }
  }
}
function isFolder(object) {
      return object instanceof Folder
}
function isFile(object) {
      return object instanceof File
}
