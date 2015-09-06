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
				var $combo = $(comboTemplate(combo));
				$comboContainer.append($combo);
			});
		});
	});

}

// when document is ready
$(function () {
	renderCombos("/api/combos");
});
