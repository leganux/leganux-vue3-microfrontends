#!/usr/bin/env node

import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = resolve(__dirname, '..');
const SCHEMA_PATH = join(PROJECT_ROOT, 'moduleSchemaExample/newModule.runner.json');

async function checkFileExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

async function readJsonFile(filePath) {
    try {
        console.log(`Reading JSON file from: ${filePath}`);
        const exists = await checkFileExists(filePath);
        if (!exists) {
            console.error(`File does not exist: ${filePath}`);
            process.exit(1);
        }
        const content = await fs.readFile(filePath, 'utf-8');
        const parsed = JSON.parse(content);
        console.log('File content:', content);
        return parsed;
    } catch (error) {
        console.error(`Error reading JSON file from ${filePath}:`, error);
        process.exit(1);
    }
}

async function createDirectory(dirPath) {
    const absolutePath = resolve(PROJECT_ROOT, dirPath);
    try {
        console.log(`Creating directory: ${absolutePath}`);
        const exists = await checkFileExists(absolutePath);
        if (exists) {
            console.log(`Directory already exists: ${absolutePath}`);
            return;
        }
        await fs.mkdir(absolutePath, { recursive: true });
        console.log(`Created directory: ${absolutePath}`);
    } catch (error) {
        console.error(`Error creating directory ${absolutePath}:`, error);
        process.exit(1);
    }
}

async function writeFile(filePath, content) {
    const absolutePath = resolve(PROJECT_ROOT, filePath);
    try {
        console.log(`Writing file: ${absolutePath}`);
        const dirPath = dirname(absolutePath);
        await createDirectory(dirPath);
        await fs.writeFile(absolutePath, content, 'utf-8');
        console.log(`Created ${absolutePath}`);
        
        // Verify file was created
        const exists = await checkFileExists(absolutePath);
        if (!exists) {
            throw new Error('File was not created successfully');
        }
        
        // Read back the content to verify
        const written = await fs.readFile(absolutePath, 'utf-8');
        if (written !== content) {
            throw new Error('File content verification failed');
        }
    } catch (error) {
        console.error(`Error writing file ${absolutePath}:`, error);
        process.exit(1);
    }
}

async function main() {
    try {
        console.log('Current working directory:', PROJECT_ROOT);
        console.log('Schema path:', SCHEMA_PATH);

        // Read and parse the JSON schema
        const schema = await readJsonFile(SCHEMA_PATH);
        console.log('Successfully parsed schema:', schema.name);

        // Create the microfrontend directory structure
        const baseDir = join('src', '_frontends', 'dashboard', schema.name);
        const interfacesDir = join(baseDir, 'interfaces');
        const servicesDir = join(baseDir, 'services');
        const storesDir = join(baseDir, 'stores');
        const viewsDir = join(baseDir, 'views');

        console.log('Creating directories...');
        await createDirectory(baseDir);
        await createDirectory(interfacesDir);
        await createDirectory(servicesDir);
        await createDirectory(storesDir);
        await createDirectory(viewsDir);

        // Test file creation with a simple content
        console.log('Creating test file...');
        await writeFile(
            join(baseDir, 'test.txt'),
            JSON.stringify(schema, null, 2)
        );

        // List created files
        console.log('\nListing created files:');
        const files = await fs.readdir(resolve(PROJECT_ROOT, baseDir), { withFileTypes: true });
        for (const file of files) {
            console.log(file.isDirectory() ? `[DIR] ${file.name}` : `[FILE] ${file.name}`);
        }

        console.log('\nTest completed successfully!');
        console.log(`\nLocation: ${resolve(PROJECT_ROOT, baseDir)}`);

    } catch (error) {
        console.error('Unexpected error:', error);
        process.exit(1);
    }
}

main().catch(console.error);
