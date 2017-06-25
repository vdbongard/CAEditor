import CAEditor from './CAEditor'
import $ from 'jquery'

const caEditor = new CAEditor()

const playButton = document.getElementById('playButton')
const nextStepButton = document.getElementById('nextStepButton')
const randomizeButton = document.getElementById('randomizeButton')
const clearButton = document.getElementById('clearButton')
const overlappingEdgeSwitch = document.getElementById('overlappingEdgeSwitch')

playButton.addEventListener('click', () => {
  if (caEditor.isPlaying) {
    playButton.firstChild.innerHTML = 'play_arrow'
    caEditor.pause()
  }
  else {
    playButton.firstChild.innerHTML = 'pause'
    caEditor.play()
  }
})

nextStepButton.addEventListener('click', () => {
  caEditor.nextStep()
})

randomizeButton.addEventListener('click', () => {
  caEditor.randomizeCells()
})

clearButton.addEventListener('click', () => {
  if (caEditor.isPlaying) {
    playButton.firstChild.innerHTML = 'play_arrow'
    caEditor.pause()
  }
  caEditor.clear()
})

overlappingEdgeSwitch.checked = caEditor.overlappingEdge
overlappingEdgeSwitch.addEventListener('change', () => {
  caEditor.overlappingEdge = !!overlappingEdgeSwitch.checked
})

$(document).ready(() => {
  $('.button-collapse').sideNav()
})
