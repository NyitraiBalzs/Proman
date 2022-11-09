import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {boardsManager} from "./boardsManager.js";
import {initDragAndDrop} from "./dragndrop.js"

export let cardsManager = {
    loadCards: async function (boardId) {
        const columns = document.querySelectorAll(`.board-column-content[data-board-id="${boardId}"]`)
        const cards = await dataHandler.getCardsByBoardId(boardId);
        for (let card of cards) {
            const cardBuilder = htmlFactory(htmlTemplates.card);
            const content = cardBuilder(card);
            for (let column of columns) {
                let columnId = parseInt(column.dataset["columnId"])
                if(card["status_id"] === columnId) {
                    domManager.addChild(`.board-column-content[data-board-id="${boardId}"][data-column-id="${columnId}"]`, content);

                    domManager.addEventListener(
                        `.card[data-card-id="${card.id}"]`,
                        "click",
                        editCard
                    );
                    domManager.addEventListener(
                        `.card-remove[data-card-id="${card.id}"]`,
                        "click",
                        deleteButtonHandler
                    );
                    domManager.addEventListener(
                        `.card-title[data-card-id="${card.id}"]`,
                        "click",
                        renameTitle
                    );
                    startDragnDrop(boardId)
                }
        }
        }
    },
};

function editCard(clickEvent) {
}

async function deleteButtonHandler(clickEvent) {
    const cardId = clickEvent.target.parentElement.dataset.cardId;
    let response = await dataHandler.getCard(cardId, "delete", `/api/cards/delete/`, cardId)
    if (response) {
        document.querySelector(`div[data-card-id="${cardId}"]`).remove()
    }
}

function renameTitle(clickEvent) {
    const cardId = clickEvent.target.dataset.cardId;
    let title = document.querySelector(`.card-title[data-card-id=\"${cardId}\"]`);
    let inputDiv = document.querySelector(`.input-div[data-card-id="${cardId}"]`);
    let inputField = document.querySelector(`.input-field[data-card-id="${cardId}"]`);
    let saveBtn = document.querySelector(`.save-btn[data-card-id="${cardId}"]`);

    title.classList.toggle("hide")
    inputField.value=title.textContent
    inputDiv.classList.toggle("hide")

    saveBtn.addEventListener("click", () =>{
    title.classList.remove("hide")
    inputDiv.classList.add("hide")
    title.textContent=inputField.value
    let table = 'cards'
    dataHandler.newBoardTitle(inputField.value, cardId, table)
    })
}

export function startDragnDrop(){
    initDragAndDrop();
}