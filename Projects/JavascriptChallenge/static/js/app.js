//adding more filter criteria input boxes
//get a handle to the filters unordered list
var filters = d3.select('#filters');

//change the label
filters.select('li').select('label').text('Set your filter criteria');

//change the placeholder value for date/time
filters.select('#datetime').attr('placeholder', 'date');

//add more filters
var inputFilters = ['city', 'state', 'country', 'shape']
inputFilters.forEach(inputFilter=> {
    filters.select('li')
        .append('input')
        .attr('class', 'form-control')
        .attr('id', inputFilter)
        .attr('type', 'text')
        .attr('placeholder', inputFilter)
});

// //function to get unique values
// function onlyUnique(value, index, self) { 
//     return self.indexOf(value) === index;
// }

// var shapeDropDown = filters.select('li').append('select').attr('id', 'shapeDropDown')
// data.map(x=> x.shape).sort().filter(onlyUnique).forEach(shape=> {
//     shapeDropDown.append('option').attr('value', shape).text(shape)
// })

//get a handle on the tbody
var tbody = d3.select('#ufo-table>tbody');

//function to display the data
function display(thisData) {
    //loop thru the data and insert each cell value per row    
    thisData.forEach((x) => {
        tbody.append('tr');
        Object.entries(x).forEach(([key, value]) => {
            tbody.append('td').text(value);
        });
      });
};

//function to clear the data
function clearDisplay() {
    tbody.html('');
};

//on page load, display all the data
display(data);

//get a handle on the submit button
var submit = d3.select('#filter-btn');

//implement the submit onclick event
submit.on('click', function() {
    // Prevent the page from refreshing
    d3.event.preventDefault();

    // get the inputValues from the form
    var inputValues = filters.selectAll('input').nodes().map(x=> {
        return { 
            id: x.id
            , value: x.value
        };
    });

    //filter on them, ignoring the inputs that have no values
    var filteredData = data
    inputValues.forEach(input=> {
        if (!(input.value === '')) {
            filteredData = filteredData.filter(row=> row[input.id] === input.value)
        }        
    });

    clearDisplay();

    display(filteredData);
});

