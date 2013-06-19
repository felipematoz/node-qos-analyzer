var io = require('socket.io').listen(8282);
var sys = require('sys')
var exec = require('child_process').exec;

var re_icmp_req = /icmp_req=([0-9]+)/;
var re_ttime = /time=([0-9.]+) ms/;
var stream_icmp = [];
var stream_time = [];
var tempo_total = 0;
var tempo_medio = 0;
var perda_total = 0;
var jitter = 0;
var jitter_media = 0;

io.sockets.on('connection', function (socket) {

	socket.on('inicia', function (data) {
		for (var i=1; i<= data.total_repeticoes; i++) {
			exec("ping -c "+data.total_requisicoes+" -i 0 "+data.servidor, function(error, stdout, stderr){
				var stream_stdout = stdout.split("\n");
				var count = 0;
				
				if (stream_stdout != null) {
					for (var i=1; i<= data.total_requisicoes; i++) {
						try {
							var result_icmp = stream_stdout[i].match(re_icmp_req);
							var result_time = stream_stdout[i].match(re_ttime);
							
							if (result_icmp != null && result_time != null) {
								stream_icmp[count] = result_icmp[1];
								stream_time[count] = result_time[1];
								
								tempo_total += parseFloat(result_time[1]);
								
								count++;
							}
						} catch (e) {
							
						}
					}
					
					tempo_medio = parseFloat(tempo_total/stream_time.length);
					
					for (var i=1; i< stream_time.length; i++) {
						jitter += Math.abs(parseFloat(stream_time[i]) - parseFloat(stream_time[i-1]));
					}
					
					atraso_media = (jitter/(stream_time.length - 1));
				}
			
				perda_total = data.total_requisicoes - count;
				
				socket.emit("resultado", {
					"tempo_total": tempo_total,
					"tempo_medio": tempo_medio,
					"perda_total": perda_total,
					"jitter": jitter,
					"media": atraso_media
				});
			});
		}
	});
});
