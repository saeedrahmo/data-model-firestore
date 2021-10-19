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
//
const app = express();
app.use(cors({ origin: true }));

app.get("/hello-world", (req, res) => {
  return res.status(200).send("Hello World!");
});

exports.app = functions.https.onRequest(app);

const serviceAccount = require("./auth/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
// Get a new write batch
const batch = db.batch();

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

      if (operationCounter === 499) {
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
      barr.forEach(async (bt) => await bt.commit());
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
