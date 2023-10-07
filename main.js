const API_KEY = 'pub_30576db04f4d80bec8cd531ff85431bb1f9c5'

const $ = elem => document.querySelector(elem)

const icon = '<img src="./img/svg/bookmark-regular.svg">'
const iconFilled = '<img src="./img/svg/bookmark-solid.svg">'

// Utils
function formatRelativeDate (isoDateString) {
  const date = new Date(isoDateString)
  const now = new Date()

  const diffInMs = now - date
  const diffInHours = Math.round(diffInMs / (1000 * 60 * 60))

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month = months[date.getMonth()]
  const day = date.getDate()

  return `${month} ${day} (${diffInHours} hours ago)`
}

function toggleButtonIcon (button) {
  const currentIcon = button.innerHTML

  if (currentIcon === icon) {
    button.innerHTML = iconFilled
  } else {
    button.innerHTML = icon
  }
}

// Render functions
async function getArticles () {
  const response = await fetch(`https://newsdata.io/api/1/news?country=ve&category=technology&size=10&apikey=${API_KEY}`)
  const data = await response.json()
  return data
}

async function showArticles () {
  const articles = await getArticles()
  const articlesContainer = $('#news')

  articles.results.forEach(article => {
    const div = document.createElement('article')

    div.classList.add('news-card')

    div.innerHTML = `<div class="info">
                      <h3>${article.source_id}</h3>
                      <p class="date">${formatRelativeDate(article.pubDate)}</p>
                    </div>
                    <h2>${article.title}</h2>
                    <p class="description">${article.description.slice(0, 170) + '...'}</p>
                    <div class="buttons-container">
                      <a href="${article.link}" role="button">Leer más</a>
                      <button role="button" class="save-button">${icon}</button>
                    </div>
                    `

    articlesContainer.appendChild(div)

    const button = div.querySelector('.save-button')

    button.addEventListener('click', () => {
      toggleButtonIcon(button)
    })
  })
}

showArticles()
