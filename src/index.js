import CAEditor from './CAEditor'

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
  },
  {
    id: 'trajectorySizeInput',
    name: 'trajectorySize'
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
  const domElements = Array.from(document.getElementsByClassName(button.id))

  domElements.forEach(el => el.addEventListener('click', () => button.function(el)))
})

toggles.forEach((toggle) => {
  const domElements = Array.from(document.getElementsByClassName(toggle.id))

  domElements.forEach(el => {
    el.checked = caEditor[toggle.name]
    el.addEventListener('change', () => {
      caEditor[toggle.name] = !!el.checked
    })
  })
})

numbers.forEach((number) => {
  const domElements = Array.from(document.getElementsByClassName(number.id))

  domElements.forEach(el => {
    el.value = caEditor[number.name]
    el.addEventListener('input', () => {
      const value = parseInt(el.value)
      if (!isNaN(value))
        caEditor[number.name] = value
    })
  })
})

multiSelects.forEach((multiSelect) => {
  const domElements = Array.from(document.getElementsByClassName(multiSelect.id))

  domElements.forEach(el => {
    caEditor[multiSelect.name].forEach((number) => {
      el.options[number + 1].selected = true
    })

    el.onchange = () => {
      const options = []

      for (let i = 1; i < el.options.length; i++)
        if (el.options[i].selected) options.push(parseInt(el.options[i].value))

      caEditor[multiSelect.name] = options
    }
  })
})

colors.forEach((color) => {
  const domElements = Array.from(document.getElementsByClassName(color.id))

  domElements.forEach(el => {
    el.value = '#' + caEditor[color.name].toString(16)

    el.addEventListener('change', () => {
      caEditor[color.name] = parseInt('0x' + el.value.slice(1))
    })
  })
})
