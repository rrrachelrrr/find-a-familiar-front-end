document.addEventListener("DOMContentLoaded", function(){
  getAnimals()
  // getFamiliars()
})

// const
const animalsURL = "http://localhost:3000/animals"
const familiarsURL = "http://localhost:3000/familiars"
const reviewsURL = "http://localhost:3000/reviews"
const animalsList = document.querySelector("#animals-list")
const familiarsList = document.querySelector("#familiars-list")
const reviewsList = document.querySelector("#reviews-list")


//fetches
function getAnimals(){
  fetch(animalsURL)
  .then(res => res.json())
  .then(animalsOnTheDOM)
}

// fetch familiars. use the id passed in to filter only the animal wanted (cat, owl, dog, rat). Use anonymous function so we can pass both ID and data into filterAnimals
function getFamiliars(animalId){
  return fetch(familiarsURL)
  .then(res => res.json())
  .then((familiarData) => filterAnimals(animalId, familiarData))
}

function getReviews(familiarId){
  fetch(reviewsURL)
  .then(res => res.json())
  .then(reviewData => filterReviews(familiarId, reviewData))

}

//event listeners
animalsList.addEventListener('click', animalClick)
familiarsList.addEventListener('click', familiarClick)

//functions
//animalId is e.target.id.  IS STRING
function filterAnimals(animalId, familiarData){
  const filteredArray = familiarData.filter(familiar => {
    return familiar.animal_id === parseInt(animalId)
  })
  familiarsOnTheDom(filteredArray)
  // console.log(filteredArray)
}

function filterReviews(familiarId, reviewData){
  const filteredArray = reviewData.filter(review => {
    return review.familiar_id === parseInt(familiarId)
  })
  reviewsOnTheDom(filteredArray)
  // console.log(familiarId)
}

// pass the animal ID into the fetch request
function animalClick(e){
  if (e.target.className === "animal"){
    getFamiliars(e.target.id)
  }
}

// pass familiar ID into the fetch request
// when user clicks on a familiar, they should be able to ENTER A REVIEW as well as read existing reviews
function familiarClick(e){
  if (e.target.className === "familiar-face"){
    console.log(e.target.id)
    getReviews(e.target.id)
  }
}

//slapping on the DOM
function reviewsOnTheDom(reviewsArray){
  reviewsArray.forEach(review => {
    const li = document.createElement("li")
    li.className = "review-list-item"
    li.innerText = `${review.comment}`
  })

}

function familiarsOnTheDom(familiarArray){
  familiarArray.forEach(familiar => {
    console.log(familiar.name)
    const li = document.createElement("li")
    li.className = "familiar-list-item"
    li.innerHTML = `
    <h5>${familiar.name}</h5>
    <img src=${familiar.img_url} class = "familiar-face" id=${familiar.id}><br>
    Magical Ability: ${familiar.magical_ability}<br>
    Obedience: ${familiar.obedience}
    `
    familiarsList.append(li)

  })
}

function animalsOnTheDOM(animals){
  animals.forEach(animal => {
    const li = document.createElement("li")
    li.className = "animal-menu-item"
    // <h2>${animal.species}</h2>
    li.innerHTML += `
    <img src=${animal.img_url} class="animal" id=${animal.id} >
    `
    animalsList.append(li)
  })
}
