function heavyComputation(data: any): any {
  // Implement your heavy computation logic here
  // This is just a placeholder example
  return data * 2;
}

self.onmessage = function(e) {
  // Perform heavy computation here
  const result = heavyComputation(e.data);
  self.postMessage(result);
}

// Ensure the worker script is treated as a module
export {};