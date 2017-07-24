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

const presets = [
  {
    'name': 'Default',
    'cellColorInactive': 0xFFFFFF,
    'cellColorActive': 0x555555,
    'showGrid': true,
    'trajectorySize': 1,
    'survives': [2, 3],
    'born': [3],
    'count': 30
  },
  {
    'name': 'Glider',
    'cells': [
      [0, 2],
      [1, 0],
      [1, 2],
      [2, 1],
      [2, 2]
    ]
  },
  {
    'name': 'Lightweight spaceship',
    'cells': [
      [0, 0],
      [0, 2],
      [1, 3],
      [2, 3],
      [3, 0],
      [3, 3],
      [4, 1],
      [4, 2],
      [4, 3]
    ]
  },
  {
    'name': 'Tumbler',
    'cellColorInactive': 0xff6e42,
    'cellColorActive': 0x8bc34a,
    'showGrid': false,
    'trajectorySize': 5,
    'cells': [
      [0, 1],
      [1, 0],
      [1, 3],
      [2, 1],
      [2, 2],
      [2, 3],
      [2, 4],
      [3, 2],
      [3, 4],
      [5, 2],
      [5, 4],
      [6, 1],
      [6, 2],
      [6, 3],
      [6, 4],
      [7, 0],
      [7, 3],
      [8, 1]
    ]
  },
  {
    'name': 'Octagon',
    'cells': [
      [0, 3],
      [0, 4],
      [1, 2],
      [1, 5],
      [2, 1],
      [2, 6],
      [3, 0],
      [3, 7],
      [4, 0],
      [4, 7],
      [5, 1],
      [5, 6],
      [6, 2],
      [6, 5],
      [7, 3],
      [7, 4]
    ]
  },
  {
    'name': 'Chain',
    'cells': [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 4],
      [0, 5],
      [0, 6],
      [1, 0],
      [1, 6],
      [2, 0],
      [2, 1],
      [2, 2],
      [2, 4],
      [2, 5],
      [2, 6]
    ]
  },
  {
    'name': 'R-pentomino',
    'cells': [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, 2],
      [2, 0]
    ]
  },
  {
    'name': 'Labyrinth-system',
    'survives': [1, 2, 3, 4, 5],
    'born': [3]
  },
  {
    'name': 'Copy-system',
    'survives': [1, 3, 5, 7],
    'born': [1, 3, 5, 7],
    'showGrid': false,
    'count': 200,
    'cells': [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 2],
      [2, 1],
      [2, 2]
    ]
  }
]

const domPresets = Array.from(document.getElementsByClassName('presets'))

domPresets.forEach(el => {
  presets.forEach((obj) => {
    const div = document.createElement('div')
    div.classList.add('preset', 'waves-effect', 'waves-blue')
    div.innerText = obj.name
    div.addEventListener('click', () => {
      caEditor.setPreset(obj)
    })

    el.appendChild(div)
  })
})
