import { AuthenticationSessionGuard } from "@/auth/authentication-session-guard";
import { DashboardHeader } from "@/components/dashboard-header/dashboard-header";
import styles from "./page.module.css";

export default function DashboardPage() {
  return (
    <AuthenticationSessionGuard>
      <div className={styles.pageWrapper}>
        <DashboardHeader />

        <div className={styles.container}>
          <div className={styles.stack}>
            <div>
              <h1 className={styles.title}>Dashboard</h1>
              <p className={styles.subtitle}>Requirement Prioritization Dashboard</p>
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Welcome to Requirement Prioritization</h2>
              <p className={styles.cardBody}>
                Your session is authenticated and active. You can now manage and prioritize project requirements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthenticationSessionGuard>
  );
}
