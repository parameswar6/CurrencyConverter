const base_url = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";
const dropdowns = document.querySelectorAll(".dropdown select");
const getRateBtn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// This loop sets up the dropdown menus and flag images
for (let select of dropdowns) {
    for (code in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = code;
        newOption.value = code;
        if (select.name === "from" && code === "USD") {
            newOption.selected = true;
        } else if (select.name === "to" && code === "INR") {
            newOption.selected = true;
        }
        select.append(newOption);
    }
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

// This function changes the flag image based on the selected currency
const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let img = element.parentElement.querySelector("img");
    img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
};

// This function gets the exchange rate and updates the message
const getExchangeRate = async () => {
    let amount = document.querySelector(".amount input").value;
    if (amount === "" || amount < 1) {
        amount = 1;
    }

    const fromCode = fromCurr.value.toLowerCase();
    const toCode = toCurr.value.toLowerCase();
    
    const url = `${base_url}/${fromCode}.json`;
    
    try {
        let response = await fetch(url);
        let data = await response.json();
        
        // The new data is inside the currency code keys
        const rate = data[fromCode][toCode];
        let finalAmount = amount * rate;
        
        msg.innerText = `${amount} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
        
    } catch (error) {
        msg.innerText = "Error fetching data. Try again later.";
        console.error("Failed to fetch exchange rate:", error);
    }
};

// When the button is clicked, get the new rate
getRateBtn.addEventListener("click", (evt) => {
    evt.preventDefault();
    getExchangeRate();
});

// Run the function when the page loads to show the initial conversion
window.addEventListener("load", () => {
    getExchangeRate();
});