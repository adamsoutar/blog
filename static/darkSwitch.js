/* global localStorage */

// Defaults to dark theme
let darkTheme = true

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

window.addEventListener('DOMContentLoaded', function (event) {
  const newTheme = localStorage.getItem('theme') || true
  renderTheme(newTheme)
})
