function renderCombos()
{
	var $comboContainer = $("#comboPlaceholder");
	var comboHTML = $("#comboTemplate").html();
	var comboTemplate = _.template(comboHTML);

	$comboContainer.empty();

	$.get("/api/sol")
	.done(function(data)
	{
		$(data).each(function (index, element)
		{
			var $combo = $(comboTemplate(element));
			$comboContainer.append($combo);
		});
	});

}

// when document is ready
$(function () {
	renderCombos();
});
