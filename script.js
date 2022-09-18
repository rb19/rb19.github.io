function fileParser(input){

  input.onchange = e => { 
    // Set up file reference
    var file = e.target.files[0]; 

    // TEST: Test file type reading
    // let fileName = 'File name: ' + file.name;
    // let fileSize = 'File size: ' + file.size;
    // let fileType = 'File type: ' + file.type;

    // Setting up FileReader API
    let csvReader = new FileReader();
    csvReader.readAsText(file);

    // Tell csvReader to spit out contents
    csvReader.onload = readerEvent => {
      var content = readerEvent.target.result;
      // TEST
      //document.getElementById("content").innerHTML = "Raw CSV data: " + content;
      //document.write(content);
      //console.log(content);

      let data = createBracket(content);

       // create generic table elements
      const tbl = document.createElement("table");
    
      for (i = 0; i < data.length; i++) {
        for (j = 0; j < 18; j++) {
          const row = document.createElement("tr");
          if (j == 0) {
            // Make the Page header here, where Page is i+1
            console.log("I am the Page Header # " + (i + 1));
            const pageHeader = document.createElement("th");
            pageHeader.setAttribute("colspan", "2");
            const pageHeaderText = document.createTextNode(`Page ${i +1}`);
            pageHeader.appendChild(pageHeaderText);
            row.appendChild(pageHeader);
          } else if (j == 1) {
            // Create a td of "Position"
            // Create a td of "Player"
            // Place these td's into a tr row
            console.log("This is where the position and player header goes");
            const positionHeader = document.createElement("th");
            const playerHeader = document.createElement("th");
            const positionHeaderText = document.createTextNode("Position");
            const playerHeaderText = document.createTextNode("Player");
            positionHeader.appendChild(positionHeaderText);
            playerHeader.appendChild(playerHeaderText);
            row.appendChild(positionHeader);
            row.appendChild(playerHeader);
          } else if (j > 1 && j <= data[i].length + 1) {
            // Create a td for each position where the position is j-1 
            // Create a td for each viable player, and place the name
            const positionCell = document.createElement("td");
            const playerCell = document.createElement("td");
            console.log("Position # " + j + " There's a player here!");
            const positionText = document.createTextNode(`${j - 1}`);
            const playerText = document.createTextNode(data[i][j-2]);
            positionCell.appendChild(positionText);
            playerCell.appendChild(playerText);
            row.appendChild(positionCell);
            row.appendChild(playerCell);
          } else if (j > 1 && j > data[i].length + 1) {
            // Create a td for each position where the position is j-1 
            // Create a td with an empty space
            console.log("Position # " + j + " NO PLAYER!");
            const positionCell = document.createElement("td");
            const playerCell = document.createElement("td");
            const positionText = document.createTextNode(`${j - 1}`);
            const playerText = document.createTextNode("");
            positionCell.appendChild(positionText);
            playerCell.appendChild(playerText);
            row.appendChild(positionCell);
            row.appendChild(playerCell);
          }
          tbl.appendChild(row);
        }
      }
      document.body.appendChild(tbl);
      tbl.setAttribute("border", "2");

      //console.log(data[0]);
      // Can't read the data from this line, moved to createBracket()
      // document.getElementById("data").innerHTML = JSON.stringify(data);
    }

    // TEST: Testing console output.
    // console.log(fileName);
    // console.log(fileSize);
    // console.log(fileType);

    // TEST: Passing variables into HTML.
    // document.getElementById("demo").innerHTML = fileName;
  }

}

function CSVToArray( strData, strDelimiter ){
  // Check to see if the delimiter is defined. If not,
  // then default to comma.
  strDelimiter = (strDelimiter || ",");

  // Create a regular expression to parse the CSV values.
  var objPattern = new RegExp(
      (
          // Delimiters.
          "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

          // Quoted fields.
          "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

          // Standard fields.
          "([^\"\\" + strDelimiter + "\\r\\n]*))"
      ),
      "gi"
      );

  // Create an array to hold our data. Give the array
  // a default empty first row.
  var arrData = [[]];

  // Create an array to hold our individual pattern
  // matching groups.
  var arrMatches = null;

  // Keep looping over the regular expression matches
  // until we can no longer find a match.
  while (arrMatches = objPattern.exec( strData )){

      // Get the delimiter that was found.
      var strMatchedDelimiter = arrMatches[ 1 ];

      // Check to see if the given delimiter has a length
      // (is not the start of string) and if it matches
      // field delimiter. If id does not, then we know
      // that this delimiter is a row delimiter.
      if (
          strMatchedDelimiter.length &&
          strMatchedDelimiter !== strDelimiter
          ){

          // Since we have reached a new row of data,
          // add an empty row to our data array.
          arrData.push( [] );

      }

      var strMatchedValue;

      // Now that we have our delimiter out of the way,
      // let's check to see which kind of value we
      // captured (quoted or unquoted).
      if (arrMatches[ 2 ]){

          // We found a quoted value. When we capture
          // this value, unescape any double quotes.
          strMatchedValue = arrMatches[ 2 ].replace(
              new RegExp( "\"\"", "g" ),
              "\""
              );

      } else {

          // We found a non-quoted value.
          strMatchedValue = arrMatches[ 3 ];

      }

      // Now that we have our value string, let's add
      // it to the data array.
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
    // TEST: Print out the number of cars in each row
    //console.log(arrData[i][1]);
    carsTotal = carsTotal + num; 
  }
  return carsTotal;
}

