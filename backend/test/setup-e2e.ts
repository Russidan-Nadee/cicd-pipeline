import { execSync } from 'child_process';

export default function globalSetup() {
  // Generate Prisma Client and push schema to database
  console.log('Setting up test database...');
  try {
    // Generate Prisma Client (skip on Windows if already exists)
    console.log('Generating Prisma Client...');
    try {
      execSync('npx prisma generate', {
        cwd: process.cwd(),
        stdio: 'inherit',
      });
    } catch (generateError) {
      // On Windows, prisma generate might fail due to file locking
      // This is okay if the client is already generated
      console.log('Prisma Client generation skipped (may already exist)');
    }

    // Push schema to test database (creates tables without migration files)
    console.log('Pushing schema to test database...');
    execSync('npx prisma db push --skip-generate --accept-data-loss', {
      cwd: process.cwd(),
      stdio: 'inherit',
    });
  } catch (error) {
    console.error('Failed to setup test database:', error);
    throw error;
  }
}
