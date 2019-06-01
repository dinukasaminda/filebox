var http = require("http");
var formidable = require("formidable");
var fs = require("fs");
var path = require("path");
var base64 = require("base-64");
var folder_path = "/abcd_mynew_path/";

var params = function(req) {
  let q = req.url.split("?"),
    result = {};
  if (q.length >= 2) {
    q[1].split("&").forEach(item => {
      try {
        result[item.split("=")[0]] = item.split("=")[1];
      } catch (e) {
        result[item.split("=")[0]] = "";
      }
    });
  }
  return result;
};
const uuidv1 = require("uuid/v1");

http
  .createServer(function(req, res) {
    var rparams = params(req);
    if (req.method == "GET" && rparams.file) {
      var file_path = base64.decode(rparams.file);
      console.log("file require: " + file_path);

      var filePath = path.join(__dirname, folder_path + file_path);
      var stat = fs.statSync(filePath);

      res.writeHead(200, {
        "Content-Length": stat.size
      });

      var readStream = fs.createReadStream(filePath);
      // We replaced all the event handlers with a simple call to readStream.pipe()
      readStream.pipe(res);
      console.log("file download");
    } else if (req.method == "POST") {
      var form = new formidable.IncomingForm();
      var form = new formidable.IncomingForm();

      form.parse(req);

      form.on("fileBegin", function(name, file) {
        //var newpath = folder_path + uuidv1() + file.name;
		var newpath = folder_path +  file.name;
        file.path = __dirname + newpath;
      });

      form.on("file", function(name, file) {
        console.log("Uploaded " + file.name);
      });
      /*
      form.parse(req, function(err, fields, files) {
        console.log(files.filetoupload);
        var oldpath = files.filetoupload.path;
        var newpath = folder_path + files.filetoupload.name;
        fs.readFile(oldpath, function(err, data) {
          if (err) throw err;
          console.log("File read!");

          // Write the file
          fs.writeFile(newpath, data, function(err) {
            if (err) throw err;
            console.log("File written!");
          });

          // Delete the file
          fs.unlink(oldpath, function(err) {
            if (err) throw err;
            console.log("File deleted!");
          });
          res.writeHead(301, {
            Location: "http://localhost:8080/"
          });
          res.end();
        });
      });*/
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
	   res.write(
        '<html><head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>'
      );
	  
      res.write(
        '<form action="" method="post" enctype="multipart/form-data" >'
      );
      res.write('<input type="file" name="filetoupload" multiple><br>');
      res.write('<input type="submit">');
      res.write("</form>");
      res.write("<h2> files:</h2>");

		/*
      var items = fs.readdirSync("./" + folder_path);
      items.forEach(item => {
        var fname = "/down?file=" + base64.encode(item);
        var link1 =
          "<a href='" +
          fname +
          "' download='" +
          item +
          "'>" +
          item +
          " </a><br>";
        res.write(link1);
      });*/
	  res.write('</body></html>');
      return res.end();
    }
  })
  .listen(8080);
console.log("port 8080");
