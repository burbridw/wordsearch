const alphabetUpper = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
const alphabetLower = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]
const gridContainer = document.querySelector(".wordsearch-grid")
const answerDisplay = document.querySelector(".answer-grid")
const gameContainer = document.querySelector(".game-container")

const setupWindow = document.querySelector(".setup-window")
const setupFirst = document.querySelector(".setup-first")
const setupPreset = document.querySelector(".setup-preset")
const setupRandom = document.querySelector(".setup-random")
const presetSelect = document.querySelector(".preset-game")
const randomSelect = document.querySelector(".random-game")

const difficultyEasy = document.querySelector(".difficulty-easy")
const difficultyMedium = document.querySelector(".difficulty-medium")
const difficultyHard = document.querySelector(".difficulty-hard")

const setupBack = document.querySelector(".setup-back-button")
const setupNext = document.querySelector(".setup-next-button")

const gameBackButton = document.querySelector(".wordsearch-back")
const gameResetButton = document.querySelector(".wordsearch-reset")
const gameCaseButton = document.querySelector(".case-button")

let gridLayers
let gridBoxes
let gridWidth
let gridDepth
let abort
let imageSelected = false

let inSetupFirst = true
let inSetupPreset = false
let inSetupRandom = false
let inGame = false
let finished = false
let setupPresetSelect = false
let setupRandomSelect = false
let difficulty
let difficultySet = false
let topicSet = false
let presetNumberSet = false
let presetNumber
let presetTopic
let stop = false
let word
let testNumber
let gameType
let gameCase = "lower"

let wordCounter = 0

let splitWordsArr = []
let answerArr = []
let sizeCheckArr = []
let selection = []
let randomizedArr = []
let wordListDeploy = []
let answersList = {}
let selectedBoxArr = []

let dataSet = {}


setupNext.addEventListener("click",()=>{
    if ( inSetupFirst ) {
        if ( setupPresetSelect && difficultySet) {
            setupPreset.classList.remove("behind")
            setupFirst.classList.add("behind")
            inSetupFirst = false
            inSetupPreset = true
            switch(difficulty) {
                case "easy": {
                    showEasyPresets()
                    break
                }
                case "medium": {
                    showMediumPresets()
                    break
                }
                case "hard": {
                    showHardPresets()
                }
            }
        } else if ( setupRandomSelect && difficultySet) {
            setupRandom.classList.remove("behind")
            setupFirst.classList.add("behind")
            inSetupFirst = false
            inSetupRandom = true
            switch(difficulty) {
                case "easy": {
                    showEasyPresets()
                    break
                }
                case "medium": {
                    showMediumPresets()
                    break
                }
                case "hard": {
                    showHardPresets()
                }
            }
        }
    } else if ( inSetupRandom && topicSet ) {
        setupPreset.classList.add("behind")
        setupRandom.classList.add("behind")
        setupWindow.classList.add("behind")
        inSetupRandom = false
        inGame = true
        gameType = "random"
        beginGameRandom()
    } else if ( inSetupPreset && topicSet && presetNumberSet ) {
        setupRandom.classList.add("behind")
        setupPreset.classList.add("behind")
        setupWindow.classList.add("behind")
        inSetupPreset = false
        inGame = true
        gameType = "preset"
        beginGamePreset(allPresets[presetTopic][difficulty][presetNumber])
    }
})

