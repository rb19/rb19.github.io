function fileParser(input){

  input.onchange = e => { 
    // Set up file reference
    var file = e.target.files[0]; 

    // Set up the FileReader API
    let csvReader = new FileReader();
    csvReader.readAsText(file);

    // Tell csvReader to spit out contents.
    csvReader.onload = readerEvent => {
      // The raw CSV data as an arary
      var content = readerEvent.target.result;
      
      // This returns the brackets for each page.
      let data = createBracket(content);

      // Clear previous tables if any exist.
      document.getElementById("brackets").innerHTML = "";

      // Iterate through each subarray and generate pages as tables.
      for (i = 0; i < data.length; i++) {

        // Create a table for every subarray in the array of brackets.
        const tbl = document.createElement("table");

        // Iterate through each row to create headers, rows.
        for (j = 0; j < 18; j++) {

          // Create a new row for each loop.
          const row = document.createElement("tr");

          if (j == 0) {
            // This block creates a fix single cell Page header.
            // This indicates the page number and spans 2 columns.

            // Create th element that spans 2 columns.
            const pageHeader = document.createElement("th");
            pageHeader.setAttribute("colspan", "2");

            // Make the Page header here, where Page is i+1.
            const pageHeaderText = document.createTextNode(`Page ${i +1}`);

            // Append header into the row.
            pageHeader.appendChild(pageHeaderText);
            row.appendChild(pageHeader);

            // LOG: Print the page number.
            // console.log("I am the Page Header # " + (i + 1));
          } else if (j == 1) {
            // This block creates fixed "Position" and "Player" header cells.

            // Create th element for Position and Player.
            const positionHeader = document.createElement("th");
            const playerHeader = document.createElement("th");

            // Create text nodes for the header cells.
            const positionHeaderText = document.createTextNode("Position");
            const playerHeaderText = document.createTextNode("Player");

            // Append the td's into the row.
            positionHeader.appendChild(positionHeaderText);
            playerHeader.appendChild(playerHeaderText);
            row.appendChild(positionHeader);
            row.appendChild(playerHeader);

            // LOG: Print position and player header row.
            // console.log("This is where the position and player header goes");
          } else if (j > 1 && j <= data[i].length + 1) {
            // This block creates rows that have player names.

            // Create td element for position number and player name.
            const positionCell = document.createElement("td");
            const playerCell = document.createElement("td");
            // Create input element to make editable cell containing player name.
            var input = document.createElement("input");
            
            // Create a text node for each position where the position is j-1 
            const positionText = document.createTextNode(`${j - 1}`);
            // Set player name for element j-2 since j starts 2 positions ahead due to headers.
            const playerText = data[i][j-2];

            // Set input fields to be text containing the player names.
            input.setAttribute('type', 'text');
            input.setAttribute('value', playerText);

            // Append the cells to the rows.
            positionCell.appendChild(positionText);
            playerCell.appendChild(input);
            row.appendChild(positionCell);
            row.appendChild(playerCell);

            // LOG: Print position # and whether player is present.
            // console.log("Position # " + j + " There's a player here!");
          } else if (j > 1 && j > data[i].length + 1) {
            // This block creates rows that have no player names.

            const positionCell = document.createElement("td");
            const playerCell = document.createElement("td");
            // Create input element to make an editable empty cell.
            var input = document.createElement("input");

            // Create a text node for each position where the position is j-1 
            const positionText = document.createTextNode(`${j - 1}`);
            // Player name is empty for these cells.
            const playerText = "";

            // Set input fields to be text containing the player names.
            input.setAttribute('type', 'text');
            input.setAttribute('value', playerText);

            // Append the cells to the rows.
            positionCell.appendChild(positionText);
            playerCell.appendChild(input);
            row.appendChild(positionCell);
            row.appendChild(playerCell);

            // LOG: Print position # and that no player exists
            // console.log("Position # " + j + " NO PLAYER!");
          }
          
          // Append the created row into the table, then loop.
          tbl.appendChild(row);
        }

        // Now that table has been created, append this to a hardcoded div.
        document.getElementById("brackets").appendChild(tbl);
        // Aesthetic border thickness. Change as needed.
        tbl.setAttribute("border", "2");
      }
    }
  }
}

