module.exports = {


  friendlyName: 'Upload file',


  description: '',


  inputs: {
    userId: {
      description: 'The ID of the user to look up.',
      // By declaring a numeric example, Sails will automatically respond with `res.badRequest`
      // if the `userId` parameter is not a number.
      type: 'string',
      // By making the `userId` parameter required, Sails will automatically respond with
      // `res.badRequest` if it's left out.
      required: false
    }
  },


  exits: {

  },


  fn: async function (inputs) {
    console.log("Upload");
    console.log(this.req.file('file')._files);
    console.log(inputs.userId);
    // All done.
    try {
      this.req.file('file').upload({
        dirname: require("path").join(__dirname, "../../../tempFilesCreator/temp"),
        saveAs: function (uploadFile, cb) {
          cb(null, uploadFile.filename);
        }
      }, function (err, uploadedFiles) {
        console.log(uploadedFiles);
        if (err) {
          console.log("err");
          return err;
        }
        return ' file(s) uploaded successfully!'
      });
    }
    catch (err) {
      return "No file selected";
    }

    return "All good";

  }


};
