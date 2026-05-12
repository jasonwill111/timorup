
// Test script to verify Mastra agent works
import { agents } from './src/mastra/agents/index.ts';

async function test() {
  console.log('Testing blogCreator agent...');
  try {
    const response = await agents.blogCreator.generate('Say hello and return JSON with {greeting: "hello", name: "test"}');
    console.log('Response type:', typeof response);
    console.log('Response keys:', Object.keys(response));
    console.log('Response.text:', response.text?.slice(0, 200));
  } catch (e) {
    console.error('Error:', e.message);
  }
}

test();
