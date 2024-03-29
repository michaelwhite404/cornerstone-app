# Cornerstone App

An app created by Cornerstone Schools of Washington to automate many school processes.

## _Why did we created this ?_

During the beginning of the pandemic, our school needed a system to remember who had each of the Chromebooks we gave to our students. At first, we used a spreadsheet but it lacked the support we needed truly track check ins/out. Because of this issue, we created our own app that teachers and administrators could use to check in and check out devices to students.

Our app was a success in our school and we are extending the project. We are adding more implementations to automate such as textbook checkout, leave request, mainentance requests & more.

![App Image 1](./screenshots/cstone1.png)

![App Image 2](./screenshots/cstone2.png)

![App Image 3](./screenshots/cstone3.png)

## Cloning the Repository

Our app requires Node.js v12+ to run.

If you want to copy this project, create a new directory and run this command in your terminal:

```sh
cd <YOUR_APP>
git clone https://github.com/michaelwhite404/cornerstone-app.git
```

Then, to install the dependencies run:

```sh
npm install
```

Start the app by running

```sh
npm start
```

## Tech Stack

- [MongoDB] - The non-relational database which stores all of our documents. We use [Mongoose](https://github.com/Automattic/mongoose) as an object data modeling tool.
- [Express] - Back end frame work for Node.js
- [Node.js] A javascript runtime built on Chrome's V8 JavaScript engine.

## Features

- Checks chromebooks in and out for every student in the school
- Has running log of all the check out for each device
- Error log for each device, detailing issues related to the deivec
- A table showing the status of all of the devices grouped bt device brand
- REST API to get and post data for devices, device log, students, and employees

## License

MIT

[//]: # "These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax"
[mongodb]: https://https://www.mongodb.com
[node.js]: http://nodejs.org
[express]: http://expressjs.com
