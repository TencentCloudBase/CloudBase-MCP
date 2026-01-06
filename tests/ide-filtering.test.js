// IDE过滤功能测试
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { expect, test } from 'vitest';
import { resolveDownloadTemplateIDE, validateIDE } from '../mcp/src/tools/setup.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helper function to wait for delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

test('downloadTemplate tool supports IDE filtering', async () => {
  let transport = null;
  let client = null;
  
  try {
    console.log('Testing downloadTemplate IDE filtering functionality...');
    
    // Create client
    client = new Client({
      name: "test-client-ide-filtering",
      version: "1.0.0",
    }, {
      capabilities: {}
    });

    // Use the CJS CLI for integration testing
    const serverPath = join(__dirname, '../mcp/dist/cli.cjs');
    transport = new StdioClientTransport({
      command: 'node',
      args: [serverPath],
      // Only enable the minimal plugin set to speed up server startup in tests
      env: { ...process.env, CLOUDBASE_MCP_PLUGINS_ENABLED: "setup" }
    });

    // Connect client to server
    await client.connect(transport);
    await delay(500);

    console.log('Testing downloadTemplate tool availability...');
    
    // List tools to find downloadTemplate
    const toolsResult = await client.listTools();
    expect(toolsResult.tools).toBeDefined();
    expect(Array.isArray(toolsResult.tools)).toBe(true);
    
    const downloadTemplateTool = toolsResult.tools.find(t => t.name === 'downloadTemplate');
    expect(downloadTemplateTool).toBeDefined();
    console.log('✅ downloadTemplate tool found');
    
    // Check if the tool has IDE parameter
    const toolSchema = downloadTemplateTool.inputSchema;
    expect(toolSchema).toBeDefined();
    
    // Check if ide parameter exists
    const ideParam = toolSchema.properties?.ide;
    expect(ideParam).toBeDefined();
    expect(ideParam.description).toContain('指定要下载的IDE类型');
    console.log('✅ IDE parameter found in tool schema');
    
    // Check if ide parameter has correct enum values
    expect(ideParam.enum).toBeDefined();
    expect(Array.isArray(ideParam.enum)).toBe(true);
    expect(ideParam.enum).toContain('all');
    expect(ideParam.enum).toContain('cursor');
    expect(ideParam.enum).toContain('windsurf');
    expect(ideParam.enum).toContain('codebuddy');
    expect(ideParam.enum).toContain('claude-code');
    expect(ideParam.enum).toContain('cline');
    expect(ideParam.enum).toContain('gemini-cli');
    expect(ideParam.enum).toContain('opencode');
    expect(ideParam.enum).toContain('qwen-code');
    expect(ideParam.enum).toContain('baidu-comate');
    expect(ideParam.enum).toContain('openai-codex-cli');
    expect(ideParam.enum).toContain('augment-code');
    expect(ideParam.enum).toContain('github-copilot');
    expect(ideParam.enum).toContain('roocode');
    expect(ideParam.enum).toContain('tongyi-lingma');
    expect(ideParam.enum).toContain('trae');
    expect(ideParam.enum).toContain('vscode');
    console.log('✅ All supported IDE types found in enum');
    
    console.log('✅ downloadTemplate IDE filtering test passed');
    
  } catch (error) {
    console.error('❌ downloadTemplate IDE filtering test failed:', error);
    throw error;
  } finally {
    if (client) {
      await client.close();
    }
    if (transport) {
      await transport.close();
    }
  }
}, 90000);

test('downloadTemplate tool validates IDE parameter correctly', async () => {
  const invalid = validateIDE('invalid-ide-type');
  expect(invalid.valid).toBe(false);
  expect(invalid.error).toContain('不支持的IDE类型');
  expect(invalid.supportedIDEs).toBeDefined();
  expect(invalid.supportedIDEs).toContain('cursor');

  expect(validateIDE('all').valid).toBe(true);
  expect(validateIDE('cursor').valid).toBe(true);
});

test('downloadTemplate tool requires IDE parameter when not detected', async () => {
  const r1 = resolveDownloadTemplateIDE(undefined, undefined);
  expect(r1.ok).toBe(false);
  if (!r1.ok) {
    expect(r1.reason).toBe('missing_ide');
    expect(r1.supportedIDEs).toContain('cursor');
  }

  const r2 = resolveDownloadTemplateIDE(undefined, 'SomeUnknownIDE');
  expect(r2.ok).toBe(false);
  if (!r2.ok) {
    expect(r2.reason).toBe('unmapped_integration_ide');
    expect(r2.integrationIDE).toBe('SomeUnknownIDE');
    expect(r2.supportedIDEs).toContain('cursor');
  }

  const r3 = resolveDownloadTemplateIDE('cursor', undefined);
  expect(r3.ok).toBe(true);
  if (r3.ok) {
    expect(r3.resolvedIDE).toBe('cursor');
  }
});