function beginGamePreset(obj) {
    gridWidth = widths[difficulty]
    gridDepth = depths[difficulty]
    gameContainer.classList.remove("behind")
    answerDisplay.classList.add(difficulty)
    document.querySelector(".wordsearch-back").classList.remove("behind")
    answersList = obj
    generateGrid()
    gridBoxes = document.querySelectorAll(".grid-box")
    let presetWordsList = Object.keys(obj)
    let presetIndexList = Object.values(obj)
    presetWordsList.forEach( (word)=>{
        let splitPresetWord = word.replaceAll(" ","").toUpperCase().split("")
        let presetIndex = obj[word]
        for ( let i = 0; i < splitPresetWord.length; i++ ) {
            switch(gameCase) {
                case "upper":
                    gridBoxes[presetIndex[i]].children[0].textContent = splitPresetWord[i]
                    break
                case "lower":
                    gridBoxes[presetIndex[i]].children[0].textContent = splitPresetWord[i].toLowerCase()
            }
            gridBoxes[presetIndex[i]].classList.add("filled")
        }
        let finalWordUpper = word.toUpperCase()
        let wordImage = getKey(allObj,word)
        switch(gameCase) {
            case "lower":
                answerDisplay.innerHTML += `<div class="answer-image-box"><img src="${wordImage}"><div class="answer-image-text"><span>${word}</span></div>`
                break
            case "upper":
                answerDisplay.innerHTML += `<div class="answer-image-box"><img src="${wordImage}"><div class="answer-image-text"><span>${finalWordUpper}</span></div>`
        }
        
    })
    gridBoxes.forEach( (box) =>{
        box.addEventListener("click",()=>{
            if ( !box.classList.contains("answer-finished") && !finished ) {
                if ( !box.classList.contains("selected") ) {
                    box.classList.add("selected")
                    selectedBoxArr.push(box)
                    checkAnswer(answerArr)
                } else {
                    box.classList.remove("selected")
                    selectedBoxArr.splice(selectedBoxArr.indexOf(box),1)
                    console.log(selectedBoxArr)
                }
            }
        })
        box.addEventListener("touchmove",()=>{
            let touchTarget = document.elementFromPoint(touchX,touchY)
            if ( touchTarget.classList.contains("grid-box") ) {
                if ( !touchTarget.classList.contains("answer-finished") && !finished) {
                    touchTarget.classList.add("selected")
                    if ( !selectedBoxArr.includes(touchTarget) ) {
                        selectedBoxArr.push(touchTarget)
                    }
                    checkAnswer(answerArr)
                }
            } else if ( touchTarget.parentElement.classList.contains("grid-box") ) {
                if ( !touchTarget.parentElement.classList.contains("answer-finished") && !finished) {
                    touchTarget.parentElement.classList.add("selected")
                    if ( !selectedBoxArr.includes(touchTarget.parentElement) ) {
                        selectedBoxArr.push(touchTarget.parentElement)
                    }
                    checkAnswer(answerArr)
                }
            }
        })
        if ( !box.classList.contains("filled") ) {
            switch(gameCase) {
                case "lower":
                    box.children[0].textContent = alphabetLower[ Math.floor( Math.random()*26 ) ]
                    break
                case "upper":
                    box.children[0].textContent = alphabetUpper[ Math.floor( Math.random()*26 ) ]
            }
        }
    })
    let allAnswerImages = document.querySelectorAll(".answer-image-box")
    allAnswerImages.forEach( (image)=>{
        image.addEventListener("click",()=>{
            if ( !image.classList.contains("answer-finished") ) {
                if ( imageSelected && !image.classList.contains("selected-image") ) {
                    document.querySelector(".selected-image").classList.remove("selected-image")
                    document.querySelectorAll(".answer").forEach( (answer) =>{
                        answer.classList.remove("answer")
                    })
                }
                if ( !image.classList.contains("selected-image") ) {
                    image.classList.add("selected-image")
                    imageSelected = true
                    let targetImage = image.children[0].getAttribute("src")
                    let targetName = allObj[targetImage]
                    answerArr = answersList[targetName]
                    markAnswer(answerArr)
                    checkAnswer(answerArr)
                } else {
                    image.classList.remove("selected-image")
                    imageSelected = false
                    let allAnswerImages = document.querySelectorAll(".answer")
                    allAnswerImages.forEach( (answer) =>{
                        answer.classList.remove("answer")
                    })
                }
            }
        })
    })
}

function beginGameRandom() {
    gameContainer.classList.remove("behind")
    answerDisplay.classList.add(difficulty)
    gridWidth = widths[difficulty]
    gridDepth = depths[difficulty]
    sizeCheckArr = selection.filter( (word) => word.length <= (gridWidth*0.8) )
    randomizedArr = sizeCheckArr.slice(0).sort( ()=> { return 0.5 - Math.random() } )
    wordListDeploy = randomizedArr.slice(0,levels[difficulty]).sort((a,b)=>{ return b.length - a.length})
    generateGrid()
    populateGrid()
}
let remake = false

gameResetButton.addEventListener("click",()=>{
    if ( gameType === "random" ) {
        wordCounter = 0
        answerDisplay.innerHTML = ""
        randomizedArr = sizeCheckArr.slice(0).sort( ()=> { return 0.5 - Math.random() } )
        wordListDeploy = randomizedArr.slice(0,levels[difficulty]).sort((a,b)=>{ return b.length - a.length})
        generateGrid()
        populateGrid()
        finished = false
    } else if ( gameType=== "preset") {
        gridContainer.innerHTML = ""
        answerDisplay.innerHTML = ""
        beginGamePreset(allPresets[presetTopic][difficulty][presetNumber])
    }
})

