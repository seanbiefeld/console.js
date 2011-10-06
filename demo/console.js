var Console = {
	code: [],
	codeAsString: function () {
		"use strict";
		var code;
		for (var i = 0; i < Console.code.length; i++) {
			if (Console.code[i]) {
				code += "\r\r" + Console.code[i];
			}
		}
		return code;
	},
	clearCode: function () {
		"use strict";
		this.code.splice(0, this.code.length);
	},
	clear: function () {
		"use strict";
		this.history.clear();
		this.clearCode();
		this.history.position = Number.NaN;
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
		$("<input></input>").attr("placeholder", "start scripting here...").addClass("input").keydown(this.codeEntered).appendTo(inputContainer).focus();
	},
	isStatement: function (statement) {
		"use strict";
		var isStatement = false;
		if (statement) {
			isStatement = isStatement || statement.trim().substr(0, 3) === "for";
			isStatement = isStatement || statement.trim().substr(0, 5) === "while";
			isStatement = isStatement || statement.trim().substr(0, 2) === "do";
			isStatement = isStatement || statement.trim().substr(0, 2) === "if";
			isStatement = isStatement || statement.trim().substr(0, 5) === "switch";
			isStatement = isStatement || statement.trim().substr(0, 3) === "try";
		}
		return isStatement;
	},
	help: ' <br/><h3 style=""> --------| welcome to console.js |---------</h3> the intent of this application is to provide<br /> a <a href="http://en.wikipedia.org/wiki/Read-eval-print_loop" style="color:#7386a5" target="_blank">REPL</a> type interactive interface to encourage <br /> learning, debugging and having fun with javascript<br /> any typical javascript can be called, plus,<br /> jquery is referenced, so that can be used as well<br/><br /> <span style="font-weight:bolder;">note: </span>to see results in the output wrap the<br/> statements in a function that returns a string<br/><br /> <span style="font-weight:bolder;">commands: </span><br /><br /><div style="padding-left: 30px;"><span style="font-weight:bold;">clear</span> - clears any previous functions,variables</span><br /><span style="font-weight:bold;">help,about</span> - about console.js, list of commands<br /><span style="font-weight:bold;">Console.code</span> - view previously entered members<br/><span style="font-weight:bold;font-size:2em;">&uarr;</span> - previously typed items, back in history<br/><span style="font-weight:bold;font-size:2em;">&darr;</span> - previously typed items, forward in history</div><br/>',
	codeEntered: function (e) {
		"use strict";
		var input, console, history, evaluation, inputValue;
		input = $("#console input");
		console = $("#console");
		history = $("#console pre");
		evaluation = "nothing";
		inputValue = input.val();
		
		//go back in history
		if ((e.which && e.which === 38) || (e.keyCode && e.keyCode === 38)) {
			input.val(Console.history.previousItem());
			return false;
		}
		
		//go forward in history
		if ((e.which && e.which === 40) || (e.keyCode && e.keyCode === 40)) {
			input.val(Console.history.nextItem());
			return false;
		}
		
		if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
			history.append("&gt;&gt; " + inputValue.replace(/>/gi, "&gt;").replace(/</gi, "&lt;") + "<br />");
			Console.history.position = Number.NaN;
			Console.history.items.push(inputValue);
			
			switch (inputValue.toUpperCase()) {
			case "CLEAR":
				Console.clear();
				history.html("");				
				break;

			case "ABOUT":
			case "HELP":
				history.append(Console.help);
				break;

			default:
				try {
					var isVariableDeclaration = inputValue.trim().substr(0, 3) === "var";
					var isFunction = inputValue.indexOf("function ") >= 0;
					var isAssignment = inputValue.indexOf("=") >= 0;
					var isInvocation = (inputValue.indexOf(")") === inputValue.length - 1) || (inputValue.indexOf(")") === inputValue.length - 2);
					var codeToRun = Console.codeAsString();
					
					if (isVariableDeclaration || isFunction || isAssignment || isInvocation) {
						Console.evaluateCode(codeToRun + "\r\r" + inputValue);
						Console.code.push("\r\r " + inputValue);
					} else {						 
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

					if (evaluation || evaluation === 0 || evaluation === false) {
						history.append('<span style="color:#8F9D6A">=&gt; ' + evaluation + "</span><br/>");
					} else {
						if(!evaluation && !isVariableDeclaration && !isFunction && !isAssignment && !isInvocation) {
							evaluation = '<span style="color:#CF6A4C">' + evaluation + "</span>";
							history.append(evaluation + "<br/>");
						}
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
		}

	}
};

Console.history = {
	items: [],
	position: Number.NaN,
	clear: function () {
		"use strict";
		this.items.splice(0, this.items.length);
	},
	nextItem: function () {
		"use strict";
		if (this.items.length > 0) {
			if (this.position < this.items.length) {
				this.position++;
				return this.items[this.position];
			}
		}
	},
	previousItem: function () {
		"use strict";
		if (this.items.length > 0) {
			if (isNaN(this.position)) {
				this.position = this.items.length - 1;
				return this.items[this.position];
			} else {				
				if (this.position > -1) {
					this.position--;
					return this.items[this.position];
				}
			}
		}
	}
};

$(document).ready(function () {
	"use strict";
	Console.init();
	$("html").click(function () { $(".input").focus(); });
});
