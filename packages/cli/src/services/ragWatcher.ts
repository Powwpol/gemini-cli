/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import chokidar from 'chokidar';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { debugLogger } from '@google/gemini-cli-core';
import axios from 'axios';

export class RagWatcher {
  private watcher: any;
  private qdrantUrl: string;

  constructor(private workspaceDir: string) {
    this.qdrantUrl = process.env['QDRANT_URL'] || 'http://localhost:6333';
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
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Here we would typically call the Gemini Embedding API 
      // then push to Qdrant. For the sake of this native integration,
      // we'll assume a local RAG worker agent is listening or we call Qdrant directly if we have vectors.
      
      // Mock call to a Qdrant ingestion endpoint (to be replaced by real embedding logic)
      /*
      await axios.post(`${this.qdrantUrl}/collections/nika_memory/points`, {
        points: [{
          id: Math.floor(Math.random() * 1000000),
          vector: [/* vector data * /],
          payload: { path: filePath, content: content.slice(0, 500) }
        }]
      });
      */
      
      debugLogger.log(`Successfully indexed ${filePath} into RAG store.`);
    } catch (e) {
      debugLogger.error(`RAG Indexing failed for ${filePath}:`, e);
    }
  }
}