gameBackButton.addEventListener("click",()=>{
    if ( inGame ) {
        gameContainer.classList.add("behind")
        gridContainer.className = "wordsearch-grid"
        answerDisplay.className = "answer-grid"
        inGame = false
        setupWindow.classList.remove("behind")
        setupFirst.classList.remove("behind")
        inSetupFirst = true
        selection = []
        wordCounter = 0
        switch(gameType) {
            case "preset": 
                topicSet = false
                presetNumberSet = false
                document.querySelector(".set-topic").classList.remove("set-topic")
                document.querySelector(".set-preset").classList.remove("set-preset")
                document.querySelectorAll(".topic-button").forEach( (topic) =>{
                    topic.classList.add("behind")
                })
                gridContainer.innerHTML = ""
                answerDisplay.innerHTML = ""
                break
            case "random":
                gridContainer.innerHTML = ""
                answerDisplay.innerHTML = ""
                document.querySelectorAll(".topic-button").forEach( (topic) =>{
                    topic.classList.add("behind")
                })
                topicSet = false
                document.querySelector(".set-topic").classList.remove("set-topic")
                break
        }

    }
})
setupBack.addEventListener("click",()=>{
    if ( inSetupPreset ) {
        setupPreset.classList.add("behind")
        setupFirst.classList.remove("behind")
        inSetupFirst = true
        inSetupPreset = false
        document.querySelectorAll(".topic-button").forEach( (topic) =>{
            topic.classList.add("behind")
        })
    } else if ( inSetupRandom ) {
        setupRandom.classList.add("behind")
        setupFirst.classList.remove("behind")
        inSetupFirst = true
        inSetupRandom = false
        document.querySelectorAll(".topic-button").forEach( (topic) =>{
            topic.classList.add("behind")
        })
    }
})

gameCaseButton.addEventListener("click",()=>{
    switch(gameCase) {
        case "lower":
            gameCase = "upper"
            gameCaseButton.children[0].textContent = gameCaseButton.children[0].textContent.toUpperCase()
            if ( inGame ) {
                gridBoxes = document.querySelectorAll(".grid-box")
                gridBoxes.forEach( (box)=>{
                    box.children[0].textContent = box.children[0].textContent.toUpperCase()
                })
                let answerDisplayText = document.querySelectorAll(".answer-image-text")
                answerDisplayText.forEach( (text)=>{
                    text.children[0].textContent = text.children[0].textContent.toUpperCase()
                })
            }
            break
        case "upper":
            gameCase = "lower"
            gameCaseButton.children[0].textContent = gameCaseButton.children[0].textContent.toLowerCase()
            if ( inGame ) {
                gridBoxes = document.querySelectorAll(".grid-box")
                gridBoxes.forEach( (box)=>{
                    box.children[0].textContent = box.children[0].textContent.toLowerCase()
                })
                let answerDisplayText = document.querySelectorAll(".answer-image-text")
                answerDisplayText.forEach( (text)=>{
                    text.children[0].textContent = text.children[0].textContent.toLowerCase()
                })
            }
    }
})

presetSelect.addEventListener("click",()=>{
    if ( setupRandomSelect ) {
        setupRandomSelect = false
        randomSelect.classList.remove("set")
        setupPresetSelect = true
        presetSelect.classList.add("set")
    } else {
        setupPresetSelect = true
        presetSelect.classList.add("set")
    }
})
randomSelect.addEventListener("click",()=>{
    if ( setupPresetSelect ) {
        setupPresetSelect = false
        presetSelect.classList.remove("set")
        setupRandomSelect = true
        randomSelect.classList.add("set")
    } else {
        setupRandomSelect = true
        randomSelect.classList.add("set")
    }
})

