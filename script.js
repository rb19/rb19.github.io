function fileParser(input) {

  input.onchange = e => {
    // Set up file reference
    var file = e.target.files[0];

    // Set up the FileReader API
    let csvReader = new FileReader();
    csvReader.readAsText(file);

    // Tell csvReader to spit out contents.
    csvReader.onload = readerEvent => {
      // The raw CSV data as an array
      var content = readerEvent.target.result;

      // This returns the brackets for each page.
      //let data = createBracket(content);
      let data = newBracket(content);

      // Calling this again to get the race class name.
      let arrData = CSVToArray(content);

      // Clear previous tables if any exist.
      document.getElementById("brackets").innerHTML = "";

      // Iterate through each subarray and generate pages as tables.
      for (i = 0; i < data.length; i++) {
        // TODO: Try using this to break out pages for print.
        // var node = document.getElementById("brackets").cloneNode(true);
        // node.id = "";

        // Create a table for every subarray in the array of brackets.
        const tbl = document.createElement("table");
         // TODO: Try using this to break out pages for print.
        // tbl.setAttribute("page-break-before","always"); 
        // tbl.setAttribute("page-break-after","always");

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
            const pageHeaderText = document.createTextNode(`${arrData[0][0]}: `+`Page ${i + 1} of ${Math.ceil(countCars(arrData) / 16)}`);

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
            const playerText = data[i][j - 2];

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
function CSVToArray(strData, strDelimiter) {
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
  while (arrMatches = objPattern.exec(strData)) {

    // Get the delimiter that was found.
    var strMatchedDelimiter = arrMatches[1];

    // Check to see if the given delimiter has a length (is not the start of string) and if it matches field delimiter. 
    // If it does not, then we know that this delimiter is a row delimiter.
    if (
      strMatchedDelimiter.length &&
      strMatchedDelimiter !== strDelimiter
    ) {

      // Since we have reached a new row of data, add an empty row to our data array.
      arrData.push([]);
    }

    var strMatchedValue;

    // Now that we have our delimiter out of the way, let's check to see which kind of value we captured (quoted or unquoted).
    if (arrMatches[2]) {

      // We found a quoted value. When we capture this value, unescape any double quotes.
      strMatchedValue = arrMatches[2].replace(
        new RegExp("\"\"", "g"),
        "\""
      );

    } else {

      // We found a non-quoted value.
      strMatchedValue = arrMatches[3];

    }

    // Now that we have our value string, let's add it to the data array.
    arrData[arrData.length - 1].push(strMatchedValue);
  }

  return (arrData);
}

// function isInt(n) {
//   return n % 1 === 0;
// }

// function isFloat(n) {
//   return n % 1 !== 0;
// }

function countCars(arrayData) {
  let carsTotal = 0;
  // Rows 1 and 2 are class name and headers, so ignore them start at i[2].
  for (let i = 2; i < arrayData.length; i++) {
    num = parseInt(arrayData[i][1]);
    carsTotal = carsTotal + num;
  }
  return carsTotal;
}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// function raceClass(arrayData) {
//   var raceClass = arrayData[0][0];

//   return raceClass;
// }

// New method
function playerList(content){
  let arrData = CSVToArray(content);

  // Collect every player name. Row 1 are headers, so skip to i[1].
  var playerData = [];
  for (let i = 1; i < arrData.length; i++) {
    playerData.push(arrData[i][0]);
  }
  console.log(playerData);

  // A STOCK
  // var aStockCars = [];
  // for (let i = 1; i < arrData.length; i++) {
  //   aStockCars.push(arrData[i][1]);
  // }

  var aStockCars = []; // j = 1
  var charityRaceCars = []; // j = 2
  var featureRaceCars = []; // j = 3
  var fteHighSpeedWheelCars = []; // j = 4
  var hotWheelsCars = []; // j = 5
  var johnnyLightningCars = []; // j = 6
  var kidsDivisionCars = []; // j = 7
  var nascarCars = []; // j = 8
  var ripAndRaceCars = []; // j = 9
  var stockEliminatorCars = []; // j = 10

  for (let i = 1; i < arrData.length; i++) {
    aStockCars.push(arrData[i][1]);
    charityRaceCars.push(arrData[i][2]);
    featureRaceCars.push(arrData[i][3]);
    fteHighSpeedWheelCars.push(arrData[i][4]);
    hotWheelsCars.push(arrData[i][5]);
    johnnyLightningCars.push(arrData[i][6]);
    kidsDivisionCars.push(arrData[i][7]);
    nascarCars.push(arrData[i][8]);
    ripAndRaceCars.push(arrData[i][9]);
    stockEliminatorCars.push(arrData[i][10]);
  }

  if (playerData.length != aStockCars.length) {
    alert("WARNING! The data does not match, try again.");
  }

  const aStockList = [];
  const charityRaceList = [];
  const featureRaceList = [];
  const fteHighSpeedWheelList = [];
  const hotWheelsList = [];
  const johnnyLightningList = [];
  const kidsDivisionList = [];
  const nascarList = [];
  const ripAndRaceList = [];
  const stockEliminatorList = [];

  for (let i = 0; i < playerData.length; i++){
    if(aStockCars[i] > 0){
      const playerCar = [];
      playerCar.push([playerData[i],aStockCars[i]]);
      aStockList.push(playerCar);
    }
    if(charityRaceCars[i] > 0){
      const playerCar = [];
      playerCar.push([playerData[i],charityRaceCars[i]]);
      charityRaceList.push(playerCar);
    }
    if(featureRaceCars[i] > 0){
      const playerCar = [];
      playerCar.push([playerData[i],featureRaceCars[i]]);
      featureRaceList.push(playerCar);
    }
    if(fteHighSpeedWheelCars[i] > 0){ 
      const playerCar = [];
      playerCar.push([playerData[i],fteHighSpeedWheelCars[i]]);
      fteHighSpeedWheelList.push(playerCar);
    }
    if(hotWheelsCars[i] > 0){ 
      const playerCar = [];
      playerCar.push([playerData[i],hotWheelsCars[i]]);
      hotWheelsList.push(playerCar);
    }
    if(johnnyLightningCars[i] > 0){
      const playerCar = [];
      playerCar.push([playerData[i],johnnyLightningCars[i]]);
      johnnyLightningList.push(playerCar);
    }
    if(kidsDivisionCars[i] > 0){
      const playerCar = [];
      playerCar.push([playerData[i],kidsDivisionCars[i]]);
      kidsDivisionList.push(playerCar);
    }
    if(nascarCars[i] > 0){
      const playerCar = [];
      playerCar.push([playerData[i],nascarCars[i]]);
      nascarList.push(playerCar);
    }
    if(ripAndRaceCars[i] > 0){
      const playerCar = [];
      playerCar.push([playerData[i],ripAndRaceCars[i]]);
      ripAndRaceList.push(playerCar);
    }
    if(stockEliminatorCars[i] > 0){
      const playerCar = [];
      playerCar.push([playerData[i],stockEliminatorCars[i]]);
      stockEliminatorList.push(playerCar);
    }
  }

  var masterList = [];
  masterList.push(aStockList,charityRaceList,featureRaceList,fteHighSpeedWheelList,hotWheelsList,johnnyLightningList,kidsDivisionList,nascarList,ripAndRaceList,stockEliminatorList)

  console.log("MASTER LIST");
  console.log(masterList);

  return masterList;
}

function newAlgorithm(rosterList){
  // New algorithm should create blocks of 4, create unique matches. Make sure to try and separate from the previous block

  // const rosterList = [["Bob D", 10], ["Cameron Daly", 1], ["Dave A", 10], ["Jaxon K", 10],["johnny O", 10], ["Logan", 10], ["Rapid Ray", 10],["SSea Bass DH", 10], ["Tom C", 6], ["Noah", 3], ["Lex", 1], ["Tom W", 7], ["Jeremy", 3]];


  // Determine full length (total cars)
  let cars = 0
  for (let i = 0; i < rosterList.length; i++){
    cars += rosterList[i][1];
  }
  console.log(cars); // This is the total number of cars

  // Create blocks of 4
  let masterBlock = [];
  // let block = [];
  // for (let i = 0; i < 4; i++){
  //   block[i] = "";
  // }
  const block = new Array(4);
  let numBlocks = Math.ceil(cars/4);
  for (let i = 0; i < numBlocks; i++){
    masterBlock[i] = block;
  }

  // For each player,
    //if the number of cars is greater than or equal to the number of blocks -> insert to higher array
    //if the number of cars is less than the number of blocks -> insert to lower array
    //The logic for higher array will distribute evenly first, then randomly pick a block, insert, then ignore that block for future inserts
    //The logic for lower array will randomly pick a block, insert, then ignore that block for future inserts
  const higherArray = [];
  const lowerArray = [];
  for (let i = 0; i < rosterList.length; i++){
    if(rosterList[i][1] >= masterBlock.length){
      higherArray.push(rosterList[i]);
    }
    if(rosterList[i][1] < masterBlock.length){
      lowerArray.push(rosterList[i]);
    }
  }
  // For higher array
    // While the count is non-zero, 
      // For each player, perform a check to see if block is full, and if player already exists.
        // If not full, check if player already exists
          // If doesn't exist, place in random spot in the block, and remove one from count
        // If does exist, move onto next
        // If all blocks have been checked and count is still > 0
          // Randomly select a block
            // Check if racer is in even or odd
            // Place additional racer in other slot
  // For lower array
    // While the count is non-zero,
      // Pick a random block to insert to
        // Do a check to see if block is full, and if player already exists.
        // If not full, check if player already exists
          // If doesn't exist, place in random spot in the block, and remove one from count
        // If does exist, move onto next
        // If all blocks have been checked and count is still > 0
          // Randomly select a block
            // Check if racer is in even or odd
            // Place additional racer in other slot
  // Merge the blocks back to together to make a single list
  // Do a sanity check
    // Check if there are any empty slots in the list. Throw error if yes
    // Count the number of entries in the race list, check against the input list. Throw error is mismatch.
  // Return the list

}

function createBracket(content) {
  // Extract CSV data as an array.
  //let arrData = CSVToArray(content);
  // Filtered list will be put back in list to return.
  let raceList = [];

  console.log("HELLO THERE");
  console.log(content);

  let aStockList = content.shift();
  console.log("A STOCK:")
  console.log(aStockList);

  // put list into algorithm, which should return curated list.
  // Once created, put list into HTML.

  let charityList = content.shift();
  console.log("CHARITY RACE")
  console.log(charityList);

  // Put list through algorithm, get the return. store it in the array.

  let featureList = content.shift();
  console.log("FEATURE RACE")
  console.log(featureList);  

  // Put list through algorithm, get the return. store it in the array.

  let fteList = content.shift();
  console.log("FTE RACE")
  console.log(fteList);

  // Put list through algorithm, get the return. store it in the array.

  let hwList = content.shift();
  console.log("HW RACE")
  console.log(hwList);
  
  // Put list through algorithm, get the return. store it in the array.

  let jlList = content.shift();
  console.log("JL RACE")
  console.log(jlList);

  // Put list through algorithm, get the return. store it in the array.

  let kidsDivisionList = content.shift();
  console.log("KIDS RACE")
  console.log(kidsDivisionList);

  // Put list through algorithm, get the return. store it in the array.

  let nascarList = content.shift();
  console.log("NASCAR RACE")
  console.log(nascarList);

  // Put list through algorithm, get the return. store it in the array.

  let ripandraceList = content.shift();
  console.log("RIP AND RACE")
  console.log(ripandraceList);

  // Put list through algorithm, get the return. store it in the array.

  let stockeliminatorList = content.shift();
  console.log("STOCK ELIMINATOR RACE")
  console.log(stockeliminatorList);

  // Put list through algorithm, get the return. store it in the array.
  
  // Post stats here

  // Determine total number of cars.
  carsTotal = countCars(arrData);

  // Check if cars is NaN. This checks for empty cells and/or rows and stops if file is bad.
  if (isNaN(carsTotal)) {
    alert('ERROR! There is an empty cell/row, or the data is invalid. Check the selected CSV file and try again.');
  }

  // Determine the number of brackets
  var totalBrackets = Math.ceil(carsTotal / 16);
  //document.getElementById("pageNumber").innerHTML = `${totalBrackets}`;

  // Array to contain all brackets
  var brackets = [];

  // Create a bracket based on the number of brackets needed.
  for (i = 0; i < totalBrackets; i++) {
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
    var carRatio = playerCars / totalBrackets;

    if (isInt(carRatio)) {
      // If the ratio is even, it means that the player can distribute a divisble number of cars
      // to each bracket. These players get pushed to the intBucket so they can be pushed to each bracket later.
      for (j = 0; j < carRatio; j++) {
        intBucket.push(playerName);
      }
    }
    else if (isFloat(carRatio)) {
      // Get quotients from each player.
      const quotient = Math.floor(playerCars / totalBrackets);
      // Get the remainder to push later.
      const remainder = playerCars % totalBrackets;
      // Push the rounded down number to each bracket for the same reason as above.
      for (j = 0; j < quotient; j++) {
        floatBucket.push(playerName);
      }
      // Push remaining players in a separate array to push later.
      for (k = 0; k < remainder; k++) {
        remainderBucket.push(playerName);
      }
    }
    else {
      alert('ERROR! Something went wrong!');
    }
  }

  // Iterate through each bracket and push int/float buckets into each bracket.
  for (k = 0; k < brackets.length; k++) {
    brackets[k].push(...intBucket);
    brackets[k].push(...floatBucket);
  }

  // Push remainder bucket into brackets.
  // This has to be done separately because we want to iterate through the remaining players instead of the actual brackets.
  for (let i = 0; i < remainderBucket.length; i++) {
    brackets[i % brackets.length].push(remainderBucket[i]);
  }

  // Sort out all odd pages so there is a maximum of 1 page with odd numbers.
  for (let i = 0; i < brackets.length - 1; i++) {
    if (brackets[i].length % 2 == 0) {
      continue;
    }
    else if (brackets[i].length <= 16 && brackets[i].length % 2 != 0 && brackets[i + 1].length % 2 != 0) {
      // Remove player from next bracket and add to current bracket.
      // Odd numbered page means it's never >16, so this will always work,
      // but make sure this only runs if the current bracket length is <= 16.
      brackets[i].push(brackets[i + 1].pop());
    }
  }

  // Randomize the bracket before shuffling. Otherwise players will face the same opponents every time.
  for (let i = 0; i < brackets.length; i++) {
    for (let j = 0; j < brackets[i].length - 1; j++) {
      const k = randomIntFromInterval(0, brackets[i].length - 1);
      [brackets[i][j], brackets[i][k]] = [brackets[i][k], brackets[i][j]];
    }
  }

  // Check every other player for match conflicts. 
  for (let i = 0; i < brackets.length; i++) {
    // Iterate every other player and check the next player.
    for (let j = 0; j < brackets[i].length - 1; j += 2) {
      // If there's a match, swap the current player with another random player and make sure it doesn't match.
      while (brackets[i][j] == brackets[i][j + 1]) {
        let k = randomIntFromInterval(0, brackets[i].length - 1);
        [brackets[i][j + 1], brackets[i][k]] = [brackets[i][k], brackets[i][j + 1]];
      }
    }
  }

  // LOG: Print the number of cars.
  console.log('Number of cars: ' + carsTotal);
  // LOG: Print number of brackets
  console.log('Number of brackets: ' + totalBrackets);
  // LOG: Print number of competitors
  console.log('Number of competitors: ' + arrData.length);

  return brackets;
}

// function createBracket(content) {
//   // Extract CSV data as an array.
//   let arrData = CSVToArray(content);

//   document.getElementById("raceClass").innerHTML = raceClass(arrData);

//   // Collect every player name. Rows 1 and 2 are class name and headers, so ignore them start at i[2].
//   var playerData = [];
//   for (let i = 2; i < arrData.length; i++) {
//     playerData.push(arrData[i][0]);
//   }
//   console.log(playerData);

//   // Determine total number of cars.
//   carsTotal = countCars(arrData);

//   // Check if cars is NaN. This checks for empty cells and/or rows and stops if file is bad.
//   if (isNaN(carsTotal)) {
//     alert('ERROR! There is an empty cell/row, or the data is invalid. Check the selected CSV file and try again.');
//   }

//   // Determine if using a 2 lane or 4 lane.
//   if (carsTotal > 200) {
//     // LOG: Print which lane to use.
//     // console.log('Use the 4 wide lane track.')
//     document.getElementById("track").innerHTML = "4 lane track";
//     document.getElementById("carCount").innerHTML = `${carsTotal}`;
//   }
//   else {
//     // LOG: Print which lane to use.
//     // console.log('You can use the 2 lane track.')
//     document.getElementById("track").innerHTML = "2 lane track";
//     document.getElementById("carCount").innerHTML = `${carsTotal}`;
//   }

//   // Determine the number of brackets
//   var totalBrackets = Math.ceil(carsTotal / 16);
//   document.getElementById("pageNumber").innerHTML = `${totalBrackets}`;

//   // Array to contain all brackets
//   var brackets = [];

//   // Create a bracket based on the number of brackets needed.
//   for (i = 0; i < totalBrackets; i++) {
//     const bracket = [];
//     brackets.push(bracket);
//   }

//   // Arrays for int, float, and remainder results.
//   // This will be used to organize players evenly.
//   const intBucket = [];
//   const floatBucket = [];
//   const remainderBucket = [];

//   // i=1 because this assumes the first line is a header.
//   for (let i = 1; i < arrData.length; i++) {
//     // Extract player name and number of cars.
//     const playerName = arrData[i][0];
//     // parseInt is needed here because CSVtoArray returns strings.
//     const playerCars = parseInt(arrData[i][1]);

//     // Ratio of cars to brackets
//     var carRatio = playerCars / totalBrackets;

//     if (isInt(carRatio)) {
//       // If the ratio is even, it means that the player can distribute a divisble number of cars
//       // to each bracket. These players get pushed to the intBucket so they can be pushed to each bracket later.
//       for (j = 0; j < carRatio; j++) {
//         intBucket.push(playerName);
//       }
//     }
//     else if (isFloat(carRatio)) {
//       // Get quotients from each player.
//       const quotient = Math.floor(playerCars / totalBrackets);
//       // Get the remainder to push later.
//       const remainder = playerCars % totalBrackets;
//       // Push the rounded down number to each bracket for the same reason as above.
//       for (j = 0; j < quotient; j++) {
//         floatBucket.push(playerName);
//       }
//       // Push remaining players in a separate array to push later.
//       for (k = 0; k < remainder; k++) {
//         remainderBucket.push(playerName);
//       }
//     }
//     else {
//       alert('ERROR! Something went wrong!');
//     }
//   }

//   // Iterate through each bracket and push int/float buckets into each bracket.
//   for (k = 0; k < brackets.length; k++) {
//     brackets[k].push(...intBucket);
//     brackets[k].push(...floatBucket);
//   }

//   // Push remainder bucket into brackets.
//   // This has to be done separately because we want to iterate through the remaining players instead of the actual brackets.
//   for (let i = 0; i < remainderBucket.length; i++) {
//     brackets[i % brackets.length].push(remainderBucket[i]);
//   }

//   // Sort out all odd pages so there is a maximum of 1 page with odd numbers.
//   for (let i = 0; i < brackets.length - 1; i++) {
//     if (brackets[i].length % 2 == 0) {
//       continue;
//     }
//     else if (brackets[i].length <= 16 && brackets[i].length % 2 != 0 && brackets[i + 1].length % 2 != 0) {
//       // Remove player from next bracket and add to current bracket.
//       // Odd numbered page means it's never >16, so this will always work,
//       // but make sure this only runs if the current bracket length is <= 16.
//       brackets[i].push(brackets[i + 1].pop());
//     }
//   }

//   // Randomize the bracket before shuffling. Otherwise players will face the same opponents every time.
//   for (let i = 0; i < brackets.length; i++) {
//     for (let j = 0; j < brackets[i].length - 1; j++) {
//       const k = randomIntFromInterval(0, brackets[i].length - 1);
//       [brackets[i][j], brackets[i][k]] = [brackets[i][k], brackets[i][j]];
//     }
//   }

//   // Check every other player for match conflicts. 
//   for (let i = 0; i < brackets.length; i++) {
//     // Iterate every other player and check the next player.
//     for (let j = 0; j < brackets[i].length - 1; j += 2) {
//       // If there's a match, swap the current player with another random player and make sure it doesn't match.
//       while (brackets[i][j] == brackets[i][j + 1]) {
//         let k = randomIntFromInterval(0, brackets[i].length - 1);
//         [brackets[i][j + 1], brackets[i][k]] = [brackets[i][k], brackets[i][j + 1]];
//       }
//     }
//   }

//   // LOG: Print the number of cars.
//   console.log('Number of cars: ' + carsTotal);
//   // LOG: Print number of brackets
//   console.log('Number of brackets: ' + totalBrackets);
//   // LOG: Print number of competitors
//   console.log('Number of competitors: ' + arrData.length);

//   return brackets;
// }

// This function is called in index.html

function fileSelect() {
  var input = document.createElement('input');
  input.type = 'file';

  // Accepts the CSV file as an input.
  //fileParser(input);
  newParser(input);

  input.click();
}

function newParser(input) {

  input.onchange = e => {
    // Set up file reference
    var file = e.target.files[0];

    // Set up the FileReader API
    let csvReader = new FileReader();
    csvReader.readAsText(file);

    // Tell csvReader to spit out contents.
    csvReader.onload = readerEvent => {
      // The raw CSV data as an array
      var content = readerEvent.target.result;

      let data = playerList(content);
      let curatedBracket = createBracket(data);
      console.log("Hey I made it out! ");
      console.log(data);

      // Calling this again to get the race class name.
      //let arrData = CSVToArray(content);
      
    }
  }
}