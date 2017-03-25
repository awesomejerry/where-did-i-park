var localStorage = window.localStorage
var google = window.google
var position = localStorage.getItem('position')
var defaultCenter = { lat: 25.0439892, lng: 121.5212213 }
var photoSize = 1000
var map = null
var marker = null
var firstTime = true
var img = document.getElementById('photo')

function initMap () { // eslint-disable-line no-unused-vars
  map = new google.maps.Map(document.getElementById('map-section'), {
    center: position ? JSON.parse(position) : defaultCenter,
    zoom: 15
  })
  if (position) {
    setMarker(JSON.parse(position))
  }
}

function setMarker (position) {
  if (marker) {
    marker.setMap(null)
  }
  marker = new google.maps.Marker({
    position: position,
    animation: google.maps.Animation.DROP,
    title: 'I parked here!'
  })
  marker.setMap(map)
}

function upload () { // eslint-disable-line no-unused-vars
  document.getElementById('upload-input').click()
}

function handleUpload (input) { // eslint-disable-line no-unused-vars
  var file = input.files[0]
  var reader = new window.FileReader()

  reader.addEventListener('load', function () {
    img.src = reader.result
  }, false)

  if (file) {
    reader.readAsDataURL(file)
  }
  navigator.geolocation.getCurrentPosition(savePosition)
}

img.onload = function resize () {
  if (firstTime && localStorage.getItem('photo')) {
    img.src = localStorage.getItem('photo')
    firstTime = false
  }

  var canvas = document.createElement('canvas')
  var ctx = canvas.getContext('2d')

  canvas.width = photoSize
  canvas.height = photoSize * img.naturalHeight / img.naturalWidth
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

  var url = canvas.toDataURL('image/jpeg')
  localStorage.setItem('photo', url)
}

function savePosition (position) {
  var coords = { lat: position.coords.latitude, lng: position.coords.longitude }
  localStorage.setItem('position', JSON.stringify(coords))
  setMarker(coords)
  map.setCenter(coords)
}
