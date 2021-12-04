const fs = require("fs");
const activity = 'ACTIVITY'+'_'+new Date().toISOString().split("T")[0] + ".log";
const error = 'ERROR'+'_'+new Date().toISOString().split("T")[0] + ".log";

const file1 = activity;
const file2 = error;

// data = {
//  info: "INFO",
//  message: "Your message have been sent"
// }
async function filecheck(data, tp) {
  const file = tp == '1' ? file1 : file2;
  const time = new Date().toISOString();
  // Check if the file exists in the current directory, and if it is readable.
  const checkfile = fs.existsSync("./logs/" + file)

  if (!checkfile) {
    fs.writeFileSync("./logs/" + file,time + data + ' \n')
  } else {
    fs.appendFileSync("./logs/" + file,time + data + ' \n')
  }
}

async function readLog(filename, type) {
  let dataArray = []
  let file = filename + ".log";
  const fileExists = fs.existsSync("../logs/" + file);
  if (fileExists) {
    var rs = fs.readFileSync("../logs/" + file)
    // dataArray.push(rs)

    const data = JSON.parse(rs)
    if (type === "INFO") {
      console.log(data)
    }

  } else {
    console.log("File does not exist");
  }
}

module.exports = {
  filecheck
};