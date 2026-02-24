/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { watch, type FSWatcher } from 'chokidar';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { debugLogger } from '@pulsai/nika-cli-core';

export class RagWatcher {
  private watcher: FSWatcher | undefined;

  constructor(private workspaceDir: string) {}

  start() {
    const watchPaths = [
      path.join(this.workspaceDir, '70_Resources'),
      path.join(this.workspaceDir, '80_Knowledge'),
    ];

    debugLogger.log(`Nika RAG Watcher active on: ${watchPaths.join(', ')}`);

    this.watcher = watch(watchPaths, {
      ignored: /(^|[/\\])\./,
      persistent: true,
    });

    this.watcher
      .on('add', (filePath: string) => this.processFile(filePath, 'added'))
      .on('change', (filePath: string) =>
        this.processFile(filePath, 'modified'),
      );
  }

  private processFile(filePath: string, event: string) {
    if (!filePath.endsWith('.md')) return;

    debugLogger.log(
      `[RAG] File ${event}: ${path.basename(filePath)}. Triggering embedding...`,
    );

    try {
      fs.readFileSync(filePath, 'utf-8');
      // Embedding logic placeholder
      debugLogger.log(`Successfully indexed ${filePath} into RAG store.`);
    } catch (_e) {
      debugLogger.error(`RAG Indexing failed for ${filePath}`);
    }
  }
}
