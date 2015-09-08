function renderCombos(route)
{
	var $comboContainer = $("#comboPlaceholder");
	var comboHTML = $("#comboTemplate").html();
	var comboTemplate = _.template(comboHTML);

	$comboContainer.empty();

	$.get(route)
	.done(function(data)
	{
		data.forEach(function(user)
		{
			displayCombos = user.combos;
			displayCombos.forEach(function (combo)
			{
				// stretch goal: filter combos per character as well as per game

				var $combo = $(comboTemplate(combo));
				$comboContainer.append($combo);
			});
		});
	});
}

// function displayAuth(type)
// {
// 	if(type === "in")
// 	{
// 		$("#signInBox p").remove();
// 		$("#signInBox").show();
// 		$("#signUpBox").hide();
// 		$("#signOutBox").hide();
// 		$("#signOutBox").prepend('<p>Signed In</p>');
// 		$("#signInBox")[0].reset();
// 	}
// 	else if(type === "up")
// 	{
// 		$("#signUpBox").show();
// 		$("#signInBox").hide();
// 		$("#signOutBox").hide();
// 		$("#signOutBox").prepend('<p>Signed Up</p>');
// 		$("#signUpBox")[0].reset();
// 	}
// 	else if(type === "out")
// 	{
// 		$("#signOutBox").show();
// 		$("#signInBox").hide();
// 		$("#signUpBox").hide();
// 		$("#signOutBox p").remove();
// 	}
// }

// if a 401 (not authorized) request is ever sent, tell the user to login
$(document).ajaxError(function(e,res){
  if (res.status === 401) {
     alert(res.status, res.statusText, "please login...");
  }
});

// when document is ready
$(function () {
	renderCombos("/api/combos");

	if($.cookie("session") === undefined)
	{
		// displayAuth("in");
		$("#signOutModalButton").hide();
	}
	else
	{
		// displayAuth("out");
		$("#signInModalButton").hide();
		$("#signUpModalButton").hide();
	}
	
	$("#signInButton").on("click", function(e)
	{
		e.preventDefault();
		$("#signInModal").modal("hide");

		if($("#rememberMe").prop("checked"))
		{
			$.cookie("session", "foo");
		}

		$.post("/api/signin", $("#signInForm").serialize())
		.done(
			function(response)
			{
				// displayAuth("out");
			})
		.fail(
			function(response)
			{
				$("#signInBox p").remove();
				$("#signInBox").append("<p>Incorrect Username or Password.</p>");
			});
	});

	$("#signUpForm").on("submit", function(e)
	{
		e.preventDefault();
		$("#signUpModal").modal("hide");

		$.post("/api/signup", $(this).serialize())
		.done(function(response)
			{
				// displayAuth("out");
			});
	});

	$("#signOutForm").on("submit", function(e)
	{
		e.preventDefault();

		$.get("/api/signout")
		.done(function()
			{
				// displayAuth("in");
			});
	});
});
