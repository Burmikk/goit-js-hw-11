import axios from "axios";
import Notiflix from "notiflix";
import simpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const URL = "https://pixabay.com/api/"
const KEY = "33062942-48d2f969e86b1c2660c340e41"
const inputEl = document.querySelector("input")
const form = document.querySelector("form")
const galleryEl = document.querySelector(".gallery")
const loadMoreEl = document.querySelector(".load-more")
const btnTextEl = document.querySelector(".text")
const spinerEl = document.querySelector(".spinner-border")
const perPage = 40
let page = 1
let value = ""
let gallery
let inputValue
let imageCounter

form.addEventListener("submit", onSearch) 

async function onSearch(event) {
    event.preventDefault()
    inputValue = inputEl.value
    page = 1

        if (inputEl.value.trim() === "") {
            Notiflix.Notify.failure("Type something to find images")
        }
        else {
            const fetch = await fetchData().then(data => {
        if (data.data.hits.length === 0) {
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
        } else if (value !== inputEl.value) {
            imageCounter = data.data.totalHits - perPage
            showBtn()
            console.log(data)
           Notiflix.Notify.success(`Hooray! We found ${data.data.totalHits} images.`) 
            value = inputEl.value
            galleryEl.innerHTML = ""
            onCreateMakrup(data.data.hits)
            gallery = new SimpleLightbox('.gallery a');
            disableBtn()
        } 
            })
        }
}

async function fetchData() {
        const response = axios.get(`${URL}?key=${KEY}&q=${inputValue}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`)
        // const data = await response.json()
    
        return response
        
}


loadMoreEl.addEventListener('click', onLoadMore)

async function onLoadMore() {
    imageCounter -= perPage
    if (imageCounter <= 0) {
        loadMoreEl.classList.add("hidden")
    }
    enableBtn()
    page+=1
    const moreFetch = await fetchData().then(data => {
        onCreateMakrup(data.data.hits)
        gallery.refresh()
    })

    const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
   disableBtn() 
    
}


function onCreateMakrup(images) {
    const markup = images.map(({ largeImageURL, webformatURL, tags,likes,views,comments,downloads}) => {
        return `<div class="photo-card">
  <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" width="340" height="250"/></a>
  <div class="info">
  <ul class="image-list">
        <li><p class="info-item">
      <b>Likes</b>
       <p class="info">${likes}</p>
    </p></li>
        <li> <p class="info-item">
      <b>Views</b>
      <p class="info">${views}</p>
    </p></li>
        <li><p class="info-item">
      <b>Comments</b>
      <p class="info">${comments}</p>
    </p></li>
        <li><p class="info-item">
      <b>Downloads</b>
      <p class="info">${downloads}</p>
    </p></li>
      </ul>
    
   
    
    
  </div>
</div>`
    }).join('')
galleryEl.insertAdjacentHTML('beforeend', markup)

}

async function showBtn() {
    loadMoreEl.classList.remove("hidden")
}
function enableBtn() {
    btnTextEl.textContent = "Loading..."
    spinerEl.classList.remove("hidden")
}
function disableBtn() {
    btnTextEl.textContent = "Load more"
    spinerEl.classList.add("hidden")
}
