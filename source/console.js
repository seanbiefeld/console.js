$(document).ready(function(){
	Console.init();	
});

var Console = {

	code: "",
	clearCode: function(){
		this.code = "";
	},

	evaluateCode: function(codeToRun){
		var func = new Function(codeToRun);
		return func();
	},

	init: function(){
		var console = $("#console").addClass("console");
		$("<pre></pre>").addClass("history").appendTo(console);
		$("<span></span>").html("&gt;").css("padding-right", "5px").appendTo(console);
		$("<input></input>").addClass("input").keypress(this.codeEntered).appendTo(console).focus();
	},
	
	codeEntered: function (e) {
		if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
			var input = $("#console input");
			var console = $("#console");
			var history = $("#console pre");
		
			var evaluation ="nothing";
			var inputValue = input.val();
			
			history.append("&gt;&gt; " + inputValue.replace(/>/gi,"&gt;").replace(/</gi,"&lt;") + "<br />");
			
			switch(inputValue.toUpperCase()){
				case "CLEAR":{
					Console.clearCode();
					history.append("&gt;&gt; " + inputValue.replace(/>/gi,"&gt;").replace(/</gi,"&lt;") + "<br />");
					break;
				}
				default:{
					try
					{
						var codeToRun = "";
					
						if(inputValue.indexOf("var ") >= 0 || inputValue.indexOf("function ") >= 0 || inputValue.indexOf("[") >= 0){
							codeToRun = Console.code + "\r\r ";
							Console.code+="\r\r "+inputValue;
						}
						else{
							codeToRun = Console.code + "\r\r return " + inputValue + ";";
						}
					
						evaluation = Console.evaluateCode(codeToRun);
						
						if(evaluation || evaluation == 0)
							history.append('<span style="color:#8F9D6A">=&gt; ' + evaluation + "</span><br/>");
					}
					catch(error){
						evaluation = '<span style="color:#CF6A4C">' + error + "</span>";
						history.append(evaluation + "<br/>");
					}
					break;
				}	
			}	
			input.val("");				
			input.focus();
			$("body").scrollTop($("body").prop("scrollHeight"));
			return false;
		} else {
			return true;
		}
	
	}
}