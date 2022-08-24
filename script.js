// function myFunction() {
//     var x = document.getElementById("myText").value;
//     document.getElementById("demo").innerHTML = x;
//   };

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
      document.getElementById("content").innerHTML = content;
      console.log(content);
    }

    // Testing console output.
    console.log(fileName);
    console.log(fileSize);
    console.log(fileType);

    // Passing variables into HTML.
    document.getElementById("demo").innerHTML = fileName;
  }

}

function fileSelect() {
  var input = document.createElement('input');
  input.type = 'file';

  fileParser(input);

  input.click();
}

// function addRow(){
//     var table = document.getElementById("playerTable");
//     var row = table.insertRow(0);
//     var playerCell = row.insertCell(0);
//     var carCell = row.insertCell(1);
//     var addCell = row.insertCell(2);
//     var removeCell = row.insertCell(3);
//     playerCell.innerHTML = "";
//     carCell.innerHTML = "";
//     addCell.innerHTML = <button onclick="addRow()">+</button>;
//     removeCell.innerHTML = <button onclick='removeRow()'>+</button>;
// };