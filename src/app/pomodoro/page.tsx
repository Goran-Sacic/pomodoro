'use client';

import { useState, useEffect, useRef, memo } from 'react';
import styles from './page.module.scss';
import { Button } from '@mui/material';
import {
	Play,
	Pause,
	SkipForward,
	ArrowBigRight,
	Undo2,
	Power,
	PowerOff,
} from 'lucide-react';
import { Tasks } from '../tasks/page';

interface Stats {
	focusSessionsCompleted: number;
	breaksCompleted: number;
	longBreaksCompleted: number;
	wholeSessionsCompleted: number;
	tasksCompleted: number;
}

type ShowStats = boolean;

const StatsTracker = memo(function StatsTracker({
	stats,
	showStats,
	toggleShowStats,
	resetStats,
	handleLog,
}: {
	stats: Stats;
	showStats: ShowStats;
	toggleShowStats: (arg0: boolean) => void;
	resetStats: () => void;
	handleLog: (arg0: string) => void;
}) {
	const toggleStats = () => {
		handleLog(`Toggled stats to ${showStats ? 'hide.' : 'show.'}`);
		toggleShowStats(!showStats);
	};

	return (
		<div className={styles.statsTracker}>
			<div className={styles.statsTrackerTitle}>
				<h1>Stats</h1>
				{!showStats && <Button onClick={toggleStats}>Show stats</Button>}
			</div>
			{showStats && (
				<div className={styles.stats}>
					<div className={styles.individualStat}>
						<p>Learning sessions completed: </p>
						<p>{stats.focusSessionsCompleted}</p>
					</div>
					<div className={styles.individualStat}>
						<p>Breaks completed: </p>
						<p>{stats.breaksCompleted}</p>
					</div>
					<div className={styles.individualStat}>
						<p>Long breaks completed: </p>
						<p>{stats.longBreaksCompleted}</p>
					</div>
					<div className={styles.individualStat}>
						<p>Pomodoros completed: </p>
						<p>{stats.wholeSessionsCompleted}</p>
					</div>
					<div className={styles.individualStat}>
						<p>Tasks completed: </p>
						<p>{stats.tasksCompleted}</p>
					</div>
				</div>
			)}
			{showStats && (
				<div className={styles.statsControls}>
					<Button onClick={resetStats}>Reset stats</Button>
					<Button onClick={toggleStats}>Hide stats</Button>
				</div>
			)}
		</div>
	);
});

const initialStatsState: Stats = {
	focusSessionsCompleted: 0,
	breaksCompleted: 0,
	longBreaksCompleted: 0,
	wholeSessionsCompleted: 0,
	tasksCompleted: 0,
};

interface Log {
	timestamp: string;
	action: string;
}

