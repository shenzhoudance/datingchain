"use strict";

var DateChain = function() {
	LocalContractStorage.defineMapProperty(this, "Data");
	LocalContractStorage.defineMapProperty(this, "myData");
	LocalContractStorage.defineProperty(this, "order");
};

DateChain.prototype = {
	init: function() {
		this.order = 0;
	},
	save: function(content,contact) {
		content = content.trim();
		if (content === "") {
			throw new Error("Emptycontent");
		}
		contact = contact.trim();
		if (contact === "") {
			throw new Error("Emptycontact");
		}
		var key = this.order;
		var obj = new Object();
		obj.index = key;
		obj.content = content;
		obj.contact = contact;
		obj.author = Blockchain.transaction.from;
		obj.createdDate = Blockchain.transaction.timestamp;
		obj.value = Blockchain.transaction.value;
		var pd = obj.value / (10e17);
		if (pd <= 0.0000099999) {
			throw new Error("0.00001");
		}
		var transf = Blockchain.transfer('n1RwrbRxDDyo5uSkSZCCx8tyjj3ZnPmP1c7',obj.value);
		if (!transf) {
			throw new Error("transfer failed.");
		}
		this.Data.set(key, JSON.stringify(obj));
		this.order += 1;
	},
	getData: function() {
		var from = Blockchain.transaction.from;
		var myArr = [];
		for(var i=0; i<this.order; i++){
			var tempObj = JSON.parse(this.Data.get(i));
			myArr.push(tempObj);
		}
		return myArr;
	},
	addMy: function(index){
		var from = Blockchain.transaction.from;
		var value = Blockchain.transaction.value;
		var tempObj = this.myData.get(from);
		var myArr;
		if(tempObj == null){
			myArr = [];
			myArr.push(index);
		}else{
			myArr = JSON.parse(tempObj);
			if(myArr.indexOf(index) < 0){
				myArr.push(index);
			}
		}
		var pd = value / (10e17);
		if (pd <= 0.0000099999) {
			throw new Error("0.00001");
		}
		var trans = Blockchain.transfer('n1RwrbRxDDyo5uSkSZCCx8tyjj3ZnPmP1c7',value);
		if (!trans) {
			throw new Error("transfer failed.");
		}
		this.myData.set(from, JSON.stringify(myArr));		
	},
	reMy: function(index){
		var from = Blockchain.transaction.from;
		var tempObj = this.myData.get(from);
		var myArr;
		if(tempObj == null){
			throw new Error("AddData");
		}else{
			myArr = JSON.parse(tempObj);
			var i = myArr.indexOf(index);
			if(i < 0){
				throw new Error("Data");
			}else{
				myArr.splice(i, 1);
			}
		}
		this.myData.set(from, JSON.stringify(myArr));		
	},
	getMy: function(){
		var from = Blockchain.transaction.from;
		var tempObj = this.myData.get(from);
		var myArr = [];
		if(tempObj == null){
			return myArr;
		}else{
			var myLikeArr = JSON.parse(tempObj);
			for(var i=0; i<myLikeArr.length; i++){
				var temp = JSON.parse(this.Data.get(myLikeArr[i]));
				myArr.push(temp);
			}
		}

		return myArr;
	}
};

module.exports = DateChain;