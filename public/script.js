const responseText = document.getElementById('output-text');

document.querySelector('.submit-form').addEventListener('submit', getResponse);
document.querySelector('.submit-filter').addEventListener('submit', getFilterResponse);

async function getFilterResponse(event) {
    event.preventDefault();

    const filterData = new FormData(event.target);

    const response = await fetch('/filter', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(filterData)
    });

    const data = await response.json();

    responseText.innerText = JSON.stringify(data, null, 2);
}

//Function to handle form submission and fetch response from the server.
async function getResponse(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    const response = await fetch('/insert', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(formData)
    });

    const data = await response.json();

    switch(data.errorCode) {
        case 2627: 
            responseText.innerText = 
                `The item ID "${data.sentData["item-code"]}" is already in use.
                Please choose a different Item ID.`;
            break;
        default:
            responseText.innerText = 
                `Server says: ${data.message}
                You sent: ${JSON.stringify(data.sentData, null, 2)}`;
            break;
    }
}