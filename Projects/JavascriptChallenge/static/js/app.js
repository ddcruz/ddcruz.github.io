//get a handle on the tbody
var tbody = d3.select('#ufo-table>tbody');

//function to display the data
function display(thisData) {
    thisData.forEach((x) => {
        tbody.append("tr");
        Object.entries(x).forEach(([key, value]) => {
            tbody.append("td").text(value);
        });
      });
}

//function to clear the data
function clearDisplay() {
    tbody.html("")
}

//on page load, display all the data
display(data);

//loop thru the data and insert each cell value per row

//get a handle on the submit button
var submit = d3.select('#filter-btn');

submit.on('click', function() {
    // Prevent the page from refreshing
    d3.event.preventDefault();

    // Select the input element and get the raw HTML node
    var inputValue = d3.select("#datetime").property("value");

    var filteredData = data.filter(row => row.datetime === inputValue);
    clearDisplay();

    display(filteredData);
});