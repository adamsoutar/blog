/* global localStorage */

// Defaults to dark theme
let darkTheme = true
let transitions

function renderTheme (newTheme) {
  if (newTheme === darkTheme) return

  const themeCSS = document.getElementById('darkTheme')
  if (darkTheme) {
    // Dark theme to light theme
    themeCSS.setAttribute('href', '')
  } else {
    // Light theme to dark theme
    themeCSS.setAttribute('href', './darkTheme.css')
  }

  darkTheme = newTheme
  localStorage.setItem('theme', darkTheme)
}

function toggleTheme () {
  renderTheme(!darkTheme)
}

function disableTransitions () {
  transitions.setAttribute('href', '')
}
function enableTransitions () {
  transitions.setAttribute('href', './transitions.css')
}

window.addEventListener('DOMContentLoaded', function (event) {
  const saved = localStorage.getItem('theme')
  let newTheme = true
  if (saved === null) {
    newTheme = true
  } else if (saved === 'false') {
    newTheme = false
  }

  transitions = document.getElementById('transitions')

  disableTransitions()
  renderTheme(newTheme)
  setTimeout(enableTransitions, 100)
})
