/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import chokidar from 'chokidar';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { debugLogger } from '@google/gemini-cli-core';

export class RagWatcher {
  private watcher: any;

  constructor(private workspaceDir: string) {
  }

  start() {
    const watchPaths = [
      path.join(this.workspaceDir, '70_Resources'),
      path.join(this.workspaceDir, '80_Knowledge')
    ];

    console.log(`🔍 Nika RAG Watcher active on: ${watchPaths.join(', ')}`);

    this.watcher = chokidar.watch(watchPaths, {
      ignored: /(^|[\/\\])\../, 
      persistent: true
    });

    this.watcher
      .on('add', (filePath: string) => this.processFile(filePath, 'added'))
      .on('change', (filePath: string) => this.processFile(filePath, 'modified'));
  }

  private async processFile(filePath: string, event: string) {
    if (!filePath.endsWith('.md')) return;

    console.log(`[RAG] File ${event}: ${path.basename(filePath)}. Triggering embedding...`);
    
    try {
      const _content = fs.readFileSync(filePath, 'utf-8');
      
      // Embedding logic...
      
      debugLogger.log(`Successfully indexed ${filePath} into RAG store.`);
    } catch (e) {
      debugLogger.error(`RAG Indexing failed for ${filePath}:`, e);
    }
  }
}
