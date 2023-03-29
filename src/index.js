const quoteList = document.querySelector("#quote-list")
const newQuoteForm = document.querySelector("#new-quote-form")

newQuoteForm.addEventListener("submit", (event) => {
  event.preventDefault()
  const newQuote = document.querySelector("#new-quote").value
  const newAuthor = document.querySelector("#author").value
  fetch("http://localhost:3000/quotes", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      quote: newQuote,
      author: newAuthor
    })
  })
    .then(r => r.json())
    .then(newQuoteObj => {
      renderSingleQuote(newQuoteObj)
    })

})

function renderSingleQuote(quote) {
  const newLi = document.createElement("li")
  newLi.className = "quote-card"

  let likesCount;
  if (quote.likes) {
    likesCount = quote.likes.length
  } else {
    likesCount = 0
  }

  newLi.innerHTML = `
  <blockquote id=${quote.id} class="blockquote">
    <p class="mb-0">${quote.quote}</p>
    <footer class="blockquote-footer">${quote.author}</footer>
    <br>
    <button class='btn-success'>Likes: <span>${likesCount}</span></button>
    <button class='btn-danger'>Delete</button>
  </blockquote>
  `
  const deleteBtn = newLi.querySelector(".btn-danger")
  const likeBtn = newLi.querySelector(".btn-success")

  likeBtn.addEventListener("click", () => {
    fetch("http://localhost:3000/likes", {
      method: "POST",
      headers: {
      },
      body: JSON.stringify({
        quoteId: quote.id
      })
    })
      .then(r => r.json())
      .then(() => {
        const likesSpan = newLi.querySelector("span")
        likesSpan.textContent = parseInt(likesSpan.textContent) + 1
      })
  })

  deleteBtn.addEventListener("click", (event) => {
    newLi.remove()
    fetch(`http://localhost:3000/quotes/${quote.id}`, {
      method: "DELETE"
    })
  })

  quoteList.append(newLi)
}

function renderAllQuotes(quoteArray) {
  quoteArray.forEach(quote => {
    renderSingleQuote(quote)
  })
}

fetch("http://localhost:3000/quotes?_embed=likes")
  .then(r => r.json())
  .then(quoteArray => renderAllQuotes(quoteArray))