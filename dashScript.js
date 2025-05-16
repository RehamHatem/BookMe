
import { addBook } from './firebase.js';

document.addEventListener("DOMContentLoaded", () => {
const content = document.getElementById("content");
const addBookForm = document.getElementById("add-book-form");
const alertBox = document.getElementById("alert-box");
const toggleBtn = document.getElementById("toggleBtn");
const imageInput = document.getElementById("book-image");
const previewImg = document.getElementById("preview-img");
const categorySelect = document.getElementById("book-category");


window.addEventListener("load", () => content.classList.add("loaded"));

toggleBtn.addEventListener("click", () => {
    document.querySelector(".sidebar").classList.toggle("active");
});

const showAlert = (message, type = "success") => {
    alertBox.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
    `;
};
//image
imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = () => {
        previewImg.src = reader.result;
        previewImg.style.display = "block";
    };
    reader.readAsDataURL(file);
    } else {
    previewImg.src = "";
    previewImg.style.display = "none";
    }
});

//=======================================================================================

//  form 
addBookForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("book-title").value.trim();
    const author = document.getElementById("book-author").value.trim();
    const price = parseFloat(document.getElementById("book-price").value);
    const stock = parseInt(document.getElementById("book-stock").value);
    const description = document.getElementById("book-description").value.trim();
    const category = categorySelect.value;
    const imageFile = imageInput.files[0];

// Validate 
    if (!title || title.length < 5) return showAlert("Title must be at least 5 characters.", "danger");
    if (!author || author.length < 3) return showAlert("Author must be at least 3 characters.", "danger");
    if (isNaN(price) || price < 0) return showAlert("Price must be a valid positive number.", "danger");
    if (isNaN(stock) || stock < 0) return showAlert("Stock must be a valid positive number.", "danger");
    if (!description || description.length < 10) return showAlert("Description must be at least 10 characters.", "danger");
    if (!category) return showAlert("Please select a book category.", "danger");
    if (!imageFile || !imageFile.type.startsWith("image/")) return showAlert("Please select a valid image file.", "danger");

// book data
    const bookData = {
    title,
    author,
    category,
    price,
    stock,
    description
    };

    //add to Firebase
    const result = await addBook(bookData, imageFile);

    if (result.success) {
    showAlert(`Book added successfully! ID: ${result.id}`, "success");
    addBookForm.reset();
    previewImg.src = "";
    previewImg.style.display = "none";
    } else {
    showAlert(`Error: ${result.error.message}`, "danger");
    }
});
});


//=============================================================