difficultyEasy.addEventListener("click",()=>{
    if ( !difficultySet ) {
        difficultySet = true
        difficulty = "easy"
        difficultyEasy.classList.add("set-difficulty")
    } else if ( difficultySet ) {
        document.querySelector(".set-difficulty").classList.remove("set-difficulty")
        difficulty = "easy"
        difficultyEasy.classList.add("set-difficulty")
    }
})
difficultyMedium.addEventListener("click",()=>{
    if ( !difficultySet ) {
        difficultySet = true
        difficulty = "medium"
        difficultyMedium.classList.add("set-difficulty")
    } else if ( difficultySet ) {
        document.querySelector(".set-difficulty").classList.remove("set-difficulty")
        difficulty = "medium"
        difficultyMedium.classList.add("set-difficulty")
    }
})
difficultyHard.addEventListener("click",()=>{
    if ( !difficultySet ) {
        difficultySet = true
        difficulty = "hard"
        difficultyHard.classList.add("set-difficulty")
    } else if ( difficultySet ) {
        document.querySelector(".set-difficulty").classList.remove("set-difficulty")
        difficulty = "hard"
        difficultyHard.classList.add("set-difficulty")
    }
})

function showEasyPresets() {
    document.querySelectorAll(".easy-topic").forEach( (topic) =>{
        topic.classList.remove("behind")
    })
}
function showMediumPresets() {
    document.querySelectorAll(".medium-topic").forEach( (topic) =>{
        topic.classList.remove("behind")
    })
}
function showHardPresets() {
    document.querySelectorAll(".hard-topic").forEach( (topic) =>{
        topic.classList.remove("behind")
    })
}

function getKey(obj, value) {
    return Object.keys(obj).find(key => obj[key] === value)
}

const allTopicButtons = document.querySelectorAll(".topic-button")
allTopicButtons.forEach( (button)=>{
    button.addEventListener("click",()=>{
        if ( !topicSet ) {
            selection = []
            let imageArr = selectObj[reference[button.getAttribute("id")]]
            imageArr.forEach( (image) =>{
                selection.push(allObj[image])
            })
            button.classList.add("set-topic")
            topicSet = true
        } else if ( topicSet ) {
            selection = []
            document.querySelector(".set-topic").classList.remove("set-topic") 
            let imageArr = selectObj[reference[button.getAttribute("id")]]
            imageArr.forEach( (image) =>{
                selection.push(allObj[image])
            })
            button.classList.add("set-topic")
        }
    })
})

const allPresetTopicButtons = document.querySelectorAll(".preset-topic-button")
allPresetTopicButtons.forEach( (topic) =>{
    topic.addEventListener("click",()=> {
        presetTopic = topic.getAttribute("id")
    })
})


const allPresetNumberButtons = document.querySelectorAll(".preset-number")
allPresetNumberButtons.forEach( (preset) =>{
    preset.addEventListener("click",()=>{
        if ( !presetNumberSet ) {
            presetNumber = preset.getAttribute("id")
            preset.classList.add("set-preset")
            presetNumberSet = true
        } else if ( presetNumberSet ) {
            document.querySelector(".set-preset").classList.remove("set-preset")
            presetNumber = preset.getAttribute("id")
            preset.classList.add("set-preset")
        }
    })
})

function generateGrid() {
    gridContainer.innerHTML = ""
    gridContainer.classList.add(difficulty)
    for (let i = 0; i < gridWidth*gridDepth; i++ ) {
        gridContainer.innerHTML += `
        <div class="grid-box"><span>${i}</span><?div>
        `
    }
    finished = false
}


let mouseDown = false
window.addEventListener("mousedown",(e)=>{
    mouseDown = true
    let target = document.elementFromPoint(e.x,e.y)
    // if ( target.classList.contains("grid-box") ) {
    //     target.classList.add("selected")
    // } else if ( target.parentElement.classList.contains("grid-box") ) {
    //     target.parentElement.classList.add("selected")
    // }
})
window.addEventListener("mousemove",(e)=> {
    e.preventDefault()
    let moveTarget = document.elementFromPoint(e.x,e.y)
    if ( mouseDown && !finished) {
        if ( moveTarget.classList.contains("grid-box") && !moveTarget.classList.contains("answer-finished") ) {
            moveTarget.classList.add("selected")
            if ( !selectedBoxArr.includes(moveTarget)) {
                selectedBoxArr.push(moveTarget)
            }
            checkAnswer(answerArr)
        } else if ( moveTarget.parentElement.classList.contains("grid-box") && !moveTarget.parentElement.classList.contains("answer-finished") ) {
            moveTarget.parentElement.classList.add("grid-box")
            if ( !selectedBoxArr.includes(moveTarget.parentElement) ) {
                selectedBoxArr.push(moveTarget.parentElement)
            }
        }
    }
})
window.addEventListener("mouseup",(e)=>{
    mouseDown = false
})
window.addEventListener("touchmove",getTouchPosition)
let touchX = 0
let touchY = 0
function getTouchPosition(event) {
    let touch = event.touches[0]
    touchX = Math.floor(touch.pageX)
    touchY = Math.floor(touch.pageY)
}


