// https://stackoverflow.com/questions/23080413/parsing-a-csv-file-using-nodejs
const fs = require("fs");
const parse = require("csv-parse");
const path = require("path");
const csv = require("csvtojson");
const { json } = require("express");
const { finished } = require("stream");
// joining path of directory
const directoryPath = path.join(__dirname, "../workload-data");
const folder = "../workload-data";

// read csv file from folder; convert and save it as json
const save_as_json = () => {
  fs.readdir(path.resolve(__dirname, folder), (err, files) => {
    if (err) throw err;

    for (let file of files) {
      const extname = path.extname(file);
      const filename = path.basename(file, extname);
      const absolutePath = path.resolve(folder, file);
      //   console.log("filename : ", filename);
      //   console.log("File : ", file);
      //   console.log("extname : ", extname);
      //   console.log("absolutePath : ", absolutePath);
      //   const csvFilePath = absolutePath;

      csv()
        .fromFile(absolutePath)
        .then((jsonObj) => {
          console.log(`LENGTH: ${jsonObj.length}`);
          for (let index = 0; index < 1; index++) {
            const element = jsonObj[index];
            var str = "{";

            for (item in element) {
              str += `${item.toString().toLowerCase()}: ${element[item]}`;
              //   console.log(
              //     `key: ${item.toString().toLowerCase()} value: ${element[item]}`
              //   );
              //   if (element[item] == element[element.length])

              //element[Object.keys(element).sort().pop()];

              if (
                item.toString().toLowerCase() !=
                Object.keys(element).pop().toLowerCase()
              )
                str += ", ";
              // console.log(
              //   `LAST: ${Object.keys(element).pop().toLowerCase()}`
              // );
            }
            str += "}";
            //console.log(str);
          }

          //   var array = jsonObj[20];
          //   var ob = JSON.stringify(jsonObj);
          //   console.log(array);
          console.log(filename.toLowerCase());
          console.log(jsonObj.length);
          //let obj = JSON.parse(array);
          //   console.log(obj.);

          //   for (let i = 0; i < array.length; i++) {
          //     //const element = array[i];

          //     for (let j = 0; j < array.length; j++) {
          //       //const element = array[j];
          //       console.log(`key: ${array[i]} value: ${array[i][j]}`);
          //     }
          //   }

          //   for (var item in array) {
          //     console.log(`key: ${item} value: ${array[item]}`);
          //   }

          //   console.log(`Json object size: ${JSON.stringify(jsonObj[0])}`);

          fs.writeFile(
            path.join(folder, filename + ".json"),
            JSON.stringify(jsonObj),
            "utf8",
            function (err) {
              if (err) {
                return console.log(err);
              }

              console.log("The file was saved!");
            }
          );
        });
    }
  });
};

save_as_json();

// var csvData = [];
// fs.readdir(path.resolve(__dirname, folder), (err, files) => {
//   if (err) throw err;

//   for (let file of files) {
//     const extname = path.extname(file);
//     const filename = path.basename(file, extname);
//     const absolutePath = path.resolve(folder, file);

//     fs.createReadStream(absolutePath)
//       .pipe(parse({ delimiter: "," }))
//       .on("data", function (csvrow) {
//         console.log(csvrow);
//         //do something with csvrow
//         csvData.push(csvrow);
//       })
//       .on("end", function () {
//         //do something with csvData
//         console.log(csvData);
//       });
//   }
// });
