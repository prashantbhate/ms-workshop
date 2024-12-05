// const opentelemetry = require("@opentelemetry/sdk-node");
// const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
// const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');

// // For troubleshooting, set the log level to DiagLogLevel.DEBUG
// diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

// const sdk = new opentelemetry.NodeSDK({
//   traceExporter: new opentelemetry.tracing.ConsoleSpanExporter(),
//   instrumentations: [getNodeAutoInstrumentations()]
// });
//
// sdk.start()


const opentelemetry = require("@opentelemetry/sdk-node");
const {
  getNodeAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-node");
const {
  OTLPTraceExporter,
} = require("@opentelemetry/exporter-trace-otlp-http");

const sdk = new opentelemetry.NodeSDK({
  traceExporter: new OTLPTraceExporter({
    // optional - url default value is http://localhost:4318/v1/traces
    url: process.env.JAEGER_URL,
    // optional - collection of custom headers to be sent with each request, empty by default
    headers: {},
  }),
  serviceName:"todoapi",
  instrumentations: [getNodeAutoInstrumentations()],
});
sdk.start();
