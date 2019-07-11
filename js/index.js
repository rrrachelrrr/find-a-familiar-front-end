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
const formDiv = document.querySelector('#form-div')


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
  return fetch(reviewsURL)
  .then(res => res.json())
  .then((reviewData) => filterReviews(familiarId, reviewData))
}

//event listeners
animalsList.addEventListener('click', animalClick)
familiarsList.addEventListener('click', familiarClick)
formDiv.addEventListener('submit', submitFormPost)
reviewsList.addEventListener('click', reviewClick)

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
  reviewsOnTheDom(filteredArray, familiarId)
  // console.log(familiarId)
}

function reviewClick(e){
  // console.log(e.target.className)
  if (e.target.className === "delete-btn black-box"){
    // debugger
    console.log("DANGER! DANGER! HIGH VOLTAGE!")
    // e.target.dataset.reviewId
    deleteReview(e.target)
  }
  else if (e.target.className === "like-btn black-box"){
    likeReview(e.target)
  }
  else if(e.target.className === "all-caps-btn black-box"){
    allCapsReview(e.target)
  }

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
    // console.log(e.target.id)
    getReviews(e.target.id)
  }
}

function allCapsReview(eventTarget){
  const allCapsId = eventTarget.dataset.allCapsId
  const capsComment = eventTarget.parentElement.querySelector(".review-text").innerText =
  eventTarget.parentElement.querySelector(".review-text").innerText.toUpperCase()
  console.log(capsComment)

  fetch(`http://localhost:3000/reviews/${allCapsId}`, {
    method: "PATCH",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      comment: capsComment
    })
  })

}

function likeReview(eventTarget){
  console.log(eventTarget.dataset.likeId)
  const likeId = eventTarget.dataset.likeId
  const likePTag = eventTarget.parentElement.querySelector("p")
  console.log(likePTag)

  let newLikeCount = parseInt(likePTag.dataset.likeCount)
  console.log(newLikeCount)
  newLikeCount ++
  console.log(newLikeCount)
  likePTag.dataset.LikeCount = newLikeCount
  likePTag.innerHTML = `Liked ${newLikeCount} times`

  fetch(`http://localhost:3000/reviews/${likeId}`, {
    method: "PATCH",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      likes: newLikeCount
    })
  })
  .then(resp=>resp.json())
  .then(oneFamiliarsReviews())
}


function deleteReview(eventTarget){
  // eventTarget.parentElement is the li
   const deleteId = eventTarget.dataset.reviewId
   // console.log(deleteId)
  fetch(`http://localhost:3000/reviews/${deleteId}`, {
    method: "DELETE"
  }).then(function(){
    eventTarget.parentElement.remove()
  })
}

function submitFormPost(e){
  e.preventDefault()
  const famId = parseInt(e.target.dataset.familiarId)
  const comment = e.target.comment.value
  console.log(comment)
  //
  fetch(`http://localhost:3000/reviews/`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      comment,
      familiar_id: famId

    })
  })
  .then(res => res.json())
  .then(addOneReview)

}


//slapping on the DOM
function reviewsOnTheDom(reviewsArray, familiarId){
  //add a review form to reviews; create submit form and append it to the formDiv
  reviewsList.innerHTML = ""
  // const reviewForm = document.createElement("form")
  formDiv.innerHTML = `
  <form class="add-review" data-familiar-id="${familiarId}">
  <h5>How helpful was this magical assistant?</h5>
  <input type="textbox" name="comment" value="" placeholder="✨💫✨" class="input-text" >
  <br>
  <input type="submit" name="submit" value="Review This Familiar ✨" class="submit black-box">
  </form>
  `
  // formDiv.append(reviewForm)
  //slap reviews on the DOM
  reviewsArray.forEach(review => {
    const li = document.createElement("li")
    li.className = "review-list-item"
    li.innerHTML = `<p class="review-text">${review.comment}</p>
    <p data-like-count="${review.likes}">Liked ${review.likes} times</p>
    <button class="like-btn black-box" data-like-id="${review.id}">Like Review 🌟</button>
    <button class="delete-btn black-box" data-review-id="${review.id}">Delete Review ☄️</button>
    <button class="all-caps-btn black-box" data-all-caps-id="${review.id}">ALL CAPS 💥📣</button>
    `
    reviewsList.append(li)
  })
}


function addOneReview(data){
  const li = document.createElement("li")
  li.className = "review-list-item"
  li.innerText = `${data.comment}`
  reviewsList.append(li)
}

function oneFamiliarsReviews(familiarId){


}

// familiars on the DOM
function familiarsOnTheDom(familiarArray){
  reviewsList.innerHTML = ""
  familiarsList.innerHTML = ""
  formDiv.innerHTML = ""
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