function checkAnswer(answerArr) {
    gridBoxes = document.querySelectorAll(".grid-box")
    if ( selectedBoxArr.length > gridWidth ) {
        selectedBoxArr[0].classList.remove("selected")
        selectedBoxArr.shift()
    }
    let count = 0
    let countFinish = answerArr.length
    for ( let i = 0; i < answerArr.length; i++ ) {
        if ( gridBoxes[answerArr[i]].classList.contains("selected") || gridBoxes[answerArr[i]].classList.contains("answer-finished")) {
            count++
        }
    }
    if ( count === countFinish && count > 1 && imageSelected ) {
        answerArr.forEach( (box) => {
            gridBoxes[box].classList.add("answer-finished")
        })
        document.querySelector(".selected-image").classList.add("answer-finished")
        document.querySelector(".selected-image").classList.remove("selected-image")
        imageSelected = false
        document.querySelectorAll(".answer").forEach( (answer) =>{
            answer.classList.remove("answer")
        })
        document.querySelectorAll(".selected").forEach( (answer) =>{
            answer.classList.remove("selected")
            selectedBoxArr.splice(selectedBoxArr.indexOf(answer),1)
        })
    }
    let allAnswerImagesArr = Array.from(document.querySelectorAll(".answer-image-box"))
    let allFinishedAnswers = allAnswerImagesArr.filter( (box) => { return !box.classList.contains("answer-finished") } )
    if ( allFinishedAnswers.length < 1 ) {
        console.log("Finished")
        finished = true
    }
    console.log(selectedBoxArr)
}



function markAnswer(answerArr) {
    gridBoxes = document.querySelectorAll(".grid-box")
    answerArr.forEach( (index) =>{
        gridBoxes[index].classList.add("answer")
    })
}


function populateGrid() {
    if ( wordCounter < levels[difficulty] ) {
        stop = false
        setRandomStart(wordListDeploy[wordCounter])
    } else {
        gridBoxes = document.querySelectorAll(".grid-box")
        gridBoxes.forEach( (box) =>{
            box.addEventListener("click",()=>{
                if ( !finished ) {
                    if ( !box.classList.contains("answer-finished") ) {
                        if ( !box.classList.contains("selected") ) {
                            box.classList.add("selected")
                            selectedBoxArr.push(box)
                            checkAnswer(answerArr)
                        } else {
                            box.classList.remove("selected")
                            selectedBoxArr.splice(selectedBoxArr.indexOf(box),1)
                        }
                    }
                }
            })
            box.addEventListener("touchmove",()=>{
                let touchTarget = document.elementFromPoint(touchX,touchY)
                if ( touchTarget.classList.contains("grid-box") ) {
                    if ( !touchTarget.classList.contains("answer-finished") && !finished) {
                        touchTarget.classList.add("selected")
                        if ( !selectedBoxArr.includes(touchTarget) ) {
                            selectedBoxArr.push(touchTarget)
                        } else {
                            console.log(finished)
                        }
                        checkAnswer(answerArr)
                    }
                } else if ( touchTarget.parentElement.classList.contains("grid-box") ) {
                    if ( !touchTarget.parentElement.classList.contains("answer-finished") && !finished) {
                        touchTarget.parentElement.classList.add("selected")
                        if ( !selectedBoxArr.includes(touchTarget.parentElement) ) {
                            selectedBoxArr.push(touchTarget.parentElement)
                        }
                        checkAnswer(answerArr)
                    }
                }
            })
            if ( !box.classList.contains("filled") ) {
                switch(gameCase) {
                    case "lower":
                        box.children[0].textContent = alphabetLower[ Math.floor( Math.random()*26 ) ]
                        break
                    case "upper":
                        box.children[0].textContent = alphabetUpper[ Math.floor( Math.random()*26 ) ]
                }
            }
        })
        let allAnswerImages = document.querySelectorAll(".answer-image-box")
        allAnswerImages.forEach( (image)=>{
            image.addEventListener("click",()=>{
                if ( !image.classList.contains("answer-finished") ) {
                    if ( imageSelected && !image.classList.contains("selected-image") ) {
                        document.querySelector(".selected-image").classList.remove("selected-image")
                        document.querySelectorAll(".answer").forEach( (answer) =>{
                            answer.classList.remove("answer")
                        })
                    }
                    if ( !image.classList.contains("selected-image") ) {
                        image.classList.add("selected-image")
                        imageSelected = true
                        let targetImage = image.children[0].getAttribute("src")
                        let targetName = allObj[targetImage].replaceAll(" ","")
                        answerArr = answersList[targetName]
                        markAnswer(answerArr)
                        checkAnswer(answerArr)
                    } else {
                        image.classList.remove("selected-image")
                        imageSelected = false
                        let allAnswerImages = document.querySelectorAll(".answer")
                        allAnswerImages.forEach( (answer) =>{
                            answer.classList.remove("answer")
                        })
                    }
                }
            })
        })
    }
}

