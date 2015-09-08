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

function displayAuth(type)
{
	if(type === "in")
	{
		$("#signInBox").show();
		$("#signUpBox").hide();
		$("#signOutBox").hide();
	}
	else if(type === "up")
	{
		$("#signUpBox").show();
		$("#signInBox").hide();
		$("#signOutBox").hide();
	}
	else if(type === "out")
	{
		$("#signOutBox").show();
		$("#signInBox").hide();
		$("#signUpBox").hide();
	}
}

// when document is ready
$(function () {
	renderCombos("/combos");
	if($.cookie("session") === undefined)
	{
		displayAuth("in");
	}
	else
	{
		displayAuth("out");
	}
	

	$("#signInBox").on("submit", function(e)
	{
		e.preventDefault();

		if($("#rememberMe").prop("checked"))
		{
			$.cookie("session", "foo");
		}

		$.post("/signin", $(this).serialize())
		.done(
			function(response)
			{
				displayAuth("out");
				$("#signOutBox").prepend('<p>Signed In</p>');
				$("#signInBox")[0].reset();
			});
	});

	$("#signUpBox").on("submit", function(e)
	{
		e.preventDefault();

		$.post("/signup", $(this).serialize())
		.done(function(response)
			{
				displayAuth("out");
				$("#signOutBox").prepend('<p>Signed Up</p>');
				$("#signUpBox")[0].reset();
			});
	});

	$("#signOutBox").on("submit", function(e)
	{
		e.preventDefault();
		$.get("/signout")
		.done(function()
			{
				displayAuth("in");
				$("#signOutBox p").remove();
			});
	});
});
