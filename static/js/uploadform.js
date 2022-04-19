const input = document.getElementById("new_photo");
var preview = document.querySelector(".preview");

input.style.opacity = 0;

input.addEventListener("change", updateImageDisplay);

function updateImageDisplay() {
  while (preview.firstChild) {
    preview.removeChild(preview.firstChild);
  }
  
  var curFiles = input.files;
  if (curFiles.length === 0) {
    var para = document.createElement("p");
    para.textContent = "No files selected for upload!";
    preview.appendChild(para);
  } else {
    var item = document.createElement("div");
    preview.appendChild(item);
    var para = document.createElement("p");
    if (validFileType(curFiles[0])) {
      para.textContent = curFiles[0].name;

      var image = document.createElement("img");
      image.src = window.URL.createObjectURL(curFiles[0]);

      var par = document.createElement("p");
      par.textContent = curFiles[0].name;
      // toto.appendChild(par)

      item.appendChild(image);
      item.appendChild(para);

    } else {
      para.textContent =
        "File " +
        curFiles[0].name +
        ": Not a valid file type. Has to be a jpeg, jpg or png!";
      item.appendChild(para);
    }
  }
}



const fileTypes = [
  'image/apng',
  'image/bmp',
  'image/gif',
  'image/jpeg',
  'image/pjpeg',
  'image/png',
  'image/svg+xml',
  'image/tiff',
  'image/webp',
  'image/x-icon',
];

function validFileType(file) {
return fileTypes.includes(file.type);
}
