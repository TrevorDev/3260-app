/*********************************************************************
* PROJECT: ResearchPal
* FILE NAME: user.js
*
* AUTHOR: 
*   Heesung Ahn
*   Trevor Baron
*   Anuj Bhatia
*   Angela Pang
*   Dan Robinson 
*
* DATE CREATED: 01/10/2013
*********************************************************************/

var fs = require('fs');
var ejs = require('ejs');
var rek = require('rekuire');

var userM = rek('userModel.js');