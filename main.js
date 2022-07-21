const listBooks = [];
const RENDER_EVENT = "render-listbooks";
const SAVED_EVENT = "saved-books";
const STORAGE_KEY = "BOOKSHELF_APP";

function generateId (){
    return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted){
    return{
        id,
        title,
        author,
        year,
        isCompleted
    }
}

function findBook(bookId){
    for(bookItem of listBooks){
        if(bookItem.id === bookId){
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(bookId){
    for(index in listBooks){
        if(listBooks[index].id === bookId){
            return index;
        }
    }

    return 1;
}

function isStorageExist(){
    if(typeof(Storage) === undefined){
        alert("Browser tidak mendukung local storage");
        return false;
    }

    return true;
}

function saveData(){
    if(isStorageExist()){
        const parsed = JSON.stringify(listBooks);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function loadDataFromStorage(){
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if(data !== null){
        for(book of data){
            listBooks.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(bookObject){
    const {id, title, author, year, isCompleted} = bookObject;

    const bookTitle = document.createElement("h3");
    bookTitle.innerText = `${title}`;

    const bookAuthor = document.createElement("p");
    bookAuthor.innerText = `Penulis : ${author}`;

    const bookYear = document.createElement("p");
    bookYear.innerText = `Tahun : ${year}`;

    const containerListBook = document.createElement("article");
    containerListBook.classList.add("book_item");
    containerListBook.append(bookTitle, bookAuthor, bookYear);
    containerListBook.setAttribute("id", `book-${id}`);

    if(isCompleted){
        const completeButton = document.createElement("button");
        completeButton.classList.add("complete");
        completeButton.innerHTML = `<i class="fa-solid fa-check"></i>`;
        completeButton.addEventListener("click", function(){
            moveBookToCompleted(id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete");
        deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
        deleteButton.addEventListener("click", function(){
            removeBookFromCompleted(id);
        });

        const editButton = document.createElement("button");
        editButton.classList.add("edit");
        editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
        editButton.addEventListener("click", function(){
            editBook(id);
        });

        const containerAction = document.createElement("div");
        containerAction.classList.add("action");
        containerAction.append(completeButton, editButton, deleteButton);

        containerListBook.append(containerAction);

    } else{
        const checkButton = document.createElement("button");
        checkButton.classList.add("complete");
        checkButton.innerHTML = `<i class="fa-solid fa-check"></i>`
        checkButton.addEventListener("click", function(){
            addBookToCompleted(id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete");
        deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`
        deleteButton.addEventListener("click", function(){
            removeBookFromCompleted(id);
        });

        const editButton = document.createElement("button");
        editButton.classList.add("edit");
        editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
        editButton.addEventListener("click", function(){
            editBook(id);
        });


        const containerAction = document.createElement("div");
        containerAction.classList.add("action");
        containerAction.append(checkButton, editButton, deleteButton);

        containerListBook.append(containerAction);
    }

    return containerListBook;
}

function addBook(){
    const bookTitle = document.getElementById("inputBookTitle").value;
    const bookAuthor = document.getElementById("inputBookAuthor").value;
    const bookYear = document.getElementById("inputBookYear").value;
    const isCompleted = document.getElementById("inputBookIsComplete").checked;

    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear, isCompleted);
    listBooks.push(bookObject);
    
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function addBookToCompleted(bookId){
    const bookTarget = findBook(bookId);
    if(bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function editBook(bookId){

    (async () => {
        const { value: formValues } = await Swal.fire({
          title: 'Masukkan Data Buku Baru',
          html:
            '<input placeholder="Judul" id="swal-input1" class="swal2-input">' +
            '<input placeholder="Penulis" id="swal-input2" class="swal2-input">' +
            '<input placeholder="Tahun" type="number" id="swal-input3" class="swal2-input">',
          focusConfirm: false,
          preConfirm: () => {
            return [
              document.getElementById('swal-input1').value,
              document.getElementById('swal-input2').value,
              document.getElementById('swal-input3').value
            ]
          }
        })

        const _title = document.getElementById('swal-input1').value;
        const _author = document.getElementById('swal-input2').value;
        const _year = document.getElementById('swal-input3').value;

        if (_title !== "" && _author !== "" && _year !== "") {
            const bookTarget = findBook(bookId);
            if(bookTarget == null) return;
            bookTarget.title = _title;
            bookTarget.author = _author;
            bookTarget.year = _year;

            document.dispatchEvent(new Event(RENDER_EVENT));
            saveData();
            Swal.fire(
                '',
                'Data Berhasil diubah.',
                'success'
              );

        } else if(_title !== "" && _author !== "" && _year === ""){
            const bookTarget = findBook(bookId);
            if(bookTarget == null) return;

            bookTarget.title = _title;
            bookTarget.author = _author;

            document.dispatchEvent(new Event(RENDER_EVENT));
            saveData();
            Swal.fire(
                '',
                'Data Berhasil diubah.',
                'success'
              );
        } else if(_title !== "" && _author === "" && _year !== ""){
            const bookTarget = findBook(bookId);
            if(bookTarget == null) return;

            bookTarget.title = _title;
            bookTarget.year = _year;

            document.dispatchEvent(new Event(RENDER_EVENT));
            saveData();
            Swal.fire(
                '',
                'Data Berhasil diubah.',
                'success'
              );
        } else if(_title !== "" && _author === "" && _year === ""){
            const bookTarget = findBook(bookId);
            if(bookTarget == null) return;

            bookTarget.title = _title;

            document.dispatchEvent(new Event(RENDER_EVENT));
            saveData();
            Swal.fire(
                '',
                'Data Berhasil diubah.',
                'success'
              );
        } else if(_title === "" && _author === "" && _year !== ""){
            const bookTarget = findBook(bookId);
            if(bookTarget == null) return;

            bookTarget.year = _year;

            document.dispatchEvent(new Event(RENDER_EVENT));
            saveData();
            Swal.fire(
                '',
                'Data Berhasil diubah.',
                'success'
              );
        } else if(_title === "" && _author !== "" && _year === ""){

            const bookTarget = findBook(bookId);
            if(bookTarget == null) return;

            bookTarget.author = _author;

            document.dispatchEvent(new Event(RENDER_EVENT));
            saveData();
            Swal.fire(
                '',
                'Data Berhasil diubah.',
                'success'
              );
        } else if(_title === "" && _author !== "" && _year !== ""){
            const bookTarget = findBook(bookId);
            if(bookTarget == null) return;

            bookTarget.author = _author;
            bookTarget.year = _year;

            document.dispatchEvent(new Event(RENDER_EVENT));
            saveData();
            Swal.fire(
                '',
                'Data Berhasil diubah.',
                'success'
              );
        } else{
            Swal.fire(
                '',
                'Tidak ada inputan!',
                'error'
              );
        } 
        })()    
}

function removeBookFromCompleted(bookId){
    Swal.fire({
        title: 'Anda yakin ingin menghapus data tersebut?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
            const bookTarget = findBookIndex(bookId);
            if(bookTarget === -1) return;
            listBooks.splice(bookTarget, 1);
    
            document.dispatchEvent(new Event(RENDER_EVENT));
            saveData();
            Swal.fire('Data berhasil dihapus')
        }else{
            Swal.fire('Data tidak dihapus')
        }
      })
}

function moveBookToCompleted(bookId){
    const bookTarget = findBook(bookId);
    if(bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function searchBook(event){
    event.preventDefault();

    const bookTitle = document.getElementById("searchBookTitle").value.toLowerCase();
    const bookList = document.querySelectorAll(".book_item > h3");

    for(book of bookList){
        if(book.innerText.toLowerCase().indexOf(bookTitle.toLowerCase()) > -1){
           book.parentElement.style.display = "block";
       } else{
           book.parentElement.style.display = "none"
       }
   }
}

document.addEventListener("DOMContentLoaded", function(){
    const submitForm = document.getElementById("inputBook");

    submitForm.addEventListener("submit", function(event){
        event.preventDefault();
        addBook();
    });

    if(isStorageExist()){
        loadDataFromStorage();
    }
});

document.addEventListener(SAVED_EVENT, () =>{
    console.log("Data berhasil disimpan");
});

document.addEventListener(RENDER_EVENT, function(){
    const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
    const completeBookshelfList = document.getElementById("completeBookshelfList");

    incompleteBookshelfList.innerHTML = "";
    completeBookshelfList.innerHTML = "";

    for(bookItem of listBooks){
        const bookElement = makeBook(bookItem);
        console.log(bookItem.id);
        if(bookItem.isCompleted == false){
            incompleteBookshelfList.append(bookElement);
        } else{
            completeBookshelfList.append(bookElement);
        }
    }
});


document.getElementById("searchSubmit").addEventListener("click", searchBook);
