const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
module.exports = {


  friendlyName: 'Receive file',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {

    console.log("Receive File");

    /*Another Way*/
    // file.openReadAsync().done(function(fileStream) {                
    //   var fileData = MSApp.createBlobFromRandomAccessStream(file.contentType, fileStream);
    //   var formData = new FormData();
    //   formData.append('file', fileData);
    // });

    const filePath = require("path").join(__dirname, "../../../tempFilesCreator/InformeFinal.pdf")
    console.log(filePath);

    /*Another another way*/
    // fs.readFile(filePath, (err, file) => {
    //   if (err) {
    //     throw err;
    //   }
    //   const form = new FormData();
    //   form.append('file', file, {
    //     //filepath: filePath,
    //     contentType: 'application/pdf',
    //   });
    //   form.append('filename', "doc")

    //   console.log("---------------------------");
    //   axios({
    //     url: "http://localhost:1337/api/v1/uploadFile",
    //     method: "POST",
    //     headers: form.getHeaders(),
    //     data: form
    //   }).then((res) => {
    //     //console.log(res);
    //   }).then((err) => {
    //     //console.log(err);
    //   })
    // })


    /*3rd try*/
    let formData = new FormData();
    formData.append('file', fs.createReadStream(filePath))


    console.log("*********************************");
    axios({
      url: "http://localhost:1337/api/v1/uploadFile",
      method: "POST",
      data: formData
    }).then((res) => {
      //console.log(res);
    }).then((err) => {
      //  console.log(err);
    })
    // All done.
    return;

  }


};
