/**
 * Logging Middleware for Affordmed Campus Notifications
 * All application logging must go through this middleware
 */

enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  module: string;
  message: string;
  data?: Record<string, any>;
}

class LoggingMiddleware {
  private logs: LogEntry[] = [];
  private logLevel: LogLevel = LogLevel.DEBUG;

  /**
   * Set the minimum log level
   */
  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
    this.log(LogLevel.INFO, 'Logger', `Log level set to ${level}`);
  }

  /**
   * Core logging method
   */
  private log(
    level: LogLevel,
    module: string,
    message: string,
    data?: Record<string, any>
  ): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      module,
      message,
      data,
    };

    // Only log if level is high enough
    const levelOrder = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    if (levelOrder.indexOf(level) >= levelOrder.indexOf(this.logLevel)) {
      this.logs.push(logEntry);
      this.printLog(logEntry);
    }
  }

  /**
   * Print log to console with formatting
   */
  private printLog(entry: LogEntry): void {
    const color = this.getColorByLevel(entry.level);
    const reset = '\x1b[0m';
    const timestamp = entry.timestamp;
    const level = entry.level;
    const module = entry.module;
    const message = entry.message;

    let output = `${color}[${timestamp}] [${level}] [${module}] ${message}${reset}`;
    
    if (entry.data) {
      output += `\n${JSON.stringify(entry.data, null, 2)}`;
    }

    console.log(output);
  }

  /**
   * Get ANSI color code for log level
   */
  private getColorByLevel(level: LogLevel): string {
    const colors: Record<LogLevel, string> = {
      [LogLevel.DEBUG]: '\x1b[36m', // Cyan
      [LogLevel.INFO]: '\x1b[32m', // Green
      [LogLevel.WARN]: '\x1b[33m', // Yellow
      [LogLevel.ERROR]: '\x1b[31m', // Red
    };
    return colors[level];
  }

  /**
   * Debug level logging
   */
  debug(module: string, message: string, data?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, module, message, data);
  }

  /**
   * Info level logging
   */
  info(module: string, message: string, data?: Record<string, any>): void {
    this.log(LogLevel.INFO, module, message, data);
  }

  /**
   * Warning level logging
   */
  warn(module: string, message: string, data?: Record<string, any>): void {
    this.log(LogLevel.WARN, module, message, data);
  }

  /**
   * Error level logging
   */
  error(module: string, message: string, data?: Record<string, any>): void {
    this.log(LogLevel.ERROR, module, message, data);
  }

  /**
   * Get all logs
   */
  getLogs(): LogEntry[] {
    return this.logs;
  }

  /**
   * Clear logs
   */
  clearLogs(): void {
    this.logs = [];
  }
}

// Export singleton instance
export const logger = new LoggingMiddleware();
