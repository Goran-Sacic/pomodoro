'use client';

import styles from './page.module.css';
import Pomodoro from './pomodoro/page';

export default function Home() {
	return (
		<div className={styles.page}>
			<Pomodoro />
		</div>
	);
}
