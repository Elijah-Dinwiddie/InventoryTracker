const responseText = document.getElementById('output-text');

document.querySelector('.submit-form').addEventListener('submit', getResponse);

//Function to handle form submission and fetch response from the server.
async function getResponse(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    const response = await fetch('/filter', {
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