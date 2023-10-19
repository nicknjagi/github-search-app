// grab elements from the DOM
const userList = document.getElementById('user-list')
const reposList = document.getElementById('repos-list')
const searchForm = document.getElementById('github-form')
const searchInput = document.getElementById('search')
const searchBtn = document.getElementById('search-btn')
const searchRepoBtn = document.getElementById('search-repos')
const message = document.getElementById('message')

// keeps track of selected user
let selectedUser = ''
// keeps track of search query
let inputValue = ''

// listen for submit event on the form
searchForm.addEventListener('submit', (e)=>{
  e.preventDefault()
})

// listen for click event on search user button
searchBtn.addEventListener('click',()=>{
  // prevent users from submiting empty strings
  if (searchInput.value.trim() == '') {
    alert('Please enter a username to search')
    return
  }
  // call fetch user function
  const query = searchInput.value.trim()
  fetchUser(query)
  // clear the input
  // searchInput.value = ''
  // clear the repos list html
  reposList.innerHTML = ''
})

// listen for click event on view repo button 
// call displayRepos()
searchRepoBtn.addEventListener('click', ()=>{
  findRepo(searchInput.value)
})

// displays user profile/s
function displayUsers(arr){
  // create users list html
  const usersHtml = arr.map(user => {
    const {login, avatar_url, html_url} = user
    return `
      <li title="Click to view repos" onclick="fetchRepos('${login}')">
        <img src="${avatar_url}" alt="${login} profile pic">
        <div>
          <h3>${login}</h3>
          <a href="${html_url}" title="click to view profile" target="_blank">View profile</a>
        </div>
      </li>
    `
  })
  // add user list html to the DOM element
  userList.innerHTML = usersHtml.join('')
}

// displays selected user repos
function displayRepos(arr) {
  // create repos list html
  const reposHtml = arr.map(repo => {
    const {name,html_url, private} = repo
    return `
      <li>
          <div>
            <h2>${name}</h2>
            <p>${private ? 'Private' : 'Public'}</p>
          </div>
          <a href="${html_url}" target="_blank">${
      private ? '' : 'View Repo'
    }</a>
      </li>
    `
  })

  // display the repos on the DOM
  reposList.innerHTML = `<h3 class="title">Repositories:</h3>` + reposHtml.join('')
}

// makes a GET request for selected user repos
// then calls display repos with the recieved data as an argument
function fetchRepos(name){
  message.innerText = 'Loading...'
  selectedUser = name
  fetch(`https://api.github.com/users/${name}/repos`, {
    'Content-type': 'application/json',
    Accept: 'application/vnd.github.v3+json',
  })
    .then((res) => res.json())
    .then((data) => {
      displayRepos(data)
      message.innerHTML = `Showing @${name} repositiories`
    })
  }
  
  // finds repo that matches query string 
  function findRepo(str){
    message.innerText = 'Loading...'
    fetch(`https://api.github.com/search/repositories?q=${str}`, {
      'Content-type': 'application/json',
      Accept: 'application/vnd.github.v3+json'
    })
    .then((res) => res.json())
    .then((data) => {
      displayRepos(data.items)
      message.innerText = `Search results for: ${str}`
    })
  }
// makes a GET request for user/s information
// then calls displayUsers() with the recieved data as an argument
function fetchUser(user){
  message.innerText = 'Loading...'
  fetch(`http://api.github.com/search/users?q=${user}`, {
    'Content-type': 'application/json',
    Accept: 'application/vnd.github.v3+json',
  })
    .then((res) => res.json())
    .then((data) => {
      displayUsers(data.items)
      message.innerText = `Search results for: @${user}`
    })
}

