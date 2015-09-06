function renderCombos(route)
{
	var $comboContainer = $("#comboPlaceholder");
	var comboHTML = $("#comboTemplate").html();
	var comboTemplate = _.template(comboHTML);

	$comboContainer.empty();

	$.get(route)
	.done(function(data)
	{
		displayCombos = data.combos;
		$(displayCombos).each(function (index, element)
		{
			var $combo = $(comboTemplate(element));
			$comboContainer.append($combo);
		});
	});

}

// when document is ready
$(function () {
	renderCombos("/api/sol");
});
