<template>
  <!-- Main content -->
  <section class="content">
    <!-- Info boxes -->
    <div class="row">
      <!-- Rquests per second -->
      <div class="col-md-3 col-sm-6 col-xs-12">
        <div class="info-box">
          <span class="info-box-icon bg-aqua"><i class="ion ion-ios-gear-outline"></i></span>
          <div class="info-box-content">
            <span class="info-box-text">Requests</span>
            <span class="info-box-number">{{this.infoServers.requestspers}} /s</span>
          </div>
          <!-- /.info-box-content -->
        </div>
        <!-- /.info-box -->
      </div>
      <!-- MBps -->
      <div class="col-md-3 col-sm-6 col-xs-12">
        <div class="info-box">
          <span class="info-box-icon bg-red"><i class="fa fa-google-plus"></i></span>

          <div class="info-box-content">
            <span class="info-box-text">MB</span>
            <span class="info-box-number">{{this.infoServers.mbps}} /s</span>
          </div>
          <!-- /.info-box-content -->
        </div>
        <!-- /.info-box -->
      </div>
      <!-- fix for small devices only -->
      <div class="clearfix visible-sm-block"></div>
      <!-- errorPercentage -->
      <div class="col-md-3 col-sm-6 col-xs-12">
        <div class="info-box">
          <span class="info-box-icon bg-green"><i class="ion ion-ios-cart-outline"></i></span>
          <div class="info-box-content">
            <span class="info-box-text">Error</span>
            <span class="info-box-number">{{this.infoServers.errorPercentage}} %</span>
          </div>
          <!-- /.info-box-content -->
        </div>
        <!-- /.info-box -->
      </div>
      <!-- Hosts -->
      <div class="col-md-3 col-sm-6 col-xs-12">
        <div class="info-box">
          <span class="info-box-icon bg-yellow"><i class="ion ion-ios-people-outline"></i></span>

          <div class="info-box-content">
            <span class="info-box-text">Hosts</span>
              <div class="form-group">
                <select class="form-control" v-model="selectedServer">
                  <option v-for="option in this.infoServers.hostnames" v-bind:value="option">
                    {{ option }}
                  </option>
                </select>
            </div>
          </div>
          <!-- /.info-box-content -->
        </div>
        <!-- /.info-box -->
      </div>

    </div>

    <!-- CodeChart General -->
    <div class="row">
      <div class="col-xs-12">
        <div class="box">
          <div class="box-header with-border">
            <h3 class="box-title"></h3>
            <div class="box-body">
              <div class="col-sm-6 col-xs-12">
                <p class="text-center">
                  <strong>CodeChart</strong>
                </p>
                <CodeChart :arrCodeChart="CodeChart" :maxSize="20" ></CodeChart>
              </div>
              <hr class="visible-xs-block">
              <div class="col-sm-6 col-xs-12">
                <p class="text-center">
                  <strong>General</strong>
                </p>
                <div class="row">
                  <div class="col-sm-6 col-xs-12">
                    <div class="row" >
                      <div class="box">
                        <div class="box-header">
                          <h3 class="box-title"> Top Server</h3>
                        </div><!-- /.box-header -->
                        <div class="box-body">
                         <b>  {{this.infoServers.topRequests}} </b>
                        </div>
                      </div>
                    </div>
                    <div class="row" >
                      <div class="box">
                        <div class="box-header">
                          <h3 class="box-title"> Top Error</h3>
                        </div><!-- /.box-header -->
                        <div class="box-body">
                          <b> {{this.infoServers.topError}} </b>
                        </div>
                      </div>
                    </div>
                    <div class="row" >
                      <div class="box">
                        <div class="box-header">
                          <h3 class="box-title">Number Servers Monitoring</h3>
                        </div><!-- /.box-header -->
                        <div class="box-body">
                          <b> {{this.infoServers.hostnames.length}} </b>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr class="visible-xs-block">
                  <div class="col-sm-6 col-xs-12">
                    <div class="box">
                      <div class="box-header">
                        <h3 class="box-title">Top Domains</h3>
                      </div><!-- /.box-header -->
                      <div class="box-body">
                        <table class="table table-striped table-bordered">
                          <tbody>
                            <tr>
                                <th style="width: 10px">#</th>
                                <th>Domains</th>
                            </tr>
                            <tr v-for="(item, index) in this.infoServers.topSites">
                                <td>{{ index + 1 }}.</td>
                                <td>{{ item }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- CacheChart  VerbChart-->
    <div class="row">
      <div class="col-xs-12">
        <div class="box">
          <div class="box-header with-border">
            <h3 class="box-title"></h3>
            <div class="box-body">
              <div class="col-sm-6 col-xs-12">
                <p class="text-center">
                  <strong>CacheChart</strong>
                </p>
                <CacheChart :arrCacheChart="CacheChart" :maxSize="20" ></CacheChart>
              </div>
              <hr class="visible-xs-block">
              <div class="col-sm-6 col-xs-12">
                <p class="text-center">
                  <strong>VerbChart</strong>
                </p>
                <VerbChart :arrVerbChart="VerbChart" :maxSize="20" ></VerbChart>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- TimesChart BandwidthChart -->
    <div class="row">
      <div class="col-xs-12">
        <div class="box">
          <div class="box-header with-border">
            <h3 class="box-title"></h3>
            <div class="box-body">
              <div class="col-sm-6 col-xs-12">
                <p class="text-center">
                  <strong>TimesChart</strong>
                </p>
                <TimesChart :arrTimesChart="TimesChart" :maxSize="20" ></TimesChart>
              </div>
              <hr class="visible-xs-block">
              <div class="col-sm-6 col-xs-12">
                <p class="text-center">
                  <strong>BandwidthChart</strong>
                </p>
                <BandwidthChart :arrBandwidthChart="BandwidthChart" :maxSize="20" ></BandwidthChart>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </section>
</template>

<script>
import axios from 'axios'
import CodeChart from '../Charts/CodeChart.vue'
import VerbChart from '../Charts/VerbChart.vue'
import CacheChart from '../Charts/CacheChart.vue'
import BandwidthChart from '../Charts/BandwidthChart.vue'
import TimesChart from '../Charts/TimesChart.vue'

export default {
  data () {
    return {
      infoServers: {
        requestspers: 0,
        mbps: 0,
        errorPercentage: 0,
        topError: '',
        topRequests: '',
        topSites: [],
        hostnames: ['All']
      },
      CodeChart: [],
      VerbChart: [],
      CacheChart: [],
      BandwidthChart: [],
      TimesChart: [],
      selectedServer: 'All'
    }
  },
  created () {
    this.start()
  },
  methods: {
    parseStatisticsCodeChart: function (data) {
      var app = this
      var auxCodeChart = []
      Object.keys(data.statistics.codes).forEach((code) => {
        auxCodeChart.push({ x: data.statistics.codes[code], y: new Date(data.date).toTimeString().split(' ')[0] })
      })
      app.CodeChart = auxCodeChart
    },
    parseStatisticsVerbChart: function (data) {
      var app = this
      var auxVerbChart = []
      Object.keys(data.statistics.verbs).forEach((code) => {
        auxVerbChart.push({ x: data.statistics.verbs[code], y: new Date(data.date).toTimeString().split(' ')[0] })
      })
      app.VerbChart = auxVerbChart
    },
    parseStatisticsCacheChart: function (data) {
      var app = this
      app.CacheChart = data
    },
    parseStatisticsBandwidthChart: function (data) {
      var app = this
      var auxBandwidthChart = []
      auxBandwidthChart.push({ x: data.statistics.bandwidth, y: new Date(data.date).toTimeString().split(' ')[0] })
      app.BandwidthChart = auxBandwidthChart
    },
    parseStatisticsTimesChart: function (data) {
      var app = this
      var auxTimesChart = []
      auxTimesChart.push({ x: data.statistics.requesttime, y: new Date(data.date).toTimeString().split(' ')[0] })
      auxTimesChart.push({ x: data.statistics.upstreamtime, y: new Date(data.date).toTimeString().split(' ')[0] })

      app.TimesChart = auxTimesChart
    },
    parseStatisticsGeneral: function (data) {
      var app = this
      app.infoServers.requestspers = data.statistics.requestspers
      app.infoServers.mbps = data.statistics.bandwidth

      var errors = data.statistics.codes['400'] + data.statistics.codes['500'] + data.statistics.codes.other
      errors = parseInt((errors / data.requests) * 100)
      if (isNaN(errors)) {
        errors = 0
      }
      app.infoServers.errorPercentage = errors
      app.infoServers.topError = data.top.error
      app.infoServers.topRequests = data.top.requests
      app.infoServers.topSites = data.top.sites

      data.hostnames.push('All')
      data.hostnames.forEach((code) => {
        if (app.infoServers.hostnames.indexOf(code) < 0) {
          app.infoServers.hostnames.push(code)
        }
      })
    },
    start () {
      var app = this
        // get all
      setInterval(function () {
        axios.get('/api/stats/' + app.selectedServer.toLowerCase())
          .then(function (response) {
            app.parseStatisticsCodeChart(response.data)
            app.parseStatisticsVerbChart(response.data)
            app.parseStatisticsCacheChart(response.data)
            app.parseStatisticsBandwidthChart(response.data)
            app.parseStatisticsTimesChart(response.data)
            app.parseStatisticsGeneral(response.data)
            console.log(response.data)
          })
          .catch(error => {
            console.log(error)
          })
      }, 2000)
    }
  },
  components: {
    CodeChart: CodeChart,
    VerbChart: VerbChart,
    CacheChart: CacheChart,
    BandwidthChart: BandwidthChart,
    TimesChart: TimesChart
  }
}
</script>
<style>
.info-box {
  cursor: pointer;
}
.info-box-content {
  text-align: center;
  vertical-align: middle;
  display: inherit;
}
.fullCanvas {
  width: 100%;
}
</style>
