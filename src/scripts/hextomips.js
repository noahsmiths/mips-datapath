/**
 * Fall 2014
 * CSCI 320 - Computer Architecture
 * Tiago Bozzetti, Ellie Easse and Chau Tieu
 *
 * Contains the function for converting the hex value to a MIPS instruction.
 */

/* Function to convert hex to binary.  It takes in a string with the hex value */
function hexToBinary(hex){
    if (checkHex(hex) == true) {
	var i, ret = '';
	for (i = 0; i < hex.length; i += 1) {    
	    if (hexTable.hasOwnProperty(hex[i])) {
		ret += hexTable[hex[i]];
	    } else {
		ret = false;
	    }
	}
	if (ret == false){
	    printErrorMessage("Error: Incorrect input. <BR> Please check to make sure you are entering valid hex numbers.");
	}
	else{
	    return ret;
	}
    }
    else {
	printErrorMessage("Error: Incorrect number of bits. <BR> Please check that you have the correct number of bits.");
    }
}


/* Function to determine which mips instruction is given */
function binaryToMips(bin){
    // document.getElementById("result_title").innerHTML = "Result";

    // var hex = document.getElementById("hex").value;
    // Check to see if hex has '0x' or 'x' at beginnig of value
    // if (hex.charAt(0) == 'x' || hex.charAt(0) == 'X'){
	// hex = hex.substring(1);
    // }
    // else if(hex.charAt(1) == 'x' || hex.charAt(1) == 'X'){
	// hex = hex.substring(2);
    // }
    // var bin = hexToBinary(hex);
    var opcode = bin.substring(0,6);
    var result = "";
    
    // search for the instruction object
    var insObj = searchIns(bin);

    // check if the instruction was found
    // if it was not found, print an error message and return
    // if(typeof insObj.format === 'undefined'){
	// document.getElementById("result_title").innerHTML = "Error";
	// document.getElementById("error_message").innerHTML = "Error: Instruction was not found. <BR> Please check to make sure you are entering a valid instruction.";
	// clearText("instruction_format");                  
	// clearText("instruction_info");
	// clearText("hex_result");
	// return;
    // }

    // if instruction was found, print instruction info
    // var instruction_info = getInstructionInfo(insObj);
    // document.getElementById("instruction_info").innerHTML = instruction_info;

    // build bits table for typed instruction
    var bits = [];
    for(i = 0; i < insObj.bits.length; i++){ // for every field of the instruction
	bits[i] = [];
	bits[i][0] = insObj.bits[i][0]; // copy starting bit
	bits[i][1] = insObj.bits[i][1]; // copy ending bit

	// get field content
	if(insObj.bits[i][3] == ""){
	    bits[i][3] = bin.substring(32 - insObj.bits[i][0] - 1, 32 - insObj.bits[i][1]); // get field content from binary value
	}
	else{
	    bits[i][3] =  insObj.bits[i][3]; // copy field content
	}

	// get field name
	if(insObj.bits[i][2].match(/(rd|rs|rt|base)/) == null){
	    bits[i][2] = insObj.bits[i][2]; // copy field name
	}
	else{
	    bits[i][2] = registerTable[bits[i][3]];
	}
    }

    // remove comas, parenthesis and square brackets of the format string
    var format = insObj.format;
    format = format.replace(/\[[^\]]+\]/g, ''); 
    format = format.replace(/,/g, ' '); 
    format = format.replace(/\(/g, ' '); 
    format = format.replace(/\)/g, ' '); 

    // get all the pieces of the format string and typed instruction (consider whitespaces as separators)
    var formatPieces = format.replace(/\s+/g,' ').trim().split(' ');

    // get the registers and immediates values and put them in an array
    for(i = 1; i < formatPieces.length; i++){
	for(j = 0; j < bits.length; j++){
	    if(insObj.bits[j][2] == formatPieces[i]){
		if(formatPieces[i].match(/(rd|rs|rt|base)/) != null){
		    formatPieces[i] = bits[j][2];
		}
		else{
		    formatPieces[i] = "0x" + binaryToHex(bits[j][3]);
		}
	    }
	}
    }

    return formatPieces.join(' ');
}
