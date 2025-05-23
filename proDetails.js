import { db } from './firebase.js';
import  { doc, getDoc, collection, query, where, getDocs, addDoc, deleteDoc} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";

const auth = getAuth();
let currentUserId = null;

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('bookId');

let currentBook = null;

async function loadBookDetails() {
  if (!productId) return;

  const productRef = doc(db, "books", productId);
  const productSnap = await getDoc(productRef);

  if (productSnap.exists()) {
    const data = productSnap.data();

    currentBook = data;

    document.querySelector("h2").innerText = data.title;
    document.querySelector("h5").innerText = `${data.price} EGP`;
    document.querySelectorAll("p")[0].innerHTML = `<strong>Category:</strong> ${data.category}`;
    document.querySelectorAll("p")[1].innerHTML = `<strong>Description:</strong> ${data.description}`;
    const authorParagraph = document.createElement("p");
    authorParagraph.innerHTML = `<strong>Author:</strong> ${data.author}`;
    document.querySelector(".book-details").insertBefore(authorParagraph, document.querySelector(".book-details").children[2]);
    loadRelatedBooks(data.category, productId);
    // document.querySelector("img").src = "book.jpg";
  } else {
    alert("Book not found!");
  }
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUserId = user.uid;
    console.log("User ID:", currentUserId);

    // Add to Cart
    document.getElementById("addtocart").addEventListener("click", async () => {
    if (!currentBook) return;

    await addDoc(collection(db, "cart"), {
        userId: currentUserId,
        title: currentBook.title,
        author: currentBook.author,
        category: currentBook.category,
        price: currentBook.price,
        addedAt: new Date()
    });
    // add cart to localstorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const exists = cart.some(item => item.title === currentBook.title && item.userId === currentUserId);

    if (!exists) {
        cart.push({
        ...currentBook,
        userId: currentUserId
        });

        localStorage.setItem("cart", JSON.stringify(cart));

        alert("Added successfully");
    } else {
        alert("The book already exist");
    }
    await showPopup(currentBook);
    });

    // Add to Wishlist

    const wishlistBtn = document.getElementById("wishlistBtn");
    const wishlistToast = document.getElementById("wishlistToast");

    wishlistBtn.addEventListener("click", async () => {

    if (!currentBook) return;
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    if (wishlistBtn.classList.contains("active")) {

    const wishlistRef = collection(db, "wishlist");
    const q = query(wishlistRef,
                    where("userId", "==", currentUserId),
                    where("title", "==", currentBook.title));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (docSnap) => {
      console.log("Deleting doc with ID:", docSnap.id);
      await deleteDoc(doc(db, "wishlist", docSnap.id));
    });

    //remove from localstorage
    wishlist = wishlist.filter(item => !(item.title === currentBook.title && item.userId === currentUserId));
    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    wishlistBtn.classList.remove("active");
    wishlistBtn.innerHTML = '<i class="fa-regular fa-heart"></i>';
    wishlistToast.innerText = "The book has been removed from wishlist."
    wishlistToast.style.display = "flex";

        setTimeout(() => {
            wishlistToast.style.display = "none";
        }, 3000);


  } else {

    await addDoc(collection(db, "wishlist"), {
        userId: currentUserId,
        title: currentBook.title,
        author: currentBook.author,
        category: currentBook.category,
        price: currentBook.price,
        addedAt: new Date()
    });

    //localstorage

  const exists = wishlist.some(item => item.title === currentBook.title && item.userId === currentUserId);

  if (!exists) {
    wishlist.push({
      ...currentBook,
      userId: currentUserId
    });

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
   }
    
        wishlistBtn.classList.add("active");
        wishlistBtn.innerHTML = '<i class="fa-solid fa-heart"></i>';

        document.querySelector(".heart-icon").style.display = "inline";
        wishlistToast.style.display = "flex";

        setTimeout(() => {
            wishlistToast.style.display = "none";
        }, 3000);
    }
    
    });
  } 
  else {
    console.log("User not logged in");
  }
});

async function loadRelatedBooks(category, currentId) {
  const booksRef = collection(db, "books");
  const q = query(booksRef, where("category", "==", category));
  const querySnapshot = await getDocs(q);

  const relatedBooksContainer = document.querySelector(".related-books");
  relatedBooksContainer.innerHTML = "";

  querySnapshot.forEach((docSnap) => {
    if (docSnap.id !== currentId) {
      const book = docSnap.data();
      const card = document.createElement("div");
      card.className = "card shadow-sm related-book-card"

      card.innerHTML = `<img alt="img">
                         <h5 class="card-title text-truncate mb-0">${book.title}</h5>
                         <h6> ${book.author}</h6>
                         <p>${book.price} EGP</p>`


      card.addEventListener("click", () => {
        window.location.href = `product.html?bookId=${docSnap.id}`;
      });

      relatedBooksContainer.appendChild(card);
    }
  });
}

loadBookDetails();



// Scroll functionality
document.getElementById("scrollLeft").addEventListener("click", () => {
  document.querySelector(".related-books-container").scrollBy({
    left: -200,
    behavior: "smooth",
  });
});

document.getElementById("scrollRight").addEventListener("click", () => {
  document.querySelector(".related-books-container").scrollBy({
    left: 200,
    behavior: "smooth",
  });
});

//calculate total price in cart
async function calculateTotalPrice() {
  const cartRef = collection(db, "cart");
  const q = query(cartRef, where("userId", "==", currentUserId));
  const cartSnapshot = await getDocs(q);  let total = 0;
  cartSnapshot.forEach(doc => {
    const data = doc.data();
    if (data.price) {
      total += Number(data.price);
    }
  });
  return total;
}

async function showPopup(book) {

  // document.getElementById("popupBookImage").src = book.imageUrl ; 
  document.getElementById("popupBookTitle").innerText = book.title;

  const totalPrice = await calculateTotalPrice();
  document.getElementById("popupTotalPrice").innerText = `Total Price in Cart: ${totalPrice} EGP`;

  document.getElementById("actionPopup").style.display = "flex";
}

document.getElementById("continueShopping").addEventListener("click", () => {
  document.getElementById("actionPopup").style.display = "none";
});

document.getElementById("goToCheckout").addEventListener("click", () => {
    console.log("clicked");
  window.location.href = "payment.html"; 
});

