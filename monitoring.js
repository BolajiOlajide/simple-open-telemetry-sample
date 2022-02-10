'use strict'

const { MeterProvider } = require('@opentelemetry/sdk-metrics-base');
const { PrometheusExporter } = require('@opentelemetry/exporter-prometheus');

const prometheusPort = PrometheusExporter.DEFAULT_OPTIONS.port;
const prometheusEndpoint = PrometheusExporter.DEFAULT_OPTIONS.endpoint;

// Add your port and startServer to the Prometheus options
const options = { port: 9464, startServer: true };
const exporter = new PrometheusExporter(options, () => {
  console.log(`prometheus scrape endpoint: http://localhost:${prometheusPort}${prometheusEndpoint}`);
});

// initialize the meter to capture measurements in various ways
const meter = new MeterProvider({
  exporter,
  interval: 1000
}).getMeter('bolaji-meter');

const counter = meter.createCounter('requests', {
  description: 'Count all incoming requests'
});

const boundInstruments = new Map();

module.exports.countAllRequests = () => {
  return (req, res, next) => {
    if (!boundInstruments.has(req.path)) {
      const labels = { route: req.path };
      const boundCounter = counter.bind(labels);
      boundInstruments.set(req.path, boundCounter);
    }

    boundInstruments.get(req.path).add(1);
    next();
  }
}