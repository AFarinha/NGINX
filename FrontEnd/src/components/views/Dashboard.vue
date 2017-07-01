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
      <!-- /.col -->

      <!-- fix for small devices only -->
      <div class="clearfix visible-sm-block"></div>

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
      <!-- /.col -->
      <div class="col-md-3 col-sm-6 col-xs-12">
        <div class="info-box">
          <span class="info-box-icon bg-yellow"><i class="ion ion-ios-people-outline"></i></span>

          <div class="info-box-content">
            <span class="info-box-text">Hosts</span>
            <span class="info-box-text">

            </span>
          </div>
          <!-- /.info-box-content -->
        </div>
        <!-- /.info-box -->
      </div>
      <!-- /.col -->
    </div>
    <!-- /.row -->
    <!-- CodeChart -->
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
                  <strong>VerbChart</strong>
                </p>
                <VerbChart :arrVerbChart="VerbChart" :maxSize="20" ></VerbChart>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- VerbChart --> <!--
    <div class="row">
      <div class="col-xs-12">
        <div class="box">
          <div class="box-header with-border">
            <h3 class="box-title"></h3>
            <div class="box-body">
              <div class="col-xs-9">
                <p class="text-center">
                  <strong>VerbChart</strong>
                </p>
                <VerbChart :arrVerbChart="VerbChart" :maxSize="20" ></VerbChart>
              </div>
              <hr class="visible-xs-block">
              <div class="col-xs-3">
                <p class="text-center">
                  <strong>Language Overview</strong>
                </p>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    -->
    <!-- CacheChart -->
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
                  <strong>BandwidthChart</strong>
                </p>
                <BandwidthChart :arrBandwidthChart="BandwidthChart" :maxSize="20" ></BandwidthChart>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- CacheChart --> <!--
    <div class="row">
      <div class="col-xs-12">
        <div class="box">
          <div class="box-header with-border">
            <h3 class="box-title"></h3>
            <div class="box-body">
              <div class="col-xs-9">
                <p class="text-center">
                  <strong>BandwidthChart</strong>
                </p>
                <BandwidthChart :arrBandwidthChart="BandwidthChart" :maxSize="20" ></BandwidthChart>
              </div>
              <hr class="visible-xs-block">
              <div class="col-xs-3">
                <p class="text-center">
                  <strong>Language Overview</strong>
                </p>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    -->
    <!-- TimesChart -->
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
                  <strong>Language Overview</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- /.row -->
    </div>
    <div class="row">
    </div>
    <!-- Main row -->
    <div class="row">
      <div class="col-md-3 col-sm-6 col-xs-12">
        <div class="info-box bg-yellow">
          <span class="info-box-icon"><i class="ion ion-ios-pricetag-outline"></i></span>

          <div class="info-box-content">
            <span class="info-box-text">CPU Load</span>
            <span class="info-box-number"> %</span>
            <div class="progress">
              <div class="progress-bar"  ></div>
            </div>
                <span class="progress-description">
               % Usage
                </span>
          </div>
          <!-- /.info-box-content -->
        </div>
      </div>
      <div class="col-md-3 col-sm-6 col-xs-12">
        <div class="info-box bg-green">
          <span class="info-box-icon"><i class="ion ion-ios-heart-outline"></i></span>

          <div class="info-box-content">
            <span class="info-box-text">Memory</span>
            <span class="info-box-number"></span>
            <div class="progress">
              <div class="progress-bar"  ></div>
            </div>
                <span class="progress-description">
                   % Usage
                </span>
          </div>
          <!-- /.info-box-content -->
        </div>
      </div>
      <div class="col-md-3 col-sm-6 col-xs-12">
        <div class="info-box bg-red">
          <span class="info-box-icon"><i class="ion ion-ios-cloud-download-outline"></i></span>

          <div class="info-box-content">
            <span class="info-box-text">Downloads</span>
            <span class="info-box-number">45</span>

            <div class="progress">
              <div class="progress-bar" style="width: 70%"></div>
            </div>
                <span class="progress-description">
                  70% Increase
                </span>
          </div>
          <!-- /.info-box-content -->
        </div>
      </div>
      <div class="col-md-3 col-sm-6 col-xs-12">
        <div class="info-box bg-aqua">
          <span class="info-box-icon"><i class="ion-ios-chatbubble-outline"></i></span>

          <div class="info-box-content">
            <span class="info-box-text">Direct Messages</span>
            <span class="info-box-number">163,921</span>

            <div class="progress">
              <div class="progress-bar" style="width: 40%"></div>
            </div>
                <span class="progress-description">
                  40% Increase
                </span>
          </div>
          <!-- /.info-box-content -->
        </div>
      </div>
    </div>
    <!-- /.row -->
  </section>
  <!-- /.content -->
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
        errorPercentage: 0
      },
      CodeChart: [],
      VerbChart: [],
      CacheChart: [],
      BandwidthChart: [],
      TimesChart: []
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
    },
    start () {
      var app = this
        // get all
      setInterval(function () {
        axios.get('/api/stats/all')
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
