import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {cardsManager} from "./cardsManager.js"
import {renameTitle} from "./boardsManager.js";


export let columnManager = {
    loadColumns: async function (boardId) {
        const statuses = await dataHandler.getStatuses()
        for (let status of statuses) {
            const columnBuilder = htmlFactory(htmlTemplates.column)
            const content = columnBuilder(boardId, status)
            domManager.addChild(`.board-columns[data-board-id="${boardId}"]`, content)
            domManager.addEventListener(
                `.board-column-title[data-column-id="${status.id}"][data-board-id="${boardId}"]`,
                'click',
                (e)=>{
                    let title = e.target
                    renameColumnTitle(status.id, title)
                }
                )
        }
        cardsManager.loadCards(boardId).then()
    }
}

function renameColumnTitle(statusId, colTitle) {
    const boardId = colTitle.parentNode.attributes[2].value;
    const currentBoard = document.querySelector(`.board[data-board-id="${boardId}"]`);

    const inputDiv = document.createElement('div');
    inputDiv.innerHTML = `<div class="input-div" data-column-id="${statusId}">
                            <input class="input-field" data-column-id="${statusId}">
                            <button class="save-btn" data-column-id="${statusId}">Save</button>
                           </div>`;
    // this should be toggled....

    currentBoard.appendChild(inputDiv);
    const saveBtn = inputDiv.children[0].children[1];
    saveBtn.addEventListener("click", removeDivHandler);
}

async function removeDivHandler(event){
    const inputDiv = event.currentTarget.parentNode;
    const inputValue = inputDiv.children[0].value;
    const columnId = inputDiv.children[0].dataset.columnId;
    inputDiv.parentNode.parentNode.removeChild(inputDiv.parentNode);
    await dataHandler.renameColumn(inputValue, columnId);
    renderNewColTitle(inputValue, columnId);
}

function renderNewColTitle(inputValue, columnId) {
    let colTitleDiv = document.querySelector(`div.board-column-title[data-column-id="${columnId}"]`);
    colTitleDiv.children[0].innerText = `${inputValue}`;
}