const Pomodoro = () => {
	const [timer, setTimer] = useState(1500000);
	const [startTimer, setStartTimer] = useState(false);
	const [session, setSession] = useState<number>(1);
	const [sessionDescription, setSessionDescription] = useState<string>('focus');
	const [allStats, setAllStats] = useState<Stats>(initialStatsState);
	const [showStats, setShowStats] = useState<boolean>(false);
	const [skipTimerButtonPressed, setSkipTimerButtonPressed] =
		useState<boolean>(false);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const [log, setLog] = useState<Log[]>([]);
	const [showLog, setShowLog] = useState<boolean>(false);

	const handleStats = (() => {
		// Necessary to keep track if stats have already been updated since useEffect runs twice. Have yet to figure out why
		let statsUpdated = false;

		return () => {
			// This avoids multiple updates.
			if (statsUpdated) return;
			statsUpdated = true;

			if (sessionDescription === 'focus') {
				setAllStats((prev) => ({
					...prev,
					focusSessionsCompleted: prev.focusSessionsCompleted + 1,
				}));
			} else if (sessionDescription === 'break') {
				setAllStats((prev) => ({
					...prev,
					breaksCompleted: prev.breaksCompleted + 1,
				}));
			} else if (sessionDescription === 'long break') {
				setAllStats((prev) => ({
					...prev,
					longBreaksCompleted: prev.longBreaksCompleted + 1,
				}));
			}
			if (sessionDescription === 'long break' && session === 4) {
				setAllStats((prev) => ({
					...prev,
					wholeSessionsCompleted: prev.wholeSessionsCompleted + 1,
				}));
			}
		};
	})();

	const handleLog = (action: string) => {
		const timestamp = new Date().toLocaleString();
		setLog([...log, { timestamp, action }]);
	};

	const handleClearLog = () => {
		setLog([]);
	};

	/* const handleStats = () => {
		if (sessionDescription === 'focus') {
			setAllStats((prev) => ({
				...prev,
				focusSessionsCompleted: prev.focusSessionsCompleted + 1,
			}));
		} else if (sessionDescription === 'break') {
			setAllStats((prev) => ({
				...prev,
				breaksCompleted: prev.breaksCompleted + 1,
			}));
		} else if (sessionDescription === 'long break') {
			setAllStats((prev) => ({
				...prev,
				longBreaksCompleted: prev.longBreaksCompleted + 1,
			}));
		}
		if (sessionDescription === 'long break' && session === 4) {
			setAllStats((prev) => ({
				...prev,
				wholeSessionsCompleted: prev.wholeSessionsCompleted + 1,
			}));
		}
	}; */

	useEffect(() => {
		if (startTimer) {
			const start = Date.now();
			const initialTime = timer;

			intervalRef.current = setInterval(() => {
				setTimer(() => {
					const elapsed = Date.now() - start;
					const timer = initialTime - elapsed;
					if (timer <= 0) {
						clearInterval(intervalRef.current!);
						return 0;
					}
					return timer;
				});
			}, 50); // Update every 50ms for smoother transitions. Could've set it to lower but what's the point.
		} else {
			clearInterval(intervalRef.current!);
		}

		return () => clearInterval(intervalRef.current!);
	}, [startTimer]);

	useEffect(() => {
		if (timer === 0 && !skipTimerButtonPressed) {
			handleStats();
		}
	}, [timer]);

	const handleStartOrPauseTimer = () => {
		setStartTimer((prev) => !prev);
		handleLog(startTimer ? 'Paused timer.' : 'Resumed timer.');
	};

	const handleSkipTimer = () => {
		setSkipTimerButtonPressed(true);
		setTimer(0);
		clearInterval(intervalRef.current!);
		handleStats();
		handleLog('Skipped to end.');
	};

	const handleNextLearningSession = () => {
		handleLog('Moved to next section.');
		setSkipTimerButtonPressed(false);
		if (sessionDescription === 'focus' && session !== 4) {
			setSessionDescription('break');
			setTimer(300000);
		} else if (sessionDescription === 'break' && session !== 4) {
			setSessionDescription('focus');
			setTimer(1500000);
		} else if (sessionDescription === 'focus' && session === 4) {
			setSessionDescription('long break');
			setTimer(1200000);
		}
		if (sessionDescription === 'break') {
			setSession((prev) => prev + 1);
			setSessionDescription('focus');
		}
		setStartTimer(false);
		clearInterval(intervalRef.current!);
	};

	const handleRestart = () => {
		handleLog('Restart timer.');
		switch (sessionDescription) {
			case 'focus':
				setTimer(1500000);
				break;
			case 'break':
				setTimer(300000);
				break;
			case 'long break':
				setTimer(1200000);
				break;
		}
		setStartTimer(false);
		clearInterval(intervalRef.current!);
	};

	const handleReset = () => {
		handleLog('Reset app.');
		setTimer(1500000);
		setSession(1);
		setSessionDescription('focus');
		setStartTimer(false);
		clearInterval(intervalRef.current!);
	};

	const resetStats = () => {
		handleLog('Reset stats.');
		setAllStats(initialStatsState);
	};

	const handleCountTasksStat = (numberOfTasksCompleted: number) => {
		setAllStats((prev) => ({
			...prev,
			tasksCompleted: numberOfTasksCompleted,
		}));
	};

	return (
		<>
			<div className={styles.timer}>
				<div className={styles.sessionsIndicator}>
					<span>
						{`Session: ${session} of 4 (${sessionDescription}
						time)`}
					</span>
				</div>
				<div className={styles.display}>
					<span>
						{`${Math.floor(timer / 60000)}`.padStart(2, '0')}:
						{`${Math.floor((timer % 60000) / 1000)}`.padStart(2, '0')}:
						{`${Math.floor((timer % 1000) / 10)}`.padStart(2, '0')}
					</span>
				</div>
				<div className={styles.controls}>
					<div>
						<Button
							variant='contained'
							startIcon={startTimer ? <Pause size={28} /> : <Play size={28} />}
							className={styles.button}
							onClick={handleStartOrPauseTimer}
							disabled={timer === 0}
						>
							{startTimer ? 'Pause' : 'Start'}
						</Button>
						<Button
							variant='contained'
							startIcon={<ArrowBigRight size={28} />}
							className={styles.button}
							onClick={handleNextLearningSession}
							disabled={sessionDescription === 'long break'}
						>
							Next
						</Button>
					</div>
					<div>
						<Button
							variant='contained'
							startIcon={<SkipForward size={24} />}
							className={styles.button}
							onClick={handleSkipTimer}
							disabled={timer === 0}
						>
							Skip
						</Button>
						<Button
							variant='contained'
							startIcon={<Undo2 size={24} />}
							className={styles.button}
							onClick={handleRestart}
						>
							Restart
						</Button>

						<Button
							variant='contained'
							startIcon={
								session === 1 &&
								sessionDescription === 'focus' &&
								timer === 1500000 ? (
									<PowerOff size={24} />
								) : (
									<Power size={24} />
								)
							}
							disabled={
								session === 1 &&
								sessionDescription === 'focus' &&
								timer === 1500000
							}
							className={styles.button}
							onClick={handleReset}
						>
							Reset
						</Button>
					</div>
				</div>
			</div>
			<Tasks countTasksStat={handleCountTasksStat} handleLog={handleLog} />
			<StatsTracker
				stats={allStats}
				showStats={showStats}
				toggleShowStats={setShowStats}
				resetStats={resetStats}
				handleLog={handleLog}
			/>
			<div className={styles.log}>
				<div className={styles.logHeader}>
					<h1>Log</h1>
					<div className={styles.logControls}>
						{showLog && (
							<Button onClick={handleClearLog} disabled={log.length === 0}>
								Clear log
							</Button>
						)}
						<Button onClick={() => setShowLog(!showLog)}>
							{!showLog ? 'Show log' : 'Hide log'}
						</Button>
					</div>
				</div>
				{log.length === 0 && showLog && (
					<p style={{ marginTop: '10px' }}>Log is empty.</p>
				)}
				{showLog && (
					<ul>
						{log.map((log, index) => (
							<li
								key={index}
								style={{ listStyle: 'none' }}
							>{`${log.timestamp}: ${log.action}`}</li>
						))}
					</ul>
				)}
			</div>
		</>
	);
};

export default Pomodoro;
