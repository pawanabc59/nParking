# nParking
A non-Iot based solution which lets user to find the parking space nearby them.

## Process
1.First the landlord will upload his parking area information on website i.e address and what type of vehicle should be parked there.
2.User will register themselves on website and will be able to see various parking site.
3.They will be able to search parking spots near them.
4.Once parking spot selected user can book the place so that when they arrive they can park there vehicle.
5.User will be able to see beforehand that wheather the parking spot is full or empty.

## Installation
[Download the XAMPP](https://www.apachefriends.org/download.html)

Import the [sql file](https://github.com/pawanabc59/lawSystem/blob/master/lawsystem.sql) in phpmyadmin to have all the table and columns.

Installing NodeJs
```
$ sudo apt-get install nodejs
```

Cloning the repo
```
$ git clone https://github.com/pawanabc59/nParking.git
```
or download the zip file

Installing the dependencies
```
$ cd nParking
$ npm install
```

Start the XAMPP server and run this command in terminal or cmd to start the project.
```
$ nodemon app.js
```

Project will run on port 8060. Type this in browser
```
$ http://localhost:8060/login
```

## Technology stack
1.  Bootstrap
2.  HTML
3.  CSS
4.  NodeJS
