import CAEditor from './CAEditor'

$(document).ready(() => { // eslint-disable-line no-undef
  $('.button-collapse').sideNav() // eslint-disable-line no-undef
  $('select').material_select() // eslint-disable-line no-undef
})

const caEditor = new CAEditor()

const playButton = document.getElementById('playButton')
const nextStepButton = document.getElementById('nextStepButton')
const randomizeButton = document.getElementById('randomizeButton')
const clearButton = document.getElementById('clearButton')
const overlappingEdgeSwitch = document.getElementById('overlappingEdgeSwitch')
const cellCountInput = document.getElementById('cellCountInput')
const lineWidthInput = document.getElementById('lineWidthInput')
const survivesSelect = document.getElementById('survivesSelect')
const bornSelect = document.getElementById('bornSelect')
const randomProbabilityInput = document.getElementById('randomProbabilityInput')
const fpsInput = document.getElementById('fpsInput')

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

cellCountInput.value = caEditor.count
cellCountInput.addEventListener('input', () => {
  const number = parseInt(cellCountInput.value)
  if (!isNaN(number))
    caEditor.count = number
})

lineWidthInput.value = caEditor.lineWidth
lineWidthInput.addEventListener('input', () => {
  const number = parseInt(lineWidthInput.value)
  if (!isNaN(number))
    caEditor.lineWidth = number
})

for (let i = 0; i < caEditor.survives.length; i++)
  survivesSelect.options[caEditor.survives[i] + 1].selected = true
survivesSelect.onchange = () => {
  const options = []

  for (let i = 1; i < survivesSelect.options.length; i++)
    if (survivesSelect.options[i].selected) options.push(parseInt(survivesSelect.options[i].value))

  caEditor.survives = options
}

for (let i = 0; i < caEditor.born.length; i++)
  bornSelect.options[caEditor.born[i] + 1].selected = true
bornSelect.onchange = () => {
  const options = []

  for (let i = 1; i < bornSelect.options.length; i++)
    if (bornSelect.options[i].selected) options.push(parseInt(bornSelect.options[i].value))

  caEditor.born = options
}

randomProbabilityInput.value = caEditor.randomProbability
randomProbabilityInput.addEventListener('input', () => {
  const number = parseInt(randomProbabilityInput.value)
  if (!isNaN(number))
    caEditor.randomProbability = number
})

fpsInput.value = caEditor.fps
fpsInput.addEventListener('input', () => {
  const number = parseInt(fpsInput.value)
  if (!isNaN(number))
    caEditor.fps = number
})
