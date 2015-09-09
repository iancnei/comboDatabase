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

function displayAuth(state)
{
	if(state === "out")
	{
		$("#signInForm p").remove();
		$("#signInButton").show();
		$("#signUpButton").show();
		$("#signOutButton").hide();
		$("#signInForm")[0].reset();
		$("#signUpForm")[0].reset();
	}
	else if(state === "in")
	{
		$("#signOutButton").show();
		$("#signInButton").hide();
		$("#signUpButton").hide();
		$("#signOutForm p").remove();
	}
}

// if a 401 (not authorized) request is ever sent, tell the user to login
$(document).ajaxError(function(e,res){
  if (res.status === 401) {
     alert(res.status, res.statusText, "please login...");
  }
});

// when document is ready
$(function () {
	renderCombos("/api/combos");

	if($.cookie("session") === undefined || $.cookie("session") === "foo")
	{
		displayAuth("out");
	}
	else
	{
		displayAuth("in");
	}
	
	$("#signInForm").on("submit", function(e)
	{
		e.preventDefault();

		$.post("/api/signIn", $("#signInForm").serialize())
		.done(
			function(response)
			{
				$("#signInModal").modal("hide");
				displayAuth("in");

				if(!$("#rememberMe").prop("checked"))
				{
					$.removeCookie('session');
				}
			})
		.fail(
			function(response)
			{
				$("#signInForm p").remove();
				$("#signInForm").append("<p>Incorrect Username or Password.</p>");
			});
	});

	$("#signUpForm").on("submit", function(e)
	{
		e.preventDefault();

		$.post("/api/signUp", $(this).serialize())
		.done(function(response)
			{
				$("#signUpModal").modal("hide");
				displayAuth("in");

				$.removeCookie('session');
			});
	});

	$("#signOutButton").on("click", function(e)
	{
		e.preventDefault();

		$.get("/api/signOut")
		.done(function()
			{
				displayAuth("out");
			});
	});

	$("#addComboForm").on("submit", function(e)
	{
		e.preventDefault();

		$.post("/api/combos", $(this).serialize())
		.done(function(response)
		{
			$("#addComboModal").modal("hide");
			renderCombos("/api/combos");
		})
	});

});
