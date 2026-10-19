import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAuthService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseAuthService.name);

  onModuleInit(): void {
    if (admin.apps.length > 0) {
      this.logger.log('Firebase Admin SDK already initialized.');
      return;
    }

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (clientEmail && rawPrivateKey) {
      const privateKey = rawPrivateKey.replace(/\\n/g, '\n');
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: projectId || undefined,
          clientEmail,
          privateKey,
        }),
      });
      this.logger.log(
        `Firebase Admin initialized with service account for project: ${projectId ?? 'default'}`,
      );
    } else if (projectId) {
      admin.initializeApp({ projectId });
      this.logger.log(
        `Firebase Admin initialized with project ID: ${projectId}`,
      );
    } else {
      admin.initializeApp();
      this.logger.log('Firebase Admin initialized with default credentials.');
    }
  }

  async verifyIdToken(token: string): Promise<admin.auth.DecodedIdToken> {
    return admin.auth().verifyIdToken(token);
  }
}
