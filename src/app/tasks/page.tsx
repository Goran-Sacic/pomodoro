'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import styles from './page.module.scss';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@mui/material';
import { Check, Pencil, Trash2, CirclePlus } from 'lucide-react';

interface Task {
	taskId: string;
	task: string;
	completed: boolean;
	isEditing: boolean;
}

interface TasksProps {
	handleCountTasksStat: (numberOfTasksCompleted: number) => void;
	handleLog: (message: string) => void;
}

const Tasks: React.FC<TasksProps> = ({ handleCountTasksStat, handleLog }) => {
	const [task, setTask] = useState<string>('');
	const [tasks, setTasks] = useState<Task[]>([]);
	const [addingTask, setAddingTask] = useState<boolean>(false);
	const editInputRef = useRef<HTMLInputElement>(null);
	const addNewTaskRef = useRef<HTMLInputElement>(null);
	const [firstRender, setFirstRender] = useState<boolean>(true);
	const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);

	const handleShowAddTask = () => {
		handleLog(
			`${!addingTask ? 'Began to add new task.' : 'Ended adding new task.'}`
		);
		setAddingTask(!addingTask);
		setTask('');
	};

	useEffect(() => {
		if (addingTask) {
			addNewTaskRef.current?.focus();
		}
	}, [addingTask]);

	const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
		event.preventDefault();
		setTask(event.currentTarget.value);
	};

	const handleNewTask = (event: React.FormEvent<HTMLButtonElement>) => {
		event.preventDefault();
		const newTask = {
			taskId: uuidv4(),
			task: task,
			completed: false,
			isEditing: false,
		};
		setTasks((prev) => [...prev, newTask]);
		setTask('');
		setAddingTask(false);
		handleLog('Added new task.');
	};

	const handleTaskCompleted = (taskId: string) => {
		const newList = tasks.map((task) => {
			if (task.taskId === taskId) {
				handleLog(
					`Marked a task ${task.completed ? 'completed' : 'not completed'}.`
				);
				return { ...task, completed: !task.completed };
			} else return task;
		});
		setTasks(newList);
	};

	const handleEditTask = (taskId: string) => {
		const findTaskToEdit = tasks.map((task) => {
			if (task.taskId === taskId) {
				handleLog('Started editing the task.');
				return { ...task, isEditing: true };
			} else return task;
		});
		setTasks(findTaskToEdit);
		if (findTaskToEdit.find((task) => task.isEditing)) {
			editInputRef.current?.focus();
		}
	};

	const handleEditTaskNameChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>, taskId: string) => {
			const updatedTasks = tasks.map((task) => {
				if (task.taskId === taskId) {
					return { ...task, task: event.currentTarget.value };
				} else return task;
			});
			setTasks(updatedTasks);
		},
		[tasks]
	);

	const handleSaveEdit = useCallback(
		(taskId: string) => {
			const updatedTasks = tasks.map((task) =>
				task.taskId === taskId ? { ...task, isEditing: false } : task
			);
			handleLog('Finished editing the task.');
			setTasks(updatedTasks);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[tasks]
	);

	useEffect(() => {
		if (editInputRef.current) {
			editInputRef.current.focus();
		}
	}, [handleEditTaskNameChange, handleSaveEdit]);

	const handleDeleteTask = (taskId: string) => {
		const filteredList = tasks.filter((task) => task.taskId !== taskId);
		handleLog('Deleted a task.');
		setTasks(filteredList);
	};

	useEffect(() => {
		if (firstRender) {
			setFirstRender(false);
			return;
		}
		const isEverythingDone = tasks.filter((task) => task.completed === false);
		if (isEverythingDone.length > 0) {
			setShowSuccessMessage(false);
		} else if (tasks.length === 0) {
			setShowSuccessMessage(false);
		} else setShowSuccessMessage(true);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tasks]);

	useEffect(() => {
		const completedTasksCount = tasks.filter((task) => task.completed).length;
		handleCountTasksStat(completedTasksCount);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tasks]);

	return (
		<>
			<div className={styles.tasks}>
				<h1>Tasks</h1>
				{tasks.map((task) => (
					<div key={task.taskId} className={styles.task}>
						<span>
							<button
								type='button'
								className={`${
									task.completed
										? styles.buttonTaskCompleted
										: styles.buttonTask
								}`}
								onClick={() => handleTaskCompleted(task.taskId)}
							>
								<Check size={24} />
							</button>
							{!task.isEditing ? (
								<p
									className={`${
										task.completed ? styles.completedTaskText : styles.taskText
									}`}
								>
									{task.task}
								</p>
							) : (
								<input
									ref={editInputRef}
									type='text'
									value={task.task}
									onChange={(e) => handleEditTaskNameChange(e, task.taskId)}
									onKeyDown={(e) => {
										if (e.key === 'Enter') {
											handleSaveEdit(task.taskId);
										}
									}}
									onBlur={() => handleSaveEdit(task.taskId)}
									className={styles.editInput}
								/>
							)}
						</span>
						<span>
							<button
								type='button'
								className={styles.buttonTask}
								onClick={() => handleEditTask(task.taskId)}
								disabled={task.completed}
							>
								<Pencil size={24} />
							</button>
							<button
								type='button'
								className={styles.buttonTask}
								onClick={() => handleDeleteTask(task.taskId)}
							>
								<Trash2 size={24} />
							</button>
						</span>
					</div>
				))}
				{showSuccessMessage && (
					<div className={styles.successMessage}>
						You&apos;ve completed all tasks. Congratulations!
					</div>
				)}
				{addingTask ? (
					<form>
						<span>
							<input
								id='task'
								onChange={handleChange}
								value={task}
								ref={addNewTaskRef}
								placeholder='Enter new task...'
							/>
						</span>
						<span>
							<Button
								type='button'
								variant='outlined'
								onClick={handleShowAddTask}
								className={styles.addNewTaskButton}
							>
								Close
							</Button>
							<Button
								type='submit'
								variant='outlined'
								onClick={handleNewTask}
								className={styles.addNewTaskButton}
							>
								Add
							</Button>
						</span>
					</form>
				) : (
					<span className={styles.showAddTaskForm}>
						<button type='button' onClick={handleShowAddTask}>
							<CirclePlus /> Add new task
						</button>
					</span>
				)}
			</div>
		</>
	);
};

export default Tasks;