// Function inspired by https://stackoverflow.com/questions/1293147/how-to-parse-csv-data
// Original method found in https://www.bennadel.com/blog/1504-ask-ben-parsing-csv-strings-with-javascript-exec-regular-expression-command.htm
function CSVToArray( strData, strDelimiter ){
  // Check to see if the delimiter is defined. If not, then default to comma.
  strDelimiter = (strDelimiter || ",");

  // Create a regular expression to parse the CSV values.
  var objPattern = new RegExp(
      (
          // Delimiters.
          "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

          // Quoted fields.
          "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

          // Standard fields.
          "([^\\" + strDelimiter + "\\r\\n]*))"
      ),
      "gi"
    );

  // Create an array to hold the CSV data. The first subarray is empty by default.
  var arrData = [[]];

  // Create a null array to hold individual pattern matching groups.
  var arrMatches = null;

  // Keep looping over the regular expression matches until a match is no longer found.
  while (arrMatches = objPattern.exec( strData )){

    // Get the delimiter that was found.
    var strMatchedDelimiter = arrMatches[ 1 ];

    // Check to see if the given delimiter has a length (is not the start of string) and if it matches field delimiter. 
    // If it does not, then we know that this delimiter is a row delimiter.
    if (
        strMatchedDelimiter.length &&
        strMatchedDelimiter !== strDelimiter
        ){

        // Since we have reached a new row of data, add an empty row to our data array.
        arrData.push( [] );
    }

    var strMatchedValue;

    // Now that we have our delimiter out of the way, let's check to see which kind of value we captured (quoted or unquoted).
    if (arrMatches[ 2 ]){

        // We found a quoted value. When we capture this value, unescape any double quotes.
        strMatchedValue = arrMatches[ 2 ].replace(
            new RegExp( "\"\"", "g" ),
            "\""
            );

    } else {

        // We found a non-quoted value.
        strMatchedValue = arrMatches[ 3 ];

    }

    // Now that we have our value string, let's add it to the data array.
    arrData[ arrData.length - 1 ].push( strMatchedValue );
  }

  return( arrData );
}

function isInt(n) {
  return n % 1 === 0;
}

function isFloat(n) {
  return n % 1 !== 0;
}

