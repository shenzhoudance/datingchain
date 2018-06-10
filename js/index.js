var dappAddress = "n1qBXaNhfZoBAfbpkvPMwxcKP9S9eh7Gste";
$(function () {
	var NebPay = require("nebpay");
	var nebpay = new NebPay();

	$("#all").click(function () {
		var to = dappAddress;
		var value = "0";
		var callFunction = "getData";
		var callArgs = "[]";
		nebpay.simulateCall(to, value, callFunction, callArgs, {
			listener: function (resp) {
				//console.log(JSON.stringify(resp.result));
				if (resp.result == "") {
					$("#searchresult").html('<div class="panel-body" >nodata</div>');
					return;
				}
				var res = JSON.parse(resp.result);
				if (res.length == 0) {
					$("#searchresult").html('<div class="panel-body">nodata</div>');
					return;
				}

				var tempStr = "";
				var time = Math.round(new Date().getTime() / 1000).toString(); //获取当前时间戳

				for (var i = 0; i < res.length-1; i++) {
					if (i % 2 == 0) { //0 2 4 6 8
						tempStr += '<div class="panel-body"> ';
					} else { //1 3 4 5 6
						tempStr += '<div class="panel-footer">';
					}
					tempStr += '<p>';
					tempStr += res[i].index + " " + res[i].content;
					tempStr += '<br>';
					tempStr += '<small><cite>' + 'ID:' + res[i].author.substr(3, 6) + '</cite></small>';
					tempStr += '<a class="btn" href="javascript:void(0)" id="like" onclick="addMy(';
					tempStr += res[i].index;
					tempStr += ')">联系TA</a>';
					tempStr += '</p> </div><hr> ';
				}
				console.log(tempStr);
				$("#searchresult").html(tempStr);
			}
		});
	});

	$("#my").click(function () {
		$("#detailTitle").text("约会历史");



		var to = dappAddress;
		var value = "0";
		var callFunction = "getMy";
		var callArgs = "[]";
		nebpay.simulateCall(to, value, callFunction, callArgs, {
			listener: function (resp) {
				//console.log(JSON.stringify(resp.result));
				if (resp.result == "") {
					$("#searchresult").html('<div class="panel-body">暂时没有记录</div>');
					return;
				}
				var res = JSON.parse(resp.result);
				if (res.length == 0) {
					$("#searchresult").html('<div class="panel-body">暂时没有记录</div>');
					return;
				}


				var tempStr = "";

				for (var i = 0; i < res.length; i++) {
					if (i % 2 == 0) {
						tempStr += '<div class="panel-body"> ';
					} else {
						tempStr += '<div class="panel-footer">';
					}

					tempStr += '<p>';
					tempStr += res[i].index + " " + res[i].content;
					tempStr += '<br>';
					tempStr += '<small><cite>' + 'ID:' + res[i].author.substr(3, 6) + '</cite></small>';
					tempStr += '<br>联系方式:' + res[i].contact;
					tempStr += '</p> </div><hr> ';
				}
				console.log(tempStr);
				$("#searchresult").html(tempStr);
			}
		});

	});

	$("#create").click(function () {
		$("#detailTitle").text("自我介绍")
		var tempStr = '';
		tempStr += '<div class="panel-body"> ';
		tempStr += '<form role="form">';
		tempStr += '<div class="form-group">';
		tempStr += '<br><h6>公开资料</h6>';
		tempStr += '<textarea class="form-control1" rows="10" id="content" placeholder="姓名&#13;&#10;性别&#13;&#10;个人介绍&#13;&#10;所在区域"></textarea>';
		tempStr += '<h6>隐私资料</h6>';
		tempStr += '<input type="text" class="form-control" rows="1" id="name" placeholder="联系电话">';
		tempStr += '<p>收取0.00001NAS保证金</p>';
		tempStr += '<br><br><button class="button1" class="btn btn-primary" id="savebutton" onclick="save();">上传信息</button><p color="red";>一旦提交将不可修改</p>';
		tempStr += '</div>';
		tempStr += '</form>';
		tempStr += '</div> ';
		console.log(tempStr);
		$("#searchresult").html(tempStr);
	});

	$("#about").click(function () {
		$("#detailTitle").text("关于")
		var tempStr = '';
		tempStr += '<div class="panel-body"> ';
		tempStr += '<form role="form">';
		tempStr += '<div class="form-group">';
		tempStr += '<h6>关于</h6>';
		tempStr += '<p>SegmentFault Blockchain Hackathon 编程马拉松 2018 北京站 参赛作品</p>';
		tempStr += '<div align="center" class="banner"><img src="image/about.jpg" alt=""></div>'
		tempStr += '</div>';
		tempStr += '</form>';
		tempStr += '</div> ';
		console.log(tempStr);
		$("#searchresult").html(tempStr);
	});


});

