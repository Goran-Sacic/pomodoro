'use client';

import styles from './page.module.css';
import { useState, useEffect, useRef } from 'react';
// @ts-expect-error use-sound has yet to be updated to React 19 / Next 15
import useSound from 'use-sound';
import { Typography, Card, Button, Stack } from '@mui/material';
import startTimerSound from '../../assets/notification_start.mp3';
import endTimerSound from '../../assets/notification_end.mp3';
import startPauseSound from '../../assets/notification_pause.mp3';

interface SessionInformation {
	sessionsCompleted: number;
	breaksCompleted: number;
	longBreaksCompleted: number;
	wholeSessionsCompleted: number;
}

export default function Home() {
	const [timer, setTimer] = useState<number>(1500000);
	const [timerStarted, setTimerStarted] = useState<boolean>(false);
	const [minutesToShow, setMinutesToShow] = useState<number>(25);
	const [secondsToShow, setSecondsToShow] = useState<number>(0);
	const [millisecondsToShow, setMillisecondsToShow] = useState<number>(0);
	/* const [timerClicked, setTimerClicked] = useState<boolean>(false); */
	const [pause, setPause] = useState<boolean>(false);
	const [showPause, setShowPause] = useState<boolean>(false);
	/* const [skippedToEnd, setSkippedToEnd] = useState<boolean>(false); */
	const [showBreak, setShowBreak] = useState<boolean>(true);
	const [showSession, setShowSession] = useState<boolean>(false);
	const [learningSession, setLearningSession] = useState<number>(1);
	const [showLongBreakButton, setShowLongBreakButton] =
		useState<boolean>(false);
	const [description, setDescription] = useState<string>('learning');
	/* const [sessionsFinished, setSessionsFinished] = useState<number>(0); */
	const [alreadyCountedStats, setAlreadyCountedStats] =
		useState<boolean>(false);
	const [sessionsInformation, setSessionsInformation] =
		useState<SessionInformation>({
			sessionsCompleted: 0,
			breaksCompleted: 0,
			longBreaksCompleted: 0,
			wholeSessionsCompleted: 0,
		});

	const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

	const [playStartTimerSound, { stop: stopStartTimerSound }] = useSound(
		startTimerSound,
		{ volume: 1 }
	);
	const [playEndTimerSound, { stop: stopEndTimerSound }] = useSound(
		endTimerSound,
		{ volume: 1 }
	);
	const [playStartPauseSound, { stop: stopStartPauseSound }] = useSound(
		startPauseSound,
		{ volume: 1 }
	);

	const handleStartTimer = () => {
		stopStartTimerSound();
		stopStartPauseSound();
		playStartTimerSound();
		/* setTimerClicked(true); */
		setTimerStarted(true);
		setPause(false);
		setShowPause(true);
		if (!intervalIdRef.current) {
			intervalIdRef.current = setInterval(() => {
				setTimer((prevTimer) => {
					if (prevTimer <= 10) {
						clearInterval(intervalIdRef.current!);
						intervalIdRef.current = null;
						stopStartTimerSound();
						return 0;
					}
					return prevTimer - 10;
				});
			}, 10);
		}
	};

	const handlePause = () => {
		stopStartTimerSound();
		stopEndTimerSound();
		playStartPauseSound();
		setPause(true);
		if (intervalIdRef.current) {
			clearInterval(intervalIdRef.current);
			intervalIdRef.current = null;
		}
		setShowPause(false);
	};

	const handleSkipToEnd = () => {
		/* setSkippedToEnd(true); */
		setPause(false);
		setTimerStarted(true);
		setTimer(0);
	};

	const handleResetApp = () => {
		setShowPause(false);
		setShowBreak(true);
		setShowSession(false);
		setDescription('learning');
		/* setSkippedToEnd(false); */
		setPause(false);
		/* setTimerClicked(false); */
		setTimer(1500000);
		setMinutesToShow(25);
		setSecondsToShow(0);
		setMillisecondsToShow(0);
		setLearningSession(1);
		setShowLongBreakButton(false);
		setTimerStarted(false);
		if (intervalIdRef.current) {
			clearInterval(intervalIdRef.current);
			intervalIdRef.current = null;
		}
	};

	useEffect(() => {
		if (timer <= 0) {
			clearInterval(intervalIdRef.current!);
			intervalIdRef.current = null;
			setMinutesToShow(0);
			setSecondsToShow(0);
			setMillisecondsToShow(0); // explicitly set to 0 when timer ends since I had some issues with timer display at 00:00:000 (it being set to 00:00:010 for some reason)
			if (description === 'long break') {
				setSessionsInformation((prev) => ({
					...prev,
					longBreaksCompleted: prev.longBreaksCompleted + 1,
					wholeSessionsCompleted: prev.wholeSessionsCompleted + 1,
				}));
			}
			if (description === 'learning') {
				setSessionsInformation((prev) => ({
					...prev,
					sessionsCompleted: prev.sessionsCompleted + 1,
				}));
			}
			if (description === 'break') {
				setSessionsInformation((prev) => ({
					...prev,
					breaksCompleted: prev.breaksCompleted + 1,
				}));
			}
			setAlreadyCountedStats(true);
		} else {
			setMinutesToShow(Math.floor(timer / 60000));
			setSecondsToShow(Math.floor((timer % 60000) / 1000));
			setMillisecondsToShow(Math.max(timer % 1000, 0));
		}
	}, [timer /* showBreak */]);

	useEffect(() => {
		if (timer <= 0) {
			playEndTimerSound();
		}
	}, [timer]);

	/* 	useEffect(() => {
		if (!timerClicked) return;
		if (pause) return;
		handleStartTimer();
	}, [timerClicked, pause]); */

	const handleShowBreak = () => {
		setDescription('break');
		setShowSession(!showSession);
		setShowBreak(!showBreak);
		setPause(false);
		setShowPause(false);
		/* setTimerClicked(false); */
		setTimer(300000);
		setMinutesToShow(5);
		setSecondsToShow(0);
		setMillisecondsToShow(0);
		setTimerStarted(false);
		if (intervalIdRef.current) {
			clearInterval(intervalIdRef.current);
			intervalIdRef.current = null;
		}
		if (!alreadyCountedStats) {
			if (description === 'long break') {
				setSessionsInformation((prev) => ({
					...prev,
					longBreaksCompleted: prev.longBreaksCompleted + 1,
					wholeSessionsCompleted: prev.wholeSessionsCompleted + 1,
				}));
			}
			if (description === 'learning') {
				setSessionsInformation((prev) => ({
					...prev,
					sessionsCompleted: prev.sessionsCompleted + 1,
				}));
			}
			if (description === 'break') {
				setSessionsInformation((prev) => ({
					...prev,
					breaksCompleted: prev.breaksCompleted + 1,
				}));
			}
		}
	};

	const handleShowSession = () => {
		setDescription('learning');
		setShowBreak(!showBreak);
		setShowSession(!showSession);
		setPause(false);
		setShowPause(false);
		/* setTimerClicked(false); */
		setTimer(1500000);
		setMinutesToShow(25);
		setSecondsToShow(0);
		setMillisecondsToShow(0);
		setTimerStarted(false);
		setLearningSession(learningSession + 1);
		if (intervalIdRef.current) {
			clearInterval(intervalIdRef.current);
			intervalIdRef.current = null;
		}
		if (!alreadyCountedStats) {
			if (description === 'long break') {
				setSessionsInformation((prev) => ({
					...prev,
					longBreaksCompleted: prev.longBreaksCompleted + 1,
					wholeSessionsCompleted: prev.wholeSessionsCompleted + 1,
				}));
			}
			if (description === 'learning') {
				setSessionsInformation((prev) => ({
					...prev,
					sessionsCompleted: prev.sessionsCompleted + 1,
				}));
			}
			if (description === 'break') {
				setSessionsInformation((prev) => ({
					...prev,
					breaksCompleted: prev.breaksCompleted + 1,
				}));
			}
		}
	};

	const handleShowLongBreakButton = () => {
		setDescription('long break');
		setShowLongBreakButton(true);
		setShowBreak(!showBreak);
		setShowSession(!showSession);
		/* setSkippedToEnd(false); */
		setPause(false);
		setShowPause(false);
		setTimerStarted(false);
		/* setTimerClicked(false); */
		setTimer(1200000);
		setMinutesToShow(20);
		setSecondsToShow(0);
		setMillisecondsToShow(0);
		if (intervalIdRef.current) {
			clearInterval(intervalIdRef.current);
			intervalIdRef.current = null;
		}
		if (!alreadyCountedStats) {
			if (description === 'long break') {
				setSessionsInformation((prev) => ({
					...prev,
					longBreaksCompleted: prev.longBreaksCompleted + 1,
					wholeSessionsCompleted: prev.wholeSessionsCompleted + 1,
				}));
			}
			if (description === 'learning') {
				setSessionsInformation((prev) => ({
					...prev,
					sessionsCompleted: prev.sessionsCompleted + 1,
				}));
			}
			if (description === 'break') {
				setSessionsInformation((prev) => ({
					...prev,
					breaksCompleted: prev.breaksCompleted + 1,
				}));
			}
		}
	};

	useEffect(() => {
		if (!timerStarted) {
			setAlreadyCountedStats(false);
		}
	}, [timerStarted]);

	return (
		<div className={styles.page}>
			<div className={styles.content}>
				<Typography variant='h3' gutterBottom>
					Welcome to Pomodoro!
				</Typography>
				<Typography variant='body1'>
					The Pomodoro Technique is a time management method that encourages
					focus and productivity. Work for a set period (usually 25 minutes),
					followed by a short break. After completing several sessions, take a
					longer break to recharge.
				</Typography>
				<Typography variant='subtitle1'>
					This app helps you manage your Pomodoro sessions with timers and
					notifications.
				</Typography>
				<Typography variant='subtitle1'>
					Stats still count even if you skip sessions, so try not to cheat!
				</Typography>
				<Typography variant='subtitle1'>
					Pressing F5 clears the whole app!
				</Typography>
				<Card className={styles.pomodoro} elevation={4}>
					<Typography variant='h6' className={styles.sessionIndicator}>
						{!showSession && `Sessions ${learningSession} of 4 (focus time)`}
						{!showBreak &&
							learningSession < 4 &&
							`Sessions ${learningSession} of 4 (break time)`}
						{!showBreak &&
							learningSession === 4 &&
							`Sessions ${learningSession} of 4 (long break)`}
					</Typography>
					<Typography variant='h3' className={styles.timer}>
						<span>{String(minutesToShow).padStart(2, '0')}</span>:
						<span>{String(secondsToShow).padStart(2, '0')}</span>:
						<span>{String(millisecondsToShow).padStart(3, '0')}</span>
					</Typography>
				</Card>
				<div className={styles.controls}>
					<Stack direction='row' spacing={3} justifyContent='center'>
						<Button
							variant='contained'
							color='primary'
							onClick={handleResetApp}
						>
							Reset Learning
						</Button>
						{!showPause && (
							<Button
								variant='contained'
								color='success'
								onClick={handleStartTimer}
								disabled={timer === 0}
								style={{ opacity: timer === 0 ? 0.9 : 1 }}
							>
								Start {description}
							</Button>
						)}
						{showPause && (
							<Button
								variant='contained'
								color='warning'
								onClick={handlePause}
								disabled={timer === 0}
								style={{ opacity: timer === 0 ? 0.9 : 1 }}
							>
								Pause {description}
							</Button>
						)}
						<Button
							variant='contained'
							color='secondary'
							onClick={handleSkipToEnd}
							disabled={timer === 0}
							style={{ opacity: timer === 0 ? 0.6 : 1 }}
						>
							Skip to End
						</Button>
						{learningSession < 4 && (
							<Button
								variant='contained'
								color='info'
								onClick={handleShowBreak}
								disabled={!showBreak}
								style={{ opacity: !showBreak ? 0.6 : 1 }}
							>
								Move to Break
							</Button>
						)}
						{learningSession < 4 ? (
							<Button
								variant='contained'
								color='info'
								onClick={handleShowSession}
								disabled={!showSession}
								style={{ opacity: !showSession ? 0.6 : 1 }}
							>
								Next Session
							</Button>
						) : (
							!showLongBreakButton && (
								<Button
									variant='contained'
									color='info'
									onClick={handleShowLongBreakButton}
									style={{ opacity: 1 }}
								>
									Move to Long Break
								</Button>
							)
						)}
					</Stack>
				</div>
			</div>
			{/* {pause && (
				<div className={styles.pausedMessage}>
					<Typography variant='h3' gutterBottom>
						(paused)
					</Typography>
				</div>
			)} */}

			<div className={styles.pausedMessage}>
				<Typography variant='h4' gutterBottom>
					Status:
					{pause && <span> paused!</span>}
					{timer > 0 && !pause && timerStarted && <span> in progress...</span>}
					{timer === 0 && !pause && (
						<span>
							{' '}
							finished
							{showLongBreakButton && <span> the whole session</span>}!
						</span>
					)}
					{!timerStarted && <span> getting ready!</span>}
				</Typography>
			</div>

			<Stack spacing={2}>
				<Card variant='outlined' className={styles.description}>
					<Typography variant='body1'>
						<strong>Start:</strong> Initiates the Pomodoro timer for a session.
					</Typography>
				</Card>
				<Card variant='outlined' className={styles.description}>
					<Typography variant='body1'>
						<strong>Pause:</strong> Pauses the timer if you need a break during
						the session.
					</Typography>
				</Card>
				<Card variant='outlined' className={styles.description}>
					<Typography variant='body1'>
						<strong>Skip to End:</strong> Ends the learning or break early.
					</Typography>
				</Card>
				<Card variant='outlined' className={styles.description}>
					<Typography variant='body1'>
						<strong>Reset Learning:</strong> Resets the entire Pomodoro session,
						including any ongoing breaks.
					</Typography>
				</Card>
				<Card variant='outlined' className={styles.description}>
					<Typography variant='body1'>
						<strong>Move to Break:</strong> Transitions from a session to a
						short break.
					</Typography>
				</Card>
				<Card variant='outlined' className={styles.description}>
					<Typography variant='body1'>
						<strong>Move to Session:</strong> Transitions from a break back to a
						learning session.
					</Typography>
				</Card>
				<Card variant='outlined' className={styles.description}>
					<Typography variant='body1'>
						<strong>Take a Long Break:</strong> After completing four sessions,
						a longer break helps you recharge.
					</Typography>
				</Card>
			</Stack>
			<div className={styles.sessionsInfo}>
				<h3 style={{ textAlign: 'center' }}>Stats</h3>
				<p>
					Sessions completed (25min): {sessionsInformation.sessionsCompleted}
				</p>
				<p>Breaks completed (5min): {sessionsInformation.breaksCompleted}</p>
				<p>
					Long breaks completed (20min):{' '}
					{sessionsInformation.longBreaksCompleted}
				</p>
				<p>
					Total breaks completed (short + long breaks):{' '}
					{sessionsInformation.breaksCompleted +
						sessionsInformation.longBreaksCompleted}
				</p>
				<p>
					Whole sessions completed: {sessionsInformation.wholeSessionsCompleted}
				</p>
			</div>
		</div>
	);
}