function countCars(arrayData){
  let carsTotal = 0;
  for (let i = 1; i < arrayData.length; i++) {
    num = parseInt(arrayData[i][1]);
    carsTotal = carsTotal + num; 
  }
  return carsTotal;
}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function createBracket(content){
  // Extract CSV data as an array.
  let arrData = CSVToArray(content);
  
  // Determine total number of cars.
  carsTotal = countCars(arrData);

  // Check if cars is NaN. This checks for empty cells and/or rows and stops if file is bad.
  if (isNaN(carsTotal)){
    alert('ERROR! There is an empty cell/row, or the data is invalid. Check the selected CSV file and try again.');
  }

  // Determine if using a 2 lane or 4 lane.
  if (carsTotal > 200){
    // LOG: Print which lane to use.
    // console.log('Use the 4 wide lane track.')
    document.getElementById("track").innerHTML = "4 lane track";
    document.getElementById("carCount").innerHTML = `${carsTotal}`;
  }
  else {
    // LOG: Print which lane to use.
    // console.log('You can use the 2 lane track.')
    document.getElementById("track").innerHTML = "2 lane track";
    document.getElementById("carCount").innerHTML = `${carsTotal}`;
  }

  // Determine the number of brackets
  var totalBrackets = Math.ceil(carsTotal/16);
  document.getElementById("pageNumber").innerHTML = `${totalBrackets}`;

  // Array to contain all brackets
  var brackets = [];

  // Create a bracket based on the number of brackets needed.
  for (i = 0; i < totalBrackets; i++){
    const bracket = [];
    brackets.push(bracket);
  }
 
  // Arrays for int, float, and remainder results.
  // This will be used to organize players evenly.
  const intBucket = [];
  const floatBucket = [];
  const remainderBucket = [];

  // i=1 because this assumes the first line is a header.
  for (let i = 1; i < arrData.length; i++) {
    // Extract player name and number of cars.
    const playerName = arrData[i][0];
    // parseInt is needed here because CSVtoArray returns strings.
    const playerCars = parseInt(arrData[i][1]);

    // Ratio of cars to brackets
    var carRatio = playerCars/totalBrackets;

    if (isInt(carRatio)){
      // If the ratio is even, it means that the player can distribute a divisble number of cars
      // to each bracket. These players get pushed to the intBucket so they can be pushed to each bracket later.
      for (j = 0; j < carRatio; j++){
        intBucket.push(playerName);
      }
    }
    else if(isFloat(carRatio)){
      // Get quotients from each player.
      const quotient = Math.floor(playerCars/totalBrackets);
      // Get the remainder to push later.
      const remainder = playerCars%totalBrackets;
      // Push the rounded down number to each bracket for the same reason as above.
      for (j = 0; j < quotient; j++){
        floatBucket.push(playerName);
      }
      // Push remaining players in a separate array to push later.
      for (k = 0; k < remainder; k++){
        remainderBucket.push(playerName);
      } 
    }
    else {
      alert('ERROR! Something went wrong!');
    }
  }

  // Iterate through each bracket and push int/float buckets into each bracket.
  for (k = 0; k < brackets.length; k++){
    brackets[k].push(...intBucket);
    brackets[k].push(...floatBucket);
  }

  // Push remainder bucket into brackets.
  // This has to be done separately because we want to iterate through the remaining players instead of the actual brackets.
  for (let i = 0; i < remainderBucket.length; i++){
    brackets[i % brackets.length].push(remainderBucket[i]);
  }

  // Sort out all odd pages so there is a maximum of 1 page with odd numbers.
  for (let i = 0; i < brackets.length - 1; i++) {
    if (brackets[i].length % 2 == 0){
      continue;
    }
    else if (brackets[i].length % 2 != 0 && brackets[i+1].length % 2 != 0) {
      // Remove player from next bracket and add to current bracket.
      // Odd numbered page means it's never >16, so this will always work.
      brackets[i].push(brackets[i+1].pop());
    }
  }

  // Randomize the bracket before shuffling. Otherwise players will face the same opponents every time.
  for (let i = 0; i < brackets.length; i++) {
    for (let j = 0; j < brackets[i].length - 1; j++) {
      const k = randomIntFromInterval(0,brackets[i].length-1);
      [ brackets[i][j], brackets[i][k] ] = [ brackets[i][k], brackets[i][j] ];
    }
  }

  // Check every other player for match conflicts. 
  for (let i = 0; i < brackets.length; i++) {
    // Iterate every other player and check the next player.
    for (let j = 0; j < brackets[i].length - 1; j+=2) {
      // If there's a match, swap the current player with another random player and make sure it doesn't match.
      while (brackets[i][j] == brackets[i][j + 1]) {
        let k = randomIntFromInterval(0,brackets[i].length-1);
        [ brackets[i][j + 1], brackets[i][k] ] = [ brackets[i][k], brackets[i][j + 1] ];
      }
    }
  }

  // LOG: Print the number of cars.
  console.log('Number of cars: ' + carsTotal);
  // LOG: Print number of brackets
  console.log('Number of brackets: ' + totalBrackets);
  // LOG: Print number of competitors
  console.log ('Number of competitors: ' + arrData.length);
  
  return brackets;
}

// This function is called in index.html
function fileSelect() {
  var input = document.createElement('input');
  input.type = 'file';

  // Accepts the CSV file as an input.
  fileParser(input);

  input.click();
}
