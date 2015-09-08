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

// when document is ready
$(function () {
	renderCombos("/combos");
	$("#signOutBox").hide();

	$("#signInBox").on("submit", function(e)
	{
		e.preventDefault();
		$.post("/signin", $(this).serialize())
		.done(
			function(response)
			{
				$("#signInBox").hide();
				$("#signUpBox").hide();
				$("#signOutBox").prepend('<p>Signed In</p>');
				$("#signOutBox").show();
				$("#signInBox")[0].reset();
			});
	});

	$("#signUpBox").on("submit", function(e)
	{
		e.preventDefault();
		$.post("/signup", $(this).serialize())
		.done(function(response)
			{
				$("#signInBox").hide();
				$("#signUpBox").hide();
				$("#signOutBox").prepend('<p>Signed Up</p>');
				$("#signOutBox").show();
				$("#signUpBox")[0].reset();
			});
	});

	$("#signOutBox").on("submit", function(e)
	{
		e.preventDefault();
		$.get("/signout")
		.done(function()
			{
				$("#signInBox").show();
				$("#signUpBox").show();
				$("#signOutBox").hide();
				$("#signOutBox p").remove();
			});
	});
});
