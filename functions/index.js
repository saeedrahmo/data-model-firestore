// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
// csv
const fs = require("fs");
const parse = require("csv-parse");
const path = require("path");
const csv = require("csvtojson");
const folder = "../workload-data";
//storage
// Imports the Google Cloud client library
const { Storage } = require("@google-cloud/storage");
//
const app = express();
app.use(cors({ origin: true }));

exports.app = functions.https.onRequest(app);

const serviceAccount = require("./auth/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
// Get a new write batch
const batch = db.batch();

// For more information on ways to initialize Storage, please see
// https://googleapis.dev/nodejs/storage/latest/Storage.html

// Creates a client using Application Default Credentials
const storage = new Storage();

// Creates a client from a Google service account key
// const storage = new Storage({keyFilename: 'key.json'});

/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
// The ID of your GCS bucket
// const bucketName = 'your-unique-bucket-name';

//-
// <h4>Downloading a File</h4>
//
// The example below demonstrates how we can reference a remote file, then
// pipe its contents to a local file. This is effectively creating a local
// backup of your remote data.
//-
async function readStream(fileName, bucketName) {
  // const [files] =
  //const stream =
  await storage
    .bucket(bucketName)
    .file(fileName)
    .createReadStream()
    .on("end", function (data) {
      return data;
      // The file is fully downloaded.
    }); // fs.createWriteStream("../wd/ts.json")

  // res = [];
  // await new Promise((resolve, reject) => {
  //   stream.on("data", function (data) {
  //     //console.log(`<=== Connection data ===>`);
  //     // return data.toString("utf8");
  //     res.push(data.toString("utf8"));
  //   });

  //   stream.on("error", function (err) {
  //     console.log(`<=== Error: ${err} ===>`);
  //     reject(err);
  //     return err;
  //   });

  //   stream.on("close", function () {
  //     console.log(`<=== Connection closed ===>`);
  //     resolve();
  //   });
  // });
  // return res;
}

app.get("/api/files-read-stream", (req, res) => {
  (async () => {
    try {
      // console.log(`BUCKET NAME: ${req.query.bucket_name}`);
      // console.log(`FILE NAME: ${req.query.file_name}`);
      // let stream = await readStream(req.query.file_name, req.query.bucket_name);
      let stream = await readStream(req.query.file_name, req.query.bucket_name);

      // ob = JSON.stringify(stream);
      // console.log(`LENGTH: ${ob.length}`);
      // for (let index = 0; index < 1; index++) {
      //   const element = ob[index];
      //   for (item in element) {
      //     console.log(`${item.toString().toLowerCase()}: ${element[item]}`);
      //   }
      // }

      // stream.on("connect", function () {
      //   console.log(`<=== Connection connected ===>`);
      // });

      // let response = "";
      // stream.on("data", function (data) {
      //   //console.log(data.toString("utf8"));
      //   response = data.toString("utf8");
      // });

      // const filesList = [];
      // files.forEach((file) => {
      //   filesList.push(file.name);
      //   console.log(file);
      // });

      //const ut = stream.toString("utf8");
      // console.log(stream);
      // console.log("hello");
      // for (item in stream) {
      //   console.log(item);
      // }

      //let response = JSON.stringify(stream);
      return res.status(200).send(stream);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

async function listFiles(bucketName) {
  // Lists files in the bucket
  const [files] = await storage.bucket(bucketName).getFiles();

  return files;
  // console.log("Files:");
  // files.forEach((file) => {
  //   console.log(file.name);
  // });
}

app.get("/api/files-list/:bucket_name", (req, res) => {
  (async () => {
    try {
      let files = await listFiles(req.params.bucket_name);

      const filesList = [];
      files.forEach((file) => {
        filesList.push(file.name);
        console.log(file);
      });

      let response = JSON.stringify(filesList);
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// listFiles().catch(console.error);

async function createBucket(bucketName) {
  // Creates the new bucket
  await storage.createBucket(bucketName);
  //console.log(`Bucket ${bucketName} created.`);
}

// create bucket
app.post("/api/bucket-create", (req, res) => {
  (async () => {
    try {
      createBucket(req.body.bucket_name);
      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

async function listBuckets() {
  const [buckets] = await storage.getBuckets();

  return buckets;
  // console.log("Buckets:");
  // buckets.forEach((bucket) => {
  //   console.log(bucket.name);
  // });
}

// listBuckets().catch(console.error);

app.get("/api/bucket-list", (req, res) => {
  (async () => {
    try {
      let buckets = await listBuckets();

      const bucketList = [];
      buckets.forEach((bucket) => {
        bucketList.push(bucket.name);
      });

      let response = JSON.stringify(bucketList);
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
// The ID of your GCS bucket
// const bucketName = 'your-unique-bucket-name';

// The path to your file to upload
// const filePath = 'path/to/your/file';

// The new ID for your GCS file
// const destFileName = 'your-new-file-name';

async function uploadFile(filePath, destFileName, bucketName) {
  const options = {
    destination: destFileName,
  };

  await storage.bucket(bucketName).upload(filePath);
  // console.log(`${filePath} uploaded to ${bucketName}`);
}

// upload file
app.post("/api/file-upload", (req, res) => {
  (async () => {
    try {
      const folderJson = "../workload-data/json";
      const files = await fs.promises.readdir(
        path.resolve(__dirname, folderJson),
        (err, files) => {
          if (err) throw err;
          return files;
        }
      );

      const promises = files.map(async (file) => {
        const extname = path.extname(file);
        const filename = path.basename(file, extname);
        const absolutePath = path.resolve(folderJson, file);

        await uploadFile(
          absolutePath,
          req.body.dest_filename,
          req.body.bucket_name
        );
      });

      await Promise.all(promises);
      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

async function downloadFile(fileName, destFileName, bucketName) {
  const options = {
    destination: destFileName,
  };
  // Downloads the file
  await storage.bucket(bucketName).file(fileName).download(options);
}

// download file
app.get("/api/file-download", (req, res) => {
  (async () => {
    try {
      let response = await downloadFile(
        req.query.file_name,
        req.query.dest_file_name,
        req.query.bucket_name
      );
      console.log(response);
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

app.get("/hello-world", (req, res) => {
  return res.status(200).send("Hello World!");
});

csvBatchSend = async () => {
  const files = await fs.promises.readdir(
    path.resolve(__dirname, folder),
    (err, files) => {
      if (err) throw err;
      return files;
    }
  );

  const batchArray = [];
  batchArray.push(batch);
  let operationCounter = 0;
  let batchIndex = 0;

  for (const file of files) {
    const extname = path.extname(file);
    const filename = path.basename(file, extname);
    const absolutePath = path.resolve(folder, file);

    // Async / await usage
    const jsonArray = await csv().fromFile(absolutePath);
    // const len = jsonArray.length;
    // const step =
    //   len > batchSize * 500 ? batchSize * 500 : batchSize * 500 - len;
    // const top = len > step + 500 ? len : step + 500;
    for (let index = 0; index < jsonArray.length; index++) {
      const wrRef = db.collection(filename.toLowerCase()).doc(`/${index + 1}/`);

      const element = jsonArray[index];
      var str = "{";
      for (item in element) {
        str += `"${item.toString().toLowerCase()}": ${element[item]}`;
        if (
          item.toString().toLowerCase() !=
          Object.keys(element).pop().toLowerCase()
        )
          str += ", ";
      }
      str += "}";
      //console.log(`${filename.toLowerCase()}\n${str}`);
      // await batch.set(wrRef, JSON.parse(str));

      batchArray[batchIndex].set(wrRef, JSON.parse(str));
      operationCounter++;

      if (operationCounter === 100) {
        batchArray.push(batch);
        batchIndex++;
        operationCounter = 0;
      }
    }
  }

  return batchArray;

  //batchArray.forEach(async (batch) => await batch.commit());
  //await batch.commit();
};

// create
app.post("/api/write", (req, res) => {
  (async () => {
    try {
      // const wrRef = db.collection("wd-video").doc(`/2/`);
      // batch.set(wrRef, { cpu: 100, memory: 230 });
      // batch.set(wrRef, { cpu: 200, memory: 300 });
      // const wrRef2 = db.collection("wd-video").doc(`/3/`);
      // batch.set(wrRef2, { cpu: 100, memory: 230 });
      // batch.set(wrRef2, { cpu: 200, memory: 300 });
      // await batch.commit();

      // const promises = async () => {

      // const files = await getFilePaths();

      // await Promise.all(files.map(async (file) => {
      //   const contents = await fs.readFile(file, 'utf8')
      //   console.log(contents)
      // }));

      // async function printFiles() {
      //   const files = await getFilePaths();

      //   for (const file of files) {
      //     const contents = await fs.readFile(file, "utf8");
      //     console.log(contents);
      //   }
      // }

      // const files = await fs.promises.readdir(
      //   path.resolve(__dirname, folder),
      //   (err, files) => {
      //     if (err) throw err;
      //     return files;
      //   }
      // );

      // const promises = files.map(async (file) => {
      //   const extname = path.extname(file);
      //   const filename = path.basename(file, extname);
      //   const absolutePath = path.resolve(folder, file);

      //   // Async / await usage
      //   const jsonArray = await csv().fromFile(absolutePath);
      //   for (let index = 0; index < 1; index++) {
      //     const wrRef = db
      //       .collection(filename.toLowerCase())
      //       .doc(`/${index + 1}/`);

      //     const element = jsonArray[index];
      //     var str = "{";
      //     for (item in element) {
      //       str += `"${item.toString().toLowerCase()}": ${element[item]}`;
      //       if (
      //         item.toString().toLowerCase() !=
      //         Object.keys(element).pop().toLowerCase()
      //       )
      //         str += ", ";
      //     }
      //     str += "}";
      //     console.log(`${filename.toLowerCase()}\n${str}`);
      //     await batch.set(wrRef, JSON.parse(str));
      //   }
      // });

      barr = await csvBatchSend();
      const promises = barr.map(async (bt) => {
        await bt.commit();
      });
      await Promise.all(promises);
      //barr.forEach(async (bt) => await bt.commit());

      //await csvBatchSend();

      // const promises = fs.promises.readdir(
      //   path.resolve(__dirname, folder),
      //   (err, files) => {
      //     if (err) throw err;

      //     for (let file of files) {
      //       const extname = path.extname(file);
      //       const filename = path.basename(file, extname);
      //       const absolutePath = path.resolve(folder, file);

      //       // Async / await usage
      //       const jsonArray = csv().fromFile(absolutePath);
      //       for (let index = 0; index < 1; index++) {
      //         const wrRef = db
      //           .collection(filename.toLowerCase())
      //           .doc(`/${index + 1}/`);

      //         const element = jsonArray[index];
      //         var str = "{";
      //         for (item in element) {
      //           str += `"${item.toString().toLowerCase()}": ${element[item]}`;
      //           if (
      //             item.toString().toLowerCase() !=
      //             Object.keys(element).pop().toLowerCase()
      //           )
      //             str += ", ";
      //         }
      //         str += "}";
      //         console.log(`${filename.toLowerCase()}\n${str}`);
      //         batch.set(wrRef, JSON.parse(str));
      //       }

      //       // csv()
      //       //   .fromFile(absolutePath)
      //       //   .then((jsonObj) => {
      //       //     for (let index = 0; index < 1; index++) {
      //       //       const wrRef = db
      //       //         .collection(filename.toLowerCase())
      //       //         .doc(`/${index + 1}/`);

      //       //       const element = jsonObj[index];
      //       //       var str = "{";
      //       //       for (item in element) {
      //       //         str += `"${item.toString().toLowerCase()}": ${
      //       //           element[item]
      //       //         }`;
      //       //         if (
      //       //           item.toString().toLowerCase() !=
      //       //           Object.keys(element).pop().toLowerCase()
      //       //         )
      //       //           str += ", ";
      //       //       }
      //       //       str += "}";
      //       //       console.log(`${filename.toLowerCase()}\n${str}`);
      //       //       batch.set(wrRef, JSON.parse(str));
      //       //     }
      //       //   });
      //     }
      //   }
      // );

      //await batch.commit();
      // };
      // const fresult = await Promise.all(promises);

      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// create
app.post("/api/create", (req, res) => {
  (async () => {
    try {
      await db
        .collection("items")
        .doc("/" + req.body.id + "/")
        .create({ item: req.body.item, color: "blue" });
      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// read item
app.get("/api/read/:item_id", (req, res) => {
  (async () => {
    try {
      const document = db.collection("items").doc(req.params.item_id);
      let item = await document.get();
      let response = item.data();
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// read all
app.get("/api/read", (req, res) => {
  (async () => {
    try {
      let query = db.collection("items");
      let response = [];
      await query.get().then((querySnapshot) => {
        let docs = querySnapshot.docs;
        for (let doc of docs) {
          const selectedItem = {
            id: doc.id,
            item: doc.data().item,
          };
          response.push(selectedItem);
        }
      });
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// update
app.put("/api/update/:item_id", (req, res) => {
  (async () => {
    try {
      const document = db.collection("items").doc(req.params.item_id);
      await document.update({
        item: req.body.item,
      });
      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// delete
app.delete("/api/delete/:item_id", (req, res) => {
  (async () => {
    try {
      const document = db.collection("items").doc(req.params.item_id);
      await document.delete();
      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

exports.convertLargeFile = functions
  .runWith({
    // Ensure the function has enough memory and time
    // to process large files
    timeoutSeconds: 540,
    memory: "8GB",
  })
  .storage.object()
  .onFinalize(async (object) => {
    //console.log("LARGE FILE");
    // Do some complicated things that take a lot of memory and time
  });
