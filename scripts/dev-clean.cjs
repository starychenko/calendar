#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const colors = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  gray: '\x1b[90m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function findNodeProcesses() {
  try {
    if (process.platform === 'win32') {
      // Windows: шукаємо node процеси
      const output = execSync('tasklist /FI "IMAGENAME eq node.exe" /FO CSV', { encoding: 'utf-8' });
      const lines = output.split('\n').slice(1).filter(line => line.trim());

      return lines.map(line => {
        const match = line.match(/"([^"]+)","(\d+)"/);
        if (match) {
          return { name: match[1], pid: match[2] };
        }
        return null;
      }).filter(Boolean);
    } else {
      // Linux/Mac: шукаємо node процеси
      const output = execSync('ps aux | grep node | grep -v grep', { encoding: 'utf-8' });
      const lines = output.split('\n').filter(line => line.trim());

      return lines.map(line => {
        const parts = line.trim().split(/\s+/);
        return { name: 'node', pid: parts[1] };
      });
    }
  } catch (error) {
    return [];
  }
}

function killProcess(pid) {
  try {
    if (process.platform === 'win32') {
      execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
    } else {
      execSync(`kill -9 ${pid}`, { stdio: 'ignore' });
    }
    return true;
  } catch (error) {
    return false;
  }
}

function removeLockFile() {
  const lockFile = path.join(process.cwd(), '.next', 'dev', 'lock');

  if (fs.existsSync(lockFile)) {
    log(`🔒 Знайдено lock файл: ${lockFile}`, 'yellow');
    try {
      fs.unlinkSync(lockFile);
      log('  ✅ Lock файл видалено', 'green');
      return true;
    } catch (error) {
      log(`  ❌ Не вдалося видалити lock файл: ${error.message}`, 'red');
      return false;
    }
  } else {
    log('✅ Lock файл не знайдено', 'green');
    return true;
  }
}

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => rl.question(query, answer => {
    rl.close();
    resolve(answer);
  }));
}

async function main() {
  console.clear();
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log('   🧹 Next.js Dev Server Cleaner & Starter', 'cyan');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  console.log();

  // Крок 1: Знаходимо процеси
  log('🔍 Перевірка запущених Node.js процесів...', 'cyan');
  const processes = findNodeProcesses();

  if (processes.length > 0) {
    log(`📋 Знайдено ${processes.length} Node.js процесів:`, 'yellow');
    processes.forEach(proc => {
      log(`  • PID ${proc.pid} - ${proc.name}`, 'gray');
    });
    console.log();

    const answer = await askQuestion('❓ Вбити всі Node.js процеси? (y/n): ');

    if (answer.toLowerCase() === 'y') {
      log('⚔️  Завершення процесів...', 'red');
      let successCount = 0;

      processes.forEach(proc => {
        if (killProcess(proc.pid)) {
          log(`  ✅ Процес ${proc.pid} завершено`, 'green');
          successCount++;
        } else {
          log(`  ❌ Не вдалося завершити процес ${proc.pid}`, 'red');
        }
      });

      log(`\n📊 Завершено ${successCount} з ${processes.length} процесів`, 'cyan');

      // Чекаємо 1 секунду для завершення процесів
      await new Promise(resolve => setTimeout(resolve, 1000));
    } else {
      log('⏭️  Пропускаємо завершення процесів', 'yellow');
    }
  } else {
    log('✅ Активних Node.js процесів не знайдено', 'green');
  }

  console.log();

  // Крок 2: Видаляємо lock файл
  removeLockFile();

  console.log();
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log('🚀 Запуск Next.js dev сервера...', 'cyan');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  console.log();

  // Крок 3: Запускаємо dev сервер
  const devServer = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true
  });

  devServer.on('error', (error) => {
    log(`❌ Помилка запуску сервера: ${error.message}`, 'red');
    process.exit(1);
  });

  // Обробка Ctrl+C
  process.on('SIGINT', () => {
    log('\n\n🛑 Зупинка dev сервера...', 'yellow');
    devServer.kill();
    process.exit(0);
  });
}

main().catch(error => {
  log(`❌ Критична помилка: ${error.message}`, 'red');
  process.exit(1);
});
