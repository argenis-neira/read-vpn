const fs = require("fs");

//const readFile = util.promisify(fs.readFile)
module.exports = {
  friendlyName: "Read vpn",

  description: "",

  inputs: {},

  exits: {},

  fn: async function (exits) {
    //Paths
    const swl = "\r\n";
    const pathLogUsers =
      "C:/Users/Argenis/Desktop/Argenis/Projects/sails/vpn-read/status.log" //"/var/log/openvpn/status.log"
    const pathAllUsers = "C:/Users/Argenis/Desktop/Argenis/Projects/sails/vpn-read/index.txt"; //"/etc/openvpn/easy-rsa/pki/index.txt"

    //function
    let temp = fs.readFileSync(pathLogUsers, "utf-8").split(swl);
    //console.log(temp);
    var odata = { data: [], date: "" };
    odata.date = temp[1].split(",")[1];
    const irt = temp.indexOf("ROUTING TABLE");

    //para validar apellidos como "De La Cruz"
    const options = ["bluelabel", "mib", "lu", "panama", "vpn"];
    for (let i = 3; i < irt; i++) {
      let arr = temp[i].split(",");
      let name = arr[0].split("-")[0];
      if (arr[0].split("-")[0] === "UNDEF") continue;

      let arrName = arr[0].split("-");
      //console.log(arrName)
      let lastName = "";
      if (arrName[0] === "UNDEF") lastName = "UNDEF";
      else {
        lastName = arrName[1].charAt(0).toUpperCase() + arrName[1].slice(1);
        for (let j = 2; j < arrName.length; j++) {
          if (options.includes(arrName[j])) break;
          lastName =
            lastName +
            " " +
            arrName[j].charAt(0).toUpperCase() +
            arrName[j].slice(1);
        }
      }

      let oarr = {
        userName: {
          commonName: arr[0],
          name: name.charAt(0).toUpperCase() + name.slice(1),
          lastName,
        },
        isConnected: true,
        realAddress: arr[1],
        bytesReceived: arr[2],
        bytesSent: arr[3],
        connectedSince: arr[4],
        virtualAddress: "",
        lastRef: "",
      };
      odata.data.push(oarr);
    }

    let total = 0;
    for (let i = irt + 2; i < temp.length - 4; i++) {
      let arr = temp[i].split(",");
      if (arr[1] === "UNDEF") continue;
      total++;
      var oselect = odata.data.find(
        (item) =>
          item.userName.commonName === arr[1] && item.realAddress === arr[2]
      );
      oselect.virtualAddress = arr[0];
      oselect.lastRef = arr[3];
    }

    //setMyValue(JSON.stringify(odata));

    console.log("Conected users: ", total)
    //console.log(odata);

    //For Disconnected Users
    let totalConnected = 0;
    let uDiscon = fs.readFileSync(pathAllUsers, "utf-8").split(swl);
    for (let i = 1; i < uDiscon.length; i++) {
      let elem = uDiscon[i].split(/\s+/)
      if (elem[0] != "V") continue;
      totalConnected++;
      let commonName = elem[4].split("=")[1]
      let uMatch = odata.data.find((item) => item.userName.commonName == commonName)
      if (!uMatch) {
        let arrName = commonName.split("-")
        let name = arrName[0]
        let lastName = arrName[1].charAt(0).toUpperCase() + arrName[1].slice(1)
        let words = arrName
        for (let j = 2; j < words.length; j++) {
          if (options.includes(words[j])) break;
          lastName =
            lastName +
            " " +
            words[j].charAt(0).toUpperCase() +
            words[j].slice(1);
        }
        let oarr = {
          userName: {
            commonName,
            name: name.charAt(0).toUpperCase() + name.slice(1),
            lastName,
          },
          isConnected: false,
          realAddress: "",
          bytesReceived: "",
          bytesSent: "",
          connectedSince: "",
          virtualAddress: "",
          lastRef: "",
        };
        odata.data.push(oarr);
      }
    }
    console.log("Total Users ", totalConnected);

    // All done.
    return odata;
  },
};