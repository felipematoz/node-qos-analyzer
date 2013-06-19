var socket = io.connect('http://localhost:8282');

google.load("visualization", "1", {packages:["corechart"]});

function analisar() {
	var servidor = $("#servidor").val();
	var total_repeticoes = $("#total_repeticoes").val();
	var total_requisicoes = $("#total_requisicoes").val();
	
	socket.emit('inicia', {
		"servidor":servidor, 
		"total_repeticoes":total_repeticoes, 
		"total_requisicoes":total_requisicoes
	});
}

function drawChart(data) {
	var data = google.visualization.arrayToDataTable([
		['Repetição', 'Tempo total (ms)', 'Tempo médio (ms)', 'Jitter', 'Atraso (ms)', 'Perda Total'],
		['#1', 1000, 400, 1000, 400, 500],
		['#2', 1000, 400, 1000, 400, 500],
		['#3', 1000, 400, 1000, 400, 500],
		['#4', 1000, 400, 1000, 400, 500],
		['#5', 1000, 400, 1000, 400, 500],
		['#6', 1000, 400, 1000, 400, 500],
		['#7', 1000, 400, 1000, 400, 500],
		['#8', 1000, 400, 1000, 400, 500],
		['#9', 1000, 400, 1000, 400, 500],
		['#10', 1000, 400, 1000, 400, 500]
	]);
	
	var options = "";
	
	var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
	chart.draw(data, options);
}


socket.on('resultado', function (data) {
	console.log(data);
	drawChart(data);
});

