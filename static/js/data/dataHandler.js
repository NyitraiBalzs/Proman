export let dataHandler = {
    getBoards: async function () {
        return await apiGet("/api/boards");
    },
    getBoard: async function (boardId) {
        // the board is retrieved and then the callback function is called with the board
    },
    getStatuses: async function () {
        return await apiGet("/api/statuses");
    },
    getStatus: async function (statusId) {
        // the status is retrieved and then the callback function is called with the status
    },
    getCardsByBoardId: async function (boardId) {
        return await apiGet(`/api/boards/${boardId}/cards/`);
    },
    getCard: async function (cardId, method, url, patch) {
        const data = {id: cardId, table_name: "cards"}
        if (method === "delete") {
            return await apiDelete(url, data);
        } else if (method === "patch") {
            return await apiPatch(url, patch);
        }
        // the card is retrieved and then the callback function is called with the card
    },
    createNewBoard: async function (boardTitle) {
        return await apiPost('/api/boards', boardTitle)
        // creates new board, saves it and calls the callback function with its data
    },
    createNewColumn: async function (columnTitle) {
         return await apiPost('/api/statuses', columnTitle)
    },
    createNewCard: async function (cardTitle, boardId, statusId) {
        return await apiPost(`/api/boards/${boardId}/new_card/`, [cardTitle, boardId, statusId])
    },
    newBoardTitle: async function (dataTitle, dataId, dataTable) {
        const data={
            dataTitle : dataTitle,
            dataId : dataId,
            dataTable : dataTable
        }
        return await apiPatch(`/rename_board`, data)
        // creates new board, saves it and calls the callback function with its data
    },

    deleteBoard: async function (boardId) {
        await apiDelete(`/api/boards/${boardId}`);
    },

    changeCardStatus: async function(cardId, columnId){
        const data ={
            cardId : cardId,
            columnId : columnId
        }
        return await apiPatch(`/change_status`, data)
    },

    renameColumn: async function (newColTitle, columnId) {
        const data={
            dataColumnId : columnId,
            dataColTitle : newColTitle
        }
        return await apiPatch(`/api/rename_column`, data)
    },

};

async function apiGet(url) {
    let response = await fetch(url, {
        method: "GET",
    });
    if (response.ok) {
        return await response.json();
    }
}

async function apiPost(url, payload) {
    let response = await fetch(url, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    });
    if (response.ok) {
        console.log('ok')
        return await response.json();
    }
}

async function apiDelete(url, payload) {
     let response = await fetch(url, {
        method: "DELETE",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    });
    if (response.ok) {
        console.log('ok')
        return await response.json();
    }
}

async function apiPut(url) {
}

async function apiPatch(url, payload) {
    let response = await fetch(url, {
        method: "PATCH",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    });
    if (response.ok) {
        return await response.json();
    }
}
