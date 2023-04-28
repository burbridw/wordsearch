const alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
const gridContainer = document.querySelector(".wordsearch-grid")
const answerDisplay = document.querySelector(".answer-grid")

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

let wordCounter = 0

let splitWordsArr = []
let answerArr = []
let sizeCheckArr = []
let selection = []
let randomizedArr = []
let wordListDeploy = []
let answersList = {}

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
        beginGameRandom()
    } else if ( inSetupPreset && topicSet && presetNumberSet ) {
        setupRandom.classList.add("behind")
        setupPreset.classList.add("behind")
        setupWindow.classList.add("behind")
        inSetupPreset = false
        inGame = true
        beginGamePreset(allPresets[presetTopic][difficulty][presetNumber])
    }
})

function beginGamePreset(obj) {
    gridWidth = widths[difficulty]
    gridDepth = depths[difficulty]
    gridContainer.classList.remove("behind")
    answerDisplay.classList.add(difficulty)
    answerDisplay.classList.remove("behind")
    answersList = obj
    console.log(answersList)
    generateGrid()
    gridBoxes = document.querySelectorAll(".grid-box")
    let presetWordsList = Object.keys(obj)
    let presetIndexList = Object.values(obj)
    presetWordsList.forEach( (word)=>{
        let splitPresetWord = word.replaceAll(" ","").toUpperCase().split("")
        let presetIndex = obj[word]
        for ( let i = 0; i < splitPresetWord.length; i++ ) {
            gridBoxes[presetIndex[i]].children[0].textContent = splitPresetWord[i]
            gridBoxes[presetIndex[i]].classList.add("filled")
        }
        let finalWord = word
        let wordImage = getKey(allObj,word)
        answerDisplay.innerHTML += `<div class="answer-image-box"><img src="${wordImage}"><div class="answer-image-text"><span>${word}</span></div>`
        
    })
    gridBoxes.forEach( (box) =>{
        box.addEventListener("click",()=>{
            if ( !box.classList.contains("answer-finished") ) {
                if ( !box.classList.contains("selected") ) {
                    box.classList.add("selected")
                    checkAnswer(answerArr)
                } else {
                    box.classList.remove("selected")
                }
            }
        })
        if ( !box.classList.contains("filled") ) {
            box.children[0].textContent = alphabet[ Math.floor( Math.random()*26 ) ]
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
                    console.log(answerArr)
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
    gridContainer.classList.remove("behind")
    answerDisplay.classList.add(difficulty)
    answerDisplay.classList.remove("behind")
    gridWidth = widths[difficulty]
    gridDepth = depths[difficulty]
    sizeCheckArr = selection.filter( (word) => word.length <= (gridWidth*0.8) )
    randomizedArr = sizeCheckArr.slice(0).sort( ()=> { return 0.5 - Math.random() } )
    wordListDeploy = randomizedArr.slice(0,levels[difficulty]).sort((a,b)=>{ return b.length - a.length})
    generateGrid()
    populateGrid()
}

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

const reference = {
    "random-colors": "colors", "preset-colors": "colors", "random-sports": "sports", "preset-sports": "sports",
    "random-foods": "foods", "preset-foods": "foods", "random-animals": "animals", "preset-animals": "animals",
    "random-fruitandveg": "fruitandveg", "preset-fruitandveg": "fruitandveg", "random-subjects": "subjects", "preset-subjects": "subjects",
    "random-stationery": "stationery", "preset-stationery": "stationery", "random-desserts": "desserts", "preset-desserts": "desserts",
    "random-months": "months", "preset-months": "months", "random-countries": "countries", "preset-countries": "countries",
    "random-dailyactivities": "dailyactivities", "preset-dailyactivities": "dailyactivities", "random-commonitems": "commonitems",
    "preset-commonitems": "commonitems", "random-activities": "activities", "preset-activities": "activities",
    "random-descriptions": "descriptions", "preset-descriptions": "descriptions", "random-conditions": "conditions",
    "preset-conditions": "conditions", "random-buildings": "buildings", "preset-buildings": "buildings",
    "random-jobs": "jobs", "preset-jobs": "jobs", "random-clubs": "clubactivities", "preset-clubs": "clubactivities",
    "random-actions1": "actions1", "random-actions2": "actions2", "preset-actions": "actions", "random-nature": "nature",
    "random-body": "body", "random-school": "school", "random-schoolevents": "schoolevents", "random-shapes": "shapes",
    "random-drinks": "drinks", "random-ingredients": "ingredients", "random-tastes": "tastes", "random-seaanimals": "seaanimals",
    "random-clothes": "clothes", "random-vehicles": "vehicles", "random-instruments": "instruments", "random-yearlyevents": "yearlyevents",
}
const selectObj = {
    "feelings" : ["./images/feelings/img1.png","./images/feelings/img2.png", "./images/feelings/img3.png", "./images/feelings/img4.png", "./images/feelings/img5.png", "./images/feelings/img6.png", "./images/feelings/img7.png", "./images/feelings/img8.png", "./images/feelings/img9.png","./images/feelings/img10.png"], 
    "numbers" : ["./images/numbers/img1.png","./images/numbers/img2.png", "./images/numbers/img3.png", "./images/numbers/img4.png", "./images/numbers/img5.png", "./images/numbers/img6.png", "./images/numbers/img7.png", "./images/numbers/img8.png", "./images/numbers/img9.png", "./images/numbers/img10.png", "./images/numbers/img11.png", "./images/numbers/img12.png"], 
    "weather" : ["./images/weather/img1.png","./images/weather/img2.png", "./images/weather/img3.png", "./images/weather/img4.png", "./images/weather/img5.png", "./images/weather/img6.png"], 
    "colors" : ["./images/colours/img1.png","./images/colours/img2.png", "./images/colours/img3.png", "./images/colours/img4.png", "./images/colours/img5.png", "./images/colours/img6.png", "./images/colours/img7.png", "./images/colours/img8.png", "./images/colours/img9.png","./images/colours/img10.png"],
    "shapes" : ["./images/shapes/img1.png","./images/shapes/img2.png", "./images/shapes/img3.png", "./images/shapes/img4.png", "./images/shapes/img5.png", "./images/shapes/img6.png", "./images/shapes/img7.png", "./images/shapes/img8.png"],
    "sports" : ["./images/sports/img1.png","./images/sports/img2.png", "./images/sports/img3.png", "./images/sports/img4.png", "./images/sports/img5.png", "./images/sports/img6.png", "./images/sports/img7.png", "./images/sports/img8.png","./images/sports/img9.png","./images/sports/img10.png","./images/sports/img11.png","./images/sports/img12.png","./images/sports/img13.png"],
    "foods" : ["./images/foods/img1.png","./images/foods/img2.png", "./images/foods/img3.png", "./images/foods/img4.png", "./images/foods/img5.png", "./images/foods/img6.png", "./images/foods/img7.png", "./images/foods/img8.png", "./images/foods/img9.png", "./images/foods/img10.png", "./images/foods/img11.png", "./images/foods/img12.png", "./images/foods/img13.png", "./images/foods/img14.png", "./images/foods/img15.png", "./images/foods/img16.png", "./images/foods/img17.png", "./images/foods/img18.png", "./images/foods/img19.png", "./images/foods/img20.png", "./images/foods/img21.png", "./images/foods/img22.png", "./images/foods/img23.png", "./images/foods/img24.png", "./images/foods/img25.png"],
    "desserts" : ["./images/desserts/img1.png","./images/desserts/img2.png", "./images/desserts/img3.png", "./images/desserts/img4.png", "./images/desserts/img5.png", "./images/desserts/img6.png", "./images/desserts/img7.png", "./images/desserts/img8.png"], 
    "drinks" : ["./images/drinks/img1.png","./images/drinks/img2.png", "./images/drinks/img3.png", "./images/drinks/img4.png", "./images/drinks/img5.png", "./images/drinks/img6.png", "./images/drinks/img7.png", "./images/drinks/img8.png"], 
    "fruitandveg" : ["./images/fruitsvegetables/img1.png","./images/fruitsvegetables/img2.png", "./images/fruitsvegetables/img3.png", "./images/fruitsvegetables/img4.png", "./images/fruitsvegetables/img5.png", "./images/fruitsvegetables/img6.png", "./images/fruitsvegetables/img7.png", "./images/fruitsvegetables/img8.png", "./images/fruitsvegetables/img9.png", "./images/fruitsvegetables/img10.png", "./images/fruitsvegetables/img11.png", "./images/fruitsvegetables/img12.png", "./images/fruitsvegetables/img13.png", "./images/fruitsvegetables/img14.png", "./images/fruitsvegetables/img15.png", "./images/fruitsvegetables/img16.png", "./images/fruitsvegetables/img17.png", "./images/fruitsvegetables/img18.png", "./images/fruitsvegetables/img19.png", "./images/fruitsvegetables/img20.png", "./images/fruitsvegetables/img21.png", "./images/fruitsvegetables/img22.png", "./images/fruitsvegetables/img23.png", "./images/fruitsvegetables/img24.png", "./images/fruitsvegetables/img25.png", "./images/fruitsvegetables/img26.png", "./images/fruitsvegetables/img27.png"], 
    "ingredients" : ["./images/ingredients/img1.png","./images/ingredients/img2.png", "./images/ingredients/img3.png", "./images/ingredients/img4.png", "./images/ingredients/img5.png", "./images/ingredients/img6.png", "./images/ingredients/img7.png", "./images/ingredients/img8.png", "./images/ingredients/img9.png", "./images/ingredients/img10.png"], 
    "meals" : ["./images/meals/img1.png","./images/meals/img2.png", "./images/meals/img3.png"], 
    "tastes" : ["./images/tastes/img1.png","./images/tastes/img2.png", "./images/tastes/img3.png", "./images/tastes/img4.png", "./images/tastes/img5.png", "./images/tastes/img6.png", "./images/tastes/img7.png", "./images/tastes/img8.png", "./images/tastes/img9.png", "./images/tastes/img10.png"], 
    "animals" : ["./images/animals/img1.png","./images/animals/img2.png", "./images/animals/img3.png", "./images/animals/img4.png", "./images/animals/img5.png", "./images/animals/img6.png", "./images/animals/img7.png", "./images/animals/img8.png", "./images/animals/img9.png", "./images/animals/img10.png", "./images/animals/img11.png", "./images/animals/img12.png", "./images/animals/img13.png", "./images/animals/img14.png", "./images/animals/img15.png", "./images/animals/img16.png", "./images/animals/img17.png", "./images/animals/img18.png", "./images/animals/img19.png", "./images/animals/img20.png", "./images/animals/img21.png", "./images/animals/img22.png", "./images/animals/img23.png", "./images/animals/img24.png"], 
    "seaanimals" : ["./images/seaanimals/img1.png","./images/seaanimals/img2.png", "./images/seaanimals/img3.png", "./images/seaanimals/img4.png", "./images/seaanimals/img5.png", "./images/seaanimals/img6.png", "./images/seaanimals/img7.png", "./images/seaanimals/img8.png"], 
    "bugs" : ["./images/bugs/img1.png","./images/bugs/img2.png", "./images/bugs/img3.png", "./images/bugs/img4.png"], 
    "nature" : ["./images/nature/img1.png","./images/nature/img2.png", "./images/nature/img3.png", "./images/nature/img4.png", "./images/nature/img5.png", "./images/nature/img6.png", "./images/nature/img7.png", "./images/nature/img8.png", "./images/nature/img9.png", "./images/nature/img10.png", "./images/nature/img11.png", "./images/nature/img12.png"], 
    "months" : ["./images/months/img1.png","./images/months/img2.png", "./images/months/img3.png", "./images/months/img4.png", "./images/months/img5.png", "./images/months/img6.png", "./images/months/img7.png", "./images/months/img8.png", "./images/months/img9.png", "./images/months/img10.png", "./images/months/img11.png", "./images/months/img12.png"], 
    "seasons" : ["./images/seasons/img1.png","./images/seasons/img2.png", "./images/seasons/img3.png", "./images/seasons/img4.png"], 
    "timesofday" : ["./images/timesofday/img1.png","./images/timesofday/img2.png", "./images/timesofday/img3.png", "./images/timesofday/img4.png"], 
    "days" : ["./images/days/img1.png","./images/days/img2.png", "./images/days/img3.png", "./images/days/img4.png","./images/days/img5.png", "./images/days/img6.png", "./images/days/img7.png"], 
    "countries" : ["./images/countries/img1.png","./images/countries/img2.png", "./images/countries/img3.png", "./images/countries/img4.png", "./images/countries/img5.png", "./images/countries/img6.png", "./images/countries/img7.png", "./images/countries/img8.png", "./images/countries/img9.png", "./images/countries/img10.png", "./images/countries/img11.png", "./images/countries/img12.png", "./images/countries/img13.png", "./images/countries/img14.png", "./images/countries/img15.png", "./images/countries/img16.png", "./images/countries/img17.png", "./images/countries/img18.png", "./images/countries/img19.png", "./images/countries/img20.png", "./images/countries/img21.png", "./images/countries/img22.png", "./images/countries/img23.png", "./images/countries/img24.png", "./images/countries/img26.png"], 
    "family" : ["./images/family/img1.png","./images/family/img2.png", "./images/family/img3.png", "./images/family/img4.png", "./images/family/img5.png", "./images/family/img6.png", "./images/family/img7.png"], 
    "people" : ["./images/people/img1.png","./images/people/img2.png", "./images/people/img3.png", "./images/people/img4.png"], 
    "personalities" : ["./images/personalities/img1.png","./images/personalities/img2.png", "./images/personalities/img3.png", "./images/personalities/img4.png", "./images/personalities/img5.png", "./images/personalities/img6.png", "./images/personalities/img7.png"], 
    "actions1" : ["./images/actions1/img1.png","./images/actions1/img2.png", "./images/actions1/img3.png", "./images/actions1/img4.png", "./images/actions1/img5.png", "./images/actions1/img6.png", "./images/actions1/img7.png", "./images/actions1/img8.png", "./images/actions1/img9.png", "./images/actions1/img10.png", "./images/actions1/img11.png", "./images/actions1/img12.png", "./images/actions1/img13.png", "./images/actions1/img14.png", "./images/actions1/img15.png", "./images/actions1/img16.png", "./images/actions1/img17.png", "./images/actions1/img18.png", "./images/actions1/img19.png", "./images/actions1/img20.png", "./images/actions1/img21.png", "./images/actions1/img22.png", "./images/actions1/img23.png", "./images/actions1/img24.png", "./images/actions1/img25.png"], 
    "pastactions" : ["./images/pastactions/img1.png","./images/pastactions/img2.png", "./images/pastactions/img3.png", "./images/pastactions/img4.png", "./images/pastactions/img5.png"], 
    "actions2" : ["./images/actions2/img1.png","./images/actions2/img2.png", "./images/actions2/img3.png", "./images/actions2/img4.png", "./images/actions2/img5.png", "./images/actions2/img6.png", "./images/actions2/img7.png", "./images/actions2/img8.png", "./images/actions2/img9.png", "./images/actions2/img10.png", "./images/actions2/img11.png", "./images/actions2/img12.png", "./images/actions2/img13.png", "./images/actions2/img14.png", "./images/actions2/img15.png"], 
    "actions" : ["./images/actions1/img1.png","./images/actions1/img2.png", "./images/actions1/img3.png", "./images/actions1/img4.png", "./images/actions1/img5.png", "./images/actions1/img6.png", "./images/actions1/img7.png", "./images/actions1/img8.png", "./images/actions1/img9.png", "./images/actions1/img10.png", "./images/actions1/img11.png", "./images/actions1/img12.png", "./images/actions1/img13.png", "./images/actions1/img14.png", "./images/actions1/img15.png", "./images/actions1/img16.png", "./images/actions1/img17.png", "./images/actions1/img18.png", "./images/actions1/img19.png", "./images/actions1/img20.png", "./images/actions1/img21.png", "./images/actions1/img22.png", "./images/actions1/img23.png", "./images/actions1/img24.png", "./images/actions1/img25.png", "./images/actions2/img1.png","./images/actions2/img2.png", "./images/actions2/img3.png", "./images/actions2/img4.png", "./images/actions2/img5.png", "./images/actions2/img6.png", "./images/actions2/img7.png", "./images/actions2/img8.png", "./images/actions2/img9.png", "./images/actions2/img10.png", "./images/actions2/img11.png", "./images/actions2/img12.png", "./images/actions2/img13.png", "./images/actions2/img14.png", "./images/actions2/img15.png"], 
    "dailyactivities" : ["./images/dailyactivities/img1.png","./images/dailyactivities/img2.png", "./images/dailyactivities/img3.png", "./images/dailyactivities/img4.png", "./images/dailyactivities/img5.png", "./images/dailyactivities/img6.png", "./images/dailyactivities/img7.png", "./images/dailyactivities/img8.png", "./images/dailyactivities/img9.png", "./images/dailyactivities/img10.png", "./images/dailyactivities/img11.png", "./images/dailyactivities/img12.png", "./images/dailyactivities/img13.png", "./images/dailyactivities/img14.png", "./images/dailyactivities/img15.png", "./images/dailyactivities/img16.png", "./images/dailyactivities/img17.png"], 
    "frequency" : ["./images/frequency/img1.png","./images/frequency/img2.png", "./images/frequency/img3.png", "./images/frequency/img4.png"], 
    "body" : ["./images/body/img1.png","./images/body/img2.png", "./images/body/img3.png", "./images/body/img4.png", "./images/body/img5.png", "./images/body/img6.png", "./images/body/img7.png", "./images/body/img8.png", "./images/body/img9.png", "./images/body/img10.png", "./images/body/img11.png", "./images/body/img12.png"], 
    "clothes" : ["./images/clothes/img1.png","./images/clothes/img2.png", "./images/clothes/img3.png", "./images/clothes/img4.png", "./images/clothes/img5.png", "./images/clothes/img6.png", "./images/clothes/img7.png", "./images/clothes/img8.png", "./images/clothes/img9.png", "./images/clothes/img10.png"], 
    "buildings" : ["./images/buildings/img1.png","./images/buildings/img2.png", "./images/buildings/img3.png", "./images/buildings/img4.png", "./images/buildings/img5.png", "./images/buildings/img6.png", "./images/buildings/img7.png", "./images/buildings/img8.png", "./images/buildings/img9.png", "./images/buildings/img10.png", "./images/buildings/img11.png", "./images/buildings/img12.png", "./images/buildings/img13.png", "./images/buildings/img14.png", "./images/buildings/img15.png", "./images/buildings/img16.png", "./images/buildings/img17.png", "./images/buildings/img18.png", "./images/buildings/img19.png", "./images/buildings/img20.png", "./images/buildings/img21.png", "./images/buildings/img22.png", "./images/buildings/img23.png", "./images/buildings/img24.png", "./images/buildings/img25.png", "./images/buildings/img26.png", "./images/buildings/img27.png", "./images/buildings/img28.png", "./images/buildings/img29.png"], 
    "directions" : ["./images/directions/img1.png","./images/directions/img2.png", "./images/directions/img3.png", "./images/directions/img4.png", "./images/directions/img5.png", "./images/directions/img6.png", "./images/directions/img7.png"], 
    "locations" : ["./images/locations/img1.png","./images/locations/img2.png", "./images/locations/img3.png", "./images/locations/img4.png"], 
    "vehicles" : ["./images/vehicles/img1.png","./images/vehicles/img2.png", "./images/vehicles/img3.png", "./images/vehicles/img4.png", "./images/vehicles/img5.png", "./images/vehicles/img6.png", "./images/vehicles/img7.png", "./images/vehicles/img8.png", "./images/vehicles/img9.png", "./images/vehicles/img10.png"], 
    "school" : ["./images/school/img1.png","./images/school/img2.png", "./images/school/img3.png", "./images/school/img4.png", "./images/school/img5.png", "./images/school/img6.png", "./images/school/img7.png", "./images/school/img8.png", "./images/school/img9.png", "./images/school/img10.png", "./images/school/img11.png", "./images/school/img12.png", "./images/school/img13.png", "./images/school/img14.png", "./images/school/img15.png", "./images/school/img16.png"], 
    "subjects" : ["./images/subjects/img1.png","./images/subjects/img2.png", "./images/subjects/img3.png", "./images/subjects/img4.png", "./images/subjects/img5.png", "./images/subjects/img6.png", "./images/subjects/img7.png", "./images/subjects/img8.png", "./images/subjects/img9.png", "./images/subjects/img10.png", "./images/subjects/img11.png"],   
    "instruments" : ["./images/instruments/img1.png","./images/instruments/img2.png", "./images/instruments/img3.png", "./images/instruments/img4.png", "./images/instruments/img5.png", "./images/instruments/img6.png", "./images/instruments/img7.png", "./images/instruments/img8.png"],   
    "stationery" : ["./images/stationary/img1.png","./images/stationary/img2.png", "./images/stationary/img3.png", "./images/stationary/img4.png", "./images/stationary/img5.png", "./images/stationary/img6.png", "./images/stationary/img7.png", "./images/stationary/img8.png", "./images/stationary/img9.png", "./images/stationary/img10.png", "./images/stationary/img11.png", "./images/stationary/img12.png"],  
    "commonitems" : ["./images/commonitems/img1.png","./images/commonitems/img2.png", "./images/commonitems/img3.png", "./images/commonitems/img4.png", "./images/commonitems/img5.png", "./images/commonitems/img6.png", "./images/commonitems/img7.png", "./images/commonitems/img8.png", "./images/commonitems/img9.png", "./images/commonitems/img10.png", "./images/commonitems/img11.png", "./images/commonitems/img12.png", "./images/commonitems/img13.png", "./images/commonitems/img14.png", "./images/commonitems/img15.png", "./images/commonitems/img16.png", "./images/commonitems/img17.png", "./images/commonitems/img18.png", "./images/commonitems/img19.png", "./images/commonitems/img20.png", "./images/commonitems/img21.png", "./images/commonitems/img22.png", "./images/commonitems/img23.png", "./images/commonitems/img24.png", "./images/commonitems/img25.png", "./images/commonitems/img26.png", "./images/commonitems/img27.png", "./images/commonitems/img28.png"],    
    "activities" : ["./images/activities/img1.png","./images/activities/img2.png", "./images/activities/img3.png", "./images/activities/img4.png", "./images/activities/img5.png", "./images/activities/img6.png", "./images/activities/img7.png", "./images/activities/img8.png", "./images/activities/img9.png", "./images/activities/img10.png", "./images/activities/img11.png", "./images/activities/img12.png", "./images/activities/img13.png", "./images/activities/img14.png"],    
    "schoolevents" : ["./images/schoolevents/img1.png","./images/schoolevents/img2.png", "./images/schoolevents/img3.png", "./images/schoolevents/img4.png", "./images/schoolevents/img5.png", "./images/schoolevents/img6.png", "./images/schoolevents/img7.png", "./images/schoolevents/img8.png", "./images/schoolevents/img9.png", "./images/schoolevents/img10.png", "./images/schoolevents/img11.png", "./images/schoolevents/img12.png", "./images/schoolevents/img13.png"],     
    "yearlyevents" : ["./images/yearlyevents/img1.png","./images/yearlyevents/img2.png", "./images/yearlyevents/img3.png", "./images/yearlyevents/img4.png", "./images/yearlyevents/img5.png", "./images/yearlyevents/img6.png", "./images/yearlyevents/img7.png", "./images/yearlyevents/img8.png", "./images/yearlyevents/img9.png", "./images/yearlyevents/img10.png"],    
    "conditions" : ["./images/conditions/img1.png","./images/conditions/img2.png", "./images/conditions/img3.png", "./images/conditions/img4.png", "./images/conditions/img5.png", "./images/conditions/img6.png", "./images/conditions/img7.png", "./images/conditions/img8.png", "./images/conditions/img9.png", "./images/conditions/img10.png", "./images/conditions/img11.png", "./images/conditions/img12.png"],    
    "descriptions" : ["./images/descriptions/img1.png","./images/descriptions/img2.png", "./images/descriptions/img3.png", "./images/descriptions/img4.png", "./images/descriptions/img5.png", "./images/descriptions/img6.png", "./images/descriptions/img7.png", "./images/descriptions/img8.png", "./images/descriptions/img9.png", "./images/descriptions/img10.png", "./images/descriptions/img11.png", "./images/descriptions/img12.png", "./images/descriptions/img13.png", "./images/descriptions/img14.png", "./images/descriptions/img15.png"],    
    "jobs" : ["./images/jobs/img1.png","./images/jobs/img2.png", "./images/jobs/img3.png", "./images/jobs/img4.png", "./images/jobs/img5.png", "./images/jobs/img6.png", "./images/jobs/img7.png", "./images/jobs/img8.png", "./images/jobs/img9.png", "./images/jobs/img10.png", "./images/jobs/img11.png", "./images/jobs/img12.png", "./images/jobs/img13.png", "./images/jobs/img14.png", "./images/jobs/img15.png", "./images/jobs/img16.png", "./images/jobs/img17.png", "./images/jobs/img18.png", "./images/jobs/img19.png", "./images/jobs/img20.png", "./images/jobs/img21.png", "./images/jobs/img22.png", "./images/jobs/img23.png", "./images/jobs/img24.png", "./images/jobs/img25.png"],     
    "clubactivities" : ["./images/clubactivities/img1.png","./images/clubactivities/img2.png", "./images/clubactivities/img3.png", "./images/clubactivities/img4.png", "./images/clubactivities/img5.png", "./images/clubactivities/img6.png", "./images/clubactivities/img7.png", "./images/clubactivities/img8.png", "./images/clubactivities/img9.png", "./images/clubactivities/img10.png", "./images/clubactivities/img11.png", "./images/clubactivities/img12.png", "./images/clubactivities/img13.png", "./images/clubactivities/img14.png", "./images/clubactivities/img15.png", "./images/clubactivities/img16.png", "./images/clubactivities/img17.png", "./images/clubactivities/img18.png"],     
}

const allObj = {
    "./images/feelings/img1.png": "fine", "./images/feelings/img2.png": "good","./images/feelings/img3.png": "great", "./images/feelings/img4.png": "happy", "./images/feelings/img5.png": "sad", "./images/feelings/img6.png": "tired",  "./images/feelings/img7.png": "sleepy", "./images/feelings/img8.png": "busy", "./images/feelings/img9.png": "hungry", "./images/feelings/img10.png": "thirsty", 
    "./images/numbers/img1.png": "one", "./images/numbers/img2.png": "two", "./images/numbers/img3.png": "three", "./images/numbers/img4.png": "four", "./images/numbers/img5.png": "five", "./images/numbers/img6.png": "six", "./images/numbers/img7.png": "seven", "./images/numbers/img8.png": "eight", "./images/numbers/img9.png": "nine", "./images/numbers/img10.png": "ten", "./images/numbers/img11.png": "eleven", "./images/numbers/img12.png": "twelve", 
    "./images/weather/img1.png": "sunny", "./images/weather/img2.png": "cloudy", "./images/weather/img3.png": "rainy", "./images/weather/img4.png": "snowy", "./images/weather/img5.png": "cold", "./images/weather/img6.png": "hot", 
    "./images/colours/img1.png": "black", "./images/colours/img2.png": "blue", "./images/colours/img3.png": "brown", "./images/colours/img4.png": "green", "./images/colours/img5.png": "orange", "./images/colours/img6.png": "pink", "./images/colours/img7.png": "purple", "./images/colours/img8.png": "red", "./images/colours/img9.png": "white", "./images/colours/img10.png": "yellow", 
    "./images/shapes/img1.png": "circle", "./images/shapes/img2.png": "cross", "./images/shapes/img3.png": "diamond", "./images/shapes/img4.png": "heart", "./images/shapes/img5.png": "rectangle", "./images/shapes/img6.png": "square", "./images/shapes/img7.png": "star", "./images/shapes/img8.png": "triangle", 
    "./images/sports/img1.png": "baseball", "./images/sports/img2.png": "softball", "./images/sports/img3.png": "basketball", "./images/sports/img4.png": "volleyball", "./images/sports/img5.png": "dodgeball", "./images/sports/img6.png": "soccer", "./images/sports/img7.png": "tennis", "./images/sports/img8.png": "table tennis", "./images/sports/img9.png": "badminton", "./images/sports/img10.png": "track and field", "./images/sports/img11.png": "swimming", "./images/sports/img12.png": "skating", "./images/sports/img13.png": "skiing", 
    "./images/foods/img1.png": "rice", "./images/foods/img2.png": "rice ball", "./images/foods/img3.png": "curry and rice", "./images/foods/img4.png": "grilled fish", "./images/foods/img5.png": "bread", "./images/foods/img6.png": "sandwich", "./images/foods/img7.png": "pancakes", "./images/foods/img8.png": "pizza", "./images/foods/img9.png": "hamburger", "./images/foods/img10.png": "hot dog", "./images/foods/img11.png": "french fries", "./images/foods/img12.png": "fried chicken", "./images/foods/img13.png": "sausage", "./images/foods/img14.png": "steak", "./images/foods/img15.png": "omelet", "./images/foods/img16.png": "spaghetti", "./images/foods/img17.png": "pie", "./images/foods/img18.png": "salad", "./images/foods/img19.png": "soup", "./images/foods/img20.png": "okonomiyaki", "./images/foods/img21.png": "gyoza", "./images/foods/img22.png": "ramen", "./images/foods/img23.png": "soba", "./images/foods/img24.png": "sushi", "./images/foods/img25.png": "tempura",
    "./images/desserts/img1.png": "cake", "./images/desserts/img2.png": "parfait", "./images/desserts/img3.png": "pudding", "./images/desserts/img4.png": "ice cream", "./images/desserts/img5.png": "shaved ice", "./images/desserts/img6.png": "chocolate", "./images/desserts/img7.png": "popcorn", "./images/desserts/img8.png": "snack food", 
    "./images/drinks/img1.png": "coffee", "./images/drinks/img2.png": "tea", "./images/drinks/img3.png": "green tea", "./images/drinks/img4.png": "orange juice",  "./images/drinks/img5.png": "soda", "./images/drinks/img6.png": "milk", "./images/drinks/img7.png": "water", "./images/drinks/img8.png": "mineral water", 
    "./images/fruitsvegetables/img1.png": "apple", "./images/fruitsvegetables/img2.png": "banana", "./images/fruitsvegetables/img3.png": "bean", "./images/fruitsvegetables/img4.png": "brocolli", "./images/fruitsvegetables/img5.png": "cabbage", "./images/fruitsvegetables/img6.png": "carrot", "./images/fruitsvegetables/img7.png": "cherry", "./images/fruitsvegetables/img8.png": "corn", "./images/fruitsvegetables/img9.png": "cucumber", "./images/fruitsvegetables/img10.png": "eggplant", "./images/fruitsvegetables/img11.png": "grapes",  "./images/fruitsvegetables/img12.png": "green pepper", "./images/fruitsvegetables/img13.png": "kiwi fruit", "./images/fruitsvegetables/img14.png": "lemon", "./images/fruitsvegetables/img15.png": "lettuce", "./images/fruitsvegetables/img16.png": "melon", "./images/fruitsvegetables/img17.png": "mushroom", "./images/fruitsvegetables/img18.png": "nut", "./images/fruitsvegetables/img19.png": "onion", "./images/fruitsvegetables/img20.png": "orange", "./images/fruitsvegetables/img21.png": "peach", "./images/fruitsvegetables/img22.png": "pineapple", "./images/fruitsvegetables/img23.png": "potato", "./images/fruitsvegetables/img24.png": "spinach", "./images/fruitsvegetables/img25.png": "strawberry", "./images/fruitsvegetables/img26.png": "tomato", "./images/fruitsvegetables/img27.png": "watermelon",
    "./images/ingredients/img1.png": "beef", "./images/ingredients/img2.png": "chicken", "./images/ingredients/img3.png": "pork", "./images/ingredients/img4.png": "bacon", "./images/ingredients/img5.png": "ham", "./images/ingredients/img6.png": "cheese", "./images/ingredients/img7.png": "egg", "./images/ingredients/img8.png": "fish", "./images/ingredients/img9.png": "salmon", "./images/ingredients/img10.png": "octopus", 
    "./images/meals/img1.png": "breakfast", "./images/meals/img2.png": "lunch", "./images/meals/img3.png": "dinner", 
    "./images/tastes/img1.png": "bitter", "./images/tastes/img2.png": "sweet", "./images/tastes/img3.png": "salty", "./images/tastes/img4.png": "sour", "./images/tastes/img5.png": "spicy", "./images/tastes/img6.png": "delicious", "./images/tastes/img7.png": "soft", "./images/tastes/img8.png": "hard", "./images/tastes/img9.png": "cold", "./images/tastes/img10.png": "hot", 
    "./images/animals/img1.png": "bear", "./images/animals/img2.png": "polar bear", "./images/animals/img3.png": "elephant", "./images/animals/img4.png": "tiger", "./images/animals/img5.png": "lion", "./images/animals/img6.png": "zebra", "./images/animals/img7.png": "gorilla", "./images/animals/img8.png": "monkey", "./images/animals/img9.png": "horse", "./images/animals/img10.png": "camel", "./images/animals/img11.png": "cow", "./images/animals/img12.png": "sheep", "./images/animals/img13.png": "pig", "./images/animals/img14.png": "panda", "./images/animals/img15.png": "koala", "./images/animals/img16.png": "penguin", "./images/animals/img17.png": "dog", "./images/animals/img18.png": "cat", "./images/animals/img19.png": "rabbit", "./images/animals/img20.png": "mouse", "./images/animals/img21.png": "snake", "./images/animals/img22.png": "frog", "./images/animals/img23.png": "bird", "./images/animals/img24.png": "eagle", 
    "./images/seaanimals/img1.png": "whale", "./images/seaanimals/img2.png": "shark", "./images/seaanimals/img3.png": "dolphin", "./images/seaanimals/img4.png": "sea turtle", "./images/seaanimals/img5.png": "fish", "./images/seaanimals/img6.png": "squid", "./images/seaanimals/img7.png": "jellyfish", "./images/seaanimals/img8.png": "shrimp", 
    "./images/bugs/img1.png": "ant", "./images/bugs/img2.png": "butterfly", "./images/bugs/img3.png": "grasshopper", "./images/bugs/img4.png": "spider", 
    "./images/nature/img1.png": "desert", "./images/nature/img2.png": "forest", "./images/nature/img3.png": "island", "./images/nature/img4.png": "lake", "./images/nature/img5.png": "mountain", "./images/nature/img6.png": "pond", "./images/nature/img7.png": "river", "./images/nature/img8.png": "savanna", "./images/nature/img9.png": "sea", "./images/nature/img10.png": "wetlands", "./images/nature/img11.png": "flower", "./images/nature/img12.png": "tree", 
    "./images/months/img1.png": "january", "./images/months/img2.png": "february", "./images/months/img3.png": "march", "./images/months/img4.png": "april", "./images/months/img5.png": "may", "./images/months/img6.png": "june", "./images/months/img7.png": "july", "./images/months/img8.png": "august", "./images/months/img9.png": "september", "./images/months/img10.png": "october", "./images/months/img11.png": "november", "./images/months/img12.png": "december", 
    "./images/seasons/img1.png": "spring", "./images/seasons/img2.png": "summer", "./images/seasons/img3.png": "fall", "./images/seasons/img4.png": "winter",
    "./images/timesofday/img1.png": "morning", "./images/timesofday/img2.png": "afternoon", "./images/timesofday/img3.png": "evening", "./images/timesofday/img4.png": "night", 
    "./images/days/img1.png": "Sunday", "./images/days/img2.png": "Monday", "./images/days/img3.png": "Tuesday", "./images/days/img4.png": "Wednesday", "./images/days/img5.png": "Thursday", "./images/days/img6.png": "Friday", "./images/days/img7.png": "Saturday", 
    "./images/countries/img1.png": "america", "./images/countries/img2.png": "australia", "./images/countries/img3.png": "brazil", "./images/countries/img4.png": "canada", "./images/countries/img5.png": "china", "./images/countries/img6.png": "egypt", "./images/countries/img7.png": "france", "./images/countries/img8.png": "germany", "./images/countries/img9.png": "ghana", "./images/countries/img10.png": "india", "./images/countries/img11.png": "italy", "./images/countries/img12.png": "japan", "./images/countries/img13.png": "kenya", "./images/countries/img14.png": "korea", "./images/countries/img15.png": "mongolia", "./images/countries/img16.png": "morocco", "./images/countries/img17.png": "norway", "./images/countries/img18.png": "peru", "./images/countries/img19.png": "russia", "./images/countries/img20.png": "singapore", "./images/countries/img21.png": "spain", "./images/countries/img22.png": "sweden", "./images/countries/img23.png": "thailand", "./images/countries/img24.png": "turkey", "./images/countries/img26.png": "vietnam", 
    "./images/family/img1.png": "grandfather", "./images/family/img2.png": "grandmother", "./images/family/img3.png": "mother", "./images/family/img4.png": "father", "./images/family/img5.png": "brother", "./images/family/img6.png": "me", "./images/family/img7.png": "sister", 
    "./images/people/img1.png": "boy", "./images/people/img2.png": "girl", "./images/people/img3.png": "friends", "./images/people/img4.png": "classmates",
    "./images/personalities/img1.png": "active", "./images/personalities/img2.png": "brave", "./images/personalities/img3.png": "friendly", "./images/personalities/img4.png": "funny", "./images/personalities/img5.png": "gentle", "./images/personalities/img6.png": "kind", "./images/personalities/img7.png": "strong",
    "./images/actions1/img1.png": "sing", "./images/actions1/img2.png": "run", "./images/actions1/img3.png": "jump", "./images/actions1/img4.png": "dance", "./images/actions1/img5.png": "swim", "./images/actions1/img6.png": "skate", "./images/actions1/img7.png": "go", "./images/actions1/img8.png": "stop", "./images/actions1/img9.png": "turn", "./images/actions1/img10.png": "eat", "./images/actions1/img11.png": "drink", "./images/actions1/img12.png": "cook", "./images/actions1/img13.png": "bake", "./images/actions1/img14.png": "clean", "./images/actions1/img15.png": "buy", "./images/actions1/img16.png": "ride", "./images/actions1/img17.png": "travel", "./images/actions1/img18.png": "study", "./images/actions1/img19.png": "teach", "./images/actions1/img20.png": "speak", "./images/actions1/img21.png": "listen", "./images/actions1/img22.png": "read", "./images/actions1/img23.png": "write", "./images/actions1/img24.png": "talk", "./images/actions1/img25.png": "draw", 
    "./images/pastactions/img1.png": "went", "./images/pastactions/img2.png": "ate", "./images/pastactions/img3.png": "saw", "./images/pastactions/img4.png": "enjoyed", "./images/pastactions/img5.png": "had", "./images/actions2/img1.png": "like", "./images/actions2/img2.png": "want", "./images/actions2/img3.png": "look", "./images/actions2/img4.png": "see", "./images/actions2/img5.png": "play", "./images/actions2/img6.png": "practice", "./images/actions2/img7.png": "try", "./images/actions2/img8.png": "enjoy", "./images/actions2/img9.png": "get", "./images/actions2/img10.png": "have", "./images/actions2/img11.png": "make", "./images/actions2/img12.png": "help", "./images/actions2/img13.png": "join", "./images/actions2/img14.png": "live", "./images/actions2/img15.png": "think",
    "./images/dailyactivities/img1.png": "get up", "./images/dailyactivities/img2.png": "brush my teeth", "./images/dailyactivities/img3.png": "take out the garbage", "./images/dailyactivities/img4.png": "get the newspaper", "./images/dailyactivities/img5.png": "eat breakfast", "./images/dailyactivities/img6.png": "go to school", "./images/dailyactivities/img7.png": "study English", "./images/dailyactivities/img8.png": "eat lunch", "./images/dailyactivities/img9.png": "go home", "./images/dailyactivities/img10.png": "play soccer", "./images/dailyactivities/img11.png": "walk my dog", "./images/dailyactivities/img12.png": "do my homework",  "./images/dailyactivities/img13.png": "eat dinner", "./images/dailyactivities/img14.png": "wash the dishes", "./images/dailyactivities/img15.png": "take a bath", "./images/dailyactivities/img16.png": "watch TV", "./images/dailyactivities/img17.png": "go to bed", "./images/frequency/img1.png": "always", "./images/frequency/img2.png": "usually", "./images/frequency/img3.png": "sometimes", "./images/frequency/img4.png": "never", 
    "./images/body/img1.png": "head", "./images/body/img2.png": "face", "./images/body/img3.png": "shoulder", "./images/body/img4.png": "hand", "./images/body/img5.png": "knee", "./images/body/img6.png": "eye", "./images/body/img7.png": "ear", "./images/body/img8.png": "nose", "./images/body/img9.png": "teeth", "./images/body/img10.png": "mouth", "./images/body/img11.png": "leg", "./images/body/img12.png": "toes", "./images/clothes/img1.png": "tshirt", "./images/clothes/img2.png": "shirt", "./images/clothes/img3.png": "vest", "./images/clothes/img4.png": "sweater", "./images/clothes/img5.png": "uniform", "./images/clothes/img6.png": "pants", "./images/clothes/img7.png": "cap", "./images/clothes/img8.png": "hat", "./images/clothes/img9.png": "gloves", "./images/clothes/img10.png": "socks",
    "./images/buildings/img1.png": "house", "./images/buildings/img2.png": "elementary school", "./images/buildings/img3.png": "junior high school", "./images/buildings/img4.png": "park", "./images/buildings/img5.png": "library", "./images/buildings/img6.png": "museum", "./images/buildings/img7.png": "city hall", "./images/buildings/img8.png": "hospital", "./images/buildings/img9.png": "bus stop", "./images/buildings/img10.png": "station", "./images/buildings/img11.png": "police station", "./images/buildings/img12.png": "fire station", "./images/buildings/img13.png": "gas station", "./images/buildings/img14.png": "post office", "./images/buildings/img15.png": "bookstore", "./images/buildings/img16.png": "convenience store", "./images/buildings/img17.png": "department store", "./images/buildings/img18.png": "restaurant", "./images/buildings/img19.png": "supermarket", "./images/buildings/img20.png": "flower shop", "./images/buildings/img21.png": "castle", "./images/buildings/img22.png": "shrine", "./images/buildings/img23.png": "temple", "./images/buildings/img24.png": "amusement park", "./images/buildings/img25.png": "aquarium", "./images/buildings/img26.png": "stadium", "./images/buildings/img27.png": "zoo", "./images/buildings/img28.png": "bridge", "./images/buildings/img29.png": "street", 
    "./images/directions/img1.png": "go", "./images/directions/img2.png": "straight", "./images/directions/img3.png": "turn", "./images/directions/img4.png": "right", "./images/directions/img5.png": "left", "./images/directions/img6.png": "block", "./images/directions/img7.png": "see",
    "./images/locations/img1.png": "by", "./images/locations/img2.png": "in", "./images/locations/img3.png": "on", "./images/locations/img4.png": "under",
    "./images/vehicles/img1.png": "bus", "./images/vehicles/img2.png": "car", "./images/vehicles/img3.png": "taxi", "./images/vehicles/img4.png": "truck", "./images/vehicles/img5.png": "train", "./images/vehicles/img6.png": "subway", "./images/vehicles/img7.png": "ship", "./images/vehicles/img8.png": "boat", "./images/vehicles/img9.png": "airplane", "./images/vehicles/img10.png": "bike",
    "./images/school/img1.png": "classroom", "./images/school/img2.png": "library", "./images/school/img3.png": "music room", "./images/school/img4.png": "gym", "./images/school/img5.png": "playground", "./images/school/img6.png": "swimming pool", "./images/school/img7.png": "teachers office", "./images/school/img8.png": "school nurses office", "./images/school/img9.png": "school principals office", "./images/school/img10.png": "entrance", "./images/school/img11.png": "restroom", "./images/school/img12.png": "science room", "./images/school/img13.png": "computer room", "./images/school/img14.png": "cooking room", "./images/school/img15.png": "arts and crafts room", "./images/school/img16.png": "lunch room", 
    "./images/subjects/img1.png": "english", "./images/subjects/img2.png": "japanese", "./images/subjects/img3.png": "caligraphy", "./images/subjects/img4.png": "social studies", "./images/subjects/img5.png": "math", "./images/subjects/img6.png": "science", "./images/subjects/img7.png": "music", "./images/subjects/img8.png": "arts and crafts", "./images/subjects/img9.png": "home economics", "./images/subjects/img10.png": "p.e", "./images/subjects/img11.png": "moral education",
    "./images/instruments/img1.png": "recorder", "./images/instruments/img2.png": "harmonica", "./images/instruments/img3.png": "triangle", "./images/instruments/img4.png": "piano", "./images/instruments/img5.png": "guitar", "./images/instruments/img6.png": "violin", "./images/instruments/img7.png": "drum", "./images/instruments/img8.png": "xylophone",
    "./images/stationary/img1.png": "crayon", "./images/stationary/img2.png": "marker", "./images/stationary/img3.png": "pen", "./images/stationary/img4.png": "pencil", "./images/stationary/img5.png": "pencil case", "./images/stationary/img6.png": "pencil sharpener", "./images/stationary/img7.png": "eraser", "./images/stationary/img8.png": "ruler", "./images/stationary/img9.png": "glue", "./images/stationary/img10.png": "scissors", "./images/stationary/img11.png": "stapler", "./images/stationary/img12.png": "notebook",
    "./images/commonitems/img1.png": "ball", "./images/commonitems/img2.png": "bat", "./images/commonitems/img3.png": "racket", "./images/commonitems/img4.png": "bag", "./images/commonitems/img5.png": "plastic bag", "./images/commonitems/img6.png": "basket", "./images/commonitems/img7.png": "box", "./images/commonitems/img8.png": "cup", "./images/commonitems/img9.png": "watch", "./images/commonitems/img10.png": "clock", "./images/commonitems/img11.png": "book", "./images/commonitems/img12.png": "textbook", "./images/commonitems/img13.png": "comic book", "./images/commonitems/img14.png": "computer", "./images/commonitems/img15.png": "calendar", "./images/commonitems/img16.png": "map", "./images/commonitems/img17.png": "pictures", "./images/commonitems/img18.png": "umbrella", "./images/commonitems/img19.png": "present", "./images/commonitems/img20.png": "treasure", "./images/commonitems/img21.png": "desk", "./images/commonitems/img22.png": "chair", "./images/commonitems/img23.png": "wheelchair", "./images/commonitems/img24.png": "table", "./images/commonitems/img25.png": "bath", "./images/commonitems/img26.png": "bed", "./images/commonitems/img27.png": "wall", "./images/commonitems/img28.png": "window",
    "./images/activities/img1.png": "camping", "./images/activities/img2.png": "fishing", "./images/activities/img3.png": "hiking", "./images/activities/img4.png": "shopping", "./images/activities/img5.png": "reading", "./images/activities/img6.png": "running", "./images/activities/img7.png": "jogging", "./images/activities/img8.png": "kite flying", "./images/activities/img9.png": "top spinning", "./images/activities/img10.png": "cards", "./images/activities/img11.png": "rock paper scissors", "./images/activities/img12.png": "tag", "./images/activities/img13.png": "jump rope", "./images/activities/img14.png": "unicycle",
    "./images/schoolevents/img1.png": "field trip", "./images/schoolevents/img2.png": "school trip", "./images/schoolevents/img3.png": "chorus contest", "./images/schoolevents/img4.png": "drama festival", "./images/schoolevents/img5.png": "music festival", "./images/schoolevents/img6.png": "school festival", "./images/schoolevents/img7.png": "volunteer day", "./images/schoolevents/img8.png": "sports day", "./images/schoolevents/img9.png": "swimming meet", "./images/schoolevents/img10.png": "fire drill", "./images/schoolevents/img11.png": "summer vacation", "./images/schoolevents/img12.png": "entrance ceremony", "./images/schoolevents/img13.png": "graduation ceremony", 
    "./images/yearlyevents/img1.png": "birthday", "./images/yearlyevents/img2.png": "new years day", "./images/yearlyevents/img3.png": "dolls festival", "./images/yearlyevents/img4.png": "april fools day", "./images/yearlyevents/img5.png": "childrens day", "./images/yearlyevents/img6.png": "star festival", "./images/yearlyevents/img7.png": "fireworks", "./images/yearlyevents/img8.png": "halloween", "./images/yearlyevents/img9.png": "christmas day", "./images/yearlyevents/img10.png": "new years eve", 
    "./images/conditions/img1.png": "big", "./images/conditions/img2.png": "small", "./images/conditions/img3.png": "long", "./images/conditions/img4.png": "short", "./images/conditions/img5.png": "new", "./images/conditions/img6.png": "old", "./images/conditions/img7.png": "easy", "./images/conditions/img8.png": "difficult", "./images/conditions/img9.png": "same", "./images/conditions/img10.png": "different", "./images/conditions/img11.png": "fast", "./images/conditions/img12.png": "slow", 
    "./images/descriptions/img1.png": "good", "./images/descriptions/img2.png": "great", "./images/descriptions/img3.png": "nice", "./images/descriptions/img4.png": "fantastic", "./images/descriptions/img5.png": "wonderful", "./images/descriptions/img6.png": "beautiful", "./images/descriptions/img7.png": "cool", "./images/descriptions/img8.png": "cute", "./images/descriptions/img9.png": "favorite", "./images/descriptions/img10.png": "interesting", "./images/descriptions/img11.png": "exciting", "./images/descriptions/img12.png": "famous", "./images/descriptions/img13.png": "popular", "./images/descriptions/img14.png": "international", "./images/descriptions/img15.png": "fun",
    "./images/jobs/img1.png": "artist", "./images/jobs/img2.png": "musician", "./images/jobs/img3.png": "singer", "./images/jobs/img4.png": "comedian", "./images/jobs/img5.png": "doctor", "./images/jobs/img6.png": "nurse", "./images/jobs/img7.png": "dentist", "./images/jobs/img8.png": "vet", "./images/jobs/img9.png": "zookeeper", "./images/jobs/img10.png": "cook", "./images/jobs/img11.png": "baker", "./images/jobs/img12.png": "florist", "./images/jobs/img13.png": "farmer", "./images/jobs/img14.png": "police officer", "./images/jobs/img15.png": "fire fighter", "./images/jobs/img16.png": "pilot", "./images/jobs/img17.png": "flight attendant", "./images/jobs/img18.png": "bus driver", "./images/jobs/img19.png": "astronaut", "./images/jobs/img20.png": "teacher", "./images/jobs/img21.png": "scientist", "./images/jobs/img22.png": "programmer", "./images/jobs/img23.png": "baseball player", "./images/jobs/img24.png": "soccer player", "./images/jobs/img25.png": "figure skater", 
    "./images/clubactivities/img1.png": "baseball", "./images/clubactivities/img2.png": "softball", "./images/clubactivities/img3.png": "basketball", "./images/clubactivities/img4.png": "volleyball", "./images/clubactivities/img5.png": "soccer", "./images/clubactivities/img6.png": "tennis", "./images/clubactivities/img7.png": "table tennis", "./images/clubactivities/img8.png": "badminton", "./images/clubactivities/img9.png": "track and field", "./images/clubactivities/img10.png": "gymnastics", "./images/clubactivities/img11.png": "art", "./images/clubactivities/img12.png": "drama", "./images/clubactivities/img13.png": "broadcasting", "./images/clubactivities/img14.png": "cooking", "./images/clubactivities/img15.png": "newspaper", "./images/clubactivities/img16.png": "photography", "./images/clubactivities/img17.png": "brass band", "./images/clubactivities/img18.png": "chorus"
}

const allImage = Object.keys(allObj)
const allText = Object.values(allObj)

function getKey(obj, value) {
    return Object.keys(obj).find(key => obj[key] === value)
}

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
    "hard": 18,
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
    gridContainer.classList.add(difficulty)
    for (let i = 0; i < gridWidth*gridDepth; i++ ) {
        gridContainer.innerHTML += `
        <div class="grid-box"><span>${i}</span><?div>
        `
    }
}


// let mouseDown = false
// window.addEventListener("mousedown",(e)=>{
//     console.log("mouse is down")
//     mouseDown = true
//     let target = document.elementFromPoint(e.x,e.y)
//     if ( target.classList.contains("grid-box") ) {
//         target.classList.add("selected")
//     } else if ( target.parentElement.classList.contains("grid-box") ) {
//         target.parentElement.classList.add("selected")
//     }
// })

// window.addEventListener("mousemove",(e)=> {
//     e.preventDefault()
//     let moveTarget = document.elementFromPoint(e.x,e.y)
//     if ( mouseDown ) {
//         if ( moveTarget.classList.contains("grid-box") ) {
//             moveTarget.classList.add("selected")
//             checkAnswer(answerArr)
//         } else if ( moveTarget.parentElement.classList.contains("grid-box") ) {
//             moveTarget.parentElement.classList.add("grid-box")
//         }
//     }
// })
// window.addEventListener("mouseup",(e)=>{
//     mouseDown = false
// })

// window.addEventListener("touchmove",getTouchPosition)

// let touchX = 0
// let touchY = 0

// function getTouchPosition(event) {
//     let touch = event.touches[0]
//     touchX = Math.floor(touch.pageX)
//     touchY = Math.floor(touch.pageY)
// }


function checkAnswer(answerArr) {
    gridBoxes = document.querySelectorAll(".grid-box")
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
        })
    }
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
        console.log(answersList)
        gridBoxes = document.querySelectorAll(".grid-box")
        gridBoxes.forEach( (box) =>{
            box.addEventListener("click",()=>{
                if ( !box.classList.contains("answer-finished") ) {
                    if ( !box.classList.contains("selected") ) {
                        box.classList.add("selected")
                        checkAnswer(answerArr)
                    } else {
                        box.classList.remove("selected")
                    }
                }
            })
            // box.addEventListener("touchmove",()=>{
            //     let touchTarget = document.elementFromPoint(touchX,touchY)
            //     if ( touchTarget.classList.contains("grid-box") ) {
            //         if ( !touchTarget.classList.contains("answer-finished") ) {
            //             touchTarget.classList.add("selected")
            //         }
            //     } else if ( touchTarget.parentElement.classList.contains("grid-box") ) {
            //         if ( !touchTarget.parentElement.classList.contains("answer-finished") ) {
            //             touchTarget.parentElement.classList.add("selected")
            //         }
            //     }
            // })
            if ( !box.classList.contains("filled") ) {
                box.children[0].textContent = alphabet[ Math.floor( Math.random()*26 ) ]
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
        gridBoxes[index+i].children[0].textContent = noSpaceWord[i]
        gridBoxes[index+i].classList.add("filled")
        tempAnswerIndexes.push(index+i)
    }
    wordCounter++
    let finalWord = word.join("").toLowerCase()
    let wordImage = getKey(allObj,finalWord)
    let answerWord = finalWord.replaceAll(" ","")
    answersList[answerWord] = tempAnswerIndexes
    answerDisplay.innerHTML += `<div class="answer-image-box"><img src="${wordImage}"><div class="answer-image-text"><span>${finalWord}</span></div>`
    populateGrid()
}
function goDown(word,index) {
    gridBoxes = document.querySelectorAll(".grid-box")
    let noSpaceWord = word.filter( (a)=> {return a != " " })
    let tempAnswerIndexes = []
    for ( let i = 0; i < noSpaceWord.length; i ++ ) {
        gridBoxes[index+(i*gridWidth)].children[0].textContent = noSpaceWord[i]
        gridBoxes[index+(i*gridWidth)].classList.add("filled")
        tempAnswerIndexes.push(index+(i*gridWidth))
    }
    wordCounter++
    let finalWord = word.join("").toLowerCase()
    let wordImage = getKey(allObj,finalWord)
    let answerWord = finalWord.replaceAll(" ","")
    answersList[answerWord] = tempAnswerIndexes
    answerDisplay.innerHTML += `<div class="answer-image-box"><img src="${wordImage}"><div class="answer-image-text"><span>${finalWord}</span></div>`
    populateGrid()
}
function goDiagonal(word,index) {
    gridBoxes = document.querySelectorAll(".grid-box")
    let noSpaceWord = word.filter( (a)=> {return a != " " })
    let tempAnswerIndexes = []
    for ( let i = 0; i < noSpaceWord.length; i ++ ) {
        gridBoxes[(index+(i*gridWidth))+i].children[0].textContent = noSpaceWord[i]
        gridBoxes[(index+(i*gridWidth))+i].classList.add("filled")
        tempAnswerIndexes.push((index+(i*gridWidth))+i)
    }
    wordCounter++
    let finalWord = word.join("").toLowerCase()
    let wordImage = getKey(allObj,finalWord)
    let answerWord = finalWord.replaceAll(" ","")
    answersList[answerWord] = tempAnswerIndexes
    answerDisplay.innerHTML += `<div class="answer-image-box"><img src="${wordImage}"><div class="answer-image-text"><span>${finalWord}</span></div>`
    populateGrid()
}

const allPresets = {
    "preset-sports": {
        "easy": {
            "preset1": {"badminton": [12, 13, 14, 15, 16, 17, 18, 19, 20],"dodgeball": [50, 51, 52,  53, 54, 55, 56, 57, 58], "swimming": [ 86, 87,88,89,90,91,92,93],"softball": [11,23,35,47,59,71,83,95],"skating": [73,74,75,76,77,78,79],"tennis": [61,62,63,64,65,66],"soccer": [41,42,43,44,45,46],"skiing": [1,2,3,4,5,6]},
            "preset2": {"badminton": [60,61,62,63,64,65,66,67,68],"dodgeball": [12,13,14,15,16,17,18,19,20],"softball": [84,85,86,87,88,89,90,91],"baseball": [11,23,35,47,59,71,83,95],"swimming": [39,40,41,42,43,44,45,46],"skating": [75,76,77,78,79,80,81],"soccer": [26,27,28,29,30,31],"skiing": [49,50,51,52,53,54]},
            "preset3": {"badminton": [86,87,88,89,90,91,92,93,94],"dodgeball": [2,3,4,5,6,7,8,9,10],"swimming": [48,49,50,51,52,53,54,55],"softball": [73,74,75,76,77,78,79,80],"skating": [36,37,38,39,40,41,42],"soccer": [64,65,66,67,68,69],"tennis": [22,34,46,58,70,82],"skiing": [26,27,28,29,30,31]},
            "preset4": {"dodgeball": [72,73,74,75,76,77,78,79,80],"badminton": [48,49,50,51,52,53,54,55,56],"softball": [3,4,5,6,7,8,9,10],"baseball": [38,39,40,41,42,43,44,45],"swimming": [24,25,26,27,28,29,30,31],"skating": [15,16,17,18,19,20,21],"tennis": [61,62,63,64,65,66],"soccer": [87,88,89,90,91,92]},
            "preset5": {"badminton": [60,61,62,63,64,65,66,67,68],"dodgeball": [12,13,14,15,16,17,18,19,20],"swimming": [36,37,38,39,40,41,42,43],"baseball": [25,26,27,28,29,30,31,32],"softball": [75,76,77,78,79,80,81,82],"skating": [87,88,89,90,91,92,93],"tennis": [10,22,34,46,58,70],"skiing": [48,49,50,51,52,53]},
            "preset6": {"dodgeball": [72,73,74,75,76,77,78,79,80],"badminton": [14,15,16,17,18,19,20,21,22],"baseball": [63,64,65,66,67,68,69,70],"swimming": [48,49,50,51,52,53,54,55],"softball": [2,3,4,5,6,7,8,9],"skating": [84,85,86,87,88,89,90],"soccer": [41,42,43,44,45,46],"tennis": [25,26,27,28,29,30]},
            "preset7": {"badminton": [12,13,14,15,16,17,18,19,20],"baseball": [85,86,87,88,89,90,91,92],"swimming": [24,25,26,27,28,29,30,31],"softball": [2,3,4,5,6,7,8,9],"skating": [39,40,41,42,43,44,45],"soccer": [35,47,59,71,83,95],"tennis": [50,51,52,53,54,55],"skiing": [10,22,34,46,58,70]},
            "preset8": {"badminton": [37,38,39,40,41,42,43,44,45],"dodgeball": [12,13,14,15,16,17,18,19,20],"swimming": [63,64,65,66,67,68,69,70],"baseball": [0,1,2,3,4,5,6,7],"softball": [11,23,35,47,59,71,83,95],"skating": [24,25,26,27,28,29,30],"tennis": [49,50,51,52,53,54],"skiing": [24,36,48,60,72,84]},
            "preset9": {"dodgeball": [38,39,40,41,42,43,44,45,46],"badminton": [61,62,63,64,65,66,67,68,69],"baseball": [49,50,51,52,53,54,55,56],"softball": [11,23,35,47,59,71,83,95],"skating": [76,77,78,79,80,81,82],"skiing": [13,14,15,16,17,18],"soccer": [0,12,24,36,48,60],"tennis": [84,85,86,87,88,89]},
            "preset10": {"dodgeball": [49,50,51,52,53,54,55,56,57],"badminton": [12,13,14,15,16,17,18,19,20],"softball": [75,76,77,78,79,80,81,82],"swimming": [11,23,35,47,59,71,83,95],"baseball": [0,1,2,3,4,5,6,7],"skating": [88,89,90,91,92,93,94],"skiing": [36,37,38,39,40,41],"soccer": [60,61,62,63,64,65]},
            "preset11": { "dodgeball": [ 14, 15, 16, 17, 18, 19, 20, 21, 22 ], "badminton": [ 37, 38, 39, 40, 41, 42, 43, 44, 45 ], "swimming": [ 51, 52, 53, 54, 55, 56, 57, 58 ], "softball": [ 3, 4, 5, 6, 7, 8, 9, 10 ], "skating": [ 88, 89, 90, 91, 92, 93, 94 ], "skiing": [ 75, 76, 77, 78, 79, 80 ], "tennis": [ 23, 35, 47, 59, 71, 83 ], "soccer": [ 62, 63, 64, 65, 66, 67 ] },
            "preset12": { "dodgeball": [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ], "softball": [ 87, 88, 89, 90, 91, 92, 93, 94 ], "baseball": [ 62, 63, 64, 65, 66, 67, 68, 69 ], "swimming": [ 25, 26, 27, 28, 29, 30, 31, 32 ], "skating": [ 48, 49, 50, 51, 52, 53, 54 ], "tennis": [ 39, 40, 41, 42, 43, 44 ], "soccer": [ 75, 76, 77, 78, 79, 80 ], "skiing": [ 35, 47, 59, 71, 83, 95 ] },
            "preset13": {},
            "preset14": {},
            "preset15": {},
            "preset16": {},
            "preset17": {},
            "preset18": {},
            "preset19": {},
            "preset20": {},
        },
        "medium": {
            "preset1": { "table tennis": [ 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87 ], "basketball": [ 124, 125, 126, 127, 128, 129, 130, 131, 132, 133 ], "volleyball": [ 137, 138, 139, 140, 141, 142, 143, 144, 145, 146 ], "badminton": [ 2, 3, 4, 5, 6, 7, 8, 9, 10 ], "dodgeball": [ 63, 64, 65, 66, 67, 68, 69, 70, 71 ], "baseball": [ 49, 50, 51, 52, 53, 54, 55, 56 ], "softball": [ 19, 20, 21, 22, 23, 24, 25, 26 ], "swimming": [ 107, 108, 109, 110, 111, 112, 113, 114 ], "skating": [ 30, 45, 60, 75, 90, 105, 120 ], "tennis": [ 61, 76, 91, 106, 121, 136 ], "skiing": [ 31, 32, 33, 34, 35, 36 ], "soccer": [ 59, 74, 89, 104, 119, 134 ] },
            "preset2": { "table tennis": [ 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86 ], "volleyball": [ 13, 28, 43, 58, 73, 88, 103, 118, 133, 148 ], "basketball": [ 30, 31, 32, 33, 34, 35, 36, 37, 38, 39 ], "badminton": [ 137, 138, 139, 140, 141, 142, 143, 144, 145 ], "dodgeball": [ 27, 42, 57, 72, 87, 102, 117, 132, 147 ], "swimming": [ 49, 50, 51, 52, 53, 54, 55, 56 ], "softball": [ 4, 5, 6, 7, 8, 9, 10, 11 ], "baseball": [ 61, 62, 63, 64, 65, 66, 67, 68 ], "skating": [ 14, 29, 44, 59, 74, 89, 104 ], "skiing": [ 60, 75, 90, 105, 120, 135 ], "soccer": [ 106, 107, 108, 109, 110, 111 ], "tennis": [ 81, 82, 83, 84, 85, 86 ] },
            "preset3": { "table tennis": [ 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146 ], "basketball": [ 106, 107, 108, 109, 110, 111, 112, 113, 114, 115 ], "volleyball": [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ], "dodgeball": [ 95, 96, 97, 98, 99, 100, 101, 102, 103 ], "badminton": [ 65, 66, 67, 68, 69, 70, 71, 72, 73 ], "baseball": [ 50, 51, 52, 53, 54, 55, 56, 57 ], "softball": [ 17, 18, 19, 20, 21, 22, 23, 24 ], "swimming": [ 123, 124, 125, 126, 127, 128, 129, 130 ], "skating": [ 81, 82, 83, 84, 85, 86, 87 ], "tennis": [ 59, 74, 89, 104, 119, 134 ], "skiing": [ 37, 38, 39, 40, 41, 42 ], "soccer": [ 75, 76, 77, 78, 79, 80 ] },
            "preset4": { "table tennis": [ 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71 ], "basketball": [ 31, 32, 33, 34, 35, 36, 37, 38, 39, 40 ], "volleyball": [ 91, 92, 93, 94, 95, 96, 97, 98, 99, 100 ], "dodgeball": [ 5, 6, 7, 8, 9, 10, 11, 12, 13 ], "badminton": [ 137, 138, 139, 140, 141, 142, 143, 144, 145 ], "swimming": [ 43, 58, 73, 88, 103, 118, 133, 148 ], "baseball": [ 15, 30, 45, 60, 75, 90, 105, 120 ], "softball": [ 121, 122, 123, 124, 125, 126, 127, 128 ], "skating": [ 29, 44, 59, 74, 89, 104, 119 ], "skiing": [ 71, 86, 101, 116, 131, 146 ], "soccer": [ 109, 110, 111, 112, 113, 114 ], "tennis": [ 42, 57, 72, 87, 102, 117 ] },
            "preset5": { "table tennis": [ 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85 ], "volleyball": [ 61, 62, 63, 64, 65, 66, 67, 68, 69, 70 ], "basketball": [ 49, 50, 51, 52, 53, 54, 55, 56, 57, 58 ], "badminton": [ 135, 136, 137, 138, 139, 140, 141, 142, 143 ], "dodgeball": [ 5, 6, 7, 8, 9, 10, 11, 12, 13 ], "softball": [ 90, 91, 92, 93, 94, 95, 96, 97 ], "baseball": [ 30, 31, 32, 33, 34, 35, 36, 37 ], "swimming": [ 120, 121, 122, 123, 124, 125, 126, 127 ], "skating": [ 105, 106, 107, 108, 109, 110, 111 ], "skiing": [ 20, 21, 22, 23, 24, 25 ], "soccer": [ 72, 87, 102, 117, 132, 147 ], "tennis": [ 59, 74, 89, 104, 119, 134 ] },
            "preset6": { "table tennis": [ 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116 ], "volleyball": [ 123, 124, 125, 126, 127, 128, 129, 130, 131, 132 ], "basketball": [ 93, 94, 95, 96, 97, 98, 99, 100, 101, 102 ], "badminton": [ 61, 62, 63, 64, 65, 66, 67, 68, 69 ], "dodgeball": [ 135, 136, 137, 138, 139, 140, 141, 142, 143 ], "swimming": [ 16, 17, 18, 19, 20, 21, 22, 23 ], "baseball": [ 48, 49, 50, 51, 52, 53, 54, 55 ], "softball": [ 15, 30, 45, 60, 75, 90, 105, 120 ], "skating": [ 28, 43, 58, 73, 88, 103, 118 ], "tennis": [ 14, 29, 44, 59, 74, 89 ], "soccer": [ 3, 4, 5, 6, 7, 8 ], "skiing": [ 31, 32, 33, 34, 35, 36 ] },
            "preset7": {"badminton": [12,13,14,15,16,17,18,19,20],"baseball": [85,86,87,88,89,90,91,92],"swimming": [24,25,26,27,28,29,30,31],"softball": [2,3,4,5,6,7,8,9],"skating": [39,40,41,42,43,44,45],"soccer": [35,47,59,71,83,95],"tennis": [50,51,52,53,54,55],"skiing": [10,22,34,46,58,70]},
            "preset8": {"badminton": [37,38,39,40,41,42,43,44,45],"dodgeball": [12,13,14,15,16,17,18,19,20],"swimming": [63,64,65,66,67,68,69,70],"baseball": [0,1,2,3,4,5,6,7],"softball": [11,23,35,47,59,71,83,95],"skating": [24,25,26,27,28,29,30],"tennis": [49,50,51,52,53,54],"skiing": [24,36,48,60,72,84]},
            "preset9": {"dodgeball": [38,39,40,41,42,43,44,45,46],"badminton": [61,62,63,64,65,66,67,68,69],"baseball": [49,50,51,52,53,54,55,56],"softball": [11,23,35,47,59,71,83,95],"skating": [76,77,78,79,80,81,82],"skiing": [13,14,15,16,17,18],"soccer": [0,12,24,36,48,60],"tennis": [84,85,86,87,88,89]},
            "preset10": {"dodgeball": [49,50,51,52,53,54,55,56,57],"badminton": [12,13,14,15,16,17,18,19,20],"softball": [75,76,77,78,79,80,81,82],"swimming": [11,23,35,47,59,71,83,95],"baseball": [0,1,2,3,4,5,6,7],"skating": [88,89,90,91,92,93,94],"skiing": [36,37,38,39,40,41],"soccer": [60,61,62,63,64,65]},
            "preset11": { "dodgeball": [ 14, 15, 16, 17, 18, 19, 20, 21, 22 ], "badminton": [ 37, 38, 39, 40, 41, 42, 43, 44, 45 ], "swimming": [ 51, 52, 53, 54, 55, 56, 57, 58 ], "softball": [ 3, 4, 5, 6, 7, 8, 9, 10 ], "skating": [ 88, 89, 90, 91, 92, 93, 94 ], "skiing": [ 75, 76, 77, 78, 79, 80 ], "tennis": [ 23, 35, 47, 59, 71, 83 ], "soccer": [ 62, 63, 64, 65, 66, 67 ] },
            "preset12": { "dodgeball": [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ], "softball": [ 87, 88, 89, 90, 91, 92, 93, 94 ], "baseball": [ 62, 63, 64, 65, 66, 67, 68, 69 ], "swimming": [ 25, 26, 27, 28, 29, 30, 31, 32 ], "skating": [ 48, 49, 50, 51, 52, 53, 54 ], "tennis": [ 39, 40, 41, 42, 43, 44 ], "soccer": [ 75, 76, 77, 78, 79, 80 ], "skiing": [ 35, 47, 59, 71, 83, 95 ] },
            "preset13": {},
            "preset14": {},
            "preset15": {},
            "preset16": {},
            "preset17": {},
            "preset18": {},
            "preset19": {},
            "preset20": {},
        }
    }
}