import { async } from '@firebase/util';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  setDoc,
  updateDoc,
  doc,
  serverTimestamp,
  where,
  getDoc,
  getDocs,
} from 'firebase/firestore';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { getPerformance } from 'firebase/performance';

import { getFirebaseConfig, db } from './firebase-config.js';

let addBookButton = document.getElementById('add-book');
let deleteButtons = document.querySelectorAll('.delete-button');
let updateButtons = document.querySelectorAll('.update-button');
let toggleReadButtons = document.querySelectorAll('.read-status');
let form = document.getElementById('form');
let book_name = document.getElementById('book_name');
let page = document.getElementById('page');
let author = document.getElementById('author');
let read = document.getElementById('read');

let Alert = new CustomAlert();

const mainContainer = document.getElementById('books-container');

let myLibrary = [];
let uniqueID=0;

console.log("Enters here");
if(JSON.parse(localStorage.getItem('library'))==null){
  myLibrary=[];
  console.log(1+": Library item not available so far");
}
else{
  myLibrary = JSON.parse(localStorage.getItem('library'));
  console.log(2+": We have library item already!");
}

if(JSON.parse(localStorage.getItem('ID'))==null){
  uniqueID = 0;
}else{
  uniqueID = JSON.parse(localStorage.getItem('ID'));
}
getAllBooks();

// loadLibrary();
// getAllBooks();


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
  myLibrary = JSON.stringify(myLibrary)
  myLibrary = JSON.parse(myLibrary)
  // if(isUserSignedIn()){
    saveLibrary();
  // }
  console.log("Add book to Library")
  console.log(myLibrary);
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
          <div class='read-status'><img src='../assets/tick.svg'></div>
          <div class='update-button'><img src='../assets/update.svg'></div>
          <div class='delete-button' ><img src='../assets/delete-button.svg'></div>
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
          <div class='read-status'><img src='../assets/cross.svg'></div>
          <div class='update-button'><img src='../assets/update.svg'></div>
          <div class='delete-button' ><img src='../assets/delete-button.svg'></div>
      </div>
    </div>`;
    }
    // console.log(myLibrary[i]);
  }
  if(!isUserSignedIn()){
    localStorage.setItem('library',JSON.stringify(myLibrary));
    console.log("From local storage API: "+JSON.parse(localStorage.getItem('library')));
  }
  localStorage.setItem('ID',uniqueID);
  mainContainer.innerHTML+=`<div class='add block' id='add-book'">+</div>`; //onclick="Alert.render('')
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
  if(isUserSignedIn()){
    updateLibrary();
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
  if(isUserSignedIn()){
    updateLibrary();
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
  if(isUserSignedIn()){
    updateLibrary();
  }
  getAllBooks();
}

//Pop Up form functions


function CustomAlert(){
  this.render = function(){
      //Show Modal
      let popUpBox = document.getElementById('popUpBox');
      popUpBox.style.display = "block";
      let form = document.getElementById('form');
      // form.style.display = "block";
      //Close Modal
      document.getElementById('closeModal').innerHTML = '<button id="add-new">Add New</button>';
      let addNew = document.getElementById('add-new');
      addNew.addEventListener('click',Alert.addNew);
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
    //   Alert.render();
    this.render();
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
      document.getElementById('closeModal').innerHTML = `<button id="update-button">Update</button>`;  //onclick="Alert.update(${id})
      let updateButton = document.getElementById("update-button");
      updateButton.addEventListener('click',()=>(Alert.update(id)))
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
    //   Alert.updateRender();
    this.updateRender();
    }
  }
}

form.reset();

// function storageAvailable(type) {
//   var storage;
//   try {
//       storage = window[type];
//       var x = '__storage_test__';
//       storage.setItem(x, x);
//       storage.removeItem(x);
//       return true;
//   }
//   catch(e) {
//       return e instanceof DOMException && (
//           // everything except Firefox
//           e.code === 22 ||
//           // Firefox
//           e.code === 1014 ||
//           // test name field too, because code might not be present
//           // everything except Firefox
//           e.name === 'QuotaExceededError' ||
//           // Firefox
//           e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
//           // acknowledge QuotaExceededError only if there's something already stored
//           (storage && storage.length !== 0);
//   }
  
// }
// if (storageAvailable('localStorage')) {
//   console.log(`Yippee! We can use localStorage awesomeness`);
// }
// else {
//   console.log(`Too bad, no localStorage for us`);
// }
if(!!isUserSignedIn()){
  localStorage.setItem('library',JSON.stringify(myLibrary));
  localStorage.setItem('ID',uniqueID);
}

function getBooksFromStorage(){
  let items = JSON.parse(localStorage.getItem('library'))
  console.log("Books in storage:"+items.length);
  for(let i=0;i<items.length;i++){
    console.log(`Item ${i}:`);
    console.log(items[i]);
  }
}
if(!isUserSignedIn()){
  getBooksFromStorage();
  getAllBooks();
}else{
  loadLibrary();
  getAllBooks();
}
// getAllBooks();

//Firebase code

let signInButton = document.getElementById('sign-in');
let signOutButton = document.getElementById('sign-out');
let userNameElement = document.getElementById('user-name');

signInButton.addEventListener('click',signIn);
signOutButton.addEventListener('click', signOutUser);

const firebaseAppConfig = getFirebaseConfig();
initializeApp(firebaseAppConfig);

