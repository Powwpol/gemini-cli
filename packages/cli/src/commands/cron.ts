/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { CommandModule, Argv } from 'yargs';
import { initializeOutputListenersAndFlush } from '../nika.js';
import { Cron } from 'croner';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { debugLogger } from '@pulsai/nika-cli-core';
import { exec } from 'node:child_process';

export const cronCommand: CommandModule = {
  command: 'cron',
  describe: 'Manage Nika Native CRON jobs',
  builder: (yargs: Argv) =>
    yargs
      .middleware((argv) => {
        initializeOutputListenersAndFlush();
        argv['isCommand'] = true;
      })
      .command('start', 'Start the CRON scheduler daemon', {}, async () => {
        const configPath = path.join(process.cwd(), 'cron', 'cron_jobs.json');
        if (!fs.existsSync(configPath)) {
          debugLogger.error(`Cron config not found at ${configPath}`);
          return;
        }

        debugLogger.log('Nika CRON Scheduler started...');

        interface CronJobSchedule {
          minute: string;
          hour: string;
          day_of_month: string;
          month: string;
          day_of_week: string;
        }

        interface CronJobConfig {
          name: string;
          enabled: boolean;
          schedule: CronJobSchedule;
          config: { template: string };
        }

        const config: { jobs: CronJobConfig[] } = JSON.parse(
          fs.readFileSync(configPath, 'utf-8'),
        );

        config.jobs.forEach((job: CronJobConfig) => {
          if (!job.enabled) return;

          const schedule = `${job.schedule.minute} ${job.schedule.hour} ${job.schedule.day_of_month} ${job.schedule.month} ${job.schedule.day_of_week}`;
          debugLogger.log(`[Scheduled] ${job.name} (${schedule})`);

          new Cron(schedule, () => {
            debugLogger.log(`[Executing] ${job.name}...`);
            const prompt = job.config.template.split('\n').join(' ');
            exec(`nika --prompt "${prompt}"`, (error) => {
              if (error)
                debugLogger.error(`Cron Job ${job.name} failed:`, error);
              debugLogger.log(`[Result] ${job.name} completed.`);
            });
          });
        });

        // Keep process alive
        process.stdin.resume();
      })
      .demandCommand(1)
      .version(false),
  handler: () => {},
};
