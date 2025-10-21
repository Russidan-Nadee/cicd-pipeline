import { execSync } from 'child_process';

export default async function globalSetup() {
  // Run database migrations
  console.log('Running database migrations...');
  try {
    execSync('npx prisma migrate deploy', {
      cwd: process.cwd(),
      stdio: 'inherit',
    });
  } catch (error) {
    console.error('Failed to run migrations:', error);
    throw error;
  }
}
