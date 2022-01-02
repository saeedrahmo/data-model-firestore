# Description
This project aims to practice the concepts, and techniques for data models and the communications for resources represented by data models.

The data set is from a Github project, under the directory of Workload Data.<br />

https://github.com/haniehalipour/Online-Machine-Learning-for-Cloud-Resource-Provisioning-of-Microservice-Backend-Systems<br />

The workload data contains the workload generated from two industrial benchmarks NDBench from Netflix and Dell DVD store from Dell. Both benchmarks are deployed on a cluster of cloud VMs on AWS and Azure clouds. The workload has been split to training sets and testing sets for machine learning purpose.<br />

In each of the workload file, the first 4 columns contain the following attributes.<br />

CPUUtilization_Average,NetworkIn_Average,NetworkOut_Average,MemoryUtilization_Average<br />

In order to provide a data model on the server-side, it is stored as JSON objects in Firestore which is a NoSQL cloudbased database. Two different collections are considered
for DVD and NDBench datasets. Each record is stored in the related collection with a document name (Testing/Training + incremental Integer identity).

# Tutorial

https://indepth.dev/posts/1084/building-an-api-with-firebase

# Deploy error fixing

https://stackoverflow.com/a/68423649
Easy fix. Inside your package.json change
"lint": "eslint",

# Screenshots
![Screenshot](https://github.com/saeedrahmo/coen424-assignment-1/blob/main/screenshots/firebase-model.png?raw=true "Server-side data model")
