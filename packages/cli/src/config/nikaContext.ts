/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { debugLogger } from '@google/gemini-cli-core';

async function findActiveJob(cwd: string): Promise<string> {
  const jobsDir = path.join(cwd, '10_Jobs');
  if (!fs.existsSync(jobsDir)) return '';

  try {
    const files = fs.readdirSync(jobsDir)
      .filter(f => f.endsWith('.md'))
      .map(f => path.join(jobsDir, f));

    // Sort by modification time (newest first)
    files.sort((a, b) => fs.statSync(b).mtime.getTime() - fs.statSync(a).mtime.getTime());

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      if (content.includes('status: running') || content.includes('status: active')) {
        return `
<active_job>
${content.slice(0, 2000)}...
</active_job>`; // Limit size
      }
    }
    
    // Fallback to most recent job if no running job found
    if (files.length > 0) {
       const content = fs.readFileSync(files[0], 'utf-8');
       return `
<latest_job_context>
${content.slice(0, 1000)}...
</latest_job_context>`;
    }

  } catch (e) {
    debugLogger.warn('Failed to load active job:', e);
  }
  return '';
}

async function loadRegistry(cwd: string): Promise<string> {
  const registryPath = path.join(cwd, '30_Agents', 'REGISTRY.md');
  if (fs.existsSync(registryPath)) {
    try {
      const content = fs.readFileSync(registryPath, 'utf-8');
      return `
<agent_registry>
${content}
</agent_registry>`;
    } catch (e) {
      debugLogger.warn('Failed to load registry:', e);
    }
  }
  return '';
}

export async function loadNikaContext(cwd: string): Promise<string> {
  debugLogger.log('Loading Nika Context...');
  const registry = await loadRegistry(cwd);
  const activeJob = await findActiveJob(cwd);
  
  if (!registry && !activeJob) return '';

  return `

<nika_system_overlay>
This is the Nika System Overlay. You are operating within the Nika Swarm Architecture.
${registry}${activeJob}
</nika_system_overlay>`;
}
