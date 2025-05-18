const { runCLI } = require('jest');
const path = require('path');

// Run Jest programmatically to get detailed error information
async function runJest() {
  try {
    const testPath = path.resolve(__dirname, 'test/components/simple/SimpleComponent.test.tsx');
    const rootDir = __dirname;
    
    const { results } = await runCLI(
      {
        verbose: true,
        runInBand: true,
        testMatch: [testPath],
        logHeapUsage: true,
      },
      [rootDir]
    );
    
    console.log('Test Suites:', results.numTotalTestSuites);
    console.log('Tests:', results.numTotalTests);
    console.log('Passes:', results.numPassedTests);
    console.log('Failures:', results.numFailedTests);
    
    if (results.testResults && results.testResults.length > 0) {
      const testResult = results.testResults[0];
      console.log('\nTest File:', testResult.testFilePath);
      console.log('Status:', testResult.testExecError ? 'FAILED' : testResult.numFailingTests > 0 ? 'PARTIAL FAIL' : 'PASSED');
      
      if (testResult.testExecError) {
        console.log('\nEXECUTION ERROR:');
        console.log(testResult.testExecError);
      }
      
      if (testResult.failureMessage) {
        console.log('\nFAILURE MESSAGE:');
        console.log(testResult.failureMessage);
      }
    }
  } catch (error) {
    console.error('Failed to run Jest:', error);
  }
}

runJest();
