var TEAMS = {}

function loadTeams(file) {
    $.getJSON(file, function(data) {
        $.each(data, function(code, team) {
        	TEAMS[code] = team;
        })
    });
}

function teamFor(code) {
	return (code in TEAMS)? TEAMS[code] : { name: code };
}

function renderGroupTables(file) {
    $.getJSON(file, function(data) {
        $.each(data, function(index, group) {
            renderGroupTable($('#' + group.id), group);
        })
    });
}

function renderGroupTable(table, group) {
	table.empty();
	table.append('<caption>' + group.name + '</caption>');
	table.append('<thead><tr><th/><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>PTS</th></tr></thead>');
	$.each(getGroupTableData(group), function(index, team) {
		var row = $('<tr></tr>')
		var nameCell = $('<td>' + teamFor(team.code).name + '</td>')
			.addClass('team').addClass(team.code.toLowerCase());
		row.append(nameCell);
		row.append('<td>' + team.p   + '</td>');
		row.append('<td>' + team.w   + '</td>');
		row.append('<td>' + team.d   + '</td>');
		row.append('<td>' + team.l   + '</td>');
		row.append('<td>' + team.f   + '</td>');
		row.append('<td>' + team.a   + '</td>');
		row.append('<td>' + team.gd  + '</td>');
		row.append('<td>' + team.pts + '</td>');
		table.append(row);
	});
	return table;
}

function getGroupTableData(group) {
	var map = {};
	$.each(group.teams, function(index, team) {
		map[team] = { code: team, p:0, w:0, d:0, l:0, f:0, a:0, gd: 0, pts:0 };
	});
	$.each(group.games, function(index, game) {
		var teams = Object.keys(game);
		var t1 = teams[0]; var t2 = teams[1];
		if (game[t1] != null) {
			var dt1 = map[t1]; var dt2 = map[t2];
			var s1 = game[t1]; var s2 = game[t2];
			dt1.p ++; dt2.p ++;
			dt1.f += s1; dt1.a += s2; dt2.f += s2; dt2.a += s1;
			dt1.gd += (s1 - s2); dt2.gd += (s2 - s1);
			if (s1 > s2) {
				dt1.w ++; dt2.l ++;
				dt1.pts += 3;
			} else if (s1 == s2) {
				dt1.d ++; dt2.d ++;
				dt1.pts ++; dt2.pts ++;
			} else {
				dt1.l ++; dt2.w ++;
				dt2.pts += 3;
			}
		}
	});
	var arr = new Array();
	for (var team in map) {
	    arr.push(map[team]);
	}
	arr.sort(function(a, b) {
		var pts = b.pts - a.pts; if (pts != 0) return pts;
		var gd  = b.gd  - a.gd;  if (gd  != 0) return gd;
		var f   = b.f   - a.f;   if (f   != 0) return f;
	});
	return arr;
}

function renderKnockoutTable(file) {
    $.getJSON(file, function(data) {
		$.each(data, function(gameKey, gameData){
			console.log(gameKey);
			console.log(gameData);
			renderKnockoutGame($("#" + gameKey), gameData);
		})
    });
}

function renderKnockoutGame(elem, game) {
	elem.empty();
	var teams = Object.keys(game);
	var t1 = teams[0]; var t2 = teams[1];
	var s1 = game[t1]; var s2 = game[t2];
	var t1Elem = $('<div></div>').addClass(t1.toLowerCase() + " team").text(teamFor(t1).name);
	var t2Elem = $('<div></div>').addClass(t2.toLowerCase() + " team").text(teamFor(t2).name);
	var sElem  = $('<div></div>').addClass("score");
	if (s1 == null || s2 == null) {
		sElem.text('-')
	} else {
		var notes = game.notes == null ? '' : ' ('+game.notes+')'
		sElem.text(s1 + ' : ' + s2 + notes)
	}
	elem.append(t1Elem, sElem, t2Elem);
}

function renderKnockoffGame1(data, id) {
	var t1Elem = $('#' + id + '_t1');
	var t2Elem = $('#' + id + '_t2');
	var sElem  = $('#' + id + '_s');
	var game = data[id];
	console.log(game);
	var teams = Object.keys(game);
	var t1 = teams[0]; var t2 = teams[1];
	var s1 = game[t1]; var s2 = game[t2];

	t1Elem.addClass(t1.toLowerCase()).text(teamFor(t1).name);
	t2Elem.addClass(t2.toLowerCase()).text(teamFor(t2).name);
	if (s1 == null || s2 == null) {
		sElem.text('-')
	} else {
		var notes = game.notes == null ? '' : ' ('+game.notes+')'
		sElem.text(s1 + ' : ' + s2 + notes)
	}
}