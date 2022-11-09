import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {cardsManager} from "./cardsManager.js";
import {columnManager} from "./coulumnManeger.js";
import {startDragnDrop}from "./cardsManager.js"

export let boardsManager = {

    loadBoards: async function () {
        let currenBoardId = 0;
        document.querySelector("#root").innerHTML = ""
        const boards = await dataHandler.getBoards();
        for (let board of boards) {
            const boardBuilder = htmlFactory(htmlTemplates.board);
            const content = boardBuilder(board);
            currenBoardId = board.id
            domManager.addChild("#root", content);
            console.log('table')
            domManager.addEventListener(
                `.board-toggle[data-board-id="${board.id}"]`,
                "click",
                () => {
                    showHideButtonHandler(board.id)
                }
            )
            document.getElementById('add-board').dataset.current_board_id = `${currenBoardId}`
            domManager.addEventListener(
                `#add-board[data-current_board_id="${currenBoardId}"]`,
                'click',
                displayNewBoardInput
            );
            domManager.addEventListener(
                `button#add-card-${board.id}.board-add`,
                "click",
                addNewCardHandler
            );
            domManager.addEventListener(
                `.board-col[data-board-id="${board.id}"]`,
                "click",
                addNewColumnHandler
            )
            domManager.addEventListener(
                `.board-title[data-board-id="${board.id}"]`,
                "click",
                () => {
                    let title = document.querySelector(`.board-title[data-board-id="${board.id}"]`)
                    renameTitle(board.id, 'board', title)
                }
            );
            domManager.addEventListener(
            `#deleteBoardButton[data-board-id="${board.id}"]`,
            "click",
            deleteBoardButtonHandler
            );

            columnManager.loadColumns(board.id).then()
        }
            registerButton()

    }

}

function showHideButtonHandler(boardId) {
        const columnContainer= document.querySelector(`.board-columns[data-board-id="${boardId}"]`)
        if (columnContainer.className === 'board-columns' || columnContainer.className === 'board-columns hide') {
            columnContainer.classList.toggle('hide');
    }
}



function displayNewBoardInput() {
    addNewBoardButton()
    domManager.addEventListener('#add-board-btn',
        'click', addNewBoard)
}

async function addNewBoard() {
    const inputValue = document.querySelector('#new-board').value
    if (inputValue) {
        const title = {'title': inputValue}
        let response = await dataHandler.createNewBoard(title)
        if (response) await boardsManager.loadBoards()
        addNewBoardButton()
    }
}


export function renameTitle(targetId, target, title) {
    let inputDiv = document.querySelector(`.input-div[data-${target}-id="${targetId}"]`);
    let inputField = document.querySelector(`.input-field[data-${target}-id="${targetId}"]`);
    let saveBtn = document.querySelector(`.save-btn[data-${target}-id="${targetId}"]`);
    title.classList.toggle("hide")
    inputField.value = title.innerText
    inputDiv.classList.toggle("hide")
    saveBtn.addEventListener("click", () => {
        title.classList.remove("hide")
        inputDiv.classList.add("hide")
        title.textContent = inputField.value
        let table = 'boards' ? target === 'board' : target === 'card' ? 'cards' : 'statuses'

        dataHandler.newBoardTitle(inputField.value, targetId, table)
    })
}

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

function htmlToElements(html) {
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.childNodes;
}

async function addNewCardHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    let response = dataHandler.createNewCard("New Card", boardId, 1)
    if (response) {
        const cards = await dataHandler.getCardsByBoardId(boardId)
        let newCard = cards[cards.length-1]
        let addCard = htmlFactory(htmlTemplates.card)
        const currentBoard = document.querySelector(`section[data-board-id="${boardId}"]`)
        let newAddedCard = htmlToElement(addCard(newCard))

        if (document.querySelector(`.board-columns[data-board-id="${boardId}"]`).classList.contains('hide') === false) {
            currentBoard.appendChild(newAddedCard)
        }

        startDragnDrop(boardId)

        const cardsAfterAdd = await dataHandler.getCardsByBoardId(boardId)
        const lastCard = cardsAfterAdd[cardsAfterAdd.length-1]

        lastCard.addEventListener("click", renameTitle);
    }
}

function addNewBoardButton() {
    const addNewBoardInput = document.getElementById('add-new-board-input')
    if (addNewBoardInput.style.display === 'block') {
        addNewBoardInput.style.display = 'none'
    } else {
        addNewBoardInput.style.display = 'block'
    }
}

function registerButton(){
    const addNewUser = document.getElementById('new-board-container')

}
function deleteBoardButtonHandler(clickEvent){
    const boardId = clickEvent.currentTarget.dataset.boardId;
    const boardToDelete =document.getElementsByClassName("board-container");
    for (let row of boardToDelete) {
        let rowId = row.getAttribute("data-board-id")
            if (rowId === boardId) {
                debugger;
                row.remove();
                dataHandler.deleteBoard(boardId).then()
        }
    }
}
async function addNewColumnHandler() {

        let response = await dataHandler.createNewColumn("New Column")
        if (response) await boardsManager.loadBoards()
}