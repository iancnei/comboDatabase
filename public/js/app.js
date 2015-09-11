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
