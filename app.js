const alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
const wordList = ["DOG","FISH","CAT"]
const animals= ["bear","polarbear", "elephant", "tiger", "lion", "zebra", "gorilla", "monkey", "horse", "camel", "cow", "sheep", "pig", "panda", "koala", "penguin", "dog", "cat", "rabbit", "mouse", "snake", "frog", "bird", "eagle"]
const buildings = ["house","elementaryschool","juniorhighschool","park","library","museum","cityhall","hospital","busstop","station","policestation","firestation","gasstation","postoffice","bookstore","conveniencestore","departmentstore","restaurant","supermarket","flowershop","castle","shrine","temple","amusementpark","aquarium","stadium","zoo","bridge","street"]
// const wordListDeploy = animals.slice(0).sort((a,b)=>{ return b.length - a.length})
const gridContainer = document.querySelector(".wordsearch-grid")
let gridLayers
let gridBoxes

const widths = {
    "easy": 12,
    "medium": 15,
    "hard": 21,
}
const depths = {
    "easy": 8,
    "medium": 10,
    "hard": 14,
}
const levels = {
    "easy": 8,
    "medium": 12,
    "hard": 16,
}
let splitWordsArr = []
let upDownOK
let leftRightOK
let diagonalOK
let word
let testNumber

let difficulty = "hard"


let gridWidth = widths[difficulty]
let gridDepth = depths[difficulty]

let stop = false

let wordCounter = 0

let sizeCheckArr = buildings.filter( (word) => word.length <= (gridWidth*0.6) )

let randomizedArr = sizeCheckArr.slice(0).sort( ()=> { return 0.5 - Math.random() } )
let wordListDeploy = randomizedArr.slice(0,levels[difficulty]).sort((a,b)=>{ return b.length - a.length})



function generateGrid() {
    gridContainer.classList.add(difficulty)
    for (let i = 0; i < gridWidth*gridDepth; i++ ) {
        gridContainer.innerHTML += `
        <div class="grid-box"><span>${i}</span><?div>
        `
    }
}

generateGrid()

window.addEventListener("click",()=>{
    stop = false
    setRandomStart(wordListDeploy[wordCounter])
})

function setRandomStart(word) {
    console.log(word)
    console.log(wordCounter)
    word = word.toUpperCase().split("")
    gridBoxes = document.querySelectorAll(".grid-box")
    console.log(gridBoxes.length)
    let testNumber = Math.floor( Math.random()*(gridBoxes.length-1))
    console.log(testNumber)
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

// function setRandomStart(word) {
//     let splitWord = word.split("")
//     console.log(splitWord)
//     gridBoxes = document.querySelectorAll(".grid-box")
//     let testNumber = Math.floor( Math.random()*149)
//     gridBoxes[testNumber].classList.add("black")
//     console.log(testNumber)
//     if ( testNumber % gridWidth > (gridWidth - splitWord.length) ) {
//         console.log("cannot go left to right")
//         leftRightOK = false
//     } else {
//         console.log("can go left to right")
//         leftRightOK = true
//     }
//     if ( gridBoxes.length - testNumber >= (splitWord.length-1)*gridWidth) {
//         console.log("can go from top to bottom")
//         upDownOK = true
//     } else {
//         console.log("cannot go from top to bottom")
//         upDownOK = false
//     }
//     if ( upDownOK && leftRightOK ) {
//         console.log("can go diagonal")
//         diagonalOK = true
//     } else {
//         console.log("cannot go diagonal")
//         diagonalOK = false
//     }
// }
let abort

function checkRight(word,index) {
    abort = false
    gridBoxes = document.querySelectorAll(".grid-box")
    if ( index%gridWidth < ( gridWidth - word.length) ) {
        let checkArr = []
        for ( let i = 0; i < word.length; i ++ ) {
            checkArr.push(index+i)
        }
        console.log(checkArr)
        checkArr.forEach( (position) =>{
            if ( gridBoxes[position].classList.contains("filled") && !abort ) {
                let overWrittenLetter = gridBoxes[position].children[0].textContent
                let overWritingLetter = word[checkArr.indexOf(position)]
                if ( overWritingLetter !== overWrittenLetter ) {
                    abort = true
                    console.log("aborting write")
                } else {
                    console.log("overwriting same letter at "+position)
                    gridBoxes[position].classList.add("red")
                }
            }
        })
    }
    if ( (index%gridWidth < ( gridWidth - word.length)) && !abort ) {
        console.log("can go from left to right")
        leftRightOK = true
        stop = true
        goRight(word,index)
    } else {
        console.log("cannot go from left to right")
        leftRightOK = false
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
        console.log(checkArr)
        checkArr.forEach( (position) =>{
            if ( gridBoxes[position].classList.contains("filled") ) {
                let overWrittenLetter = gridBoxes[position].children[0].textContent
                let overWritingLetter = word[checkArr.indexOf(position)]
                if ( overWritingLetter !== overWrittenLetter ) {
                    abort = true
                    console.log("aborting write")
                } else {
                    console.log("overwriting same letter at "+position)
                }
            }
        })
    }
    if ( gridBoxes.length - index > (word.length-1)*gridWidth && !abort ) {
        console.log("can go from top to bottom")
        upDownOK = true
        let checkArr = []
        for ( let i = 0; i < word.length; i ++ ) {
            checkArr.push(index+(i*gridWidth))
        }
        stop = true
        goDown(word,index)
    } else {
        console.log("cannot go from top to bottom")
        upDownOK = false
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
        console.log(checkArr)
        checkArr.forEach( (position) =>{
            if ( gridBoxes[position].classList.contains("filled") ) {
                let overWrittenLetter = gridBoxes[position].children[0].textContent
                let overWritingLetter = word[checkArr.indexOf(position)]
                if ( overWritingLetter !== overWrittenLetter ) {
                    abort = true
                    console.log("aborting write")
                } else {
                    console.log("overwriting same letter at "+position)
                }
            }
        })
    }
    if ( (index%gridWidth < ( gridWidth - word.length)) && (gridBoxes.length - index > (word.length-1)*gridWidth) && !abort ) {
        console.log("can go diagonal")
        diagonalOK = true
        let checkArr = []
        for ( let i = 0; i < word.length; i ++ ) {
            checkArr.push((index+(i*gridWidth))+i)
        }
        stop = true
        goDiagonal(word,index)
    } else {
        console.log("cannot go diagonal")
        diagonalOK = false
    }
}

function goRight(word,index) {
    gridBoxes = document.querySelectorAll(".grid-box")
    for ( let i = 0; i < word.length; i ++ ) {
        gridBoxes[index+i].children[0].textContent = word[i]
        gridBoxes[index+i].classList.add("filled")
    }
    wordCounter++
}
function goDown(word,index) {
    gridBoxes = document.querySelectorAll(".grid-box")
    for ( let i = 0; i < word.length; i ++ ) {
        gridBoxes[index+(i*gridWidth)].children[0].textContent = word[i]
        gridBoxes[index+(i*gridWidth)].classList.add("filled")
    }
    wordCounter++
}
function goDiagonal(word,index) {
    gridBoxes = document.querySelectorAll(".grid-box")
    for ( let i = 0; i < word.length; i ++ ) {
        gridBoxes[(index+(i*gridWidth))+i].children[0].textContent = word[i]
        gridBoxes[(index+(i*gridWidth))+i].classList.add("filled")
    }
    wordCounter++
}