const API_KEY = 'pub_30576db04f4d80bec8cd531ff85431bb1f9c5'

const $ = elem => document.querySelector(elem)

let articlesData = sessionStorage.getItem('articles')
const savedArticles = JSON.parse(localStorage.getItem('savedArticles')) || []

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
  if (!articlesData) {
    const response = await fetch(`https://newsdata.io/api/1/news?country=ve&category=technology&size=10&apikey=${API_KEY}`)
    articlesData = await response.json()
    localStorage.setItem('articles', JSON.stringify(articlesData))
  }
  return articlesData
}

async function showArticles () {
  const articles = await getArticles()
  const articlesContainer = $('#news')
  articlesContainer.innerHTML = ''

  articles.results.forEach(article => {
    const div = document.createElement('article')
    const isSaved = savedArticles.find(a => a.title === article.title)

    let currentIcon = icon
    if (isSaved) {
      currentIcon = iconFilled
    }

    div.classList.add('news-card')

    div.innerHTML = `<div class="info">
                      <h3>${article.source_id}</h3>
                      <p class="date">${formatRelativeDate(article.pubDate)}</p>
                    </div>
                    <h2>${article.title}</h2>
                    <p class="description">${article.description.slice(0, 170) + '...'}</p>
                    <div class="buttons-container">
                      <a target="_blank" href="${article.link}" role="button">Leer más</a>
                      <button role="button" class="save-button button">${currentIcon}</button>
                    </div>
                    `

    articlesContainer.appendChild(div)

    const button = div.querySelector('.save-button')

    button.addEventListener('click', () => {
      toggleButtonIcon(button)
    })
  })

  handleSaveButton()
}

function getArticleData (button) {
  const article = button.closest('article')
  return {
    source: article.querySelector('h3').textContent,
    title: article.querySelector('h2').textContent,
    description: article.querySelector('.description').textContent,
    link: article.querySelector('a').href
  }
}

function handleSaveButton () {
  const saveButtons = document.querySelectorAll('.save-button')

  saveButtons.forEach(button => {
    button.addEventListener('click', () => {
      const articleData = getArticleData(button)

      const index = savedArticles.findIndex(a => a.title === articleData.title)

      if (index > -1) {
        savedArticles.splice(index, 1)
      } else {
        savedArticles.push(articleData)
      }

      const savedArticlesJSON = JSON.stringify(savedArticles)

      localStorage.setItem('savedArticles', savedArticlesJSON)
    })
  })
}

// Saved section
function handleSavedSectionButton () {
  const savedSectionButton = $('#saved-button')
  const savedSectionBackButton = $('#back-button')
  const savedSection = $('#saved-section')

  savedSectionButton.addEventListener('click', () => {
    savedSection.classList.add('saved-active')
    addSavedArticles()
  })

  savedSectionBackButton.addEventListener('click', () => {
    savedSection.classList.remove('saved-active')

    showArticles()
  })
}

function addSavedArticles () {
  let articles = localStorage.getItem('savedArticles')

  const mainSection = $('#saved-news')
  mainSection.innerHTML = ''

  if (articles) {
    articles = JSON.parse(articles)
    articles.forEach(article => {
      const div = document.createElement('article')

      div.classList.add('news-card')

      div.innerHTML = `<div class="info">
                        <h3>${article.source}</h3>
                      </div>
                      <h2>${article.title}</h2>
                      <p class="description">${article.description}</p>
                      <div class="buttons-container">
                        <a target="_blank" href="${article.link}" role="button">Leer más</a>
                        <button role="button" class="save-button button">${iconFilled}</button>
                      </div>
                      `

      mainSection.appendChild(div)

      const button = div.querySelector('.save-button')

      button.addEventListener('click', () => {
        const article = button.closest('article')
        const title = article.querySelector('h2').textContent

        const index = savedArticles.findIndex(a => a.title === title)
        savedArticles.splice(index, 1)

        localStorage.setItem('savedArticles', JSON.stringify(savedArticles))
        article.remove()
      })
    })
  }
}

showArticles()
handleSavedSectionButton()
