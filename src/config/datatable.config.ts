const language = {
    lengthMenu: 'Mostrar &nbsp; _MENU_ &nbsp; resultados <br><br>',
    search: 'Buscar: &nbsp;  <br>',
    decimal: '',
    emptyTable: 'No hay datos en la tabla',
    info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
    infoEmpty: 'Mostrando 0 a 0 de 0 entries',
    infoFiltered: '(filtered from _MAX_ total entries)',
    infoPostFix: '',
    thousands: ',',
    loadingRecords: 'Cargando...',
    processing: '',
    zeroRecords: 'Ninguna concidencia encontrada',
    paginate: {
      first: 'Primera',
      last: 'Ultima',
      next: 'Siguiente',
      previous: 'Previa',
    },
    aria: {
      orderable: 'Ordenar por esta columna',
      orderableReverse: 'Ordenar inversa por esta columna',
    },
  }
  
  
  const lengthMenu = [
    [5, 10, 15, 25, 50, 100, 1000, -1],
    ['5 ', '10 ', '15 ', '25 ', '50 ', '100 ', '1000 ', 'Todos los'],
  ]
  
  
  const buttons = [
    {
      extend: 'copy',
      text: 'Copiar al porta papeles',
      exportOptions: {
        columns: ':visible',
      },
    },
    {
      extend: 'excel',
      text: 'Exportar a Excel',
      exportOptions: {
        columns: ':visible',
      },
    },
  
  ]
  
  
  export { lengthMenu, language, buttons }