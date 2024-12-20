import { useState } from 'react';
import styles from './Header.module.scss';
import { Info } from 'lucide-react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const Header = () => {
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	return (
		<>
			<div className={styles.header}>
				<h1 className={styles.headerTitle}>Pomodorko</h1>
				<div className={styles.options} onClick={handleOpen}>
					<Info size={48} />
				</div>
			</div>
			<div>
				<Modal
					open={open}
					onClose={handleClose}
					aria-labelledby='modal-modal-title'
					aria-describedby='modal-modal-description'
				>
					<Box className={styles.modalBox}>
						<Typography
							id='modal-modal-title'
							variant='h6'
							component='h2'
							className={styles.modalTitle}
						>
							Pomodorko Features Overview
						</Typography>
						<Typography
							component={'div'}
							id='modal-modal-description'
							className={styles.modalDescription}
						>
							Welcome to <strong>Pomodorko</strong>, your all-in-one
							productivity app designed to help you stay focused and organized!
							Here’s a quick rundown of everything you can do:
							<br />
							<br />
							<strong style={{ textDecoration: 'underline' }}>
								Pomodoro Timer
							</strong>
							<ul>
								<li>
									<strong>Start/Pause Timer:</strong> Control your focus
									sessions with a simple start and pause functionality.
								</li>
								<li>
									<strong>Skip Timer:</strong> Jump to the end of the current
									session when you need to adjust your workflow.
								</li>
								<li>
									<strong>Move to Next Session:</strong> Seamlessly transition
									between focus, break, and long break sessions.
								</li>
								<li>
									<strong>Restart Session:</strong> Rewind and restart the
									current session to ensure you stay on track.
								</li>
								<li>
									<strong>Reset Pomodoro Cycle:</strong> Start a fresh Pomodoro
									cycle anytime you need a reset.
								</li>
							</ul>
							<br />
							<strong style={{ textDecoration: 'underline' }}>
								Tasks Management
							</strong>
							<ul>
								<li>
									<strong>Add Tasks:</strong> Organize your to-do list by adding
									tasks for your Pomodoro session(s).
								</li>
								<li>
									<strong>Edit Tasks:</strong> Update your tasks as priorities
									or requirements change.
								</li>
								<li>
									<strong>Delete Tasks:</strong> Keep your task list clean by
									removing completed or unnecessary tasks.
								</li>
							</ul>
							<br />
							<strong style={{ textDecoration: 'underline' }}>
								Statistics
							</strong>
							<ul>
								<li>
									<strong>Learning Sessions Completed:</strong> See how many
									25-minute focus sessions you&apos;ve completed.
								</li>
								<li>
									<strong>Breaks Completed:</strong> Monitor the number of
									5-minute breaks you&apos;ve taken to recharge.
								</li>
								<li>
									<strong>Long Breaks Completed:</strong> Keep track of your
									well-deserved 20-minute long breaks.
								</li>
								<li>
									<strong>Pomodoros Completed:</strong> Celebrate completing
									entire Pomodoro cycles.
								</li>
								<li>
									<strong>Tasks Completed:</strong> Stay motivated by reviewing
									your accomplished tasks.
								</li>
							</ul>
							<br />
							<strong style={{ textDecoration: 'underline' }}>
								Activity Log
							</strong>
							<ul>
								<li>
									<strong>Tracked Actions:</strong> Every action you take, like
									starting/stopping the timer or adding/editing/deleting tasks,
									is logged for your reference.
								</li>
								<li>
									<strong>Review History:</strong> Use the log to analyze your
									habits and identify areas for improvement.
								</li>
							</ul>
							<br />
							With <strong>Pomodorko</strong> you can maximize productivity,
							manage tasks efficiently and track your progress.
						</Typography>
						<div className={styles.modalControls}>
							<button onClick={handleClose} className={styles.closeModalButton}>
								CLOSE
							</button>
						</div>
					</Box>
				</Modal>
			</div>
		</>
	);
};

export default Header;
