/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { CommandModule, Argv } from 'yargs';
import { initializeOutputListenersAndFlush } from '../gemini.js';
import * as k8s from '@kubernetes/client-node';
import { debugLogger } from '@google/gemini-cli-core';

export const swarmCommand: CommandModule = {
  command: 'swarm',
  describe: 'Nika Swarm Orchestration (Kubernetes)',
  builder: (yargs: Argv) =>
    yargs
      .middleware((argv) => {
        initializeOutputListenersAndFlush();
        argv['isCommand'] = true;
      })
      .command(
        'spawn <prompt>',
        'Spawn a new Nika worker agent in the cluster',
        (yargs) => yargs.positional('prompt', { type: 'string', describe: 'Initial task for the agent' }),
        async (argv) => {
          const kc = new k8s.KubeConfig();
          kc.loadFromDefault();
          const k8sApi = kc.makeApiClient(k8s.BatchV1Api);
          
          const jobName = `nika-worker-${Math.random().toString(16).slice(2, 8)}`;
          console.log(`Spawning Nika Worker: ${jobName}...`);

          const job = {
            metadata: { name: jobName, namespace: 'nika-swarm' },
            spec: {
              template: {
                spec: {
                  containers: [{
                    name: 'nika-worker',
                    image: 'nika-cli:latest',
                    args: ['--prompt', argv.prompt as string],
                    volumeMounts: [{ name: 'vault-storage', mountPath: '/workspace' }]
                  }],
                  restartPolicy: 'Never',
                  volumes: [{ name: 'vault-storage', persistentVolumeClaim: { claimName: 'nika-vault-pvc' } }]
                }
              }
            }
          };

          try {
            await k8sApi.createNamespacedJob({ namespace: 'nika-swarm', body: job });
            console.log(`✅ Successfully spawned agent for task: "${argv.prompt}"`);
          } catch (e) {
            debugLogger.error('Failed to spawn K8s job:', e);
            console.error('❌ Error connecting to Kubernetes cluster. Ensure K8s is enabled in Docker Desktop.');
          }
        }
      )
      .command('list', 'List active agents in the swarm', {}, async () => {
        const kc = new k8s.KubeConfig();
        kc.loadFromDefault();
        const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
        try {
          const res = await k8sApi.listNamespacedPod({ namespace: 'nika-swarm' });
          console.table(res.items.map((p: any) => ({
            name: p.metadata?.name,
            status: p.status?.phase,
            startTime: p.status?.startTime
          })));
        } catch (e) {
          console.error('❌ Failed to list swarm pods.');
        }
      })
      .demandCommand(1)
      .version(false),
  handler: () => {},
};
