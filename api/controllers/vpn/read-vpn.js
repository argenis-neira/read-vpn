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
      "C:/Users/Mami/Desktop/Carlos/Github/VPN-sails/status.log"; //"/var/log/openvpn/status.log"
    const pathAllUsers = "C:/Users/Mami/Desktop/index.txt"; //"/etc/openvpn/easy-rsa/pki/index.txt"

    //init object
    let oData = { data: [], date: "" };

    //Status LOG
    const uLog = fs.readFileSync(pathLogUsers, "utf-8");
    const linesULog = uLog.split(swl);

    oData.date = linesULog[1].split(",")[1];
    const half = linesULog.indexOf("ROUTING TABLE");

    let userLog1 = linesULog.slice(3, half);
    let uConnected = [];
    for (let i = 0; i < userLog1.length; i++) {
      if (userLog1[i].split(",")[0] === "UNDEF") continue;
      uConnected.push({
        user: userLog1[i].split(",")[0],
        restData: userLog1[i].split(",").splice(1),
      });
    }
    console.log(uConnected);

    let userLog2 = linesULog.slice(half + 2, linesULog.length - 4);
    console.log(uConnected.length, userLog2.length);

    //All USERS
    const users = fs.readFileSync(pathAllUsers, "utf-8");
    const linesUser = users.split(swl);

    //building object
    let total = 0;
    for (let i = 1; i < linesUser.length; i++) {
      let elem = linesUser[i].split(/\s+/);
      if (elem[0] != "V") continue;
      //check every single one
      let user = elem[4].split("=")[1];

      let name,
        lastName,
        realAddress,
        bytesReceived,
        bytesSent,
        connectedSince,
        virtualAddress,
        lastRef = "";
      let isConnected = false;

      let uMatch = uConnected.find((item) => item.user == user);
      if (uMatch) {
        name = user;
        lastName = user;
        isConnected = true;
        realAddress = uMatch.restData[0];
        bytesReceived = uMatch.restData[1];
        bytesSent = uMatch.restData[2];
        connectedSince = uMatch[3];
      }

      //init object
      let oUser = {
        userName: {
          commonName: user,
          name,
          lastName,
        },
        isConnected,
        realAddress,
        bytesReceived,
        bytesSent,
        connectedSince,
        virtualAddress,
        lastRef,
      };

      oData.data.push(oUser);

      //total++;
    }
    console.log(total);

    return oData;
  },
};