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
	renderCombos("/api/combos");

	$("#signInBox").on("submit", function(e)
	{
		e.preventDefault();
		$.post("/api/signin", $(this).serialize())
		.done(
			function(response)
			{
				$("#signInBox").append("Signed In.");
				$("#signInBox")[0].reset();
			});
	});

	$("#signUpBox").on("submit", function(e)
	{
		e.preventDefault();
		$.post("/api/signup", $(this).serialize())
		.done(
			function(response)
			{
				$("#signUpBox").append("Signed Up.");
				$("#signUpBox")[0].reset();
			});
	});
});
