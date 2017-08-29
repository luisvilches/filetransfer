$('.upload-btn').on('click', function (){
    $('#upload-input').click();
    $('.progress-bar').text('0%');
    $('.progress-bar').width('0%');
});

sendfile();

function sendfile(){
    $('#upload-input').on('change', function(){
        var files = $(this).get(0).files;

        if (files.length > 0){
            // Si se ha seleccionado 1 o más archivos, se procederá a la carga de los mismos al servidor
            // creamos un objeto FormData que será enviado a través del request AJAX
            var formData = new FormData();

            // hacemos un loop por todos los archivos seleccionados
            for (var i = 0; i < files.length; i++) {
                var file = files[i];

                // añadimos los archivos al objeto formData
                formData.append('uploads[]', file, file.name);
            }

            $.ajax({
                url: '/upload',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(data){
                    console.log('La carga de archivos se ha realizado con éxito' + data);
                    let datos = JSON.stringify(data);
                    console.log(datos);
                },
                xhr: function() {
                    // creamos un objeto XMLHttpRequest
                    var xhr = new XMLHttpRequest();

                    // gestionamos el evento 'progress'
                    xhr.upload.addEventListener('progress', function(evt) {

                        if (evt.lengthComputable) {
                            // calculamos el porcentaje completado de la carga de archivos
                            var percentComplete = evt.loaded / evt.total;
                            percentComplete = parseInt(percentComplete * 100);

                            // actualizamos la barra de progreso con el nuevo porcentaje
                            $('.progress-bar').text(percentComplete + '%');
                            $('.progress-bar').width(percentComplete + '%');

                            // una vez que la carga llegue al 100%, ponemos la progress bar como Finalizado
                            if (percentComplete === 100) {
                                $('.progress-bar').html('Finalizado');
                            }
                        }
                    }, false);

                    return xhr;
                }
            });
        }
    });
};