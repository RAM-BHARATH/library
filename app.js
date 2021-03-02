let myLibrary = [];
let uniqueID = 0;

let addBookButton = document.getElementById('add-book');
let deleteButtons = document.querySelectorAll('.delete-button');
let updateButtons = document.querySelectorAll('.update-button');
let form = document.getElementById('form');
let book_name = document.getElementById('book_name');
let page = document.getElementById('page');
let author = document.getElementById('author');
let read = document.getElementById('read');

const mainContainer = document.getElementById('books-container');

addBookButton.addEventListener('click',function(){
  console.log(addBookButton.textContent);
  console.log("Add clicked");
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
  console.log(myLibrary);
  getAllBooks();
}

function getAllBooks(){
  removeBooks();
  for(let i=0;i<myLibrary.length;i++){
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
    console.log(myLibrary[i]);
  }
  mainContainer.innerHTML+=`<div class='add block' id='add-book' onclick="Alert.render('')">+</div>`;
  addBookButton = document.getElementById('add-book');
  addBookButton.addEventListener('click',function(){
    console.log("Add clicked");
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
    console.log(`Delete button ${i} : ${deleteButtons[i]}`);
    deleteButtons[i].addEventListener('click',deleteBook);
  }
  updateButtons = document.querySelectorAll('.update-button');
  console.log("Update buttons:"+updateButtons);
  console.log(updateButtons);
  for(let i=0;i<updateButtons.length;i++){
    console.log(`Update button ${i} : ${updateButtons[i]}`);
    updateButtons[i].addEventListener('click',Alert.updateRender);
  }
}
function removeBooks(){
  mainContainer.innerHTML=``;
}

function deleteBook(){
  let id = this.parentNode.parentNode.id;
  console.log("Delete clicked: "+id);
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
    console.log(book_name.value);
    console.log(read.checked);
    if(book_name.value!==''&&author.value!==''&&page.value>0&&page.value<=10000){
      let bookTitle = book_name.value;
      let bookAuthor = author.value;
      let bookPages = page.value;
      let bookRead = read.value;
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
        // myLibrary.splice(index,1);
        // myLibrary[i].title;
        let bookTitle = myLibrary[i].title;
        let bookAuthor = myLibrary[i].author;
        let bookPages = myLibrary[i].pages;
        let bookRead = myLibrary[i].read;
        let bookId = myLibrary[i].id;
        console.log(form);
        book_name.setAttribute('value',bookTitle);
        author.setAttribute('value',bookAuthor);
        page.setAttribute('value',bookPages);
        read.setAttribute('value',bookRead);
      }
      console.log(form);
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
    // document.getElementById('form').style.display='none';
    console.log(book_name.value);
    console.log(read.checked);
    if(book_name.value!==''&&author.value!==''&&page.value>0&&page.value<=10000){
      let bookTitle = book_name.value;
      let bookAuthor = author.value;
      let bookPages = page.value;
      let bookRead = read.value;
      console.log(id);
      updateBook(bookTitle,bookAuthor,bookPages,bookRead,id);
      // addBookToLibrary(bookTitle,bookAuthor,bookPages,bookRead);
      // myLibrary[i].title = bookTitle;
      // myLibrary[i].author = bookAuthor;
      // myLibrary[i].pages = bookPages;
      // myLibrary[i].bookRead = bookRead;
      book_name.removeAttribute('value');
      page.removeAttribute('value');
      author.removeAttribute('value');
      read.removeAttribute('value');
    }
    else{
      Alert.updateRender();
    }
  }
}

form.reset();