function setRandomStart(word) {
    word = word.toUpperCase().split("")
    gridBoxes = document.querySelectorAll(".grid-box")
    let testNumber = Math.floor( Math.random()*(gridBoxes.length-1))
    let randomizer = [0, 1, 2]
    let newRandomizer = randomizer.slice(0).sort( ()=>{ return 0.5 - Math.random() } )
    for ( let i = 0; i < newRandomizer.length; i++ ) {
        let checkIndex = newRandomizer[i]
        if ( checkIndex === 0 && !stop ) {
            checkRight(word,testNumber)
        } else if ( checkIndex === 1 && !stop ) {
            checkDown(word,testNumber)
        } else if ( checkIndex === 2 && !stop ) {
            checkDiagonal(word,testNumber)
        }
    }
    if ( !stop ) {
        setRandomStart(word.join(""))
    }
}


function checkRight(word,index) {
    abort = false
    gridBoxes = document.querySelectorAll(".grid-box")
    if ( index%gridWidth < ( gridWidth - word.length) ) {
        let checkArr = []
        for ( let i = 0; i < word.length; i ++ ) {
            checkArr.push(index+i)
        }
        checkArr.forEach( (position) =>{
            if ( gridBoxes[position].classList.contains("filled") && !abort ) {
                let overWrittenLetter = gridBoxes[position].children[0].textContent
                let overWritingLetter = word[checkArr.indexOf(position)]
                if ( overWritingLetter !== overWrittenLetter ) {
                    abort = true
                }
            }
        })
    }
    if ( (index%gridWidth < ( gridWidth - word.length)) && !abort ) {
        stop = true
        goRight(word,index)
    }
}
function checkDown(word,index) {
    abort = false
    gridBoxes = document.querySelectorAll(".grid-box")
    if ( gridBoxes.length - index > (word.length-1)*gridWidth ) {
        let checkArr = []
        for ( let i = 0; i < word.length; i ++ ) {
            checkArr.push(index+(i*gridWidth))
        }
        checkArr.forEach( (position) =>{
            if ( gridBoxes[position].classList.contains("filled") && !abort ) {
                let overWrittenLetter = gridBoxes[position].children[0].textContent
                let overWritingLetter = word[checkArr.indexOf(position)]
                if ( overWritingLetter !== overWrittenLetter ) {
                    abort = true
                }
            }
        })
    }
    if ( gridBoxes.length - index > (word.length-1)*gridWidth && !abort ) {
        let checkArr = []
        for ( let i = 0; i < word.length; i ++ ) {
            checkArr.push(index+(i*gridWidth))
        }
        stop = true
        goDown(word,index)
    }
}
function checkDiagonal(word,index) {
    abort = false
    gridBoxes = document.querySelectorAll(".grid-box")
    if ( (index%gridWidth < ( gridWidth - word.length)) && (gridBoxes.length - index > (word.length-1)*gridWidth) ) {
        let checkArr = []
        for ( let i = 0; i < word.length; i ++ ) {
            checkArr.push((index+(i*gridWidth))+i)
        }
        checkArr.forEach( (position) =>{
            if ( gridBoxes[position].classList.contains("filled") && !abort ) {
                let overWrittenLetter = gridBoxes[position].children[0].textContent
                let overWritingLetter = word[checkArr.indexOf(position)]
                if ( overWritingLetter !== overWrittenLetter ) {
                    abort = true
                }
            }
        })
    }
    if ( (index%gridWidth < ( gridWidth - word.length)) && (gridBoxes.length - index > (word.length-1)*gridWidth) && !abort ) {
        let checkArr = []
        for ( let i = 0; i < word.length; i ++ ) {
            checkArr.push((index+(i*gridWidth))+i)
        }
        stop = true
        goDiagonal(word,index)
    }
}

