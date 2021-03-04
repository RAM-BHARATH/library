let myLibrary = [];
if(JSON.parse(localStorage.getItem('library'))==null){
  myLibrary=[];
  console.log(1);
}
else{
  myLibrary = JSON.parse(localStorage.getItem('library'));
  console.log(2);
  
}
let uniqueID=0;
if(JSON.parse(localStorage.getItem('ID'))==0){
  uniqueID = 0;
}else{
  uniqueID = JSON.parse(localStorage.getItem('ID'));
}
let addBookButton = document.getElementById('add-book');
let deleteButtons = document.querySelectorAll('.delete-button');
let updateButtons = document.querySelectorAll('.update-button');
let toggleReadButtons = document.querySelectorAll('.read-status');
let form = document.getElementById('form');
let book_name = document.getElementById('book_name');
let page = document.getElementById('page');
let author = document.getElementById('author');
let read = document.getElementById('read');

const mainContainer = document.getElementById('books-container');

addBookButton.addEventListener('click',function(){
  // console.log(addBookButton.textContent);
  // console.log("Add clicked");
  Alert.render('');
});

function Book(title, author, pages, read) {
  // the constructor...
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read; //boolean
  this.id=uniqueID;
  uniqueID++;
}

function addBookToLibrary(title, author, pages, read) {
  // do stuff here
  let book = new Book(title, author, pages, read);
  myLibrary.push(book);
  // console.log(myLibrary);
  getAllBooks();
}

function getAllBooks(){
  removeBooks();
  for(let i=0;i<myLibrary.length;i++){
    if(myLibrary[i].read===true){
      mainContainer.innerHTML+=`<div class='book block' id='${myLibrary[i].id}'>
    <div class='book-name' >
        <p>${myLibrary[i].title}</p>
    </div>
    <div class='book-author'><p>${myLibrary[i].author}</p></div>
      <div class='block-bottom'>
          <div class='pages'><p>${myLibrary[i].pages}</p></div>
          <div class='read-status'><img src='assets/tick.svg'></div>
          <div class='update-button'><img src='assets/update.svg'></div>
          <div class='delete-button' ><img src='assets/delete-button.svg'></div>
      </div>
    </div>`;
    }else{
      mainContainer.innerHTML+=`<div class='book block' id='${myLibrary[i].id}'>
    <div class='book-name' >
        <p>${myLibrary[i].title}</p>
    </div>
    <div class='book-author'><p>${myLibrary[i].author}</p></div>
      <div class='block-bottom'>
          <div class='pages'><p>${myLibrary[i].pages}</p></div>
          <div class='read-status'><img src='assets/cross.svg'></div>
          <div class='update-button'><img src='assets/update.svg'></div>
          <div class='delete-button' ><img src='assets/delete-button.svg'></div>
      </div>
    </div>`;
    }
    // console.log(myLibrary[i]);
  }
  localStorage.setItem('library',JSON.stringify(myLibrary));
  console.log("From local storage API: "+JSON.parse(localStorage.getItem('library')));
  localStorage.setItem('ID',uniqueID);
  mainContainer.innerHTML+=`<div class='add block' id='add-book' onclick="Alert.render('')">+</div>`;
  addBookButton = document.getElementById('add-book');
  addBookButton.addEventListener('click',function(){
    // console.log("Add clicked");
    Alert.render('');
    // let bookTitle = prompt('title');
    // let bookAuthor = prompt('Book Author');
    // let bookPages = prompt('Pages in book');
    // let bookRead = prompt('Read the book?');
    // document.innerHTML+=`<div class='form-container><form>Hello</form></div>`; 
  });

  deleteButtons = document.querySelectorAll('.delete-button');
  console.log("Delete buttons:"+deleteButtons);
  for(let i=0;i<deleteButtons.length;i++){
    // console.log(`Delete button ${i} : ${deleteButtons[i]}`);
    deleteButtons[i].addEventListener('click',deleteBook);
  }

  updateButtons = document.querySelectorAll('.update-button');
  // console.log("Update buttons:"+updateButtons);
  // console.log(updateButtons);
  for(let i=0;i<updateButtons.length;i++){
    // console.log(`Update button ${i} : ${updateButtons[i]}`);
    updateButtons[i].addEventListener('click',Alert.updateRender);
  }
  
  toggleReadButtons = document.querySelectorAll('.read-status');
  // console.log("Read buttons:"+toggleReadButtons);
  for(let i=0;i<toggleReadButtons.length;i++){
    // console.log(`Toggle read button ${i} : ${toggleReadButtons[i]}`);
    toggleReadButtons[i].addEventListener('click',toggleReadStatus);
  }
}
function removeBooks(){
  mainContainer.innerHTML=``;
}

function deleteBook(){
  let id = this.parentNode.parentNode.id;
  // console.log("Delete clicked: "+id);
  for(let i=0;i<myLibrary.length;i++){
    if(id==myLibrary[i].id){
      let index = i;
      myLibrary.splice(index,1);
      break;
    }
  }
  getAllBooks();
}

