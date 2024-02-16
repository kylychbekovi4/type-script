import React, { FC, useState } from "react";
import axios from "axios";
import { TodoType } from "../types";
import scss from "./TodoMap.module.scss";

const url = import.meta.env.VITE_BACKEND_URL;

interface TodoMapProps {
	todos: TodoType[];
	getTodos: () => void;
}

const TodoMap: FC<TodoMapProps> = ({ todos, getTodos }) => {
	const [editInput1, setEditInput1] = useState("");
	const [editInput2, setEditInput2] = useState("");
	const [editInput3, setEditInput3] = useState("");
	const [editInput4, setEditInput4] = useState("");
	const [isEdit, setIsEdit] = useState(false);
	const [editId, setEditId] = useState("");

	const deleteTodo = async (id: string) => {
		await axios.delete(`${url}/${id}`);
		getTodos();
	};

	const updateTodoValue = (id: string) => {
		const filterData = todos.find((item) => item._id === id);
		if (filterData) {
			setEditInput1(filterData.title);
			setEditInput2(filterData.password);
			setEditInput3(filterData.img);
			setEditInput4(filterData.price.toString());
			setEditId(id);
			setIsEdit(true);
		}
	};

	const updateTodo = async (id: string) => {
		if (!isEdit) return;
		const updateData = {
			title: editInput1,
			password: editInput2,
			img: editInput3,
			price: editInput4,
		};
		try {
			await axios.patch(`${url}/${id}`, updateData);
			getTodos();
			setIsEdit(false);
			setEditId("");
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className={scss.TodoMap}>
			{todos.map((item) => (
				<div className={scss.card_map} key={item._id}>
					{isEdit && editId === item._id ? (
						<div className={scss.Inputs}>
							<input
								type="text"
								value={editInput1}
								onChange={(e) => setEditInput1(e.target.value)}
							/>
							<input
								type="password"
								value={editInput2}
								onChange={(e) => setEditInput2(e.target.value)}
							/>
							<input
								type="url"
								value={editInput3}
								onChange={(e) => setEditInput3(e.target.value)}
							/>
							<input
								type="number"
								value={editInput4}
								onChange={(e) => setEditInput4(e.target.value)}
							/>
							<button onClick={() => updateTodo(item._id)}>Save</button>
						</div>
					) : (
						<div className={scss.cards}>
							<h2>{item.title}</h2>
							<h3>{item.password}</h3>
							<p>{item.price}</p>
							<img className={scss.img} src={item.img} alt="photo" />
							<div className={scss.button}>
								<button
									className={scss.delete}
									onClick={() => deleteTodo(item._id)}>
									Delete
								</button>
								<button
									className={scss.edit}
									onClick={() => updateTodoValue(item._id)}>
									Edit
								</button>
							</div>
						</div>
					)}
				</div>
			))}
		</div>
	);
};

export default TodoMap;
