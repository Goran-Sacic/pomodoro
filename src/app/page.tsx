'use client';

import Header from './components/Header';
import styles from './page.module.css';
import Pomodoro from './pomodoro/page';

export default function Home() {
	return (
		<div className={styles.page}>
			<Header />
			<Pomodoro />
		</div>
	);
}
