function renderCombos(route)
{

	var $comboContainer = $("#comboPlaceholder");
	var comboHTML = $("#comboTemplate").html();
	var comboTemplate = _.template(comboHTML);

	$comboContainer.empty();

	$.get(route ? route : "/api/combos")
	.done(function(data)
	{
		// console.log(data);
		data.forEach(function(user)
		{
			var $user = $(comboTemplate(user));
			$comboContainer.append($user);
		});
	});
}

function parseYoutubeLink(ytLink)
{
	var embedLink = ytLink.slice(ytLink.lastIndexOf("/") + 1);
	var embedSeconds = null;
	var ytTimeIndex = null;
	// bool to determine if the parameter is preceded by an & or an ?
	var ampBool = false;

	if(embedLink.indexOf("&t=") !== -1)
	{
		ytTimeIndex = embedLink.indexOf("&t=");
		ampBool = true;
	}
	else if (embedLink.indexOf("?t=") !== -1 )
	{
		ytTimeIndex = embedLink.indexOf("?t=");
	}

	if(ytTimeIndex)
	{
		var embedTime = embedLink.slice(ytTimeIndex + 1);

		// check if there are minutes and convert them into seconds
		// need to check in case of a pure second time display
		embedSeconds = parseInt(embedTime.slice(embedTime.indexOf("s") - 2, embedTime.indexOf("s")));
		if(embedTime.indexOf("m") !== -1)
		{
			embedMinutes = embedTime.slice(embedTime.indexOf("m") - 1, embedTime.indexOf("m") + 1);
			embedMinutes = parseInt(embedMinutes) * 60;
			embedSeconds += embedMinutes;
		}
		// console.log(embedSeconds);
		if(ampBool)
		{
			embedLink = embedLink.substring(0, embedLink.indexOf("&t="));
		}
		else
		{
			embedLink = embedLink.substring(0, embedLink.indexOf("?t="));
		}
		// console.log("after time stamp check", embedLink);
	}

	var ytVideoIndex = embedLink.indexOf("v=");
	var ytAmpersandIndex = embedLink.indexOf("&");
	if(ytVideoIndex !== -1)
	{
		if(ytAmpersandIndex !== -1)
		{
			embedLink = embedLink.slice(ytVideoIndex + 2, ytAmpersandIndex);
		}
		else
		{
			embedLink = embedLink.slice(ytVideoIndex + 2);	
		}
		// console.log("after 'v=' check", embedLink);
	}

	if(embedSeconds)
	{
		embedLink = embedLink + "?start=" + embedSeconds;
	}

	return embedLink;
}

function populateEditForm(contextId)
{
	var newId = "=" + contextId;

	$.get("/api/combos/" + contextId)
	.done(function(data)
	{
		resetEditForm();

		if(data.moves)
		{
			$("#editComboMoves").val(data.moves);
		}
		if(data.damage)
		{
			$("#editComboDamage").val(data.damage);
		}
		if(data.meter)
		{
			$("#editComboMeter").val(data.meter);
		}
		if(data.position)
		{
			$("#editComboPosition").val(data.position);
		}
		if(data.notes)
		{
			$("#editComboNotes").val(data.notes);
		}
		if(data.link)
		{
			$("#editComboLink").val(data.link);
		}

		$("#editComboModal").modal("show");

		$("#editComboForm button").attr("id", newId);
	});
}

function resetEditForm()
{
	$("#editComboMoves").val("");
	$("#editComboDamage").val("");
	$("#editComboMeter").val("");
	$("#editComboPosition").val("");
	$("#editComboNotes").val("");
	$("#editComboLink").val("");
	$("#editComboForm button").attr("id", "editComboButton");
}

function sendEdit(contextId)
{
	var comboId = contextId.replace("=", "");
	var updatedCombo = $("#editComboForm").serialize();

	$.ajax(
	{
		url: '/api/combos/' + comboId,
		type: 'PUT',
		data: updatedCombo,
		success: function(res)
		{
			$("#editComboModal").modal("hide");

			renderCombos("/api/combos");
		},
		failure: function(res)
		{
			console.log("error sending edit");
		}
	});

	return false;
}

function deleteCombo(contextId)
{
	$.ajax(
	{
		url: "/api/combos/" + contextId,
		type: "DELETE",
		success: function(res)
		{
			renderCombos("/api/combos");
		},
		failure: function(res)
		{
			console.log("delete failed");
		}
	});
}

function displayComboDetails(contextId)
{
	id = "#collapse" + contextId.replace("combo", "");
	console.log(id);
	$(id).collapse('toggle');
}

function displayAuth(state, email)
{
	if(state === "out")
	{
		$("#signInForm p").remove();
		$("#signInButton").show();
		$("#signUpButton").show();
		$("#profileButton").hide();
		$("#signOutButton").hide();
		$("#signInForm")[0].reset();
		$("#signUpForm")[0].reset();
		$("#authButtons p").remove();
	}
	else if(state === "in")
	{
		$("#profileButton").show();
		$("#signOutButton").show();
		$("#signInButton").hide();
		$("#signUpButton").hide();
		$("#signOutForm p").remove();
		$("#authButtons").prepend("<p class='navbar-text'>Welcome Back " + email + " </p>");
	}
}

// if a 401 (not authorized) request is ever sent, tell the user to login
$(document).ajaxError(function(e,res){
  if (res.status === 401) {
     alert("You are not authorized to perform that action. Please Sign In.");
  }
});

function alertUser()
{
	alert("The link you are trying to click on is still under construction. Thank you for your patience =) ");
}

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
				console.log(response);
				$("#signInModal").modal("hide");
				displayAuth("in", response.email);

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
				console.log(response);
				$("#signUpModal").modal("hide");
				displayAuth("in", response.email);

				$.removeCookie('session');
			});
	});

	$("#signOutButton").on("click", function(e)
	{
		e.preventDefault();

		$.get("/api/signOut")
		.done(function()
			{
				displayAuth("out", null);
			});
	});

	$("#addComboForm").on("submit", function(e)
	{
		e.preventDefault();

		$.post("/api/newCombo", $(this).serialize())
		.done(function(response)
		{
			$("#addComboModal").modal("hide");
			renderCombos("/api/combos");
		})
	});
});
