import CAEditor from './CAEditor'

$(document).ready(() => { // eslint-disable-line no-undef
  $('.button-collapse').sideNav() // eslint-disable-line no-undef
  $('select').material_select() // eslint-disable-line no-undef
})

const caEditor = new CAEditor()

const buttons = [
  {
    id: 'playButton',
    function: (domElement) => {
      if (caEditor.isPlaying) {
        domElement.firstChild.innerHTML = 'play_arrow'
        caEditor.pause()
      }
      else {
        domElement.firstChild.innerHTML = 'pause'
        caEditor.play()
      }
    }
  },
  {
    id: 'nextStepButton',
    function: () => caEditor.nextStep()
  },
  {
    id: 'randomizeButton',
    function: () => caEditor.randomizeCells()
  },
  {
    id: 'clearButton',
    function: (domElement) => {
      if (caEditor.isPlaying) {
        domElement.parentElement.firstElementChild.firstChild.innerHTML = 'play_arrow'
        caEditor.pause()
      }
      caEditor.clear()
    }
  }]

const toggles = [
  {
    id: 'overlappingEdgeSwitch',
    name: 'overlappingEdge'
  },
  {
    id: 'gridSwitch',
    name: 'showGrid'
  }]

const numbers = [
  {
    id: 'cellCountInput',
    name: 'count'
  },
  {
    id: 'randomProbabilityInput',
    name: 'randomProbability'
  },
  {
    id: 'fpsInput',
    name: 'fps'
  }]

const multiSelects = [
  {
    id: 'survivesSelect',
    name: 'survives'
  },
  {
    id: 'bornSelect',
    name: 'born'
  }]

const colors = [
  {
    id: 'cellColorActiveInput',
    name: 'cellColorActive'
  },
  {
    id: 'cellColorInactiveInput',
    name: 'cellColorInactive'
  }
]

buttons.forEach((button) => {
  const domElement = document.getElementById(button.id)
  domElement.addEventListener('click', () => button.function(domElement))
})

toggles.forEach((toggle) => {
  const domElement = document.getElementById(toggle.id)
  domElement.checked = caEditor[toggle.name]
  domElement.addEventListener('change', () => {
    caEditor[toggle.name] = !!domElement.checked
  })
})

numbers.forEach((number) => {
  const domElement = document.getElementById(number.id)
  domElement.value = caEditor[number.name]
  domElement.addEventListener('input', () => {
    const value = parseInt(domElement.value)
    if (!isNaN(value))
      caEditor[number.name] = value
  })
})

multiSelects.forEach((multiSelect) => {
  const domElement = document.getElementById(multiSelect.id)

  caEditor[multiSelect.name].forEach((number) => {
    domElement.options[number + 1].selected = true
  })

  domElement.onchange = () => {
    const options = []

    for (let i = 1; i < domElement.options.length; i++)
      if (domElement.options[i].selected) options.push(parseInt(domElement.options[i].value))

    caEditor[multiSelect.name] = options
  }
})

colors.forEach((color) => {
  const domElement = document.getElementById(color.id)
  domElement.value = '#' + caEditor[color.name].toString(16)

  domElement.addEventListener('change', () => {
    caEditor[color.name] = parseInt('0x' + domElement.value.slice(1))
  })
})