function goRight(word,index) {
    gridBoxes = document.querySelectorAll(".grid-box")
    let noSpaceWord = word.filter( (a)=> {return a != " " })
    let tempAnswerIndexes = []
    for ( let i = 0; i < noSpaceWord.length; i ++ ) {
        switch(gameCase) {
            case "upper":
                gridBoxes[index+i].children[0].textContent = noSpaceWord[i]
                break
            case "lower":
                gridBoxes[index+i].children[0].textContent = noSpaceWord[i].toLowerCase()
        }
        gridBoxes[index+i].classList.add("filled")
        tempAnswerIndexes.push(index+i)
    }
    wordCounter++
    let finalWord = word.join("")
    let finalWordLower = word.join("").toLowerCase()
    let wordImage = getKey(allObj,finalWordLower)
    let answerWord = finalWordLower.replaceAll(" ","")
    answersList[answerWord] = tempAnswerIndexes
    switch(gameCase) {
        case "upper":
            answerDisplay.innerHTML += `<div class="answer-image-box"><img src="${wordImage}"><div class="answer-image-text"><span>${finalWord}</span></div>`
            break
        case "lower":
            answerDisplay.innerHTML += `<div class="answer-image-box"><img src="${wordImage}"><div class="answer-image-text"><span>${finalWordLower}</span></div>`
    }
    populateGrid()
}
function goDown(word,index) {
    gridBoxes = document.querySelectorAll(".grid-box")
    let noSpaceWord = word.filter( (a)=> {return a != " " })
    let tempAnswerIndexes = []
    for ( let i = 0; i < noSpaceWord.length; i ++ ) {
        switch(gameCase) {
            case "upper":
                gridBoxes[index+(i*gridWidth)].children[0].textContent = noSpaceWord[i]
                break
            case "lower":
                gridBoxes[index+(i*gridWidth)].children[0].textContent = noSpaceWord[i].toLowerCase()
        }
        gridBoxes[index+(i*gridWidth)].classList.add("filled")
        tempAnswerIndexes.push(index+(i*gridWidth))
    }
    wordCounter++
    let finalWord = word.join("")
    let finalWordLower = word.join("").toLowerCase()
    let wordImage = getKey(allObj,finalWordLower)
    let answerWord = finalWordLower.replaceAll(" ","")
    answersList[answerWord] = tempAnswerIndexes
    switch(gameCase) {
        case "upper":
            answerDisplay.innerHTML += `<div class="answer-image-box"><img src="${wordImage}"><div class="answer-image-text"><span>${finalWord}</span></div>`
            break
        case "lower":
            answerDisplay.innerHTML += `<div class="answer-image-box"><img src="${wordImage}"><div class="answer-image-text"><span>${finalWordLower}</span></div>`
    }
    populateGrid()
}
function goDiagonal(word,index) {
    gridBoxes = document.querySelectorAll(".grid-box")
    let noSpaceWord = word.filter( (a)=> {return a != " " })
    let tempAnswerIndexes = []
    for ( let i = 0; i < noSpaceWord.length; i ++ ) {
        switch(gameCase) {
            case "upper":
                gridBoxes[(index+(i*gridWidth))+i].children[0].textContent = noSpaceWord[i]
                break
            case "lower":
                gridBoxes[(index+(i*gridWidth))+i].children[0].textContent = noSpaceWord[i].toLowerCase()
        }
        gridBoxes[(index+(i*gridWidth))+i].classList.add("filled")
        tempAnswerIndexes.push((index+(i*gridWidth))+i)
    }
    wordCounter++
    let finalWord = word.join("")
    let finalWordLower = word.join("").toLowerCase()
    let wordImage = getKey(allObj,finalWordLower)
    let answerWord = finalWordLower.replaceAll(" ","")
    answersList[answerWord] = tempAnswerIndexes
    switch(gameCase) {
        case "upper":
            answerDisplay.innerHTML += `<div class="answer-image-box"><img src="${wordImage}"><div class="answer-image-text"><span>${finalWord}</span></div>`
            break
        case "lower":
            answerDisplay.innerHTML += `<div class="answer-image-box"><img src="${wordImage}"><div class="answer-image-text"><span>${finalWordLower}</span></div>`
    }
    populateGrid()
}