function addMy(index) {
	var NebPay = require("nebpay"); //https://github.com/nebulasio/nebPay
	var nebpay = new NebPay();
	var to = dappAddress;
	var value = "0.00001"; //保证金
	var callFunction = "addMy";
	var callArgs = "[\"" + index + "\"]";
	nebpay.call(to, value, callFunction, callArgs, {
		listener: function (resp) {
			console.log(JSON.stringify(resp.result));
		}
	});
};

function reMy(index) {
	var NebPay = require("nebpay"); //https://github.com/nebulasio/nebPay
	var nebpay = new NebPay();
	var to = dappAddress;
	var value = "0";
	var callFunction = "reMy";
	var callArgs = "[\"" + index + "\"]";
	nebpay.call(to, value, callFunction, callArgs, {
		listener: function (resp) {
			console.log(JSON.stringify(resp.result));
		}
	});
};

function savebid(i) {
	var NebPay = require("nebpay"); //https://github.com/nebulasio/nebPay
	var nebpay = new NebPay();
	var nids = i.toString();
	var nidsmon = $("#nidsmon").val();
	if (nids == "") {
		alert("FAIL...");
		return;
	}
	if (nidsmon == "") {
		alert("FAIL PRICE");
		return;
	}

	nids = nids.replace(/\n/g, "<br>");
	nidsmon = nidsmon.replace(/\n/g, "<br>");
	nebpay.call(dappAddress, "" + nidsmon, "bid", "[\"" + nids + "\"]", {
		listener: function Push(resp) {
			console.log("response of push: " + JSON.stringify(resp))
			var respString = JSON.stringify(resp);
			if (respString.search("rejected by user") !== -1) {
				alert("cancle")
			} else if (respString.search("txhash") !== -1) {
				alert("Update Hash: " + resp.txhash)
			}
		}
	})
};


function save() {
	var NebPay = require("nebpay"); //https://github.com/nebulasio/nebPay
	var nebpay = new NebPay();
	var content = $("#content").val();
	var name = $("#name").val();
	if (content == "") {
		alert("FAIL INFO");
		return;
	}
	if (name == "") {
		alert("FAIL TIME");
		return;
	}

	content = content.replace(/\n/g, "<br>");
	name = name.replace(/\n/g, "<br>");
	var to = dappAddress;
	var value = "0.00001";
	var callFunction = "save";
	var callArgs = '["' + content + '","' + name + '"]';
	nebpay.call(to, value, callFunction, callArgs, {
		listener: function Push(resp) {
			console.log("response of push: " + JSON.stringify(resp))
			var respString = JSON.stringify(resp);
			if (respString.search("rejected by user") !== -1) {
				alert("cancle")
			} else if (respString.search("txhash") !== -1) {
				alert("Update Hash: " + resp.txhash)
			}
		}
	});
};


function ttt(timestamp) {
	var date = new Date(timestamp * 1000);
	Y = date.getFullYear() + '-';
	M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
	D = date.getDate() + ' ';
	h = date.getHours() + ':';
	m = date.getMinutes() + ':';
	s = date.getSeconds();
	return Y + M + D + h + m + s;
}