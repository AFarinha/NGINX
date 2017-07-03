<template>
  <canvas id="CacheChart" ></canvas>
</template>
<script>
import Chart from 'chart.js'

export default {
  props: ['arrCacheChart', 'maxSize'],
  name: 'CacheChart',
  data () {
    return {
      CacheChart: ''
    }
  },
  watch: {
    arrCacheChart: function (value) {
      var self = this
      var auxData = [{
        'x': new Date(value.date).toTimeString().split(' ')[0],
        'y': 0
      }, {
        'x': new Date(value.date).toTimeString().split(' ')[0],
        'y': 0
      }, {
        'x': new Date(value.date).toTimeString().split(' ')[0],
        'y': 0
      }, {
        'x': new Date(value.date).toTimeString().split(' ')[0],
        'y': 0
      }, {
        'x': new Date(value.date).toTimeString().split(' ')[0],
        'y': 0
      }, {
        'x': new Date(value.date).toTimeString().split(' ')[0],
        'y': 0
      }, {
        'x': new Date(value.date).toTimeString().split(' ')[0],
        'y': 0
      }, {
        'x': new Date(value.date).toTimeString().split(' ')[0],
        'y': 0
      }, {
        'x': new Date(value.date).toTimeString().split(' ')[0],
        'y': 0
      }]

      Object.keys(value.cache).forEach((code) => {
        var ps
        switch (code) {
          case '-':
            ps = auxData[4]
            break
          case 'HIT':
            ps = auxData[0]
            break
          case 'BYPASS':
            ps = auxData[1]
            break
          case 'EXPIRED':
            ps = auxData[3]
            break
          case 'MISS':
            ps = auxData[2]
            break
          case 'STALE':
            ps = auxData[5]
            break
          case 'UPDATING':
            ps = auxData[6]
            break
          case 'REVALIDATED':
            ps = auxData[7]
            break
          default:
            ps = auxData[8]
            break
        }
        ps.y = value.cache[code]
      })

      self.CacheChart.data.labels.shift()
      self.CacheChart.data.labels.push(auxData[0].x)
      for (var i = 0; i < auxData.length; i++) {
        self.CacheChart.data.datasets[i].data.shift()
        self.CacheChart.data.datasets[i].data.push(auxData[i].y)
      }
      self.CacheChart.update(0)
    }
  },
  mounted () {
    this.$nextTick(() => {
      var self = this
      var ctx = document.getElementById('CacheChart').getContext('2d')
      var config = {
        type: 'line',
        data: {
          labels: [],
          datasets: [{
            label: 'HIT',
            fill: false,
            borderColor: '#284184',
            pointBackgroundColor: '#284184',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            data: []
          }, {
            label: 'Bypass',
            borderColor: '#4BC0C0',
            pointBackgroundColor: '#4BC0C0',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            data: []
          }, {
            label: 'Miss',
            borderColor: '#4BC0C0',
            pointBackgroundColor: '#4BC0C0',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            data: []
          }, {
            label: 'Expired',
            borderColor: '#4BC0C0',
            pointBackgroundColor: '#4BC0C0',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            data: []
          }, {
            label: 'Internal',
            borderColor: '#4BC0C0',
            pointBackgroundColor: '#4BC0C0',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            data: []
          }, {
            label: 'Stale',
            borderColor: '#4BC0C0',
            pointBackgroundColor: '#4BC0C0',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            data: []
          }, {
            label: 'Updating',
            borderColor: '#4BC0C0',
            pointBackgroundColor: '#4BC0C0',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            data: []
          }, {
            label: 'Revalidated',
            borderColor: '#4BC0C0',
            pointBackgroundColor: '#4BC0C0',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            data: []
          }, {
            label: 'Other',
            borderColor: '#4BC0C0',
            pointBackgroundColor: '#4BC0C0',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            data: []
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: !this.isMobile,
          legend: {
            position: 'bottom',
            display: true
          },
          tooltips: {
            mode: 'label',
            xPadding: 10,
            yPadding: 10,
            bodySpacing: 10
          }
        }
      }
      self.CacheChart = new Chart(ctx, config)

      self.CacheChart.data.datasets.forEach((dataset) => {
        for (var i = 0; i < self.maxSize; i++) {
          dataset.data.push(0)
        }
      })
      for (var i = 0; i < self.maxSize; i++) {
        self.CacheChart.data.labels.push('')
      }
      self.CacheChart.update()
    })
  }
}
</script>

<style>

</style>
