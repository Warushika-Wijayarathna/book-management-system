import { Request, Response, NextFunction } from 'express';
import { logAction } from '../services/auditLogger';
import { logger, accessLogger, auditFileLogger, errorFileLogger } from '../config/logger';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export const requestLogger = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const { method, url, ip } = req;
  const userAgent = req.get('User-Agent') || 'Unknown';

  accessLogger.http('Incoming Request', {
    method,
    url,
    ip,
    userAgent,
    timestamp: new Date().toISOString(),
    body: method !== 'GET' ? req.body : undefined
  });

  const originalJson = res.json;
  const originalSend = res.send;

  res.json = function(body?: any) {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;

    accessLogger.http('Response', {
      method,
      url,
      statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
      ip,
      success: statusCode >= 200 && statusCode < 400
    });

    return originalJson.call(this, body);
  };

  res.send = function(body?: any) {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;

    accessLogger.http('Response', {
      method,
      url,
      statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
      ip,
      success: statusCode >= 200 && statusCode < 400
    });

    return originalSend.call(this, body);
  };

  next();
};

export const auditLogger = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const writeOperations = ['POST', 'PUT', 'DELETE', 'PATCH'];
  const excludePaths = ['/api/auth/login', '/api/auth/register', '/api/auth/logout'];

  if (writeOperations.includes(req.method) && !excludePaths.includes(req.path)) {
    const originalJson = res.json;
    const originalSend = res.send;

    const logAuditAction = () => {
      if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
        const action = `${req.method} ${req.path}`;
        const performedBy = req.user.userId;

        const pathParts = req.path.split('/');
        let targetModel = 'Unknown';
        let targetId = 'N/A';

        if (pathParts.length >= 3) {
          targetModel = pathParts[2];
          if (pathParts.length >= 4 && pathParts[3]) {
            targetId = pathParts[3];
          }
        }

        auditFileLogger.info('Audit Action', {
          action,
          performedBy,
          targetModel,
          targetId,
          timestamp: new Date().toISOString(),
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          body: req.body
        });

        logAction(action, performedBy, targetModel, targetId).catch(error => {
          errorFileLogger.error('Failed to log audit action to database', {
            error: error.message,
            stack: error.stack,
            action,
            performedBy,
            targetModel,
            targetId
          });
        });
      }
    };

    res.json = function(body?: any) {
      logAuditAction();
      return originalJson.call(this, body);
    };

    res.send = function(body?: any) {
      logAuditAction();
      return originalSend.call(this, body);
    };
  }

  next();
};

export const errorLogger = (error: any, req: Request, res: Response, next: NextFunction) => {
  const { method, url, ip } = req;

  errorFileLogger.error('HTTP Error', {
    message: error.message,
    stack: error.stack,
    method,
    url,
    ip,
    userAgent: req.get('User-Agent'),
    body: req.body,
    params: req.params,
    query: req.query,
    timestamp: new Date().toISOString()
  });

  next(error);
};
