function fileParser(input){

  input.onchange = e => { 
    // Set up file reference
    var file = e.target.files[0]; 

    // Test file type reading
    let fileName = 'File name: ' + file.name;
    let fileSize = 'File size: ' + file.size;
    let fileType = 'File type: ' + file.type;

    // Setting up FileReader API
    let csvReader = new FileReader();
    csvReader.readAsText(file);

    // Tell csvReader to spit out contents
    csvReader.onload = readerEvent => {
      var content = readerEvent.target.result;
      document.getElementById("content").innerHTML = "Raw CSV data: " + content;
      //document.write(content);
      //console.log(content);

      let data = createBracket(content);
      // Can't read the data from this line, moved to createBracket()
      // document.getElementById("data").innerHTML = JSON.stringify(data);
    }

    // Testing console output.
    console.log(fileName);
    console.log(fileSize);
    console.log(fileType);

    // Passing variables into HTML.
    document.getElementById("demo").innerHTML = fileName;
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
  //document.getElementById("data").innerHTML = JSON.stringify(arrData);

  // Return the number of competitors.
  console.log ('Number of competitors: ' + arrData.length);

  // Determine total number of cars.
  carsTotal = countCars(arrData);
  //console.log(carsTotal);

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
  // var bracketComp = [];
  // for (var k = 1; k < bracketsNumber; k++) {
  //   bracketComp[k]=[];
  // }
  var bracketComp = {};
  for (var i=1; i<totalBrackets+1; i++){
    var bracketNumber = 'bracket ' + i;
    bracketComp[bracketNumber] = [];
  }
  console.log(bracketComp);
  console.log('Number of brackets: ' + totalBrackets);

  // Array to dump odd ratios into
  var floatArray = [];

  // Split cars into each bracket.
  for (let i = 1; i < arrData.length; i++) {
    //document.getElementById("data").innerHTML = JSON.stringify(arrData[i]);
    // Uncomment below to test output read
    // console.log(arrData[i][1]);

    let playerName = arrData[i][0];

    // Convert player's cars to an integer
    let playerCars = parseInt(arrData[i][1]);
    // Ratio of cars to brackets
    var carRatio = playerCars/totalBrackets;
    

    if (isInt(carRatio)){
      // for (let j = 1; j < bracketsNumber; j++){
      //   for (let l = 1; l < carRatio; l++){
      //     bracket[j].push(arrData[i][0]);
      //   }
      // }
      // bracketComp.forEach(function(number){
      //   bracketComp[number].push(arrData[i][0]);
      // });
      for (let property in bracketComp){
        //for (let l = 1; l < carRatio; l++){
          bracketComp[property].push(playerName);
          // Object.assign(bracketComp,arrData[i][0]);
        //}
      }
    }
    else if(isFloat(carRatio)){
      // This will be split in the next split step.
      floatArray.push(arrData[i]);
    }
    else {
      alert('ERROR! Something went wrong!');
    }
  }
  console.log(bracketComp);
  console.log(floatArray);
  // Call bracket randomizer

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
