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
      console.log(content);

      let data = CSVToArray(content);
      document.getElementById("data").innerHTML = JSON.stringify(data);
    }

    // Testing console output.
    console.log(fileName);
    console.log(fileSize);
    console.log(fileType);

    // Passing variables into HTML.
    document.getElementById("demo").innerHTML = fileName;
  }

}

// function csvToArray(str, delimiter = ",") {
//   // slice from start of text to the first \n index
//   // use split to create an array from string by delimiter
//   const headers = str.slice(0, str.indexOf("\n")).split(delimiter);

//   // slice from \n index + 1 to the end of the text
//   // use split to create an array of each csv value row
//   const rows = str.slice(str.indexOf("\n") + 1).split("\n");

//   // Map the rows
//   // split values from each row into an array
//   // use headers.reduce to create an object
//   // object properties derived from headers:values
//   // the object passed as an element of the array
//   const arr = rows.map(function (row) {
//     const values = row.split(delimiter);
//     const el = headers.reduce(function (object, header, index) {
//       object[header] = values[index];
//       return object;
//     }, {});
//     return el;
//   });

//   // return the array
//   return arr;
// }

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

  // Return the parsed data.
  return( arrData );
}

function fileSelect() {
  var input = document.createElement('input');
  input.type = 'file';

  fileParser(input);

  input.click();
}
