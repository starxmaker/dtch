var chartReceptividad, chartPudimosHablar;
function initCharts(){
var ctx = document.getElementById('chartReceptividad').getContext('2d');
chartReceptividad= new Chart(ctx, {
    type: 'pie',
    data: {
      //   labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        labels: ['Positiva', 'Sin interés'],
        datasets: [{
            label: '#',
            data: [1, 1],
            backgroundColor: [
                'green',
                'yellow'
            ],
             borderWidth: 0
        }]
    },
options: {
      plugins:{
        labels: [{
    render: 'percentage',
    fontSize: 30,
    fontColor: 'white',
    
  },
{
      render: 'label',
      fontSize: 14,
    fontColor: '#BEBEBE',
    position: 'outside',
    arc:true
    }
  ]
      }
    }
});

ctx = document.getElementById('chartPudimosHablar').getContext('2d');
chartPudimosHablar= new Chart(ctx, {
    type: 'pie',
    data: {
      //   labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        labels: ['En vivo', 'Paralelo'],
        datasets: [{
            label: '#',
            data: [1, 1],
            backgroundColor: [
                'purple',
                'orange'
            ],
             borderWidth: 0
        }]
    },
options: {
      plugins:{
        labels: [{
    render: 'percentage',
    fontSize: 30,
    fontColor: 'white',
    
  },
{
      render: 'label',
      fontSize: 14,
    fontColor: '#BEBEBE',
    position: 'outside',
    arc:true
    }
  ]
      }
    }
});
}