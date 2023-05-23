/**
 * Name: Bridget Yang
 * CS 132 Spring 2023
 * Date: April 27, 2023
 * 
 * Contains functions to split a restaurant bill. Calculates how much your
 * meal costed based on entered itemized prices. Also, calculates tax
 * based on where the user dined and tip based on the desired
 * percentage and number of diners splitting.
 */

(function() {
  "use strict";
  /**
   * Updates the percent tip displayed if the user
   * adjusts the tip bar.
   */
  function updateTip() {
    id("tip-value").innerHTML = id("tip-percent").value;
  }
  
  /**
   * Adds one number entry field for every item the user
   * ordered so that they can enter the price of each item
   * they ordered.
   */
  function addItemField() {
    const itemContainer = id("item-input-field");
    let numFields = id("num-dishes").value;
    for (let i = 0; i < numFields; i++) {
        let field = gen("input");
        field.setAttribute("type", "number");
        field.classList.add("item-input");
        field.min = "0";
        field.step = "0.01"
        field.placeholder = "Item Price";
        itemContainer.appendChild(field);
    }
  }

  /**
   * Removes item price entry fields until the number of number
   * entry fields matches the desired number the user inputed.
   */
  function removeItemField() {
    const itemContainer = id("item-input-field");
    let numFields = id("num-dishes").value;
    // Learned about childElementCount method from: 
    // https://www.w3schools.com/jsref/prop_element_childelementcount.asp
    while (numFields < itemContainer.childElementCount) {
      itemContainer.removeChild(itemContainer.lastChild);
    }
  }

  /**
   * Calculates the tip depending on the subtotal and the
   * desired tip percentage. Rounds to the nearest cent.
   * @returns {number} representing the tip based on the subtotal
   */
  function subtotalTip() {
    let tip = id("tip-percent").value / 100;
    let subtotal = id("subtotal").value;
    // Learned about toFixed() method from:
    // https://www.w3schools.com/jsref/jsref_tofixed.asp
    return (subtotal * tip).toFixed(2);
  }

  /**
   * Calculates the tip per person if the diners want to just
   * split it perfectly evenly (without taking into account how
   * much each individual ordered). Rounds to the nearest cent.
   * @returns {number} representing the tip per person
   */
  function tipPerPerson() {
    let numDiners = id("num-diners").value;
    return (subtotalTip() / numDiners).toFixed(2);
  }

  /**
   * Calculates the total price of all the items you ordered pre-tax.
   * @returns {number} representing the total price of the items you ordered
   */
  function yourOrderTotal() {
    let yourItems = qsa(".item-input");
    let yourOrderTotal = 0;
    for (let i = 0; i < yourItems.length; i++) {
      yourOrderTotal += Number(yourItems[i].value);
    }
    return (yourOrderTotal).toFixed(2);
  }

  /**
   * Returns the price including the state sales tax.
   * @param {number} price - price in dollars
   * @returns {number} representing the price including the sales tax
   */
  function tax(price) {
    // Sources: https://taxfoundation.org/2023-sales-taxes/, 
    // https://www.cdtfa.ca.gov/taxes-and-fees/rates.aspx
    const stateTaxes = {"AL": 0.04, "AK": 0, "AZ": 0.056, "AR": 0.065,
                        "LA, CA": 0.095, "OC, CA": 0.0775, "CA": 0.0725,
                        "CO": 0.029, "CT": 0.0635, "DE": 0, "FL": 0.06,
                        "GA": 0.04, "HI": 0.04, "ID": 0.06, "IL": 0.0625,
                        "IN": 0.07, "IA": 0.06, "KS": 0.065, "KY": 0.065,
                        "LA": 0.045, "ME": 0.055, "MD": 0.06, "MA": 0.0625,
                        "MI": 0.06, "MN": 0.06875, "MS": 0.07, "MO": 0.04225,
                        "MT": 0, "NE": 0.055, "NV": 0.0685, "NH": 0, "NJ": 0.06625,
                        "NY": 0.04, "NC": 0.0475, "ND": 0.05, "OH": 0.0575, 
                        "OK": 0.045, "OR": 0, "PA": 0.06, "RI": 0.07, "SC": 0.06,
                        "SD": 0.045, "TN": 0.07, "TX": 0.0625, "UT": 0.061, 
                        "VT": 0.06, "VA": 0.053, "WA": 0.065, "WV": 0.06, 
                        "WI": 0.05, "WY": 0.04, "NYC": 0.08875, "SF, CA": 0.08625,
                        "DC": 0.1, "SD, CA": 0.0775, "AL, CA": 0.1075, 
                        "SB, CA": 0.0775, "R, CA": 0.0875}
    return (price * (1 + stateTaxes[id("state-dropdown-menu").value])).toFixed(2);
  }

  /**
   * Computes and shows the total tip, the tip per person, your order total
   * before and after tax, and how much you owe (your order total post-tax + tip
   * per person or tip proportional to your order price).
   */
  function calculate() {
    const results = id("results");

    // Clear results from previous calculation
    while (results.firstChild) {
      results.removeChild(results.firstChild);
    }

    // Shows and computes how much you owe if tip is split evenly and proportionally
    let oweEven = gen("p");
    let oweProp = gen("p");
    oweEven.textContent = "You owe: $" + String((Number(tipPerPerson()) 
                          + Number(tax(yourOrderTotal()))).toFixed(2)) 
                          + " (if tip is split evenly)";
    oweProp.textContent = "$" + String((Number(yourOrderTotal() 
                          * (id("tip-percent").value / 100)) 
                          + Number(tax(yourOrderTotal()))).toFixed(2))
                          + " (if tip is split proportionally)";
    oweEven.classList.add("calc-output");
    oweProp.classList.add("calc-output");
    results.appendChild(oweEven);
    results.appendChild(oweProp);

    // Shows and computes the tip from the entered subtotal and desired % tip
    let totalTip = gen("p");
    totalTip.textContent = "Total tip: $" + subtotalTip();
    results.appendChild(totalTip);

    // Shows and computes the tip per person
    let perPersonTip = gen("p");
    perPersonTip.textContent = "Tip per person: $" + tipPerPerson();
    results.appendChild(perPersonTip);

    // Shows and computes your order total (before tax)
    let urTotal = gen("p");
    urTotal.textContent = "Your order total (before tax): $" + yourOrderTotal();
    results.appendChild(urTotal);

    // Shows and computes your order total (after tax)
    let urTotalTax = gen("p");
    urTotalTax.textContent = "Your order total (after tax): $" + tax(yourOrderTotal());
    results.appendChild(urTotalTax);
  }

  /**
   * Checks if the values entered in the fields are valid.
   * If they aren't, an alert message pops up on the window.
   */
  function checkFields() {
    let numDiners = id("num-diners").value;
    let subtotal = id("subtotal").value;
    console.log(numDiners);
    if (numDiners == "0" || numDiners == "") {
      alert("Please enter a valid number of diners!");
    } else if (subtotal == "0" || subtotal == "") {
      alert("Please enter a valid subtotal amount!");
    } else if (Number(yourOrderTotal()) > Number(subtotal)) {
      alert("Your order seems to have costed more than the entire bill?")
    } else {
      calculate();
    }
  }
  
  /**
   * Displays the tip percentage based on what the value of the range input is. 
   * Listens to how many items the user ordered and calls the functions to add or 
   * remove price fields based on this number. Submits all the field information 
   * when the user clicks on the Calculate button.
   */
  function init() {
    id("tip-value").append(id("tip-percent").value);
    id("tip-percent").addEventListener("input", updateTip);
    id("num-dishes").addEventListener("input", addItemField);
    id("num-dishes").addEventListener("input", removeItemField);
    qs("input[type=submit]").addEventListener("click", checkFields);
  }
  init();
})();