function updateBook(bookTitle,bookAuthor,bookPages,bookRead,id){
  // let id = this.parentNode.parentNode.id;
  console.log("Update clicked: "+id);
  for(let i=0;i<myLibrary.length;i++){
    if(id==myLibrary[i].id){
      // let index = i;
      // myLibrary.splice(index,1);
      // myLibrary[i].title;
      myLibrary[i].title = bookTitle;
      myLibrary[i].author = bookAuthor ;
      myLibrary[i].pages = bookPages;
      myLibrary[i].read = bookRead;
      myLibrary[i].id = id;
      form.reset();
      // Alert.updateRender(bookTitle,bookAuthor,bookPages,bookRead,bookId);
    }
  }
  getAllBooks();
}

function toggleReadStatus(){
  let id = this.parentNode.parentNode.id;
  // console.log(`Read status ${id}`);
  for(let i=0;i<myLibrary.length;i++){
    if(id==myLibrary[i].id){
      myLibrary[i].read = !(myLibrary[i].read);
      console.log(myLibrary[i].read);
      break;
    }
  }
  getAllBooks();
}

//Pop Up form functions

var Alert = new CustomAlert();
function CustomAlert(){
  this.render = function(){
      //Show Modal
      let popUpBox = document.getElementById('popUpBox');
      popUpBox.style.display = "block";
      let form = document.getElementById('form');
      // form.style.display = "block";
      //Close Modal
      document.getElementById('closeModal').innerHTML = '<button onclick="Alert.addNew()">Add New</button>';
  }

  this.addNew = function(){
    let book_name = document.getElementById('book_name');
    let page = document.getElementById('page');
    let author = document.getElementById('author');
    document.getElementById('popUpBox').style.display = "none";
    document.getElementById('popUpOverlay').style.display = "none";
    // document.getElementById('form').style.display='none';
    // console.log(book_name.value);
    // console.log(read.checked);
    if(book_name.value!==''&&author.value!==''&&page.value>0&&page.value<=10000){
      let bookTitle = book_name.value;
      let bookAuthor = author.value;
      let bookPages = page.value;
      let bookRead = read.checked;
      addBookToLibrary(bookTitle,bookAuthor,bookPages,bookRead);
      form.reset();
    }
    else{
      Alert.render();
    }
  }

  this.updateRender = function(){
    let popUpBox = document.getElementById('popUpBox');
    let form = document.getElementById('form');
    // form.style.display = "block";
    //Close Modal
    let id = this.parentNode.parentNode.id;
    // console.log(this.parentNode.parentNode.id);
    console.log("Update clicked: "+id);
    for(let i=0;i<myLibrary.length;i++){
      if(id==myLibrary[i].id){
        let index = i;
        let bookTitle = myLibrary[i].title;
        let bookAuthor = myLibrary[i].author;
        let bookPages = myLibrary[i].pages;
        let bookRead = myLibrary[i].read;
        let bookId = myLibrary[i].id;
        // console.log(form);
        book_name.setAttribute('value',bookTitle);
        author.setAttribute('value',bookAuthor);
        page.setAttribute('value',bookPages);
        if(bookRead==true){
          read.setAttribute('checked',bookRead);
        }else{
          read.setAttribute('unchecked',bookRead);
        }
        
      }
      // console.log(form);
      popUpBox.style.display = "block";
      document.getElementById('closeModal').innerHTML = `<button onclick="Alert.update(${id})">Update</button>`;    
  }
}

  this.update = function(id){
    let book_name = document.getElementById('book_name');
    let page = document.getElementById('page');
    let author = document.getElementById('author');
    document.getElementById('popUpBox').style.display = "none";
    document.getElementById('popUpOverlay').style.display = "none";
    console.log(book_name.value);
    console.log(read.checked);
    if(book_name.value!==''&&author.value!==''&&page.value>0&&page.value<=10000){
      let bookTitle = book_name.value;
      let bookAuthor = author.value;
      let bookPages = page.value;
      let bookRead = read.checked;
      console.log(id);
      updateBook(bookTitle,bookAuthor,bookPages,bookRead,id);
      book_name.removeAttribute('value');
      page.removeAttribute('value');
      author.removeAttribute('value');
      read.removeAttribute('checked');
      read.removeAttribute('unchecked');
    }
    else{
      Alert.updateRender();
    }
  }
}

form.reset();

function storageAvailable(type) {
  var storage;
  try {
      storage = window[type];
      var x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
  }
  catch(e) {
      return e instanceof DOMException && (
          // everything except Firefox
          e.code === 22 ||
          // Firefox
          e.code === 1014 ||
          // test name field too, because code might not be present
          // everything except Firefox
          e.name === 'QuotaExceededError' ||
          // Firefox
          e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
          // acknowledge QuotaExceededError only if there's something already stored
          (storage && storage.length !== 0);
  }
  
}
if (storageAvailable('localStorage')) {
  console.log(`Yippee! We can use localStorage awesomeness`);
}
else {
  console.log(`Too bad, no localStorage for us`);
}
localStorage.setItem('library',JSON.stringify(myLibrary));
localStorage.setItem('ID',uniqueID);

function getBooksFromStorage(){
  console.log(JSON.parse(localStorage.getItem('library')));
}
getBooksFromStorage();
getAllBooks();