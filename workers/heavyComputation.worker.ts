self.onmessage = function(e) {
  // Perform heavy computation here
  const result = heavyComputation(e.data)
  self.postMessage(result)
}

// In your component:
const worker = new Worker(new URL('../workers/heavyComputation.worker.ts', import.meta.url))
worker.onmessage = function(e) {
  // Handle the result
}
worker.postMessage(dataForComputation)