async function signIn() {
  var provider = new GoogleAuthProvider();
  await signInWithPopup(getAuth(), provider);
  loadLibrary().then(
    getAllBooks()
  )
}

// Signs-out
function signOutUser() {
  // Sign out of Firebase.
  signOut(getAuth());
  // myLibrary=[]
  // localStorage.setItem('library',[])
}

// Initialize firebase auth
function initFirebaseAuth() {
  // Listen to auth state changes.
  onAuthStateChanged(getAuth(), authStateObserver);
}

function authStateObserver(user) {
  if (user) {
    // User is signed in!
    // Get the signed-in user's profile pic and name.
    // var profilePicUrl = getProfilePicUrl();
    var userName = getUserName();
    // Set the user's profile pic and name.
    // userPicElement.style.backgroundImage =
    //   'url(' + addSizeToGoogleProfilePic(profilePicUrl) + ')';
    userNameElement.textContent = userName;

    // Show user's profile and sign-out button.
    userNameElement.removeAttribute('hidden');
    // userPicElement.removeAttribute('hidden');
    signOutButton.removeAttribute('hidden');

    // Hide sign-in button.
    signInButton.setAttribute('hidden', 'true');

    // We save the Firebase Messaging Device token and enable notifications.
    // saveMessagingDeviceToken();
  } else {
    // User is signed out!
    // Hide user's profile and sign-out button.
    userNameElement.setAttribute('hidden', 'true');
    // userPicElement.setAttribute('hidden', 'true');
    signOutButton.setAttribute('hidden', 'true');

    // Show sign-in button.
    signInButton.removeAttribute('hidden');
  }
  if(isUserSignedIn()){
    // myLibrary=[]
    loadLibrary();
  }else{
    console.log("Logged out")
    myLibrary = JSON.parse(localStorage.getItem('library'))
    getAllBooks();
  }
  // myLibrary=[]
  getAllBooks();
}

// Returns the signed-in user's display name.
function getUserName() {
  // TODO 5: Return the user's display name.
  console.log(getAuth().currentUser);
  return getAuth().currentUser.displayName;
}

function getEmail(){
  return getAuth().currentUser.email;
}

function isUserSignedIn() {
  // TODO 6: Return true if a user is signed-in.
  return !!getAuth().currentUser;
}

// Saves a new message to Cloud Firestore.
async function saveLibrary() {
  // Add a new message entry to the Firebase database.
  if(myLibrary.length>1){
    console.log('===================')
    console.log(myLibrary.length);
    console.log("My library")
    console.log(myLibrary);
    console.log('===================')
    // console.log("----------------------In loadLibrary--------------------")
    // console.log(await loadLibrary());
    // console.log("Non empty library")
    updateLibrary();
  }else{
    try {
      await addDoc(collection(getFirestore(), `library_data`), {
        email: getEmail(),
        name: getUserName(),
        library: myLibrary,
        timestamp: serverTimestamp()
      });
    }
    catch(error) {
      console.error('Error writing new message to Firebase Database', error);
    }
  }
}

// Loads chat messages history and listens for upcoming ones.
async function loadLibrary() {
  // const db = firebase.firestore()
  // Create the query to load the last 12 messages and listen for new ones.
  // const libraryItemsQuery = query(getDoc(getFirestore(), 'libary_data')); //, where('email','==',getEmail())
  // const libraryItemsQuery = db.collection('library_data').get().then((snapshot) =>{
  const libraryCollection = collection(db, 'library_data');  
  const librarySnapshot = await getDocs(libraryCollection);
  const libraryList = librarySnapshot.docs.map(doc => doc.data());
  console.log('=======================================')
  // console.log(librarySnapshot)
  for(let i=0; i<librarySnapshot.docs.length;i++){
    console.log(librarySnapshot.docs[i].id)
    console.log(librarySnapshot.docs[i].data());
    console.log(librarySnapshot.docs[i].data().library);
    if(librarySnapshot.docs[i].data().email===getEmail()){
      myLibrary = librarySnapshot.docs[i].data().library;
      console.log("Current user: ", getEmail())
    }
    // console.log("Using id to get a doc");
    // console.log(db.collection('library_data').doc(librarySnapshot.docs[i].id).get())
    // console.log((await getDoc(doc(db, 'library_data', librarySnapshot.docs[i].id))).data())
  }
  console.log(libraryList);
  console.log('=======================================')
  // Start listening to the query.
  console.log("From snapshot")
  // console.log(libraryItemsQuery);
  // onSnapshot(libraryItemsQuery, function(snapshot) {
    // snapshot.docChanges().forEach(function(change) {
      // if (change.type === 'removed') {
      //   deleteMessage(change.doc.id);
      // } else {
      //   var message = change.doc.data();
      //   displayMessage(change.doc.id, message.timestamp, message.name,
      //                 message.text, message.imageUrl);
      // }
    //   console.log(libraryItemsQuery)
    // });
  // });
  getAllBooks();
  return libraryList;
}

async function updateLibrary(){
  const libraryCollection = collection(db, 'library_data');  
  const librarySnapshot = await getDocs(libraryCollection);
  const libraryList = librarySnapshot.docs.map(doc => doc.data());
  for(let i=0;i<librarySnapshot.docs.length;i++){
    if(librarySnapshot.docs[i].data().email===getEmail()){
      await updateDoc(doc(db, 'library_data', librarySnapshot.docs[i].id),{
        library: myLibrary
      })
    }
  }  
}
initFirebaseAuth();