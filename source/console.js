var Console = {

	code: [],
	clearCode: function () {
		"use strict";
		this.code.splice(0, this.code.length);
	},

	evaluateCode: function (codeToRun) {
		"use strict";
		var func = new Function(codeToRun);
		return func();
	},

	init: function () {
		"use strict";
		var console, inputContainer;
		console = $("#console").addClass("console");
		$("<pre></pre>").addClass("history").appendTo(console);
		$("<div></div>").html("&gt;").addClass("caret").appendTo(console);
		inputContainer = $("<div></div>").addClass("inputContainer").appendTo(console);
		$("<input></input>").attr("placeholder", "start scripting here...").addClass("input").keypress(this.codeEntered).appendTo(inputContainer).focus();
	},

	isStatement: function (value) {
		"use strict";
		var isStatement = false;
		isStatement = isStatement || value.trim().substr(0, 3) === "for";
		isStatement = isStatement || value.trim().substr(0, 5) === "while";
		isStatement = isStatement || value.trim().substr(0, 2) === "do";
		isStatement = isStatement || value.trim().substr(0, 2) === "if";
		isStatement = isStatement || value.trim().substr(0, 5) === "switch";
		isStatement = isStatement || value.trim().substr(0, 3) === "try";
		return isStatement;
	},
	codeEntered: function (e) {
		"use strict";
		if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
			var input, console, history, evaluation, inputValue;
			input = $("#console input");
			console = $("#console");
			history = $("#console pre");
			evaluation = "nothing";
			inputValue = input.val();

			history.append("&gt;&gt; " + inputValue.replace(/>/gi, "&gt;").replace(/</gi, "&lt;") + "<br />");

			switch (inputValue.toUpperCase()) {
			case "CLEAR":
				Console.clearCode();
				history.append("&gt;&gt; " + inputValue.replace(/>/gi, "&gt;").replace(/</gi, "&lt;") + "<br />");
				break;

			case "ABOUT":
			case "HELP":
				history.append(' <br/><h3 style=""> --------| welcome to console.js |---------</h3> the intent of this application is to provide<br /> a <a href="http://en.wikipedia.org/wiki/Read-eval-print_loop" style="color:#7386a5" target="_blank">REPL</a> type interactive interface to encourage <br /> learning, debugging and having fun with javascript<br /> any typical javascript can be called, plus,<br /> jquery is referenced, so that can be used as well<br/><br /> <span style="font-weight:bolder;">commands: </span><br /><br /><div style="padding-left: 30px;"><span style="font-weight:bold;">clear</span> - clears any previous functions,variables</span><br /><span style="font-weight:bold;">help,about</span> - about console.js, list of commands</div><br/>');
				Console.clearCode();
				break;

			default:
				try {
					var codeToRun = "";

					var isVariableDeclaration = inputValue.trim().substr(0, 3) === "var";
					var isFunction = inputValue.indexOf("function ") >= 0;

					if (isVariableDeclaration || isFunction) {
						Console.code.push("\r\r " + inputValue);
					} else {
						for (var i = 0; i < Console.code.length; i++) {
							if (Console.code[i]) {
								codeToRun += "\r\r" + Console.code[i];
							}
						}
						var lastCharIndex = inputValue.length - 1;

						if (Console.isStatement(inputValue)) {
							codeToRun += inputValue;
						} else {
							codeToRun += "\r\r return " + inputValue;
						}

						if (inputValue[lastCharIndex] !== ';' && inputValue[lastCharIndex] !== '}') {
							codeToRun += ";";
						}
					}

					evaluation = Console.evaluateCode(codeToRun);

					if (evaluation || evaluation === 0) {
						history.append('<span style="color:#8F9D6A">=&gt; ' + evaluation + "</span><br/>");
					}
					
					if(!evaluation && !isVariableDeclaration && !isFunction) {
						evaluation = '<span style="color:#CF6A4C">' + evaluation + "</span>";
						history.append(evaluation + "<br/>");
					}
				} catch (error) {
					evaluation = '<span style="color:#CF6A4C">' + error + "</span>";
					history.append(evaluation + "<br/>");
				}
				break;
			}
			input.val("");
			input.focus();
			$("body").scrollTop($("body").prop("scrollHeight"));

			return false;
		} else {
			return true;
		}

	}
};

$(document).ready(function () {
	"use strict";
	Console.init();
	$("html").click(function () { $(".input").focus(); });
});
