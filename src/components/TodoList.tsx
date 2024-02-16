import { useState, useEffect } from "react";
import axios from "axios";
import scss from "./TodoList.module.scss";
import { TodoType } from "../types/index";
import TodoMap from "./TodoMap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const url = import.meta.env.VITE_BACKEND_URL;

const TodoList = () => {
	const [darkMode, setDarkMode] = useState(false);

	const [todos, setTodos] = useState<TodoType[]>([]);
	const [values, setValues] = useState({
		title: "",
		password: "",
		img: "",
		price: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target;
		setValues((prevValues) => ({
			...prevValues,
			[id]: value,
		}));
	};

	const getTodos = async () => {
		try {
			const response = await axios.get<TodoType[]>(url);
			setTodos(response.data);
		} catch (error) {
			toast.error("Failed to load todos");
		}
	};

	const postTodos = async () => {
		if (
			values.title === "" ||
			values.price === "" ||
			values.password === "" ||
			values.img === ""
		) {
			toast.error("Заполните все поля!");
		} else {
			try {
				await axios.post(url, values);
				getTodos();
				setValues({ title: "", password: "", img: "", price: "" });
				toast.success("Запрос успешно отправлено");
			} catch (error) {
				toast.error("Failed to add todo");
			}
		}
	};

	// ! Function Black vs White
	const enableDarkMode = () => {
		setDarkMode(true);
		document.body.style.background = "black";
		document.body.style.color = "white";
	};

	const disableDarkMode = () => {
		setDarkMode(false);
		document.body.style.background = "white";
		document.body.style.color = "black";
	};

	// ! Delete All
	const deleteAllTodo = async () => {
		const response = await axios.delete(url);
		setTodos(response.data);
	};

	useEffect(() => {
		getTodos();
	}, []);

	return (
		<div className={scss.TodoList}>
			<ToastContainer />
			<h1>Todo List</h1>
			<div className={scss.animation_btn}>
				<button
					className={darkMode ? scss.selected : scss.default}
					onClick={enableDarkMode}>
					Dark mode
				</button>
				<button
					className={!darkMode ? scss.selected : scss.default}
					onClick={disableDarkMode}>
					White mode
				</button>
			</div>
			<div className={scss.Input}>
				<div className={scss.Input_First}>
					<input
						id="title"
						value={values.title}
						onChange={handleChange}
						type="text"
						placeholder="Please, write"
					/>
					<input
						id="password"
						value={values.password}
						onChange={handleChange}
						type="password"
						placeholder="Please enter your password"
					/>
				</div>

				<div className={scss.Input_Second}>
					<input
						id="img"
						value={values.img}
						onChange={handleChange}
						type="url"
						placeholder="Image link"
					/>
					<input
						id="price"
						value={values.price}
						onChange={handleChange}
						type="number"
						placeholder="Price as desired"
					/>
				</div>
			</div>
			<div className={scss.btn_button}>
				<button className={scss.submit} onClick={postTodos}>
					Submit
				</button>
				<button className={scss.delete_all} onClick={deleteAllTodo}>
					Delete All
				</button>
			</div>

			<TodoMap todos={todos} getTodos={getTodos} />
		</div>
	);
};

export default TodoList;
