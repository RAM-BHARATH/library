let myLibrary = [];
let uniqueID = 0;

let addBookButton = document.getElementById('add-book');
let deleteButtons = document.querySelectorAll('.delete-button');
let updateButtons = document.querySelectorAll('.update-button');

const mainContainer = document.getElementById('books-container');

addBookButton.addEventListener('click',function(){
  console.log("Add clicked");
  let bookTitle = prompt('title');
  let bookAuthor = prompt('Book Author');
  let bookPages = prompt('Pages in book');
  let bookRead = prompt('Read the book?');
  addBookToLibrary(bookTitle,bookAuthor,bookPages,bookRead);
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
  mainContainer.innerHTML+=`<div class='add block' id='add-book'>+</div>`;
  addBookButton = document.getElementById('add-book');
  addBookButton.addEventListener('click',function(){
    console.log("Add clicked");
    let bookTitle = prompt('title');
    let bookAuthor = prompt('Book Author');
    let bookPages = prompt('Pages in book');
    let bookRead = prompt('Read the book?');
    // document.innerHTML+=`<div class='form-container><form>Hello</form></div>`; 
    addBookToLibrary(bookTitle,bookAuthor,bookPages,bookRead);
  });

  deleteButtons = document.querySelectorAll('.delete-button');
  console.log("Delete buttons:"+deleteButtons);
  for(let i=0;i<deleteButtons.length;i++){
    console.log(`Delete button ${i} : ${deleteButtons[i]}`);
    deleteButtons[i].addEventListener('click',deleteBook);
  }
  updateButtons = document.querySelectorAll('.update-button');
  console.log("Update buttons:"+updateButtons);
  for(let i=0;i<updateButtons.length;i++){
    console.log(`Update button ${i} : ${updateButtons[i]}`);
    updateButtons[i].addEventListener('click',updateBook);
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

function updateBook(){
  let id = this.parentNode.parentNode.id;
  console.log("Update clicked: "+id);
  for(let i=0;i<myLibrary.length;i++){
    if(id==myLibrary[i].id){
      let index = i;
      // myLibrary.splice(index,1);
      myLibrary[i].title;
      let bookTitle = prompt('title', myLibrary[i].title);
      let bookAuthor = prompt('Book Author', myLibrary[i].author);
      let bookPages = prompt('Pages in book', myLibrary[i].pages);
      let bookRead = prompt('Read the book?', myLibrary[i].read);
      myLibrary[i].title = bookTitle;
      myLibrary[i].author = bookAuthor;
      myLibrary[i].pages = bookPages;
      myLibrary[i].bookRead = bookRead;
      break;
    }
  }
  getAllBooks();
}