function createBracket(content){

  let arrData = CSVToArray(content);
  //let arrData = [['Player', 'Cars'],['Al H','8'], ['Dave H','6'], ['Tom','5'], ['Ray','10'], ['Jeremy','4'], ['Jim','1'], ['Heather','3'], ['Scott','5'], ['John','6']];

  // Return the number of competitors.
  console.log ('Number of competitors: ' + arrData.length);

  // Determine total number of cars.
  carsTotal = countCars(arrData);

  // Check if cars is NaN. This checks for empty cells and/or rows.
  if (isNaN(carsTotal)){
    alert('ERROR! There is an empty cell or blank row. Please check the CSV file and try again.');
  }

  // Determine if using a 2 lane or 4 lane.
  if (carsTotal > 200){
    console.log('Use the 4 wide lane track.')
  }
  else {
    console.log('You can use the 2 lane track.')
  }
  
  // Return the number of cars.
  console.log('Number of cars: ' + carsTotal);

  // Determine the number of brackets
  var totalBrackets = Math.ceil(carsTotal/16);
  console.log('Number of brackets: ' + totalBrackets);

  // Array to contain all brackets
  var startingBrackets = [];

  // For each bracket...
  for (i = 0; i < totalBrackets; i++){
    const bracket = [];
    startingBrackets.push(bracket);
  }
  // Alternative method to store. Uncomment this if the nested array method doesn't work.
  // var bracketComp = {};
  // for (var i=0; i<totalBrackets; i++){
  //   var bracketNumber = 'bracket ' + (i + 1);
  //   bracketComp[bracketNumber] = [];
  // }
  // console.log("Starting brackets: ");
  // console.log(bracketComp);
 
  const floatBucket = [];
  // Find the ratios, and push players into buckets. 
  // i=1 because this assumes the first line is a header.
  const intBucket = [];
  const remainderBucket = [];
  for (let i = 1; i < arrData.length; i++) {
    const player = arrData[i];
    const playerName = arrData[i][0];
    const playerCars = parseInt(arrData[i][1]);

    // Ratio of cars to brackets
    var carRatio = playerCars/totalBrackets;

    if (isInt(carRatio)){
      for (j = 0; j < carRatio; j++){
        intBucket.push(playerName);
      }
    }
    else if(isFloat(carRatio)){
      // This will be split in the next split step.
      const quotient = Math.floor(playerCars/totalBrackets);
      const remainder = playerCars%totalBrackets;
      for (j = 0; j < quotient; j++){
        floatBucket.push(playerName);
      }
      for (k = 0; k < remainder; k++){
        remainderBucket.push(playerName);
      } 
    }
    else {
      alert('ERROR! Something went wrong!');
    }
  }

  // Push int bucket into brackets
  for (k = 0; k < startingBrackets.length; k++){
    startingBrackets[k].push(...intBucket);
    startingBrackets[k].push(...floatBucket);
  }

  for (let i = 0; i < remainderBucket.length; i++){
    startingBrackets[i % startingBrackets.length].push(remainderBucket[i]);
  }

  // Randomize the bracket before shuffling. Otherwise players will face the same opponents every time.
  for (let i = 0; i < startingBrackets.length; i++) {
    for (let j = 0; j < startingBrackets[i].length - 1; j++) {
        const k = Math.floor(Math.random() * (j + 1));
        [ startingBrackets[i][j], startingBrackets[i][k] ] = [ startingBrackets[i][k], startingBrackets[i][j] ];
    }
  }

  // Check every other player for match conflicts. If there is one, swap with last element.
  for (let i = 0; i < startingBrackets.length; i++) {
    for (let j = 0; j < startingBrackets[i].length - 1; j++) {
        if (j % 2 != 0){
            continue;
        }
        else {
            if (startingBrackets[i][j] == startingBrackets[i][j + 1]) {
                if (j + 1 < startingBrackets[i].length) {
                [ startingBrackets[i][j + 1], startingBrackets[i][startingBrackets[i].length-1] ] = [ startingBrackets[i][startingBrackets[i].length-1], startingBrackets[i][j + 1] ];
                }        
            }
        }
    }
  }

  // console.log("startingBrackets:")
  // console.log(startingBrackets);

  return startingBrackets;
}

// Randomize the bracket. Make sure that people are not facing themselves in first round
function bracketRandomizer (){

}

function fileSelect() {
  var input = document.createElement('input');
  input.type = 'file';

  fileParser(input);

  input.click();
}
