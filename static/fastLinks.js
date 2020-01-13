/*
 * fastLinks.js
 * Makes links seem faster
*/

const aS = document.getElementsByTagName('a')
for (const a of aS) {
  a.addEventListener('mousedown', (e) => {
    window.location.href = e.target.attributes.href.value
  })
}
